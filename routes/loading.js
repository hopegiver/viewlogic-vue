const STYLE_ID = 'route-style-loading';
const STYLE_CONTENT = ".loading-container{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:200px;padding:2rem;}.loading-spinner{position:relative;width:80px;height:80px;margin-bottom:1rem;}.spinner-ring{position:absolute;top:0;left:0;width:100%;height:100%;border:4px solid transparent;border-top-color:#007bff;border-radius:50%;animation:spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite;}.spinner-ring:nth-child(1){animation-delay:-0.45s;}.spinner-ring:nth-child(2){animation-delay:-0.3s;}.spinner-ring:nth-child(3){animation-delay:-0.15s;}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.loading-text{font-size:1rem;color:#666;margin:0;font-weight:500;}.page-loading-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(255,255,255,0.9);z-index:9999;display:flex;justify-content:center;align-items:center;}.loading-progress{position:fixed;top:0;left:0;width:100%;height:3px;background-color:#f0f0f0;z-index:10000;overflow:hidden;}.loading-progress-bar{height:100%;background:linear-gradient(90deg,#007bff,#0056b3);width:0%;transition:width 0.3s ease;animation:progressPulse 2s ease-in-out infinite;}@keyframes progressPulse{0%,100%{opacity:0.8;}50%{opacity:1;}}.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:loading 1.5s infinite;}@keyframes loading{0%{background-position:200% 0;}100%{background-position:-200% 0;}}.skeleton-text{height:1rem;border-radius:4px;margin:0.5rem 0;}.skeleton-title{height:1.5rem;border-radius:4px;margin:1rem 0;}.skeleton-paragraph{height:0.8rem;border-radius:4px;margin:0.3rem 0;}";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = STYLE_CONTENT;
  document.head.appendChild(styleEl);
}

const component = {
    name: 'LoadingComponent',
    layout: 'default',
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
        }
    }
,
  _routeName: "loading",
  _isBuilt: true,
  _buildTime: "2025-08-29T07:55:51.999Z",
  _buildVersion: "1.0.0"
};

component.template = "<nav class=\"main-nav\" x-data=\"{ cartItemCount: (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0, mobileMenuOpen: false, currentRoute: window.location.hash.slice(2) || 'home' }\" x-init=\" // 쿠키 변경 감지를 위한 이벤트 리스너 window.addEventListener('cartUpdated', () => { cartItemCount = (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0; }); // 라우트 변경 감지 window.addEventListener('hashchange', () => { currentRoute = window.location.hash.slice(2) || 'home'; }); \"><div class=\"nav-container\"><div class=\"nav-brand\"><a @click=\"navigateTo('home')\" class=\"brand-link\"><span class=\"brand-logo\">🚀</span><span class=\"brand-text\">ViewLogic</span></a></div><button class=\"nav-toggle\" @click=\"toggleMobileMenu\" :class=\"{ active: mobileMenuOpen }\"><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span></button><div class=\"nav-menu\" :class=\"{ active: mobileMenuOpen }\"><ul class=\"nav-links\"><li><a @click=\"navigateTo('home'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'home' }\">Home</a></li><li><a @click=\"navigateTo('about'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'about' }\">About</a></li><li class=\"has-dropdown\"><a href=\"javascript:void(0)\" class=\"dropdown-toggle\">서비스</a><ul class=\"dropdown-menu\"><li><a @click=\"navigateTo('products'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'products' }\">상품</a></li><li><a @click=\"navigateTo('blog'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'blog' }\">블로그</a></li><li><a @click=\"navigateTo('videos'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'videos' }\">동영상</a></li></ul></li><li><a @click=\"navigateTo('components'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'components' }\">컴포넌트</a></li><li><a @click=\"navigateTo('contact'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'contact' }\">Contact</a></li></ul></div><div class=\"nav-utils\" :class=\"{ active: mobileMenuOpen }\"><div class=\"cart-widget\" @click=\"navigateTo('cart'); closeMobileMenu()\"><span class=\"cart-icon\">🛒</span><span class=\"cart-count\" x-show=\"cartItemCount > 0\" x-text=\"cartItemCount\"></span></div><div class=\"nav-auth\"><a @click=\"navigateTo('login'); closeMobileMenu()\" class=\"auth-link login-link\">로그인</a><a @click=\"navigateTo('signup'); closeMobileMenu()\" class=\"auth-link signup-link\">회원가입</a></div></div></div></nav><header v-if=\"showHeader\" class=\"page-header\"><div class=\"container\"><h1>{{ headerTitle || pageTitle }}</h1><p v-if=\"headerSubtitle\" class=\"subtitle\">{{ headerSubtitle }}</p></div></header><main class=\"main-content\"><div class=\"container\"><div class=\"loading-container\"><div class=\"loading-spinner\"><div class=\"spinner-ring\"></div><div class=\"spinner-ring\"></div><div class=\"spinner-ring\"></div><div class=\"spinner-ring\"></div></div><p class=\"loading-text\">{{ loadingText }}{{ dots }}</p></div></div></main><footer class=\"page-footer\"><div class=\"container\"><p>&copy; 2025 ViewLogic App. All rights reserved.</p></div></footer>";

export default component;