/**
 * ViewLogic Router - UMD factory (Promise-based)
 * Exposes a single global: createRouter(options) -> Promise<router>
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        var api = factory();
        root.createRouter = api.createRouter;
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    let RouterClass = null;
    let loadPromise = null;

    function detectEnvironment(options = {}) {
        if (options && typeof options.environment === 'string') {
            return options.environment;
        }
        return 'development';
    }

    function getRouterPath(environment) {
        return environment === 'production' ? './viewlogic-router.prod.js' : './viewlogic-router.js';
    }

    async function loadRouterClass(options = {}) {
        if (RouterClass) return RouterClass;
        if (!loadPromise) {
            const environment = detectEnvironment(options);
            const routerPath = getRouterPath(environment);
            console.log(`📦 Loading ViewLogicRouter (${environment} mode): ${routerPath}`);
            loadPromise = import(routerPath)
                .then(module => {
                    RouterClass = module.ViewLogicRouter;
                    console.log(`✅ ViewLogicRouter loaded successfully (${environment})`);
                    return RouterClass;
                })
                .catch(error => {
                    if (environment === 'production' && error && error.message && error.message.includes('Failed to fetch')) {
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

    async function createRouter(options = {}) {
        const Cls = await loadRouterClass(options);
        const router = new Cls(options);
        // mount 편의 함수 제공: 전역 노출 및 체이닝
        if (typeof router.mount !== 'function') {
            router.mount = function(el) {
                try { root.router = router; } catch(_) { try { window.router = router; } catch(__) {} }
                return router;
            };
        }
        return router;
    }

    return { createRouter };
}));