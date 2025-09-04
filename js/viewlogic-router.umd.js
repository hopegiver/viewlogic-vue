/**
 * ViewLogic Router - UMD Bundle
 * Optimized version with cleaner Promise handling
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        var api = factory();
        root.createRouter = api.createRouter;
        root.ViewLogicRouter = api.ViewLogicRouter;
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    let RouterClass = null;
    let loadPromise = null;

    function detectEnvironment(options) {
        return (options && options.environment) || 'development';
    }

    function getRouterPath(environment) {
        return environment === 'production' ? './viewlogic-router.prod.js' : './viewlogic-router.js';
    }

    function setGlobalRouter(router) {
        try { 
            root.router = router; 
        } catch(_) { 
            try { 
                window.router = router; 
            } catch(__) {}
        }
    }

    async function loadRouterClass(options) {
        if (RouterClass) return RouterClass;
        
        if (!loadPromise) {
            const environment = detectEnvironment(options);
            const routerPath = getRouterPath(environment);
            
            loadPromise = import(routerPath)
                .then(module => {
                    RouterClass = module.ViewLogicRouter;
                    return RouterClass;
                })
                .catch(error => {
                    if (environment === 'production' && error?.message?.includes('Failed to fetch')) {
                        return import('./viewlogic-router.js').then(module => {
                            RouterClass = module.ViewLogicRouter;
                            return RouterClass;
                        });
                    }
                    throw error;
                });
        }
        
        return loadPromise;
    }

    async function createRouter(options = {}) {
        const RouterConstructor = await loadRouterClass(options);
        const router = new RouterConstructor(options);
        
        // 라우터 생성 즉시 전역에 설정
        setGlobalRouter(router);
        
        if (!router.mount) {
            router.mount = function(el) {
                // mount 시에도 다시 설정 (안전장치)
                setGlobalRouter(router);
                return router;
            };
        }
        
        return router;
    }

    function ViewLogicRouter(options = {}) {
        const routerPromise = createRouter(options);
        
        // Promise 완료 시 즉시 전역 설정 확인
        routerPromise.then(router => {
            setGlobalRouter(router);
        });
        
        routerPromise.mount = function(el) {
            return routerPromise.then(router => {
                // mount 시에도 다시 설정 (안전장치)
                setGlobalRouter(router);
                
                if (router.mount) {
                    return router.mount(el);
                }
                return router;
            });
        };
        
        return routerPromise;
    }

    return { createRouter, ViewLogicRouter };
}));