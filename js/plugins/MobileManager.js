/**
 * ViewLogic Mobile Menu Management System
 * 모바일 메뉴 상태 관리 시스템
 */
export class MobileManager {
    constructor(router, options = {}) {
        this.config = {
            breakpoint: options.breakpoint || 768,
            debug: options.debug || false
        };
        
        // 라우터 인스턴스 참조
        this.router = router;
        
        // 모바일 메뉴 상태
        this.mobileMenuOpen = false;
        
        this.log('MobileManager initialized with config:', this.config);
        
        // 윈도우 리사이즈 이벤트 리스너 등록
        this.initializeEventListeners();
    }

    /**
     * 이벤트 리스너 초기화
     */
    initializeEventListeners() {
        window.addEventListener('resize', () => this.handleWindowResize());
    }

    /**
     * 모바일 메뉴 토글
     */
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        // 현재 Vue 앱에서 상태 업데이트
        if (this.router.currentVueApp) {
            this.router.currentVueApp.config.globalProperties.mobileMenuOpen = this.mobileMenuOpen;
            // 강제 업데이트를 위한 이벤트 발생
            this.updateMobileMenuState();
        }
    }

    /**
     * 모바일 메뉴 닫기
     */
    closeMobileMenu() {
        this.mobileMenuOpen = false;
        
        // 현재 Vue 앱에서 상태 업데이트
        if (this.router.currentVueApp) {
            this.router.currentVueApp.config.globalProperties.mobileMenuOpen = this.mobileMenuOpen;
            // 강제 업데이트를 위한 이벤트 발생
            this.updateMobileMenuState();
        }
    }

    /**
     * 모바일 메뉴 상태 업데이트
     */
    updateMobileMenuState() {
        // 모바일 메뉴 상태를 DOM에 반영
        const navMenus = document.querySelectorAll('.nav-menu, .nav-auth');
        const navToggle = document.querySelector('.nav-toggle');
        
        navMenus.forEach(menu => {
            if (this.mobileMenuOpen) {
                menu.classList.add('active');
            } else {
                menu.classList.remove('active');
            }
        });
        
        if (navToggle) {
            if (this.mobileMenuOpen) {
                navToggle.classList.add('active');
            } else {
                navToggle.classList.remove('active');
            }
        }
        
        // body 스크롤 제어
        if (this.mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * 윈도우 리사이즈 시 모바일 메뉴 정리
     */
    handleWindowResize() {
        if (window.innerWidth > this.config.breakpoint) {
            this.closeMobileMenu();
        }
    }

    /**
     * 모바일 메뉴 상태 가져오기
     */
    getMobileMenuOpen() {
        return this.mobileMenuOpen;
    }

    /**
     * 모바일 메뉴 상태 설정
     */
    setMobileMenuOpen(state) {
        if (typeof state === 'boolean') {
            this.mobileMenuOpen = state;
            this.updateMobileMenuState();
        }
    }

    /**
     * Vue 앱에 전역 속성 등록
     */
    registerGlobalProperties(vueApp) {
        if (!vueApp || !vueApp.config) return;
        
        vueApp.config.globalProperties.mobileMenuOpen = this.mobileMenuOpen;
        vueApp.config.globalProperties.toggleMobileMenu = () => this.toggleMobileMenu();
        vueApp.config.globalProperties.closeMobileMenu = () => this.closeMobileMenu();
        
        this.log('Global properties registered to Vue app');
    }

    /**
     * 설정 업데이트
     */
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        this.log('MobileManager config updated:', this.config);
    }

    /**
     * 디버그 로그
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[MobileManager]', ...args);
        }
    }

    /**
     * 정리 (메모리 누수 방지)
     */
    destroy() {
        // 이벤트 리스너 제거
        window.removeEventListener('resize', () => this.handleWindowResize());
        
        // 상태 초기화
        this.mobileMenuOpen = false;
        this.router = null;
        
        this.log('MobileManager destroyed');
    }
}