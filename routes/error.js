const STYLE_ID = 'route-style-error';
const STYLE_CONTENT = ".error-container{display:flex;justify-content:center;align-items:center;min-height:60vh;padding:2rem;}.error-content{text-align:center;max-width:600px;padding:2rem;background-color:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);}.error-icon{font-size:4rem;margin-bottom:1rem;display:block;}.error-code{font-size:6rem;font-weight:700;color:#dc3545;margin:0;line-height:1;}.error-title{font-size:1.8rem;color:#343a40;margin:1rem 0;font-weight:600;}.error-description{font-size:1.1rem;color:#6c757d;margin:1.5rem 0;line-height:1.5;}.error-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin:2rem 0;}.error-actions .btn{padding:0.75rem 1.5rem;font-size:1rem;border-radius:8px;text-decoration:none;transition:all 0.3s ease;border:2px solid transparent;cursor:pointer;font-weight:500;}.error-actions .btn:disabled{opacity:0.6;cursor:not-allowed;}.error-actions .btn-primary{background-color:#007bff;color:white;border-color:#007bff;}.error-actions .btn-primary:hover:not(:disabled){background-color:#0056b3;transform:translateY(-2px);}.error-actions .btn-secondary{background-color:#6c757d;color:white;border-color:#6c757d;}.error-actions .btn-secondary:hover{background-color:#545b62;transform:translateY(-2px);}.error-actions .btn-outline{background-color:transparent;color:#007bff;border-color:#007bff;}.error-actions .btn-outline:hover{background-color:#007bff;color:white;transform:translateY(-2px);}.error-help{margin-top:2rem;padding-top:1rem;border-top:1px solid #e9ecef;}.error-details{margin-bottom:1rem;}.error-details summary{cursor:pointer;padding:0.5rem;background-color:#f8f9fa;border-radius:4px;margin-bottom:0.5rem;font-weight:500;color:#495057;}.error-details summary:hover{background-color:#e9ecef;}.error-tech-info{text-align:left;background-color:#f8f9fa;padding:1rem;border-radius:4px;font-family:'Courier New',monospace;font-size:0.9rem;color:#495057;}.error-tech-info p{margin:0.5rem 0;}.btn-link{background:none;border:none;color:#007bff;text-decoration:underline;cursor:pointer;font-size:0.9rem;padding:0.5rem;}.btn-link:hover{color:#0056b3;}@media (max-width:768px){.error-container{padding:1rem;min-height:50vh;}.error-content{padding:1.5rem;}.error-code{font-size:4rem;}.error-title{font-size:1.5rem;}.error-actions{flex-direction:column;align-items:center;}.error-actions .btn{width:100%;max-width:250px;}}";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = STYLE_CONTENT;
  document.head.appendChild(styleEl);
}

const component = {
    name: 'ErrorComponent',
    layout: 'default',
    props: {
        errorCode: {
            type: [String, Number],
            default: 500
        },
        errorMessage: {
            type: String,
            default: '오류가 발생했습니다.'
        },
        showRetry: {
            type: Boolean,
            default: true
        },
        showGoHome: {
            type: Boolean,
            default: true
        }
    },
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
        }
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
                window.router.navigateTo('home');
            } else {
                window.location.href = '#/';
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
        }
    }
,
  _routeName: "error",
  _isBuilt: true,
  _buildTime: "2025-08-29T07:55:51.971Z",
  _buildVersion: "1.0.0"
};

component.template = "<nav class=\"main-nav\" x-data=\"{ cartItemCount: (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0, mobileMenuOpen: false, currentRoute: window.location.hash.slice(2) || 'home' }\" x-init=\" // 쿠키 변경 감지를 위한 이벤트 리스너 window.addEventListener('cartUpdated', () => { cartItemCount = (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0; }); // 라우트 변경 감지 window.addEventListener('hashchange', () => { currentRoute = window.location.hash.slice(2) || 'home'; }); \"><div class=\"nav-container\"><div class=\"nav-brand\"><a @click=\"navigateTo('home')\" class=\"brand-link\"><span class=\"brand-logo\">🚀</span><span class=\"brand-text\">ViewLogic</span></a></div><button class=\"nav-toggle\" @click=\"toggleMobileMenu\" :class=\"{ active: mobileMenuOpen }\"><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span></button><div class=\"nav-menu\" :class=\"{ active: mobileMenuOpen }\"><ul class=\"nav-links\"><li><a @click=\"navigateTo('home'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'home' }\">Home</a></li><li><a @click=\"navigateTo('about'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'about' }\">About</a></li><li class=\"has-dropdown\"><a href=\"javascript:void(0)\" class=\"dropdown-toggle\">서비스</a><ul class=\"dropdown-menu\"><li><a @click=\"navigateTo('products'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'products' }\">상품</a></li><li><a @click=\"navigateTo('blog'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'blog' }\">블로그</a></li><li><a @click=\"navigateTo('videos'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'videos' }\">동영상</a></li></ul></li><li><a @click=\"navigateTo('components'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'components' }\">컴포넌트</a></li><li><a @click=\"navigateTo('contact'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'contact' }\">Contact</a></li></ul></div><div class=\"nav-utils\" :class=\"{ active: mobileMenuOpen }\"><div class=\"cart-widget\" @click=\"navigateTo('cart'); closeMobileMenu()\"><span class=\"cart-icon\">🛒</span><span class=\"cart-count\" x-show=\"cartItemCount > 0\" x-text=\"cartItemCount\"></span></div><div class=\"nav-auth\"><a @click=\"navigateTo('login'); closeMobileMenu()\" class=\"auth-link login-link\">로그인</a><a @click=\"navigateTo('signup'); closeMobileMenu()\" class=\"auth-link signup-link\">회원가입</a></div></div></div></nav><header v-if=\"showHeader\" class=\"page-header\"><div class=\"container\"><h1>{{ headerTitle || pageTitle }}</h1><p v-if=\"headerSubtitle\" class=\"subtitle\">{{ headerSubtitle }}</p></div></header><main class=\"main-content\"><div class=\"container\"><div class=\"error-container\"><div class=\"error-content\"><div class=\"error-icon\">{{ errorIcon }}</div><h1 class=\"error-code\">{{ errorCode }}</h1><h2 class=\"error-title\">{{ errorTitle }}</h2><p class=\"error-description\">{{ errorDescription }}</p><div class=\"error-actions\"><button v-if=\"showRetry\" @click=\"handleRetry\" :disabled=\"isRetrying\" class=\"btn btn-primary\" ><span v-if=\"isRetrying\">재시도 중...</span><span v-else>🔄 다시 시도</span></button><button v-if=\"showGoHome\" @click=\"goHome\" class=\"btn btn-secondary\" > 🏠 홈으로 가기 </button><button @click=\"goBack\" class=\"btn btn-outline\"> ← 뒤로 가기 </button></div><div class=\"error-help\"><details class=\"error-details\"><summary>기술적 세부사항</summary><div class=\"error-tech-info\"><p><strong>오류 코드:</strong> {{ errorCode }}</p><p><strong>시간:</strong> {{ new Date().toLocaleString() }}</p><p><strong>URL:</strong> {{ window.location.href }}</p></div></details><button @click=\"reportError\" class=\"btn btn-link\"> 📧 문제 신고하기 </button></div></div></div></div></main><footer class=\"page-footer\"><div class=\"container\"><p>&copy; 2025 ViewLogic App. All rights reserved.</p></div></footer>";

export default component;