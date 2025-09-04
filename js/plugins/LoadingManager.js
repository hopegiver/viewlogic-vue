/**
 * ViewLogic Loading Management System
 * 로딩 상태 및 프로그레스 관리 시스템
 */
export class LoadingManager {
    constructor(router, options = {}) {
        this.config = {
            showLoadingProgress: options.showLoadingProgress === true,
            loadingMinDuration: options.loadingMinDuration || 300,
            debug: options.debug || false
        };
        
        // 라우터 인스턴스 참조 (필요시 라우터 상태 확인용)
        this.router = router;
        
        this.transitionInProgress = false;
        this.loadingStartTime = null;
        this.progressBar = null;
        this.loadingOverlay = null;
        this.progressInterval = null;
        
        this.init();
    }

    /**
     * 로깅 래퍼 메서드
     */
    log(level, ...args) {
        if (this.router?.errorHandler) {
            this.router.errorHandler.log(level, 'LoadingManager', ...args);
        }
    }

    /**
     * 초기화
     */
    init() {
        if (this.config.showLoadingProgress) {
            this.createProgressBar();
        }
        this.addLoadingStyles();
    }

    /**
     * 프로그레스 바 생성
     */
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

    /**
     * 로딩 시작
     */
    showLoading() {
        this.transitionInProgress = true;
        this.loadingStartTime = Date.now();

        if (this.config.showLoadingProgress && this.progressBar) {
            this.progressBar.container.style.display = 'block';
            this.progressBar.bar.style.width = '0%';

            // 프로그레스 애니메이션 시작
            this.animateProgress();
        }
    }

    /**
     * 프로그레스 애니메이션
     */
    animateProgress() {
        let progress = 0;
        this.progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;

            if (this.progressBar && this.progressBar.bar) {
                this.progressBar.bar.style.width = progress + '%';
            }

            if (!this.transitionInProgress) {
                clearInterval(this.progressInterval);
                if (this.progressBar && this.progressBar.bar) {
                    this.progressBar.bar.style.width = '100%';
                }
            }
        }, 200);
    }

    /**
     * 로딩 종료
     */
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

        // 풀페이지 로딩 오버레이 제거
        if (this.loadingOverlay) {
            this.loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.remove();
                    this.loadingOverlay = null;
                }
            }, 300);
        }

        this.transitionInProgress = false;
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    /**
     * 풀페이지 로딩 표시
     */
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

        // 페이드인 효과
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    /**
     * 로딩 관련 스타일 추가
     */
    addLoadingStyles() {
        if (document.querySelector('#loading-manager-styles')) {
            return; // 이미 추가됨
        }

        const style = document.createElement('style');
        style.id = 'loading-manager-styles';
        style.textContent = `
            .loading-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                z-index: 9999;
            }

            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                transition: width 0.3s ease;
                border-radius: 0 3px 3px 0;
            }

            .page-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(2px);
            }

            .loading-container {
                text-align: center;
                padding: 2rem;
            }

            .loading-spinner {
                display: inline-block;
                position: relative;
                width: 64px;
                height: 64px;
                margin-bottom: 1rem;
            }

            .loading-spinner .spinner-ring {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 51px;
                height: 51px;
                margin: 6px;
                border: 6px solid #3b82f6;
                border-radius: 50%;
                animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #3b82f6 transparent transparent transparent;
            }

            .loading-spinner .spinner-ring:nth-child(1) {
                animation-delay: -0.45s;
            }

            .loading-spinner .spinner-ring:nth-child(2) {
                animation-delay: -0.3s;
            }

            .loading-spinner .spinner-ring:nth-child(3) {
                animation-delay: -0.15s;
            }

            @keyframes spinner-ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            .loading-text {
                margin: 0;
                font-size: 1rem;
                color: #6b7280;
                font-weight: 500;
            }

            .loading-state {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                min-height: 200px;
            }

            .loading-state .loading-spinner {
                margin-bottom: 0;
                transform: scale(0.8);
            }

            .fade-out {
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            @media (max-width: 768px) {
                .loading-container {
                    padding: 1rem;
                }

                .loading-spinner {
                    width: 48px;
                    height: 48px;
                }

                .loading-spinner .spinner-ring {
                    width: 38px;
                    height: 38px;
                    margin: 5px;
                    border-width: 4px;
                }

                .loading-text {
                    font-size: 0.9rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 전환 상태 확인
     */
    isTransitionInProgress() {
        return this.transitionInProgress;
    }

    /**
     * 전환 상태 설정
     */
    setTransitionInProgress(inProgress) {
        this.transitionInProgress = inProgress;
    }

    /**
     * 로딩 엘리먼트 제거 (기존 컴포넌트에서 사용)
     */
    removeLoadingElement(appElement) {
        const loadingElement = appElement.querySelector('.loading');
        if (loadingElement) {
            // 페이드아웃 효과
            loadingElement.classList.add('fade-out');
            setTimeout(() => {
                if (loadingElement && loadingElement.parentNode) {
                    loadingElement.remove();
                }
            }, 300);
        }
    }

    /**
     * 정리 (메모리 누수 방지)
     */
    destroy() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        if (this.progressBar) {
            if (this.progressBar.container && this.progressBar.container.parentNode) {
                this.progressBar.container.remove();
            }
            this.progressBar = null;
        }

        if (this.loadingOverlay && this.loadingOverlay.parentNode) {
            this.loadingOverlay.remove();
            this.loadingOverlay = null;
        }

        // 스타일 제거
        const styleElement = document.querySelector('#loading-manager-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }
}