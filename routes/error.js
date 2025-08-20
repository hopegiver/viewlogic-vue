/**
 * ViewLogic 경량 라우트: error
 * 빌드 시간: 2025-08-20T02:13:26.530Z
 * 빌드 버전: 1.0.0
 * 컴포넌트: 통합 components.js 사용
 */

// 스타일 자동 적용
const STYLE_ID = 'route-style-error';
const STYLE_CONTENT = `.error-container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 60vh;\n    padding: 2rem;\n}\n\n.error-content {\n    text-align: center;\n    max-width: 600px;\n    padding: 2rem;\n    background-color: #fff;\n    border-radius: 12px;\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n}\n\n.error-icon {\n    font-size: 4rem;\n    margin-bottom: 1rem;\n    display: block;\n}\n\n.error-code {\n    font-size: 6rem;\n    font-weight: 700;\n    color: #dc3545;\n    margin: 0;\n    line-height: 1;\n}\n\n.error-title {\n    font-size: 1.8rem;\n    color: #343a40;\n    margin: 1rem 0;\n    font-weight: 600;\n}\n\n.error-description {\n    font-size: 1.1rem;\n    color: #6c757d;\n    margin: 1.5rem 0;\n    line-height: 1.5;\n}\n\n.error-actions {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n    gap: 1rem;\n    margin: 2rem 0;\n}\n\n.error-actions .btn {\n    padding: 0.75rem 1.5rem;\n    font-size: 1rem;\n    border-radius: 8px;\n    text-decoration: none;\n    transition: all 0.3s ease;\n    border: 2px solid transparent;\n    cursor: pointer;\n    font-weight: 500;\n}\n\n.error-actions .btn:disabled {\n    opacity: 0.6;\n    cursor: not-allowed;\n}\n\n.error-actions .btn-primary {\n    background-color: #007bff;\n    color: white;\n    border-color: #007bff;\n}\n\n.error-actions .btn-primary:hover:not(:disabled) {\n    background-color: #0056b3;\n    transform: translateY(-2px);\n}\n\n.error-actions .btn-secondary {\n    background-color: #6c757d;\n    color: white;\n    border-color: #6c757d;\n}\n\n.error-actions .btn-secondary:hover {\n    background-color: #545b62;\n    transform: translateY(-2px);\n}\n\n.error-actions .btn-outline {\n    background-color: transparent;\n    color: #007bff;\n    border-color: #007bff;\n}\n\n.error-actions .btn-outline:hover {\n    background-color: #007bff;\n    color: white;\n    transform: translateY(-2px);\n}\n\n.error-help {\n    margin-top: 2rem;\n    padding-top: 1rem;\n    border-top: 1px solid #e9ecef;\n}\n\n.error-details {\n    margin-bottom: 1rem;\n}\n\n.error-details summary {\n    cursor: pointer;\n    padding: 0.5rem;\n    background-color: #f8f9fa;\n    border-radius: 4px;\n    margin-bottom: 0.5rem;\n    font-weight: 500;\n    color: #495057;\n}\n\n.error-details summary:hover {\n    background-color: #e9ecef;\n}\n\n.error-tech-info {\n    text-align: left;\n    background-color: #f8f9fa;\n    padding: 1rem;\n    border-radius: 4px;\n    font-family: 'Courier New', monospace;\n    font-size: 0.9rem;\n    color: #495057;\n}\n\n.error-tech-info p {\n    margin: 0.5rem 0;\n}\n\n.btn-link {\n    background: none;\n    border: none;\n    color: #007bff;\n    text-decoration: underline;\n    cursor: pointer;\n    font-size: 0.9rem;\n    padding: 0.5rem;\n}\n\n.btn-link:hover {\n    color: #0056b3;\n}\n\n/* 반응형 디자인 */\n@media (max-width: 768px) {\n    .error-container {\n        padding: 1rem;\n        min-height: 50vh;\n    }\n    \n    .error-content {\n        padding: 1.5rem;\n    }\n    \n    .error-code {\n        font-size: 4rem;\n    }\n    \n    .error-title {\n        font-size: 1.5rem;\n    }\n    \n    .error-actions {\n        flex-direction: column;\n        align-items: center;\n    }\n    \n    .error-actions .btn {\n        width: 100%;\n        max-width: 250px;\n    }\n}`;

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    const styleElement = document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = STYLE_CONTENT;
    document.head.appendChild(styleElement);
}

const component = {
    name: "ErrorComponent",
    props: {"errorCode":{"type":[null,null],"default":500},"errorMessage":{"default":"오류가 발생했습니다."},"showRetry":{"default":true},"showGoHome":{"default":true}},
    data() {
        return {
            isRetrying: false
        }
    },
    computed: {
        errorTitle() {
            const errorTitles = {
                404: '페이지를 찾을 수 없습니다',
                500: '서버 오류가 발생했습니다',
                403: '접근이 거부되었습니다',
                401: '인증이 필요합니다',
                400: '잘못된 요청입니다'
            };
            return errorTitles[this.errorCode] || '알 수 없는 오류';
        },
        errorDescription() {
            const descriptions = {
                404: '요청하신 페이지를 찾을 수 없습니다. URL을 확인해 주세요.',
                500: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
                403: '이 페이지에 접근할 권한이 없습니다.',
                401: '로그인이 필요한 페이지입니다.',
                400: '요청이 올바르지 않습니다.'
            };
            return descriptions[this.errorCode] || this.errorMessage;
        },
        errorIcon() {
            const icons = {
                404: '🔍',
                500: '⚠️',
                403: '🚫',
                401: '🔐',
                400: '❌'
            };
            return icons[this.errorCode] || '⚠️';
        },
    },
    methods: {
        async handleRetry() {
            this.isRetrying = true;
            try {
                // 현재 페이지 다시 로드 시도
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.reload();
            } catch (error) {
                console.error('재시도 실패:', error);
            } finally {
                this.isRetrying = false;
            }
        },
        goHome() {
            if (window.router) {
                window.router.navigate('home');
            } else {
                window.location.href = '#/home';
            }
        },
        goBack() {
            window.history.back();
        },
        reportError() {
            // 에러 리포팅 로직 (추후 구현 가능)
            console.log('에러 신고:', {
                code: this.errorCode,
                message: this.errorMessage,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
            alert('에러가 신고되었습니다. 빠른 시일 내에 수정하겠습니다.');
        },
    },
    _routeName: "error",
    _isBuilt: true,
    _buildTime: "2025-08-20T02:13:26.530Z",
    _buildVersion: "1.0.0",
};

component.template = `<nav class="main-nav">\n    <ul>\n        <li><a @click="navigateTo('home')" :class="{ active: currentRoute === 'home' }">Home</a></li>\n        <li><a @click="navigateTo('about')" :class="{ active: currentRoute === 'about' }">About</a></li>\n        <li><a @click="navigateTo('contact')" :class="{ active: currentRoute === 'contact' }">Contact</a></li>\n    </ul>\n</nav>\n\n<header v-if="showHeader" class="page-header">\n    <div class="container">\n        <h1>{{ headerTitle || pageTitle }}</h1>\n        <p v-if="headerSubtitle" class="subtitle">{{ headerSubtitle }}</p>\n    </div>\n</header>\n\n<main class="main-content">\n    <div class="container">\n        <!-- 페이지 콘텐츠가 여기에 삽입됩니다 -->\n        <div class="error-container">\n    <div class="error-content">\n        <div class="error-icon">{{ errorIcon }}</div>\n        <h1 class="error-code">{{ errorCode }}</h1>\n        <h2 class="error-title">{{ errorTitle }}</h2>\n        <p class="error-description">{{ errorDescription }}</p>\n        \n        <div class="error-actions">\n            <button \n                v-if="showRetry" \n                @click="handleRetry" \n                :disabled="isRetrying"\n                class="btn btn-primary"\n            >\n                <span v-if="isRetrying">재시도 중...</span>\n                <span v-else>🔄 다시 시도</span>\n            </button>\n            \n            <button \n                v-if="showGoHome" \n                @click="goHome" \n                class="btn btn-secondary"\n            >\n                🏠 홈으로 가기\n            </button>\n            \n            <button @click="goBack" class="btn btn-outline">\n                ← 뒤로 가기\n            </button>\n        </div>\n        \n        <div class="error-help">\n            <details class="error-details">\n                <summary>기술적 세부사항</summary>\n                <div class="error-tech-info">\n                    <p><strong>오류 코드:</strong> {{ errorCode }}</p>\n                    <p><strong>시간:</strong> {{ new Date().toLocaleString() }}</p>\n                    <p><strong>URL:</strong> {{ window.location.href }}</p>\n                </div>\n            </details>\n            \n            <button @click="reportError" class="btn btn-link">\n                📧 문제 신고하기\n            </button>\n        </div>\n    </div>\n</div>\n    </div>\n</main>\n\n<footer class="page-footer">\n    <div class="container">\n        <p>&copy; 2025 ViewLogic App. All rights reserved.</p>\n    </div>\n</footer>`;

export default component;