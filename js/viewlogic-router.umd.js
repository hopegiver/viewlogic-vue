/**
 * ViewLogic Router - Environment-aware UMD Wrapper
 * Loads different files based on development/production mode
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ViewLogicRouter = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    let RouterClass = null;
    let loadPromise = null;

    // 환경 감지 함수
    function detectEnvironment() {
        // URL 기반 감지
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            if (url.includes('production.html') || url.includes('/dist/') || url.includes('.prod.')) {
                return 'production';
            }
        }
        
        // 파일명 기반 감지
        if (typeof document !== 'undefined') {
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                if (script.src && script.src.includes('production')) {
                    return 'production';
                }
            }
        }
        
        // 기본값: development
        return 'development';
    }

    // 환경별 파일 경로 결정
    function getRouterPath(environment) {
        if (environment === 'production') {
            return './viewlogic-router.prod.js';
        }
        return './viewlogic-router.js';
    }

    // ES6 모듈 로드 함수
    async function loadRouter(options = {}) {
        if (RouterClass) return RouterClass;
        
        if (!loadPromise) {
            // 환경 감지 (옵션으로 오버라이드 가능)
            const environment = options.environment || detectEnvironment();
            const routerPath = getRouterPath(environment);
            
            console.log(`📦 Loading ViewLogicRouter (${environment} mode): ${routerPath}`);
            
            loadPromise = import(routerPath)
                .then(module => {
                    RouterClass = module.ViewLogicRouter;
                    console.log(`✅ ViewLogicRouter loaded successfully (${environment})`);
                    return RouterClass;
                })
                .catch(error => {
                    // 프로덕션 파일이 없을 경우 개발 파일로 폴백
                    if (environment === 'production' && error.message.includes('Failed to fetch')) {
                        console.warn('⚠️ Production file not found, falling back to development mode');
                        return import('./viewlogic-router.js').then(module => {
                            RouterClass = module.ViewLogicRouter;
                            console.log('✅ ViewLogicRouter loaded (fallback to development)');
                            return RouterClass;
                        });
                    }
                    console.error('❌ Failed to load ViewLogicRouter:', error);
                    throw error;
                });
        }
        
        return loadPromise;
    }

    // 간단한 래퍼 생성자
    function ViewLogicRouter(options = {}) {
        this.options = options;
        this._router = null;
        this._ready = false;
        
        // 즉시 초기화 시작
        this.init();
    }

    // 초기화 메서드
    ViewLogicRouter.prototype.init = async function() {
        try {
            const RouterClass = await loadRouter(this.options);
            this._router = new RouterClass(this.options);
            this._ready = true;
            console.log('🚀 Router initialized');
        } catch (error) {
            console.error('❌ Router initialization failed:', error);
        }
    };

    // 메서드 프록시
    ViewLogicRouter.prototype.navigate = function(route) {
        if (this._ready && this._router) {
            return this._router.navigate(route);
        }
        console.warn('Router not ready yet');
    };

    return ViewLogicRouter;
}));