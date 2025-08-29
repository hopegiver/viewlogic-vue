const STYLE_ID = 'route-style-404';
const STYLE_CONTENT = ".not-found-container{min-height:80vh;display:flex;align-items:center;justify-content:center;padding:2rem;}.not-found-content{max-width:800px;text-align:center;width:100%;}.not-found-illustration{margin-bottom:2rem;}.number-404{display:flex;justify-content:center;align-items:center;font-size:8rem;font-weight:700;color:#007bff;margin-bottom:1rem;}.four{animation:bounce 2s infinite;}.four:first-child{animation-delay:0s;}.four:last-child{animation-delay:0.2s;}.zero{position:relative;margin:0 1rem;}.zero-inner{width:120px;height:120px;border:8px solid #007bff;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:spin 3s linear infinite;}.search-icon{font-size:3rem;animation:pulse 2s infinite;}@keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0);}40%{transform:translateY(-20px);}60%{transform:translateY(-10px);}}@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}.not-found-text h1{font-size:2.5rem;color:#333;margin-bottom:1rem;font-weight:600;}.error-message{font-size:1.1rem;color:#666;line-height:1.6;margin-bottom:2rem;}.error-message code{background-color:#f8f9fa;padding:0.2rem 0.4rem;border-radius:4px;color:#e83e8c;font-family:'Courier New',monospace;}.search-section{margin:2rem 0;}.search-box{display:flex;max-width:500px;margin:0 auto;gap:0.5rem;}.search-input{flex:1;padding:0.75rem 1rem;border:2px solid #e9ecef;border-radius:8px;font-size:1rem;transition:border-color 0.3s ease;}.search-input:focus{outline:none;border-color:#007bff;}.search-button{padding:0.75rem 1.5rem;background-color:#007bff;color:white;border:none;border-radius:8px;font-size:1rem;cursor:pointer;transition:background-color 0.3s ease;}.search-button:hover{background-color:#0056b3;}.suggestions-section{margin:3rem 0;}.suggestions-section h3{font-size:1.5rem;color:#333;margin-bottom:1.5rem;font-weight:600;}.suggestions-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem;max-width:800px;margin:0 auto;}.suggestion-card{background-color:#f8f9fa;padding:1.5rem;border-radius:12px;cursor:pointer;transition:all 0.3s ease;position:relative;border:2px solid transparent;}.suggestion-card:hover{background-color:#e9ecef;transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,123,255,0.15);border-color:#007bff;}.suggestion-card h4{font-size:1.2rem;color:#333;margin-bottom:0.5rem;font-weight:600;}.suggestion-card p{color:#666;margin-bottom:1rem;line-height:1.4;}.suggestion-arrow{position:absolute;top:1rem;right:1rem;font-size:1.2rem;color:#007bff;transition:transform 0.3s ease;}.suggestion-card:hover .suggestion-arrow{transform:translateX(4px);}.action-buttons{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin:2rem 0;}.action-buttons .btn{padding:0.75rem 1.5rem;font-size:1rem;border-radius:8px;text-decoration:none;transition:all 0.3s ease;border:2px solid transparent;cursor:pointer;font-weight:500;}.action-buttons .btn-primary{background-color:#007bff;color:white;border-color:#007bff;}.action-buttons .btn-primary:hover{background-color:#0056b3;transform:translateY(-2px);}.action-buttons .btn-secondary{background-color:#6c757d;color:white;border-color:#6c757d;}.action-buttons .btn-secondary:hover{background-color:#545b62;transform:translateY(-2px);}.action-buttons .btn-outline{background-color:transparent;color:#007bff;border-color:#007bff;}.action-buttons .btn-outline:hover{background-color:#007bff;color:white;transform:translateY(-2px);}.help-section{margin-top:3rem;padding-top:2rem;border-top:1px solid #e9ecef;}.help-details summary{cursor:pointer;padding:1rem;background-color:#f8f9fa;border-radius:8px;font-weight:600;color:#495057;transition:background-color 0.3s ease;}.help-details summary:hover{background-color:#e9ecef;}.help-content{padding:1.5rem;text-align:left;background-color:#ffffff;border-radius:8px;margin-top:0.5rem;box-shadow:0 2px 10px rgba(0,0,0,0.1);}.help-content p{color:#495057;margin-bottom:1rem;}.help-content ul{color:#666;padding-left:1.5rem;}.help-content li{margin-bottom:0.5rem;line-height:1.4;}@media (max-width:768px){.not-found-container{padding:1rem;min-height:70vh;}.number-404{font-size:5rem;}.zero-inner{width:80px;height:80px;}.search-icon{font-size:2rem;}.not-found-text h1{font-size:2rem;}.search-box{flex-direction:column;}.suggestions-grid{grid-template-columns:1fr;}.action-buttons{flex-direction:column;align-items:center;}.action-buttons .btn{width:100%;max-width:250px;}}";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = STYLE_CONTENT;
  document.head.appendChild(styleEl);
}

const component = {
    name: 'NotFoundPage',
    layout: 'default',
    pageTitle: '404 - 페이지를 찾을 수 없습니다',
    showHeader: false,
    data() {
        return {
            searchQuery: '',
            suggestedPages: [
                { name: '홈', route: 'home', description: '메인 페이지로 이동합니다' },
                { name: '소개', route: 'about', description: '서비스 소개 페이지입니다' },
                { name: '연락처', route: 'contact', description: '연락처 정보를 확인할 수 있습니다' }
            ],
            requestedUrl: window.location.hash || window.location.pathname
        }
    },
    methods: {
        searchSite() {
            if (this.searchQuery.trim()) {
                // 간단한 페이지 검색 로직
                const query = this.searchQuery.toLowerCase();
                const matchedPage = this.suggestedPages.find(page => 
                    page.name.toLowerCase().includes(query) ||
                    page.description.toLowerCase().includes(query)
                );
                
                if (matchedPage) {
                    this.navigateTo(matchedPage.route);
                } else {
                    alert(`"${this.searchQuery}"에 대한 검색 결과가 없습니다.`);
                }
            }
        },
        goToSuggestion(route) {
            this.navigateTo(route);
        },
        reportBrokenLink() {
            const errorInfo = {
                url: this.requestedUrl,
                referrer: document.referrer,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            console.log('깨진 링크 신고:', errorInfo);
            alert('깨진 링크가 신고되었습니다. 빠른 시일 내에 수정하겠습니다.');
        },
        goBack() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                this.navigateTo('home');
            }
        }
    },
    mounted() {
        // 404 페이지 방문 추적
        console.warn('404 페이지 방문:', {
            requestedUrl: this.requestedUrl,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
        });
    }
,
  _routeName: "404",
  _isBuilt: true,
  _buildTime: "2025-08-29T07:55:51.782Z",
  _buildVersion: "1.0.0"
};

component.template = "<nav class=\"main-nav\" x-data=\"{ cartItemCount: (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0, mobileMenuOpen: false, currentRoute: window.location.hash.slice(2) || 'home' }\" x-init=\" // 쿠키 변경 감지를 위한 이벤트 리스너 window.addEventListener('cartUpdated', () => { cartItemCount = (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0; }); // 라우트 변경 감지 window.addEventListener('hashchange', () => { currentRoute = window.location.hash.slice(2) || 'home'; }); \"><div class=\"nav-container\"><div class=\"nav-brand\"><a @click=\"navigateTo('home')\" class=\"brand-link\"><span class=\"brand-logo\">🚀</span><span class=\"brand-text\">ViewLogic</span></a></div><button class=\"nav-toggle\" @click=\"toggleMobileMenu\" :class=\"{ active: mobileMenuOpen }\"><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span></button><div class=\"nav-menu\" :class=\"{ active: mobileMenuOpen }\"><ul class=\"nav-links\"><li><a @click=\"navigateTo('home'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'home' }\">Home</a></li><li><a @click=\"navigateTo('about'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'about' }\">About</a></li><li class=\"has-dropdown\"><a href=\"javascript:void(0)\" class=\"dropdown-toggle\">서비스</a><ul class=\"dropdown-menu\"><li><a @click=\"navigateTo('products'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'products' }\">상품</a></li><li><a @click=\"navigateTo('blog'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'blog' }\">블로그</a></li><li><a @click=\"navigateTo('videos'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'videos' }\">동영상</a></li></ul></li><li><a @click=\"navigateTo('components'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'components' }\">컴포넌트</a></li><li><a @click=\"navigateTo('contact'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'contact' }\">Contact</a></li></ul></div><div class=\"nav-utils\" :class=\"{ active: mobileMenuOpen }\"><div class=\"cart-widget\" @click=\"navigateTo('cart'); closeMobileMenu()\"><span class=\"cart-icon\">🛒</span><span class=\"cart-count\" x-show=\"cartItemCount > 0\" x-text=\"cartItemCount\"></span></div><div class=\"nav-auth\"><a @click=\"navigateTo('login'); closeMobileMenu()\" class=\"auth-link login-link\">로그인</a><a @click=\"navigateTo('signup'); closeMobileMenu()\" class=\"auth-link signup-link\">회원가입</a></div></div></div></nav><header v-if=\"showHeader\" class=\"page-header\"><div class=\"container\"><h1>{{ headerTitle || pageTitle }}</h1><p v-if=\"headerSubtitle\" class=\"subtitle\">{{ headerSubtitle }}</p></div></header><main class=\"main-content\"><div class=\"container\"><div class=\"not-found-container\"><div class=\"not-found-content\"><div class=\"not-found-illustration\"><div class=\"number-404\"><span class=\"four\">4</span><span class=\"zero\"><div class=\"zero-inner\"><span class=\"search-icon\">🔍</span></div></span><span class=\"four\">4</span></div></div><div class=\"not-found-text\"><h1>페이지를 찾을 수 없습니다</h1><p class=\"error-message\"> 요청하신 페이지 <code>{{ requestedUrl }}</code>를 찾을 수 없습니다.<br> URL을 확인하시거나 아래 옵션을 이용해 주세요. </p></div></div></div></div></main><footer class=\"page-footer\"><div class=\"container\"><p>&copy; 2025 ViewLogic App. All rights reserved.</p></div></footer>";

export default component;