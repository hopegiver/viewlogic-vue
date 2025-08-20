/**
 * ViewLogic 경량 라우트: loading
 * 빌드 시간: 2025-08-20T01:49:20.018Z
 * 빌드 버전: 1.0.0
 * 컴포넌트: 통합 components.js 사용
 */

// 스타일 자동 적용
const STYLE_ID = 'route-style-loading';
const STYLE_CONTENT = `.loading-container {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    min-height: 200px;\n    padding: 2rem;\n}\n\n.loading-spinner {\n    position: relative;\n    width: 80px;\n    height: 80px;\n    margin-bottom: 1rem;\n}\n\n.spinner-ring {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    border: 4px solid transparent;\n    border-top-color: #007bff;\n    border-radius: 50%;\n    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;\n}\n\n.spinner-ring:nth-child(1) {\n    animation-delay: -0.45s;\n}\n\n.spinner-ring:nth-child(2) {\n    animation-delay: -0.3s;\n}\n\n.spinner-ring:nth-child(3) {\n    animation-delay: -0.15s;\n}\n\n@keyframes spin {\n    0% {\n        transform: rotate(0deg);\n    }\n    100% {\n        transform: rotate(360deg);\n    }\n}\n\n.loading-text {\n    font-size: 1rem;\n    color: #666;\n    margin: 0;\n    font-weight: 500;\n}\n\n/* 전체 페이지 로딩 오버레이 */\n.page-loading-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: rgba(255, 255, 255, 0.9);\n    z-index: 9999;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n/* 페이지 전환 로딩 바 */\n.loading-progress {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 3px;\n    background-color: #f0f0f0;\n    z-index: 10000;\n    overflow: hidden;\n}\n\n.loading-progress-bar {\n    height: 100%;\n    background: linear-gradient(90deg, #007bff, #0056b3);\n    width: 0%;\n    transition: width 0.3s ease;\n    animation: progressPulse 2s ease-in-out infinite;\n}\n\n@keyframes progressPulse {\n    0%, 100% {\n        opacity: 0.8;\n    }\n    50% {\n        opacity: 1;\n    }\n}\n\n/* 스켈레톤 로딩 */\n.skeleton {\n    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n    background-size: 200% 100%;\n    animation: loading 1.5s infinite;\n}\n\n@keyframes loading {\n    0% {\n        background-position: 200% 0;\n    }\n    100% {\n        background-position: -200% 0;\n    }\n}\n\n.skeleton-text {\n    height: 1rem;\n    border-radius: 4px;\n    margin: 0.5rem 0;\n}\n\n.skeleton-title {\n    height: 1.5rem;\n    border-radius: 4px;\n    margin: 1rem 0;\n}\n\n.skeleton-paragraph {\n    height: 0.8rem;\n    border-radius: 4px;\n    margin: 0.3rem 0;\n}`;

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    const styleElement = document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = STYLE_CONTENT;
    document.head.appendChild(styleElement);
}

const component = {
    name: "LoadingComponent",
    data() {
        return {
            loadingText: '로딩 중...',
            dots: '',
            animationInterval: null
        }
    },
    mounted() {
        this.startAnimation();
    },
    unmounted() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    },
    methods: {
        startAnimation() {
            this.animationInterval = setInterval(() => {
                if (this.dots.length >= 3) {
                    this.dots = '';
                } else {
                    this.dots += '.';
                }
            }, 500);
        },
    },
    _routeName: "loading",
    _isBuilt: true,
    _buildTime: "2025-08-20T01:49:20.018Z",
    _buildVersion: "1.0.0",
};

component.template = `<nav class="main-nav">\n    <ul>\n        <li><a @click="navigateTo('home')" :class="{ active: currentRoute === 'home' }">Home</a></li>\n        <li><a @click="navigateTo('about')" :class="{ active: currentRoute === 'about' }">About</a></li>\n        <li><a @click="navigateTo('contact')" :class="{ active: currentRoute === 'contact' }">Contact</a></li>\n    </ul>\n</nav>\n\n<header v-if="showHeader" class="page-header">\n    <div class="container">\n        <h1>{{ headerTitle || pageTitle }}</h1>\n        <p v-if="headerSubtitle" class="subtitle">{{ headerSubtitle }}</p>\n    </div>\n</header>\n\n<main class="main-content">\n    <div class="container">\n        <!-- 페이지 콘텐츠가 여기에 삽입됩니다 -->\n        <div class="loading-container">\n    <div class="loading-spinner">\n        <div class="spinner-ring"></div>\n        <div class="spinner-ring"></div>\n        <div class="spinner-ring"></div>\n        <div class="spinner-ring"></div>\n    </div>\n    <p class="loading-text">{{ loadingText }}{{ dots }}</p>\n</div>\n    </div>\n</main>\n\n<footer class="page-footer">\n    <div class="container">\n        <p>&copy; 2025 ViewLogic App. All rights reserved.</p>\n    </div>\n</footer>`;

export default component;