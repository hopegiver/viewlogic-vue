/**
 * ViewLogic Preload Management System
 * 라우트 프리로딩 관리 시스템
 */
export class PreloadManager {
    constructor(router, options = {}) {
        this.config = {
            preloadRoutes: options.preloadRoutes || [],
            preloadDelay: options.preloadDelay || 1000,
            preloadInterval: options.preloadInterval || 500,
            debug: options.debug || false
        };
        
        this.preloadedRoutes = new Set();
        this.preloadQueue = [];
        this.isProcessing = false;
        
        // 라우터 인스턴스 참조 (필수 의존성)
        this.router = router;
        
        this.log('info', 'PreloadManager initialized with routes:', this.config.preloadRoutes);
    }

    /**
     * 로깅 래퍼 메서드
     */
    log(level, ...args) {
        if (this.router?.errorHandler) {
            this.router.errorHandler.log(level, 'PreloadManager', ...args);
        }
    }

    /**
     * 프리로딩 시작
     */
    async startPreloading(currentRoute = '') {
        if (this.config.preloadRoutes.length === 0) {
            this.log('info', 'No routes to preload');
            return;
        }

        this.log('info', `🚀 Starting preload for routes: [${this.config.preloadRoutes.join(', ')}]`);

        // 현재 라우트를 제외한 라우트들을 큐에 추가
        for (const route of this.config.preloadRoutes) {
            if (!this.preloadedRoutes.has(route) && route !== currentRoute) {
                this.preloadQueue.push(route);
            }
        }

        // 프리로드 큐 처리 시작
        this.processPreloadQueue();
    }

    /**
     * 프리로드 큐 처리
     */
    async processPreloadQueue() {
        if (this.preloadQueue.length === 0 || this.isProcessing) {
            return;
        }

        this.isProcessing = true;
        const routeName = this.preloadQueue.shift();

        try {
            await this.preloadRoute(routeName);
            this.preloadedRoutes.add(routeName);
            this.log(`✅ Preloaded route: ${routeName}`);

            // 다음 프리로드를 위한 지연
            setTimeout(() => {
                this.isProcessing = false;
                this.processPreloadQueue();
            }, this.config.preloadInterval);

        } catch (error) {
            this.log(`⚠️ Failed to preload route ${routeName}:`, error.message);
            
            // 실패해도 다음 라우트 처리 계속
            setTimeout(() => {
                this.isProcessing = false;
                this.processPreloadQueue();
            }, this.config.preloadInterval);
        }
    }

    /**
     * 개별 라우트 프리로드
     */
    async preloadRoute(routeName) {
        if (!this.router) {
            throw new Error('Router instance not provided');
        }

        try {
            // 이미 캐시된 경우 스킵
            if (this.router.cacheManager?.getFromCache(`script_${routeName}`)) {
                this.log(`✅ Route already cached: ${routeName}`);
                return;
            }
            
            // 스크립트만 프리로드 (가장 시간이 오래 걸리는 부분)
            await (this.router.routeLoader?.loadScript(routeName) || this.router.loadScript(routeName));
            
            if (this.router.config.environment === 'development') {
                // 개발 모드에서는 템플릿과 스타일도 프리로드
                try {
                    await (this.router.routeLoader?.loadTemplate(routeName) || this.router.loadTemplate(routeName));
                    await (this.router.routeLoader?.loadStyle(routeName) || this.router.loadStyle(routeName));
                    
                    // 레이아웃도 프리로드 (스크립트에 layout 정보가 있는 경우)
                    const script = this.router.cacheManager?.getFromCache(`script_${routeName}`);
                    if (script && script.layout && script.layout !== null && this.router.config.useLayout) {
                        await (this.router.routeLoader?.loadLayout(script.layout) || this.router.loadLayout(script.layout));
                    }
                } catch (error) {
                    // 템플릿이나 스타일이 없어도 괜찮음
                    this.log(`Optional files not found for ${routeName}:`, error.message);
                }
            }
            
            this.log(`✅ Preloaded route: ${routeName}`);
        } catch (error) {
            // 프리로드 실패는 치명적이지 않음
            this.log(`⚠️ Preload failed for ${routeName}:`, error.message);
            throw error;
        }
    }

    /**
     * 특정 라우트를 우선순위로 프리로드
     */
    preloadSpecificRoute(routeName, currentRoute = '') {
        if (!this.preloadedRoutes.has(routeName) && routeName !== currentRoute) {
            // 큐의 맨 앞에 추가 (우선순위)
            this.preloadQueue.unshift(routeName);
            
            if (!this.isProcessing) {
                this.processPreloadQueue();
            }
        }
    }

    /**
     * 라우트가 프리로드되었는지 확인
     */
    isPreloaded(routeName) {
        return this.preloadedRoutes.has(routeName);
    }

    /**
     * 프리로드된 라우트 목록 반환
     */
    getPreloadedRoutes() {
        return Array.from(this.preloadedRoutes);
    }

    /**
     * 프리로드 큐 상태 반환
     */
    getQueueStatus() {
        return {
            queue: [...this.preloadQueue],
            preloaded: this.getPreloadedRoutes(),
            isProcessing: this.isProcessing,
            remaining: this.preloadQueue.length
        };
    }

    /**
     * 라우터 인스턴스 설정
     */
    setRouter(router) {
        this.router = router;
        this.log('debug', 'Router instance updated');
    }

    /**
     * 프리로드 캐시 초기화
     */
    clearCache() {
        this.preloadedRoutes.clear();
        this.preloadQueue = [];
        this.isProcessing = false;
        this.log('debug', 'Preload cache cleared');
    }

    /**
     * 특정 라우트의 프리로드 캐시 무효화
     */
    invalidateRoute(routeName) {
        this.preloadedRoutes.delete(routeName);
        
        // 큐에서도 제거 (재프리로드를 위해)
        const index = this.preloadQueue.indexOf(routeName);
        if (index > -1) {
            this.preloadQueue.splice(index, 1);
        }
        
        this.log(`Invalidated preload cache for route: ${routeName}`);
    }

    /**
     * 프리로드 중지
     */
    stop() {
        this.isProcessing = false;
        this.preloadQueue = [];
        this.log('Preloading stopped');
    }

    /**
     * 프리로드 시작 (지연 시간 포함)
     */
    startDelayedPreloading(currentRoute = '') {
        setTimeout(() => {
            this.startPreloading(currentRoute);
        }, this.config.preloadDelay);
    }

    /**
     * 통계 정보 반환
     */
    getStats() {
        return {
            totalPreloadRoutes: this.config.preloadRoutes.length,
            preloadedCount: this.preloadedRoutes.size,
            queuedCount: this.preloadQueue.length,
            isProcessing: this.isProcessing,
            preloadRatio: this.config.preloadRoutes.length > 0 
                ? (this.preloadedRoutes.size / this.config.preloadRoutes.length * 100).toFixed(1) + '%'
                : '0%'
        };
    }

    /**
     * 정리 (메모리 누수 방지)
     */
    destroy() {
        this.stop();
        this.clearCache();
        this.routeLoader = null;
        this.log('PreloadManager destroyed');
    }
}