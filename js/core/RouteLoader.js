/**
 * ViewLogic Route Loading System
 * 라우트 로딩 및 컴포넌트 관리 시스템
 */
export class RouteLoader {
    constructor(router, options = {}) {
        this.config = {
            basePath: options.basePath || '/src',
            routesPath: options.routesPath || '/routes',
            environment: options.environment || 'development',
            useLayout: options.useLayout !== false,
            defaultLayout: options.defaultLayout || 'default',
            useComponents: options.useComponents !== false,
            debug: options.debug || false
        };
        
        // 라우터 인스턴스 참조
        this.router = router;
        
        
        this.log('RouteLoader initialized with config:', this.config);
    }

    /**
     * 스크립트 파일 로드
     */
    async loadScript(routeName) {
        const cacheKey = `script_${routeName}`;
        const cached = this.router.cacheManager?.getFromCache(cacheKey);
        if (cached) return cached;
        
        let script;
        try {
            if (this.config.environment === 'production') {
                // 프로덕션 모드: routes 폴더에서 빌드된 JS 로드 (절대 경로)
                const importPath = `${this.config.routesPath}/${routeName}.js`;
                this.log(`📦 Loading production route: ${importPath}`);
                const module = await import(importPath);
                script = module.default;
            } else {
                // 개발 모드: src 폴더에서 로드 (절대 경로)
                const importPath = `${this.config.basePath}/logic/${routeName}.js`;
                this.log(`🛠️ Loading development route: ${importPath}`);
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
        
        this.router.cacheManager?.setCache(cacheKey, script);
        return script;
    }

    /**
     * 템플릿 파일 로드
     */
    async loadTemplate(routeName) {
        const cacheKey = `template_${routeName}`;
        const cached = this.router.cacheManager?.getFromCache(cacheKey);
        if (cached) return cached;
        
        const response = await fetch(`${this.config.basePath}/views/${routeName}.html`);
        if (!response.ok) throw new Error('Template not found');
        const template = await response.text();
        
        this.router.cacheManager?.setCache(cacheKey, template);
        return template;
    }

    /**
     * 스타일 파일 로드
     */
    async loadStyle(routeName) {
        const cacheKey = `style_${routeName}`;
        const cached = this.router.cacheManager?.getFromCache(cacheKey);
        if (cached) return cached;
        
        const response = await fetch(`${this.config.basePath}/styles/${routeName}.css`);
        if (!response.ok) throw new Error('Style not found');
        const style = await response.text();
        
        this.router.cacheManager?.setCache(cacheKey, style);
        return style;
    }

    /**
     * 레이아웃 파일 로드
     */
    async loadLayout(layoutName) {
        const cacheKey = `layout_${layoutName}`;
        const cached = this.router.cacheManager?.getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            const response = await fetch(`${this.config.basePath}/layouts/${layoutName}.html`);
            if (!response.ok) throw new Error(`Layout not found: ${response.status}`);
            const layout = await response.text();
            
            this.log(`✓ Layout '${layoutName}' loaded successfully`);
            this.router.cacheManager?.setCache(cacheKey, layout);
            return layout;
        } catch (error) {
            console.warn(`❌ Layout '${layoutName}' not found:`, error.message);
            return null;
        }
    }

    /**
     * 레이아웃과 템플릿 병합
     */
    mergeLayoutWithTemplate(routeName, layout, template) {
        const cacheKey = `merge_${routeName}`;
        const cached = this.router.cacheManager?.getFromCache(cacheKey);
        if (cached) return cached;

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
            this.log('✓ Using main-content replacement');
            result = layout.replace(
                /(<div class="container">).*?(<\/div>\s*<\/main>)/s,
                `$1${template}$2`
            );
        }
        // 마지막 대안: 전체 레이아웃을 템플릿으로 감싸기
        else {
            this.log('✓ Wrapping template with layout');
            result = `${layout}\n${template}`;
        }
        
        this.router.cacheManager?.setCache(cacheKey, result);
        return result;
    }

    /**
     * Vue 컴포넌트 생성
     */
    async createVueComponent(routeName) {
        // 캐시된 Vue 컴포넌트가 있는지 확인
        const cacheKey = `component_${routeName}`;
        const cached = this.router.cacheManager?.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }
        
        const script = await this.loadScript(routeName);
        
        if (this.config.environment === 'production') {
            // 프로덕션 모드: 빌드된 컴포넌트는 이미 완성되어 있음
            const router = this.router; // 라우터 인스턴스 참조
            const component = {
                ...script,
                // name이 없으면 라우트명을 자동으로 설정 (PascalCase로 변환)
                name: script.name || this.toPascalCase(routeName),
                // template이 없으면 기본 템플릿 생성
                template: script.template || this.generateDefaultTemplate(routeName),
                // UI 컴포넌트들을 컴포넌트 레벨에서 등록 (useComponents가 활성화된 경우에만)
                components: this.config.useComponents && router.componentLoader ? await router.componentLoader.loadAllComponents() : {},
                data() {
                    const originalData = script.data ? script.data() : {};
                    return {
                        ...originalData,
                        currentRoute: routeName,
                        pageTitle: script.pageTitle || router.routeLoader.generatePageTitle(routeName),
                        showHeader: script.showHeader !== false,
                        headerTitle: script.headerTitle || router.routeLoader.generatePageTitle(routeName),
                        headerSubtitle: script.headerSubtitle,
                        $query: router.queryManager?.getQueryParams() || {},
                        // i18n 관련 데이터
                        $lang: router.i18nManager?.getCurrentLanguage() || router.config.i18nDefaultLanguage,
                        // dataURL 관련 로딩 상태
                        $dataLoading: false
                    };
                },
                computed: {
                    // 기존 computed 속성 유지
                    ...(script.computed || {}),
                    // 쿼리 파라미터를 props처럼 사용할 수 있도록 computed 속성 추가
                    params() {
                        return router.queryManager?.getQueryParams() || {};
                    }
                },
                async mounted() {
                    // 원래 mounted 함수 실행
                    if (script.mounted) {
                        await script.mounted.call(this);
                    }
                    
                    // dataURL이 있으면 데이터 가져오기
                    if (script.dataURL) {
                        await this.$fetchData();
                    }
                },
                methods: {
                    ...script.methods,
                    navigateTo: (route, params) => router.navigateTo(route, params),
                    getCurrentRoute: () => router.getCurrentRoute(),
                    getQueryParams: () => router.queryManager?.getQueryParams() || {},
                    getQueryParam: (key) => router.queryManager?.getQueryParam(key),
                    setQueryParams: (params, replace) => router.queryManager?.setQueryParams(params, replace),
                    removeQueryParams: (keys) => router.queryManager?.removeQueryParams(keys),
                    // i18n 함수들을 메서드로 포함
                    $t: (key, params) => router.i18nManager?.t(key, params) || key,
                    $i18n: () => router.i18nManager || null,
                    // 인증 관련 메서드
                    $isAuthenticated: () => router.authManager ? 
                        router.authManager.isUserAuthenticated() : false,
                    $logout: () => router.authManager ? 
                        router.navigateTo(router.authManager.handleLogout()) : null,
                    $loginSuccess: (target) => router.authManager ? 
                        router.navigateTo(router.authManager.handleLoginSuccess(target)) : null,
                    $checkAuth: (route) => router.authManager ? 
                        router.authManager.checkAuthentication(route) : Promise.resolve({ allowed: true, reason: 'auth_disabled' }),
                    $getToken: () => router.authManager ? 
                        router.authManager.getAccessToken() : null,
                    $setToken: (token, options) => router.authManager ? 
                        router.authManager.setAccessToken(token, options) : false,
                    $removeToken: (storage) => router.authManager ? 
                        router.authManager.removeAccessToken(storage) : null,
                    $getAuthCookie: () => router.authManager ? 
                        router.authManager.getAuthCookie() : null,
                    $getCookie: (name) => router.authManager ? 
                        router.authManager.getCookieValue(name) : null,
                    // 데이터 fetch 메서드
                    async $fetchData() {
                        if (!script.dataURL) return;
                        
                        this.$dataLoading = true;
                        try {
                            const data = await router.routeLoader.fetchComponentData(script.dataURL);
                            console.log(`📊 Data fetched for ${routeName}:`, data);
                            
                            // 데이터를 컴포넌트에 직접 할당
                            Object.assign(this, data);
                            
                            this.$emit('data-loaded', data);
                        } catch (error) {
                            console.warn(`⚠️ Failed to fetch data for ${routeName}:`, error);
                            this.$emit('data-error', error);
                        } finally {
                            this.$dataLoading = false;
                        }
                    }
                },
                _routeName: routeName
            };
            
            // 캐시에 저장
            this.router.cacheManager?.setCache(cacheKey, component);
            
            return component;
        } else {
            // 개발 모드: 개별 파일들을 로드하고 병합
            const template = await this.loadTemplate(routeName);
            const style = await this.loadStyle(routeName);
            const layout = this.config.useLayout && script.layout !== null ? await this.loadLayout(script.layout || this.config.defaultLayout) : null;
            
            const router = this.router; // 라우터 인스턴스 참조
            const component = {
                ...script,
                // name이 없으면 라우트명을 자동으로 설정 (PascalCase로 변환)
                name: script.name || this.toPascalCase(routeName),
                template: layout ? this.mergeLayoutWithTemplate(routeName, layout, template) : template,
                // UI 컴포넌트들을 컴포넌트 레벨에서 등록 (useComponents가 활성화된 경우에만)
                components: this.config.useComponents && router.componentLoader ? await router.componentLoader.loadAllComponents() : {},
                data() {
                    const originalData = script.data ? script.data() : {};
                    return {
                        ...originalData,
                        currentRoute: routeName,
                        pageTitle: script.pageTitle || router.routeLoader.generatePageTitle(routeName),
                        pageStyle: style,
                        showHeader: script.showHeader !== false,
                        headerTitle: script.headerTitle || router.routeLoader.generatePageTitle(routeName),
                        headerSubtitle: script.headerSubtitle,
                        $query: router.queryManager?.getQueryParams() || {},
                        // i18n 관련 데이터
                        $lang: router.i18nManager?.getCurrentLanguage() || router.config.i18nDefaultLanguage,
                        // dataURL 관련 로딩 상태
                        $dataLoading: false
                    };
                },
                computed: {
                    // 기존 computed 속성 유지
                    ...(script.computed || {}),
                    // 쿼리 파라미터를 props처럼 사용할 수 있도록 computed 속성 추가
                    params() {
                        return router.queryManager?.getQueryParams() || {};
                    }
                },
                async mounted() {
                    // 원래 mounted 함수 실행
                    if (script.mounted) {
                        await script.mounted.call(this);
                    }
                    
                    // dataURL이 있으면 데이터 가져오기
                    if (script.dataURL) {
                        await this.$fetchData();
                    }
                },
                methods: {
                    ...script.methods,
                    navigateTo: (route, params) => router.navigateTo(route, params),
                    getCurrentRoute: () => router.getCurrentRoute(),
                    getQueryParams: () => router.queryManager?.getQueryParams() || {},
                    getQueryParam: (key) => router.queryManager?.getQueryParam(key),
                    setQueryParams: (params, replace) => router.queryManager?.setQueryParams(params, replace),
                    removeQueryParams: (keys) => router.queryManager?.removeQueryParams(keys),
                    // i18n 함수들을 메서드로 포함
                    $t: (key, params) => router.i18nManager?.t(key, params) || key,
                    $i18n: () => router.i18nManager || null,
                    // 인증 관련 메서드
                    $isAuthenticated: () => router.authManager ? 
                        router.authManager.isUserAuthenticated() : false,
                    $logout: () => router.authManager ? 
                        router.navigateTo(router.authManager.handleLogout()) : null,
                    $loginSuccess: (target) => router.authManager ? 
                        router.navigateTo(router.authManager.handleLoginSuccess(target)) : null,
                    $checkAuth: (route) => router.authManager ? 
                        router.authManager.checkAuthentication(route) : Promise.resolve({ allowed: true, reason: 'auth_disabled' }),
                    $getToken: () => router.authManager ? 
                        router.authManager.getAccessToken() : null,
                    $setToken: (token, options) => router.authManager ? 
                        router.authManager.setAccessToken(token, options) : false,
                    $removeToken: (storage) => router.authManager ? 
                        router.authManager.removeAccessToken(storage) : null,
                    $getAuthCookie: () => router.authManager ? 
                        router.authManager.getAuthCookie() : null,
                    $getCookie: (name) => router.authManager ? 
                        router.authManager.getCookieValue(name) : null,
                    // 데이터 fetch 메서드
                    async $fetchData() {
                        if (!script.dataURL) return;
                        
                        this.$dataLoading = true;
                        try {
                            const data = await router.routeLoader.fetchComponentData(script.dataURL);
                            console.log(`📊 Data fetched for ${routeName}:`, data);
                            
                            // 데이터를 컴포넌트에 직접 할당
                            Object.assign(this, data);
                            
                            this.$emit('data-loaded', data);
                        } catch (error) {
                            console.warn(`⚠️ Failed to fetch data for ${routeName}:`, error);
                            this.$emit('data-error', error);
                        } finally {
                            this.$dataLoading = false;
                        }
                    }
                },
                _style: style,
                _routeName: routeName,
                _layout: layout
            };
            
            // 캐시에 저장
            this.router.cacheManager?.setCache(cacheKey, component);
            
            return component;
        }
    }

    /**
     * 문자열을 PascalCase로 변환
     */
    toPascalCase(str) {
        return str
            .split(/[-_\s]+/) // 하이픈, 언더스코어, 공백으로 분리
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * 페이지 제목 생성
     */
    generatePageTitle(routeName) {
        return this.toPascalCase(routeName).replace(/([A-Z])/g, ' $1').trim();
    }

    /**
     * 기본 템플릿 생성
     */
    generateDefaultTemplate(routeName) {
        return `<div class="route-${routeName}"><h1>Route: ${routeName}</h1></div>`;
    }

    /**
     * 컴포넌트 데이터 가져오기
     */
    async fetchComponentData(dataURL) {
        try {
            // 현재 쿼리 파라미터를 URL에 추가
            const queryString = this.router.queryManager?.buildQueryString(this.router.queryManager?.getQueryParams()) || '';
            const fullURL = queryString ? `${dataURL}?${queryString}` : dataURL;
            
            this.log(`🌐 Fetching data from: ${fullURL}`);
            
            const response = await fetch(fullURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 데이터 유효성 검사
            if (typeof data !== 'object' || data === null) {
                throw new Error('Invalid data format: expected object');
            }
            
            return data;
            
        } catch (error) {
            console.error('Failed to fetch component data:', error);
            throw error;
        }
    }



    /**
     * 캐시 무효화
     */
    invalidateCache(routeName) {
        if (this.router.cacheManager) {
            this.router.cacheManager.invalidateComponentCache(routeName);
        }
        this.log(`Cache invalidated for route: ${routeName}`);
    }


    /**
     * 설정 업데이트
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('RouteLoader config updated:', this.config);
    }

    /**
     * 통계 정보 반환
     */
    getStats() {
        return {
            environment: this.config.environment,
            basePath: this.config.basePath,
            routesPath: this.config.routesPath,
            useLayout: this.config.useLayout,
            useComponents: this.config.useComponents
        };
    }

    /**
     * 페이지 제목 생성
     */
    generatePageTitle(routeName) {
        return this.toPascalCase(routeName).replace(/([A-Z])/g, ' $1').trim();
    }

    /**
     * 디버그 로그
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[RouteLoader]', ...args);
        }
    }

    /**
     * 정리 (메모리 누수 방지)
     */
    destroy() {
        this.router = null;
        this.log('RouteLoader destroyed');
    }
}