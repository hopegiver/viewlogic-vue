// ViewLogic Router - ES6 Module
import { I18nManager } from './plugins/I18nManager.js';
import { LoadingManager } from './plugins/LoadingManager.js';
import { PreloadManager } from './plugins/PreloadManager.js';
import { AuthManager } from './plugins/AuthManager.js';
import { CacheManager } from './plugins/CacheManager.js';
import { QueryManager } from './plugins/QueryManager.js';
import { MobileManager } from './plugins/MobileManager.js';
import { RouteLoader } from './core/RouteLoader.js';
import { ErrorHandler } from './core/ErrorHandler.js';
import { ComponentLoader } from './core/ComponentLoader.js';

export class ViewLogicRouter {
    constructor(options = {}) {
        // 버전 정보
        this.version = options.version || '1.0.0';
        
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
            showLoadingProgress: options.showLoadingProgress === true, // 로딩 프로그레스 바 표시
            loadingMinDuration: options.loadingMinDuration || 300, // 최소 로딩 시간 (UX 개선)
            enableErrorReporting: options.enableErrorReporting !== false, // 에러 리포팅 활성화
            useComponents: options.useComponents !== false, // 컴포넌트 시스템 사용 여부
            // 컴포넌트 로더 설정
            componentNames: options.componentNames || [
                'Button', 'Modal', 'Card', 'Toast', 'Input', 'Tabs',
                'Checkbox', 'Alert', 'DynamicInclude', 'HtmlInclude'
            ],
            // i18n 설정
            useI18n: options.useI18n !== false, // 다국어 시스템 사용 여부
            defaultLanguage: options.defaultLanguage || 'ko', // 기본 언어 (폴백 언어로도 사용)
            // 인증 설정
            authEnabled: options.authEnabled || false, // 인증 시스템 사용 여부
            loginRoute: options.loginRoute || 'login', // 로그인 페이지 라우트
            protectedRoutes: options.protectedRoutes || [], // 보호된 특정 라우트들
            protectedPrefixes: options.protectedPrefixes || [], // 보호된 prefix들 (예: ['admin', 'dashboard'])
            publicRoutes: options.publicRoutes || ['login', 'register', 'home'], // 공개 라우트들
            checkAuthFunction: options.checkAuthFunction || null, // 사용자 정의 인증 체크 함수
            redirectAfterLogin: options.redirectAfterLogin || 'home', // 로그인 후 리다이렉트할 페이지
            // 쿠키 기반 인증 설정
            authCookieName: options.authCookieName || 'authToken', // 인증 쿠키 이름
            authFallbackCookieNames: options.authFallbackCookieNames || ['accessToken', 'token', 'jwt'], // 대체 쿠키 이름들
            // 스토리지 설정
            authStorage: options.authStorage || 'cookie', // 인증 토큰 저장소: 'localStorage', 'sessionStorage', 'cookie'
            authCookieOptions: options.authCookieOptions || {}, // 쿠키 저장 시 옵션
            authSkipValidation: options.authSkipValidation || false, // JWT 토큰 유효성 검사 스킵 여부
            // 보안 설정
            enableParameterValidation: options.enableParameterValidation !== false,
            maxParameterLength: options.maxParameterLength || 1000,
            maxParameterCount: options.maxParameterCount || 50,
            maxArraySize: options.maxArraySize || 100,
            allowedKeyPattern: options.allowedKeyPattern || /^[a-zA-Z0-9_-]+$/,
            logSecurityWarnings: options.logSecurityWarnings !== false            
        };
        
        this.currentHash = '';
        this.currentVueApp = null;
        this.previousVueApp = null; // 이전 Vue 앱 (전환 효과를 위해 보관)
        this.componentLoader = null; // 컴포넌트 로더 인스턴스

        // LoadingManager가 없을 때를 위한 기본 전환 상태
        this.transitionInProgress = false;
        
        // 모든 매니저를 생성자에서 직접 초기화
        this.initializeManagers();
        
        // 라우터 시작
        this.init();
    }

    /**
     * 매니저 전체 초기화 - 동기적으로 모든 매니저 생성
     */
    initializeManagers() {
        try {
            // 1. 항상 필요한 매니저들
            this.cacheManager = new CacheManager(this, this.config);
            this.routeLoader = new RouteLoader(this, this.config);
            this.queryManager = new QueryManager(this, this.config);
            this.errorHandler = new ErrorHandler(this, this.config);
            this.mobileManager = new MobileManager(this, this.config);
            
            // 2. 조건부 매니저들
            if (this.config.useI18n) {
                this.i18nManager = new I18nManager(this, this.config);
            }
            
            if (this.config.showLoadingProgress) {
                this.loadingManager = new LoadingManager(this, this.config);
            }
            
            if (this.config.authEnabled) {
                this.authManager = new AuthManager(this, this.config);
            }
            
            if (this.config.useComponents) {
                this.componentLoader = new ComponentLoader(this, {
                    ...this.config,
                    basePath: this.config.basePath + '/components',
                    cache: true,
                    componentNames: this.config.componentNames
                });
                
                // 프로덕션 모드에서는 통합 components.js 비동기 로드
                if (this.config.environment === 'production') {
                    this.componentLoader.loadUnifiedComponents(this.config.routesPath)
                        .catch(error => {
                            console.warn('Failed to load unified components:', error);
                            this.config.useComponents = false;
                        });
                }
            }
            
            if (this.config.preloadRoutes && this.config.preloadRoutes.length > 0) {
                this.preloadManager = new PreloadManager(this, this.config);
                // 프리로딩을 지연 시작
                setTimeout(() => {
                    if (this.preloadManager) {
                        this.preloadManager.startDelayedPreloading(this.currentHash);
                    }
                }, this.config.preloadDelay);
            }
            
            console.log('✅ All managers initialized successfully');
            
        } catch (error) {
            console.error('❌ Manager initialization failed:', error);
            throw error;
        }
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
                window.location.hash = '#/';
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
        let route, queryParams;
        
        if (this.config.mode === 'hash') {
            let hashPath = window.location.hash.slice(1) || '/';
            
            // Extract query parameters from hash
            const hashParts = hashPath.split('?');
            const pathPart = hashParts[0];
            const queryPart = hashParts[1] || window.location.search.slice(1);
            
            // Handle both /#/ and /#/home formats
            if (pathPart === '/' || pathPart === '') {
                route = 'home';
            } else if (pathPart.startsWith('/')) {
                route = pathPart.slice(1) || 'home';
            } else {
                // Legacy format support (#home)
                route = pathPart || 'home';
            }
            
            queryParams = this.queryManager?.parseQueryString(queryPart) || {};
        } else {
            // History mode
            route = window.location.pathname.slice(1) || 'home';
            queryParams = this.queryManager?.parseQueryString(window.location.search.slice(1)) || {};
        }
        
        // Store current query parameters in QueryManager
        this.queryManager?.setCurrentQueryParams(queryParams);
        
        if (route !== this.currentHash || this.queryManager?.hasQueryParamsChanged(queryParams)) {
            this.currentHash = route;
            this.loadRoute(route);
        }
    }

    async loadRoute(routeName) {
        // 전환이 진행 중이면 무시
        const inProgress = this.loadingManager ? 
            this.loadingManager.isTransitionInProgress() : 
            this.transitionInProgress;
        
        if (inProgress) {
            return;
        }

        try {
            if (this.loadingManager) {
                this.loadingManager.showLoading();
            } else {
                this.transitionInProgress = true;
            }
            
            // 인증 체크
            const authResult = this.authManager ? 
                await this.authManager.checkAuthentication(routeName) :
                { allowed: true, reason: 'auth_disabled' };
            if (!authResult.allowed) {
                // 인증 실패 시 로그인 페이지로 리다이렉트
                if (this.loadingManager) {
                    await this.loadingManager.hideLoading();
                }
                if (this.authManager) {
                    this.authManager.emitAuthEvent('auth_required', { 
                        originalRoute: routeName,
                        loginRoute: this.config.loginRoute 
                    });
                    const redirectUrl = routeName !== this.config.loginRoute ? 
                        `${this.config.loginRoute}?redirect=${encodeURIComponent(routeName)}` : 
                        this.config.loginRoute;
                    this.navigateTo(redirectUrl);
                }
                return;
            }
            
            const appElement = document.getElementById('app');
            if (!appElement) {
                throw new Error('App element not found');
            }

            // Vue 컴포넌트 생성 (백그라운드에서)
            const component = await this.routeLoader.createVueComponent(routeName);
            
            // 새로운 페이지를 오버레이로 렌더링
            await this.renderComponentWithTransition(component, routeName);
            
            // 로딩 완료
            if (this.loadingManager) {
                await this.loadingManager.hideLoading();
            }
            
        } catch (error) {
            console.error('라우트 로딩 오류:', error);
            
            if (this.loadingManager) {
                await this.loadingManager.hideLoading();
            }
            
            // 에러 타입에 따른 처리 (transitionInProgress는 에러 처리 후에 리셋)
            if (this.errorHandler) {
                await this.errorHandler.handleRouteError(routeName, error);
            } else {
                console.error('ErrorHandler not available, showing basic error:', error.message);
            }
        } finally {
            // 모든 처리가 완료된 후 전환 상태 리셋
            if (this.loadingManager) {
                this.loadingManager.setTransitionInProgress(false);
            } else {
                this.transitionInProgress = false;
            }
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
            navigateTo: (route, params) => this.navigateTo(route, params),
            getCurrentRoute: () => this.getCurrentRoute(),
            getQueryParams: () => this.queryManager?.getQueryParams() || {},
            getQueryParam: (key) => this.queryManager?.getQueryParam(key),
            setQueryParams: (params, replace) => this.queryManager?.setQueryParams(params, replace),
            removeQueryParams: (keys) => this.queryManager?.removeQueryParams(keys),
            currentRoute: this.currentHash,
            currentQuery: this.queryManager?.getQueryParams() || {}
        };

        // 모바일 메뉴 전역 함수 추가
        if (this.mobileManager) {
            this.mobileManager.registerGlobalProperties(newVueApp);
        }

        newVueApp.mount(`#${newPageContainer.id}`);

        // 즉시 이전 페이지들 정리
        setTimeout(() => {
            this.cleanupPreviousPages();
            if (this.loadingManager) {
                this.loadingManager.setTransitionInProgress(false);
            } else {
                this.transitionInProgress = false;
            }
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
        if (this.loadingManager) {
            this.loadingManager.removeLoadingElement(appElement);
        } else {
            const loadingElement = appElement.querySelector('.loading');
            if (loadingElement) {
                loadingElement.remove();
            }
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


    navigateTo(routeName, params = null) {
        // If routeName is an object, treat it as {route, params}
        if (typeof routeName === 'object') {
            params = routeName.params || null;
            routeName = routeName.route;
        }
        
        // Clear current query params if navigating to a different route
        if (routeName !== this.currentHash && this.queryManager) {
            this.queryManager.clearQueryParams();
        }
        
        // Update URL with new route and params
        this.updateURL(routeName, params);
    }

    getCurrentRoute() {
        return this.currentHash;
    }


    updateURL(route, params = null) {
        const queryParams = params || this.queryManager?.getQueryParams() || {};
        const queryString = this.queryManager?.buildQueryString(queryParams) || '';
        
        if (this.config.mode === 'hash') {
            let newHash;
            if (route === 'home') {
                newHash = queryString ? `#/?${queryString}` : '#/';
            } else {
                newHash = queryString ? `#/${route}?${queryString}` : `#/${route}`;
            }
            
            // Prevent triggering hashchange if URL is the same
            if (window.location.hash !== newHash) {
                window.location.hash = newHash;
            }
        } else {
            let newPath;
            if (route === 'home') {
                newPath = queryString ? `/?${queryString}` : '/';
            } else {
                newPath = queryString ? `/${route}?${queryString}` : `/${route}`;
            }
            
            // Use replaceState to avoid adding to history when only query params change
            const isSameRoute = window.location.pathname === (route === 'home' ? '/' : `/${route}`);
            if (isSameRoute) {
                window.history.replaceState({}, '', newPath);
            } else {
                window.history.pushState({}, '', newPath);
            }
            this.handleRouteChange();
        }
    }
}
// 전역 라우터는 index.html에서 환경설정과 함께 생성됨