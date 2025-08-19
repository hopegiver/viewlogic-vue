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
            preloadInterval: options.preloadInterval || 500 // 프리로드 간격 (밀리초)
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
        
        this.init();
        
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
            const appElement = document.getElementById('app');
            
            if (!appElement) return;

            // Vue 컴포넌트 생성 (백그라운드에서)
            const component = await this.createVueComponent(routeName);
            
            // 새로운 페이지를 오버레이로 렌더링
            await this.renderComponentWithTransition(component, routeName);
            
        } catch (error) {
            console.log(error);
            this.transitionInProgress = false;
            this.showError(routeName);
        }
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
                _routeName: routeName
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
            
            // Vue 3 전역 속성 설정
            this.currentVueApp.config.globalProperties.$router = {
                navigateTo: (route) => this.navigateTo(route),
                getCurrentRoute: () => this.getCurrentRoute(),
                currentRoute: this.currentHash
            };
            
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
        
        // Vue 3 전역 속성 설정
        newVueApp.config.globalProperties.$router = {
            navigateTo: (route) => this.navigateTo(route),
            getCurrentRoute: () => this.getCurrentRoute(),
            currentRoute: this.currentHash
        };
        
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

    showError(routeName) {
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h1>페이지를 찾을 수 없습니다</h1>
                    <p>${routeName} 페이지가 존재하지 않습니다.</p>
                    <button onclick="router.navigateTo('home')">홈으로 돌아가기</button>
                </div>
            `;
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