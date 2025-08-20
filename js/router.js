class VueCompatibleRouter {
    constructor(options = {}) {
        // 기본 환경설정
        this.config = {
            basePath: options.basePath || '/src',
            mode: options.mode || 'hash', // 'hash' 또는 'history'
            cacheMode: options.cacheMode || 'memory', // 'memory' 또는 'lru'
            cacheTTL: options.cacheTTL || 300000, // 5분 (밀리초)
            maxCacheSize: options.maxCacheSize || 50, // LRU 캐시 최대 크기
            useLayout: options.useLayout || false, // 레이아웃 사용 여부
            defaultLayout: options.defaultLayout || 'default', // 기본 레이아웃
            environment: options.environment || 'development', // 'development' 또는 'production'
            routesPath: options.routesPath || '/routes', // 프로덕션 모드에서 사용할 경로
            preloadRoutes: options.preloadRoutes || [], // 프리로드할 라우트들
            preloadDelay: options.preloadDelay || 1000, // 프리로드 시작 지연 시간 (밀리초)
            preloadInterval: options.preloadInterval || 500, // 프리로드 간격 (밀리초)
            showLoadingProgress: options.showLoadingProgress !== false, // 로딩 프로그레스 바 표시
            loadingMinDuration: options.loadingMinDuration || 300, // 최소 로딩 시간 (UX 개선)
            enableErrorReporting: options.enableErrorReporting !== false, // 에러 리포팅 활성화
            useComponents: options.useComponents !== false, // 컴포넌트 시스템 사용 여부
            globalComponents: options.globalComponents || ['Button', 'Modal', 'Card', 'Toast', 'Input', 'Tabs'], // 전역 컴포넌트 목록
            preloadComponents: options.preloadComponents !== false // 컴포넌트 사전 로드 여부
        };
        
        this.currentHash = '';
        this.currentVueApp = null;
        this.previousVueApp = null; // 이전 Vue 앱 (전환 효과를 위해 보관)
        this.cache = new Map();
        this.cacheTimestamps = new Map();
        this.lruOrder = []; // LRU 순서 추적
        this.preloadedRoutes = new Set(); // 프리로드된 라우트 추적
        this.preloadQueue = []; // 프리로드 대기열
        this.transitionInProgress = false; // 전환 중 플래그
        this.loadingStartTime = null; // 로딩 시작 시간
        this.progressBar = null; // 프로그레스 바 엘리먼트
        this.loadingOverlay = null; // 로딩 오버레이 엘리먼트
        this.componentLoader = null; // 컴포넌트 로더 인스턴스
        
        this.init();
        this.initializeLoadingComponents();
        this.initializeComponentSystem();

        // 초기 라우트 로드 후 프리로딩 시작 (설정된 지연 시간 후)
        setTimeout(() => this.startPreloading(), this.config.preloadDelay);
    }

    init() {
        if (this.config.mode === 'hash') {
            window.addEventListener('hashchange', () => this.handleRouteChange());
            
            // DOM이 준비되면 즉시 라우트 로딩 시작
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.handleRouteChange());
            } else {
                // 이미 로드된 경우 즉시 실행
                setTimeout(() => this.handleRouteChange(), 0);
            }
            
            if (!window.location.hash) {
                window.location.hash = '#home';
            }
        } else {
            // History 모드
            window.addEventListener('popstate', () => this.handleRouteChange());
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.handleRouteChange());
            } else {
                setTimeout(() => this.handleRouteChange(), 0);
            }
            
            if (window.location.pathname === '/') {
                this.navigateTo('home');
            }
        }
    }

    initializeLoadingComponents() {
        // 프로그레스 바 생성
        if (this.config.showLoadingProgress) {
            this.createProgressBar();
        }
    }

    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress';
        progressContainer.style.display = 'none';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'loading-progress-bar';
        
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        this.progressBar = {
            container: progressContainer,
            bar: progressBar
        };
    }

    showLoading() {
        this.loadingStartTime = Date.now();
        
        if (this.config.showLoadingProgress && this.progressBar) {
            this.progressBar.container.style.display = 'block';
            this.progressBar.bar.style.width = '0%';
            
            // 프로그레스 애니메이션
            this.animateProgress();
        }
    }

    animateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            if (this.progressBar && this.progressBar.bar) {
                this.progressBar.bar.style.width = progress + '%';
            }
            
            if (!this.transitionInProgress) {
                clearInterval(interval);
                if (this.progressBar && this.progressBar.bar) {
                    this.progressBar.bar.style.width = '100%';
                }
            }
        }, 100);
    }

    async hideLoading() {
        const loadingDuration = Date.now() - this.loadingStartTime;
        const minDuration = this.config.loadingMinDuration;
        
        // 최소 로딩 시간 보장
        if (loadingDuration < minDuration) {
            await new Promise(resolve => setTimeout(resolve, minDuration - loadingDuration));
        }
        
        if (this.progressBar) {
            this.progressBar.bar.style.width = '100%';
            
            setTimeout(() => {
                if (this.progressBar) {
                    this.progressBar.container.style.display = 'none';
                    this.progressBar.bar.style.width = '0%';
                }
            }, 200);
        }
        
        if (this.loadingOverlay) {
            this.loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.remove();
                    this.loadingOverlay = null;
                }
            }, 300);
        }
    }

    showFullPageLoading(message = '로딩 중...') {
        this.hideLoading(); // 기존 로딩 숨기기
        
        const overlay = document.createElement('div');
        overlay.className = 'page-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p class="loading-text">${message}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.loadingOverlay = overlay;
        
        // 스타일이 로드되지 않은 경우를 위한 인라인 스타일
        this.addLoadingStyles();
    }

    async initializeComponentSystem() {
        if (!this.config.useComponents) {
            return;
        }

        try {
            // 프로덕션 모드에서는 통합 components.js 로드
            if (this.config.environment === 'production') {
                console.log('🧩 Production mode: Loading unified components system');
                await this.loadUnifiedComponents();
                return;
            }

            // 개발 모드에서만 ComponentLoader 동적 로드
            const { getComponentLoader } = await import(this.config.basePath + '/components/ComponentLoader.js');
            
            this.componentLoader = getComponentLoader({
                basePath: this.config.basePath + '/components',
                globalComponents: this.config.globalComponents,
                cache: true
            });

            console.log('🧩 Component system initialized (development mode)');
            
            // 컴포넌트 사전 로드
            if (this.config.preloadComponents && this.config.globalComponents.length > 0) {
                setTimeout(() => this.preloadGlobalComponents(), 500);
            }

        } catch (error) {
            console.warn('⚠️ Component system initialization failed:', error);
            this.config.useComponents = false;
        }
    }

    async loadUnifiedComponents() {
        try {
            // 통합 components.js 파일 로드
            const componentsPath = `${this.config.routesPath}/components.js`;
            console.log(`📦 Loading unified components from: ${componentsPath}`);
            
            const componentsModule = await import(componentsPath);
            
            // 컴포넌트 등록 함수가 있는지 확인
            if (typeof componentsModule.registerComponents === 'function') {
                // 글로벌 Vue 앱이 없으면 임시로 저장
                this.unifiedComponentsModule = componentsModule;
                console.log('📦 Unified components loaded and ready for registration');
                return true;
            } else {
                throw new Error('registerComponents function not found in components module');
            }
            
        } catch (error) {
            console.error('❌ Failed to load unified components:', error);
            this.config.useComponents = false;
            throw error;
        }
    }

    registerComponentsToVueApp(vueApp) {
        if (!this.config.useComponents || !vueApp) {
            return;
        }

        try {
            // 프로덕션 모드에서 통합 컴포넌트 등록
            if (this.config.environment === 'production' && this.unifiedComponentsModule) {
                this.unifiedComponentsModule.registerComponents(vueApp);
                return true;
            }

            // 개발 모드에서 ComponentLoader 사용
            if (this.componentLoader) {
                this.componentLoader.registerGlobalComponents(vueApp);
                return true;
            }

        } catch (error) {
            console.error('❌ Failed to register components to Vue app:', error);
            return false;
        }

        return false;
    }

    async preloadGlobalComponents() {
        if (!this.componentLoader) return;

        try {
            console.log('🚀 Preloading global components...');
            const result = await this.componentLoader.preloadComponents(this.config.globalComponents);
            
            if (result.successful.length > 0) {
                console.log(`✅ Preloaded components: ${result.successful.join(', ')}`);
            }
            
            if (result.failed.length > 0) {
                console.warn(`⚠️ Failed to preload components:`, result.failed.map(f => f.name).join(', '));
            }
        } catch (error) {
            console.warn('Component preloading failed:', error);
        }
    }

    async registerComponentsForVueApp(vueApp) {
        if (!this.config.useComponents || !vueApp) {
            return { successful: [], failed: [] };
        }

        // 프로덕션 모드에서는 컴포넌트가 라우트에 인라인으로 포함되어 있음
        if (this.config.environment === 'production') {
            console.log('📝 Production mode: Components registered via inline routes');
            return { successful: [], failed: [] };
        }

        if (!this.componentLoader) {
            return { successful: [], failed: [] };
        }

        try {
            console.log('📝 Registering global components with Vue app (development mode)...');
            const result = await this.componentLoader.registerGlobalComponents(vueApp);
            
            // 컴포넌트 스타일은 이제 base.css에 통합되어 있음
            
            return result;
        } catch (error) {
            console.warn('Component registration failed:', error);
            return { successful: [], failed: [] };
        }
    }

    async loadComponentStyles() {
        // 컴포넌트 CSS는 이제 base.css에 통합되어 있으므로 별도 로딩 불필요
        console.log('🎨 Component styles already integrated in base.css');
        return;
    }

    registerInlineComponents(vueApp, component) {
        // 프로덕션 빌드에 인라인으로 포함된 컴포넌트들을 등록
        if (!vueApp || !component) return;
        
        if (component.registerInlineComponents && typeof component.registerInlineComponents === 'function') {
            try {
                component.registerInlineComponents(vueApp);
                console.log('📦 Inline components registered for route:', component._routeName);
            } catch (error) {
                console.warn('Failed to register inline components:', error);
            }
        }
    }

    addLoadingStyles() {
        if (!document.getElementById('router-loading-styles')) {
            const style = document.createElement('style');
            style.id = 'router-loading-styles';
            style.textContent = `
                .page-loading-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .loading-progress {
                    position: fixed; top: 0; left: 0; width: 100%;
                    height: 3px; background: #f0f0f0; z-index: 10000;
                }
                .loading-progress-bar {
                    height: 100%; background: linear-gradient(90deg, #007bff, #0056b3);
                    width: 0%; transition: width 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleRouteChange() {
        let route;
        if (this.config.mode === 'hash') {
            route = window.location.hash.slice(1) || 'home';
        } else {
            route = window.location.pathname.slice(1) || 'home';
        }
        
        if (route !== this.currentHash) {
            this.currentHash = route;
            this.loadRoute(route);
        }
    }

    async loadRoute(routeName) {
        // 전환이 진행 중이면 무시
        if (this.transitionInProgress) {
            return;
        }

        try {
            this.transitionInProgress = true;
            this.showLoading();
            
            const appElement = document.getElementById('app');
            if (!appElement) {
                throw new Error('App element not found');
            }

            // Vue 컴포넌트 생성 (백그라운드에서)
            const component = await this.createVueComponent(routeName);
            
            // 새로운 페이지를 오버레이로 렌더링
            await this.renderComponentWithTransition(component, routeName);
            
            // 로딩 완료
            await this.hideLoading();
            
        } catch (error) {
            console.error('라우트 로딩 오류:', error);
            
            await this.hideLoading();
            this.transitionInProgress = false;
            
            // 에러 타입에 따른 처리
            await this.handleRouteError(routeName, error);
        }
    }

    async handleRouteError(routeName, error) {
        let errorCode = 500;
        let errorMessage = '페이지를 로드할 수 없습니다.';
        
        console.log('에러 상세:', error.message, error.name);
        
        // 에러 타입 분석 (더 정확한 404 감지)
        if (error.message.includes('not found') || 
            error.message.includes('404') ||
            error.message.includes('Failed to resolve') ||
            error.message.includes('Failed to fetch') ||
            (error.name === 'TypeError' && error.message.includes('resolve'))) {
            errorCode = 404;
            errorMessage = `'${routeName}' 페이지를 찾을 수 없습니다.`;
        } else if (error.message.includes('network') && !error.message.includes('not found')) {
            errorCode = 503;
            errorMessage = '네트워크 연결을 확인해 주세요.';
        } else if (error.message.includes('permission') || error.message.includes('403')) {
            errorCode = 403;
            errorMessage = '페이지에 접근할 권한이 없습니다.';
        }
        
        console.log(`에러 코드 결정: ${errorCode} (라우트: ${routeName})`);
        
        // 에러 리포팅
        if (this.config.enableErrorReporting) {
            this.reportError(routeName, error, errorCode);
        }
        
        try {
            // 404 페이지 전용 처리
            if (errorCode === 404) {
                await this.load404Page();
            } else {
                // 일반 에러 페이지
                await this.loadErrorPage(errorCode, errorMessage);
            }
        } catch (fallbackError) {
            console.error('에러 페이지 로딩 실패:', fallbackError);
            this.showFallbackError(routeName, errorCode, errorMessage);
        }
    }

    async load404Page() {
        try {
            this.transitionInProgress = true;
            const component = await this.createVueComponent('404');
            await this.renderComponentWithTransition(component, '404');
        } catch (error) {
            throw new Error('404 페이지 로딩 실패: ' + error.message);
        }
    }

    async loadErrorPage(errorCode, errorMessage) {
        try {
            this.transitionInProgress = true;
            
            // 에러 컴포넌트 생성
            const errorComponent = await this.createErrorComponent(errorCode, errorMessage);
            await this.renderComponentWithTransition(errorComponent, 'error');
        } catch (error) {
            throw new Error('에러 페이지 로딩 실패: ' + error.message);
        }
    }

    async createErrorComponent(errorCode, errorMessage) {
        try {
            // 에러 컴포넌트를 동적으로 로드
            const component = await this.createVueComponent('error');
            
            // 에러 정보를 props로 전달
            const errorComponent = {
                ...component,
                data() {
                    const originalData = component.data ? component.data() : {};
                    return {
                        ...originalData,
                        errorCode,
                        errorMessage,
                        showRetry: true,
                        showGoHome: true
                    };
                }
            };
            
            return errorComponent;
        } catch (error) {
            // 에러 컴포넌트도 로드할 수 없는 경우 인라인 에러 컴포넌트 생성
            return this.createInlineErrorComponent(errorCode, errorMessage);
        }
    }

    createInlineErrorComponent(errorCode, errorMessage) {
        return {
            template: `
                <div class="error-container" style="text-align: center; padding: 2rem;">
                    <h1 style="font-size: 4rem; color: #dc3545; margin: 0;">{{ errorCode }}</h1>
                    <h2 style="color: #333; margin: 1rem 0;">{{ errorTitle }}</h2>
                    <p style="color: #666; margin: 1rem 0;">{{ errorMessage }}</p>
                    <div style="margin-top: 2rem;">
                        <button @click="goHome" style="background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; margin: 0.5rem; cursor: pointer;">
                            홈으로 가기
                        </button>
                        <button @click="retry" style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; margin: 0.5rem; cursor: pointer;">
                            다시 시도
                        </button>
                    </div>
                </div>
            `,
            data() {
                return {
                    errorCode,
                    errorMessage
                };
            },
            computed: {
                errorTitle() {
                    const titles = {
                        404: '페이지를 찾을 수 없습니다',
                        500: '서버 오류',
                        503: '서비스를 사용할 수 없습니다',
                        403: '접근 거부됨'
                    };
                    return titles[this.errorCode] || '오류가 발생했습니다';
                }
            },
            methods: {
                goHome() {
                    if (window.router) {
                        window.router.navigateTo('home');
                    }
                },
                retry() {
                    window.location.reload();
                }
            }
        };
    }

    showFallbackError(routeName, errorCode, errorMessage) {
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = `
                <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                    <h1 style="color: #dc3545; font-size: 4rem; margin: 0;">${errorCode}</h1>
                    <h2 style="color: #333; margin: 1rem 0;">페이지를 로드할 수 없습니다</h2>
                    <p style="color: #666; margin: 1rem 0;">${errorMessage}</p>
                    <div style="margin-top: 2rem;">
                        <button onclick="router.navigateTo('home')" 
                                style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; margin: 0.5rem; cursor: pointer; font-size: 1rem;">
                            홈으로 가기
                        </button>
                        <button onclick="window.location.reload()" 
                                style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; margin: 0.5rem; cursor: pointer; font-size: 1rem;">
                            다시 시도
                        </button>
                    </div>
                </div>
            `;
        }
    }

    reportError(routeName, error, errorCode) {
        const errorReport = {
            route: routeName,
            errorCode,
            errorMessage: error.message,
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            routerConfig: {
                environment: this.config.environment,
                mode: this.config.mode
            }
        };
        
        console.error('라우터 에러 리포트:', errorReport);
        
        // 추후 에러 추적 서비스로 전송할 수 있음
        // 예: analytics.track('router_error', errorReport);
    }

    async createVueComponent(routeName) {
        const script = await this.loadScript(routeName);
        
        if (this.config.environment === 'production') {
            // 프로덕션 모드: 빌드된 컴포넌트는 이미 완성되어 있음
            const component = {
                ...script,
                methods: {
                    ...script.methods,
                    navigateTo: (route) => this.navigateTo(route),
                    getCurrentRoute: () => this.getCurrentRoute()
                },
                data() {
                    const originalData = script.data ? script.data() : {};
                    return {
                        ...originalData,
                        currentRoute: routeName,
                        pageTitle: script.pageTitle || routeName,
                        showHeader: script.showHeader !== false,
                        headerTitle: script.headerTitle,
                        headerSubtitle: script.headerSubtitle
                    };
                },
                _routeName: routeName,
                _hasInlineComponents: Boolean(script.registerInlineComponents)
            };
            
            return component;
        } else {
            // 개발 모드: 개별 파일들을 로드하고 병합
            const template = await this.loadTemplate(routeName);
            const style = await this.loadStyle(routeName);
            const layout = this.config.useLayout ? await this.loadLayout(script.layout || this.config.defaultLayout) : null;
            
            const component = {
                ...script,
                template: layout ? this.mergeLayoutWithTemplate(routeName, layout, template) : template,
                methods: {
                    ...script.methods,
                    navigateTo: (route) => this.navigateTo(route),
                    getCurrentRoute: () => this.getCurrentRoute()
                },
                data() {
                    const originalData = script.data ? script.data() : {};
                    return {
                        ...originalData,
                        currentRoute: routeName,
                        pageTitle: script.pageTitle || routeName,
                        pageStyle: style,
                        showHeader: script.showHeader !== false,
                        headerTitle: script.headerTitle,
                        headerSubtitle: script.headerSubtitle
                    };
                },
                _style: style,
                _routeName: routeName,
                _layout: layout
            };
            
            return component;
        }
    }

    async loadLayout(layoutName) {
        const cacheKey = `layout_${layoutName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            console.log(`🔄 Loading layout: ${this.config.basePath}/layouts/${layoutName}.html`);
            const response = await fetch(`${this.config.basePath}/layouts/${layoutName}.html`);
            if (!response.ok) throw new Error(`Layout not found: ${response.status}`);
            const layout = await response.text();
            
            console.log(`✓ Layout '${layoutName}' loaded successfully`);
            this.setCache(cacheKey, layout);
            return layout;
        } catch (error) {
            console.warn(`❌ Layout '${layoutName}' not found:`, error.message);
            return null;
        }
    }

    mergeLayoutWithTemplate(routeName, layout, template) {

        const cacheKey = `merge_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        console.log('🔄 Merging layout with template...');
        
        let result;
        // 레이아웃에서 <slot name="content"> 부분을 템플릿으로 교체
        if (layout.includes('{{ content }}')) {
            result = layout.replace(
                /{{ content }}/s,
                template
            );
        }
        // slot이 없으면 main-content 클래스 내용 교체
        else if (layout.includes('class="main-content"')) {
            console.log('✓ Using main-content replacement');
            result = layout.replace(
                /(<div class="container">).*?(<\/div>\s*<\/main>)/s,
                `$1${template}$2`
            );
        }
        // 마지막 대안: 전체 레이아웃을 템플릿으로 감싸기
        else {
            console.log('✓ Wrapping template with layout');
            result = `${layout}\n${template}`;
        }
        
        console.log('✓ Layout merge completed');
        this.setCache(cacheKey, result);
        return result;
    }

    async loadTemplate(routeName) {
        const cacheKey = `template_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const response = await fetch(`${this.config.basePath}/views/${routeName}.html`);
        if (!response.ok) throw new Error('Template not found');
        const template = await response.text();
        
        this.setCache(cacheKey, template);
        return template;
    }

    async loadScript(routeName) {
        const cacheKey = `script_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        let script;
        try {
            if (this.config.environment === 'production') {
                // 프로덕션 모드: routes 폴더에서 빌드된 JS 로드 (절대 경로)
                const importPath = `${this.config.routesPath}/${routeName}.js`;
                console.log(`📦 Loading production route: ${importPath}`);
                const module = await import(importPath);
                script = module.default;
            } else {
                // 개발 모드: src 폴더에서 로드 (절대 경로)
                const importPath = `${this.config.basePath}/logic/${routeName}.js`;
                console.log(`🛠️ Loading development route: ${importPath}`);
                const module = await import(importPath);
                script = module.default;
            }
            
            if (!script) {
                throw new Error(`Route '${routeName}' not found - no default export`);
            }
            
        } catch (error) {
            // import 에러를 404로 분류
            if (error.message.includes('Failed to resolve') || 
                error.message.includes('Failed to fetch') ||
                error.message.includes('not found') ||
                error.name === 'TypeError') {
                throw new Error(`Route '${routeName}' not found - 404`);
            }
            // 다른 에러는 그대로 전파
            throw error;
        }
        
        this.setCache(cacheKey, script);
        return script;
    }

    async loadStyle(routeName) {
        const cacheKey = `style_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const response = await fetch(`${this.config.basePath}/styles/${routeName}.css`);
        if (!response.ok) throw new Error('Style not found');
        const style = await response.text();
        
        this.setCache(cacheKey, style);
        return style;
    }

    async renderComponent(vueComponent, routeName) {
        // 첫 번째 로드인 경우에만 사용 (이후는 renderComponentWithTransition 사용)
        const appElement = document.getElementById('app');
        if (!appElement) return;

        // 로딩 텍스트가 있으면 첫 로드임
        const loadingElement = appElement.querySelector('.loading');
        if (loadingElement) {
            // 첫 로드: 기존 방식으로 직접 마운트
            loadingElement.classList.add('fade-out');
            setTimeout(() => {
                if (loadingElement && loadingElement.parentNode) {
                    loadingElement.remove();
                }
            }, 300);

            // 개발 모드에서만 스타일 적용
            if (this.config.environment === 'development' && vueComponent._style) {
                this.applyStyle(vueComponent._style, routeName);
            }
            
            // Vue 3 앱 생성 및 마운트
            const { createApp } = Vue;
            this.currentVueApp = createApp(vueComponent);
            
            // 컴포넌트 등록 (통합 컴포넌트 시스템 또는 개발 모드)
            this.registerComponentsToVueApp(this.currentVueApp);
            
            // Vue 3 전역 속성 설정
            this.currentVueApp.config.globalProperties.$router = {
                navigateTo: (route) => this.navigateTo(route),
                getCurrentRoute: () => this.getCurrentRoute(),
                currentRoute: this.currentHash
            };

            // 글로벌 컴포넌트 등록
            await this.registerComponentsForVueApp(this.currentVueApp);
            
            // 인라인 컴포넌트 등록 (프로덕션 빌드에 포함된 컴포넌트)
            this.registerInlineComponents(this.currentVueApp, vueComponent);
            
            this.currentVueApp.mount('#app');
            this.transitionInProgress = false;
        } else {
            // 이후 로드들은 전환 효과 사용
            await this.renderComponentWithTransition(vueComponent, routeName);
        }
    }

    async renderComponentWithTransition(vueComponent, routeName) {
        const appElement = document.getElementById('app');
        if (!appElement) return;

        // 새로운 페이지 컨테이너 생성
        const newPageContainer = document.createElement('div');
        newPageContainer.className = 'page-container page-entered';
        newPageContainer.id = `page-${routeName}-${Date.now()}`;
        
        // 기존 컨테이너가 있다면 즉시 숨기기
        const existingContainers = appElement.querySelectorAll('.page-container');
        existingContainers.forEach(container => {
            container.classList.remove('page-entered');
            container.classList.add('page-exiting');
        });

        // 새 컨테이너를 앱에 추가
        appElement.appendChild(newPageContainer);

        // 개발 모드에서만 스타일 적용 (프로덕션 모드는 빌드된 JS에서 자동 처리)
        if (this.config.environment === 'development' && vueComponent._style) {
            this.applyStyle(vueComponent._style, routeName);
        }
        
        // 새로운 Vue 앱을 새 컨테이너에 마운트
        const { createApp } = Vue;
        const newVueApp = createApp(vueComponent);
        
        // 컴포넌트 등록 (통합 컴포넌트 시스템 또는 개발 모드)
        this.registerComponentsToVueApp(newVueApp);
        
        // Vue 3 전역 속성 설정
        newVueApp.config.globalProperties.$router = {
            navigateTo: (route) => this.navigateTo(route),
            getCurrentRoute: () => this.getCurrentRoute(),
            currentRoute: this.currentHash
        };

        // 글로벌 컴포넌트 등록
        await this.registerComponentsForVueApp(newVueApp);
        
        // 인라인 컴포넌트 등록 (프로덕션 빌드에 포함된 컴포넌트)
        this.registerInlineComponents(newVueApp, vueComponent);
        
        newVueApp.mount(`#${newPageContainer.id}`);

        // 즉시 이전 페이지들 정리
        setTimeout(() => {
            this.cleanupPreviousPages();
            this.transitionInProgress = false;
        }, 50); // 최소한의 지연만

        // 이전 앱 정리 준비
        if (this.currentVueApp) {
            this.previousVueApp = this.currentVueApp;
        }
        
        this.currentVueApp = newVueApp;
    }

    cleanupPreviousPages() {
        const appElement = document.getElementById('app');
        if (!appElement) return;

        // exiting 상태의 컨테이너들 제거
        const exitingContainers = appElement.querySelectorAll('.page-container.page-exiting');
        exitingContainers.forEach(container => {
            if (container.parentNode) {
                container.remove();
            }
        });

        // 이전 Vue 앱 정리
        if (this.previousVueApp) {
            try {
                this.previousVueApp.unmount();
            } catch (error) {
                console.debug('Previous Vue app already unmounted:', error);
            }
            this.previousVueApp = null;
        }

        // 로딩 텍스트 제거 (첫 로드 시)
        const loadingElement = appElement.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    applyStyle(css, routeName) {
        // 기존 스타일 제거
        const existing = document.querySelector(`style[data-route="${routeName}"]`);
        if (existing) existing.remove();

        if (css) {
            const style = document.createElement('style');
            style.textContent = css;
            style.setAttribute('data-route', routeName);
            document.head.appendChild(style);
        }
    }


    navigateTo(routeName) {
        if (this.config.mode === 'hash') {
            window.location.hash = `#${routeName}`;
        } else {
            window.history.pushState({}, '', `/${routeName}`);
            this.handleRouteChange();
        }
    }

    getCurrentRoute() {
        return this.currentHash;
    }
    
    // 캐시 관리 메서드들
    setCache(key, value) {
        const now = Date.now();
        
        if (this.config.cacheMode === 'lru') {
            // LRU 캐시 관리
            if (this.cache.size >= this.config.maxCacheSize && !this.cache.has(key)) {
                const oldestKey = this.lruOrder.shift();
                this.cache.delete(oldestKey);
                this.cacheTimestamps.delete(oldestKey);
            }
            
            // 기존 키가 있으면 LRU 순서에서 제거
            const existingIndex = this.lruOrder.indexOf(key);
            if (existingIndex > -1) {
                this.lruOrder.splice(existingIndex, 1);
            }
            
            // 최신 순서로 추가
            this.lruOrder.push(key);
        }
        
        this.cache.set(key, value);
        this.cacheTimestamps.set(key, now);
    }
    
    getFromCache(key) {
        const now = Date.now();
        const timestamp = this.cacheTimestamps.get(key);
        
        // TTL 체크
        if (timestamp && (now - timestamp) > this.config.cacheTTL) {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
            
            if (this.config.cacheMode === 'lru') {
                const index = this.lruOrder.indexOf(key);
                if (index > -1) {
                    this.lruOrder.splice(index, 1);
                }
            }
            
            return null;
        }
        
        const value = this.cache.get(key);
        
        if (value && this.config.cacheMode === 'lru') {
            // LRU 순서 업데이트
            const index = this.lruOrder.indexOf(key);
            if (index > -1) {
                this.lruOrder.splice(index, 1);
                this.lruOrder.push(key);
            }
        }
        
        return value;
    }
    
    clearCache() {
        this.cache.clear();
        this.cacheTimestamps.clear();
        this.lruOrder = [];
    }
    
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: this.config.maxCacheSize,
            mode: this.config.cacheMode,
            ttl: this.config.cacheTTL
        };
    }
    
    // 프리로딩 기능
    async startPreloading() {
        // 설정된 라우트들을 프리로드 대기열에 추가
        console.log(`🚀 Starting preload for routes: [${this.config.preloadRoutes.join(', ')}]`);
        
        for (const route of this.config.preloadRoutes) {
            if (!this.preloadedRoutes.has(route) && route !== this.currentHash) {
                this.preloadQueue.push(route);
            }
        }
        
        // 프리로드 실행
        this.processPreloadQueue();
    }
    
    async processPreloadQueue() {
        if (this.preloadQueue.length === 0) return;
        
        const routeName = this.preloadQueue.shift();
        
        try {
            console.log(`🔄 Preloading route: ${routeName}`);
            await this.preloadRoute(routeName);
            this.preloadedRoutes.add(routeName);
            console.log(`✅ Preloaded route: ${routeName}`);
            
            // 다음 라우트를 설정된 간격 후에 프리로드 (부드러운 백그라운드 로딩)
            setTimeout(() => this.processPreloadQueue(), this.config.preloadInterval);
        } catch (error) {
            console.warn(`⚠️ Failed to preload route ${routeName}:`, error.message);
            // 실패해도 다음 라우트 계속 처리
            setTimeout(() => this.processPreloadQueue(), this.config.preloadInterval);
        }
    }
    
    async preloadRoute(routeName) {
        // 이미 캐시된 경우 스킵
        if (this.getFromCache(`script_${routeName}`)) {
            return;
        }
        
        // 스크립트만 프리로드 (가장 시간이 오래 걸리는 부분)
        await this.loadScript(routeName);
        
        if (this.config.environment === 'development') {
            // 개발 모드에서는 템플릿과 스타일도 프리로드
            try {
                await this.loadTemplate(routeName);
                await this.loadStyle(routeName);
                
                // 레이아웃도 프리로드 (스크립트에 layout 정보가 있는 경우)
                const script = this.getFromCache(`script_${routeName}`);
                if (script && script.layout && this.config.useLayout) {
                    await this.loadLayout(script.layout);
                }
            } catch (error) {
                // 템플릿이나 스타일이 없어도 괜찮음
                console.debug(`Optional files not found for ${routeName}:`, error.message);
            }
        }
    }
    
    // 특정 라우트를 즉시 프리로드
    preloadSpecificRoute(routeName) {
        if (!this.preloadedRoutes.has(routeName) && routeName !== this.currentHash) {
            this.preloadQueue.unshift(routeName); // 큐의 맨 앞에 추가
            this.processPreloadQueue();
        }
    }
}
// 전역 라우터는 index.html에서 환경설정과 함께 생성됨