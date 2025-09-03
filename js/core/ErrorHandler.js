/**
 * ViewLogic Error Handling System
 * 라우트 및 시스템 에러 처리 시스템
 */
export class ErrorHandler {
    constructor(router, options = {}) {
        this.config = {
            enableErrorReporting: options.enableErrorReporting !== false,
            debug: options.debug || false
        };
        
        // 라우터 인스턴스 참조
        this.router = router;
        
        this.log('ErrorHandler initialized with config:', this.config);
    }

    /**
     * 라우트 에러 처리
     */
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
            // 모든 에러 페이지가 실패했을 때 최후의 폴백 페이지 표시
            this.showFallbackErrorPage(errorCode, errorMessage);
        }
    }

    /**
     * 404 페이지 로딩
     */
    async load404Page() {
        try {
            console.log('🔍 Loading 404 page...');
            const component = await this.createVueComponent('404');
            await this.renderComponentWithTransition(component, '404');
            console.log('✅ 404 page loaded successfully');
        } catch (error) {
            console.error('❌ 404 page loading failed:', error);
            // 404 페이지도 없으면 간단한 에러 메시지 표시
            this.showFallbackErrorPage('404', '페이지를 찾을 수 없습니다.');
        }
    }

    /**
     * 에러 페이지 로딩
     */
    async loadErrorPage(errorCode, errorMessage) {
        try {
            console.log(`🔍 Loading error page for ${errorCode}...`);
            
            // 에러 컴포넌트 생성
            const errorComponent = await this.createErrorComponent(errorCode, errorMessage);
            await this.renderComponentWithTransition(errorComponent, 'error');
            console.log(`✅ Error page ${errorCode} loaded successfully`);
        } catch (error) {
            console.error(`❌ Error page ${errorCode} loading failed:`, error);
            // 에러 페이지도 로딩 실패하면 폴백 표시
            this.showFallbackErrorPage(errorCode, errorMessage);
        }
    }

    /**
     * 에러 컴포넌트 생성
     */
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
            // 에러 컴포넌트도 로드할 수 없는 경우 간단한 에러 표시
            console.error('Error component load failed:', error);
            throw new Error(`Cannot load error page: ${error.message}`);
        }
    }

    /**
     * 폴백 에러 페이지 표시 (모든 에러 페이지가 실패했을 때)
     */
    showFallbackErrorPage(errorCode, errorMessage) {
        const appElement = document.getElementById('app');
        if (!appElement) return;

        const fallbackHTML = `
            <div class="fallback-error-page" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem;
                text-align: center;
                background: #f8f9fa;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    max-width: 500px;
                ">
                    <h1 style="
                        font-size: 4rem;
                        margin: 0;
                        color: #dc3545;
                        font-weight: 300;
                    ">${errorCode}</h1>
                    <h2 style="
                        margin: 1rem 0;
                        color: #495057;
                        font-weight: 400;
                    ">${errorMessage}</h2>
                    <p style="
                        color: #6c757d;
                        margin-bottom: 2rem;
                        line-height: 1.5;
                    ">요청하신 페이지를 찾을 수 없습니다.</p>
                    <button onclick="window.location.hash = '#/'" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        `;

        // 기존 컨테이너들 정리
        appElement.innerHTML = fallbackHTML;
        
        console.log(`📄 Fallback error page displayed for ${errorCode}`);
    }

    /**
     * 에러 리포팅
     */
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
                environment: this.router.config.environment,
                mode: this.router.config.mode
            }
        };
        
        console.error('라우터 에러 리포트:', errorReport);
        
        // 추후 에러 추적 서비스로 전송할 수 있음
        // 예: analytics.track('router_error', errorReport);
    }

    /**
     * Vue 컴포넌트 생성 (RouteLoader 위임)
     */
    async createVueComponent(routeName) {
        if (this.router.routeLoader) {
            return await this.router.routeLoader.createVueComponent(routeName);
        }
        throw new Error('RouteLoader not available');
    }

    /**
     * 컴포넌트 렌더링 (ViewManager 위임)
     */
    async renderComponentWithTransition(component, routeName) {
        if (this.router.renderComponentWithTransition) {
            return await this.router.renderComponentWithTransition(component, routeName);
        }
        throw new Error('Render function not available');
    }

    /**
     * 설정 업데이트
     */
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.log('ErrorHandler config updated:', this.config);
    }

    /**
     * 디버그 로그
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[ErrorHandler]', ...args);
        }
    }

    /**
     * 정리 (메모리 누수 방지)
     */
    destroy() {
        this.router = null;
        this.log('ErrorHandler destroyed');
    }
}