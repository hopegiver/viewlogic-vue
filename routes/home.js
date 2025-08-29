const STYLE_ID = 'route-style-home';
const STYLE_CONTENT = ".home-page{padding:20px;max-width:1200px;margin:0 auto;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}.home-page h1{color:#333;margin-bottom:20px;font-size:2.5rem;text-align:center;}.home-content{padding:20px;}.home-content > p{font-size:1.2rem;text-align:center;margin-bottom:20px;color:#666;}.home-message{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:12px;text-align:center;margin-bottom:30px;box-shadow:0 4px 15px rgba(102,126,234,0.3);}.home-message p{margin:0;font-size:1.1rem;}.features{background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:30px;}.features h3{color:#333;margin-bottom:15px;}.features ul{list-style-type:none;padding-left:0;}.features li{padding:8px 0;border-bottom:1px solid #eee;}.features li:before{content:\"✓ \";color:#28a745;font-weight:bold;}.home-actions{text-align:center;margin-top:30px;}.home-actions button{background:#007bff;color:white;border:none;padding:12px 24px;border-radius:4px;cursor:pointer;margin:0 10px;font-size:1rem;transition:background 0.3s;}.home-actions button:hover{background:#0056b3;}@media (max-width:768px){.home-page{padding:15px;margin:10px;}.home-page h1{font-size:2rem;}.home-actions button{display:block;width:100%;margin:10px 0;}}";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = STYLE_CONTENT;
  document.head.appendChild(styleEl);
}

const component = {
    name: 'Home',
    layout: 'default',  // 사용할 레이아웃 지정
    pageTitle: 'Home - ViewLogic',
    showHeader: true,
    headerTitle: 'ViewLogic App',
    headerSubtitle: 'Vue 3 Compatible Router System with Components',
    data() {
        return {
            message: '',
            actionLoading: false,
            showModal: false,
            modalInput: '',
            demoInput: '',
            activeTab: 'demo1',
            features: [],
            tabsData: [
                {
                    name: 'demo1',
                    label: '컴포넌트 데모',
                    icon: '🧩'
                },
                {
                    name: 'demo2',
                    label: '기능 목록',
                    icon: '📋'
                }
            ],
            componentFeatures: [
                {
                    name: 'Button',
                    description: '다양한 스타일과 상태를 가진 버튼 컴포넌트',
                    status: '완료'
                },
                {
                    name: 'Modal',
                    description: '모달 다이얼로그 컴포넌트',
                    status: '완료'
                },
                {
                    name: 'Card',
                    description: '콘텐츠를 카드 형태로 표시하는 컴포넌트',
                    status: '완료'
                },
                {
                    name: 'Toast',
                    description: '알림 메시지 컴포넌트',
                    status: '완료'
                },
                {
                    name: 'Input',
                    description: '다양한 타입의 입력 필드 컴포넌트',
                    status: '완료'
                },
                {
                    name: 'Tabs',
                    description: '탭 네비게이션 컴포넌트',
                    status: '완료'
                }
            ]
        }
    },
    methods: {
        async handleAction() {
            this.actionLoading = true;
            this.message = 'Vue 3 반응형 시스템이 정상 작동합니다! 🎉'
            
            // 로딩 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.actionLoading = false;
            this.message = 'Vue 3 + 컴포넌트 시스템으로 완벽하게 동작합니다!'
            
            setTimeout(() => {
                this.message = 'Vue 3 컴포넌트로 동작중입니다!'
            }, 3000)
        },
        
        showToast() {
            if (this.$refs.toast) {
                this.$refs.toast.success('컴포넌트 시스템이 정상적으로 작동하고 있습니다!', {
                    title: '성공',
                    duration: 4000
                });
            } else {
                console.log('Toast: 컴포넌트 시스템이 정상적으로 작동하고 있습니다!');
            }
        },
        
        handleModalConfirm() {
            console.log('모달 확인:', this.modalInput);
            this.showModal = false;
            
            if (this.$refs.toast) {
                this.$refs.toast.info(`모달 입력값: ${this.modalInput || '(비어있음)'}`, {
                    title: '모달 확인됨'
                });
            }
        },
        
        handleModalCancel() {
            console.log('모달 취소됨');
            this.modalInput = '';
        },
        
        onTabChange(data) {
            console.log('탭 변경:', data);
            
            if (this.$refs.toast) {
                this.$refs.toast.info(`'${data.tab.label}' 탭으로 이동했습니다`, {
                    duration: 2000
                });
            }
        },
        
        loadI18nData() {
            if (this.$t) {
                this.message = this.$t('home.message');
                this.features = this.$t('home.features');
                this.headerTitle = this.$t('home.title');
                this.headerSubtitle = this.$t('home.subtitle');
            }
        },
        
        onLanguageChanged(data) {
            console.log('Language changed to:', data.language);
            // 언어가 변경되면 데이터 다시 로드
            this.$nextTick(() => {
                this.loadI18nData();
            });
        }
    },
    
    mounted() {
        // i18n 데이터 로딩
        this.loadI18nData();
        
        // 컴포넌트 시스템 로드 완료 알림
        setTimeout(() => {
            if (this.$refs.toast) {
                this.$refs.toast.success(this.$t ? this.$t('components.toast.test_message') : '컴포넌트 시스템이 로드되었습니다!', {
                    title: this.$t ? this.$t('common.success') : '시스템 준비 완료',
                    duration: 3000
                });
            }
        }, 1000);
    }
,
  _routeName: "home",
  _isBuilt: true,
  _buildTime: "2025-08-29T07:55:51.984Z",
  _buildVersion: "1.0.0"
};

component.template = "<nav class=\"main-nav\" x-data=\"{ cartItemCount: (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0, mobileMenuOpen: false, currentRoute: window.location.hash.slice(2) || 'home' }\" x-init=\" // 쿠키 변경 감지를 위한 이벤트 리스너 window.addEventListener('cartUpdated', () => { cartItemCount = (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0; }); // 라우트 변경 감지 window.addEventListener('hashchange', () => { currentRoute = window.location.hash.slice(2) || 'home'; }); \"><div class=\"nav-container\"><div class=\"nav-brand\"><a @click=\"navigateTo('home')\" class=\"brand-link\"><span class=\"brand-logo\">🚀</span><span class=\"brand-text\">ViewLogic</span></a></div><button class=\"nav-toggle\" @click=\"toggleMobileMenu\" :class=\"{ active: mobileMenuOpen }\"><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span></button><div class=\"nav-menu\" :class=\"{ active: mobileMenuOpen }\"><ul class=\"nav-links\"><li><a @click=\"navigateTo('home'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'home' }\">Home</a></li><li><a @click=\"navigateTo('about'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'about' }\">About</a></li><li class=\"has-dropdown\"><a href=\"javascript:void(0)\" class=\"dropdown-toggle\">서비스</a><ul class=\"dropdown-menu\"><li><a @click=\"navigateTo('products'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'products' }\">상품</a></li><li><a @click=\"navigateTo('blog'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'blog' }\">블로그</a></li><li><a @click=\"navigateTo('videos'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'videos' }\">동영상</a></li></ul></li><li><a @click=\"navigateTo('components'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'components' }\">컴포넌트</a></li><li><a @click=\"navigateTo('contact'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'contact' }\">Contact</a></li></ul></div><div class=\"nav-utils\" :class=\"{ active: mobileMenuOpen }\"><div class=\"cart-widget\" @click=\"navigateTo('cart'); closeMobileMenu()\"><span class=\"cart-icon\">🛒</span><span class=\"cart-count\" x-show=\"cartItemCount > 0\" x-text=\"cartItemCount\"></span></div><div class=\"nav-auth\"><a @click=\"navigateTo('login'); closeMobileMenu()\" class=\"auth-link login-link\">로그인</a><a @click=\"navigateTo('signup'); closeMobileMenu()\" class=\"auth-link signup-link\">회원가입</a></div></div></div></nav><header v-if=\"showHeader\" class=\"page-header\"><div class=\"container\"><h1>{{ headerTitle || pageTitle }}</h1><p v-if=\"headerSubtitle\" class=\"subtitle\">{{ headerSubtitle }}</p></div></header><main class=\"main-content\"><div class=\"container\"><div class=\"home-page\"><div class=\"language-switcher-container\" style=\"position: absolute; top: 1rem; right: 1rem;\"><LanguageSwitcher variant=\"select\" @language-changed=\"onLanguageChanged\" /></div><div class=\"home-content\"><Card :title=\"$t ? $t('home.router_title') : 'ViewLogic Router'\" :subtitle=\"$t ? $t('home.router_subtitle') : 'Vue 3 호환 라우터 시스템'\" :hoverable=\"true\" shadow=\"medium\" ><p><strong>{{ message || ($t ? $t('home.message') : 'Vue 스타일 컴포넌트로 동작중입니다!') }}</strong></p><template #footer><div class=\"card-tags\"><span class=\"card-tag tag-primary\">Vue 3</span><span class=\"card-tag tag-success\">Router</span></div></template></Card><Card :title=\"$t ? $t('home.features_title') : '주요 기능'\" :hoverable=\"true\" shadow=\"small\" style=\"margin-top: 1rem;\" ><ul><li v-for=\"feature in features\" :key=\"feature\">{{ feature }}</li></ul></Card><div class=\"home-actions\" style=\"margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;\"><Button variant=\"primary\" size=\"medium\" @click=\"navigateTo('about')\" icon=\"📖\" > {{ $t ? $t('home.about_page') : 'About 페이지' }} </Button><Button variant=\"secondary\" size=\"medium\" @click=\"navigateTo('contact')\" icon=\"📞\" > {{ $t ? $t('home.contact_page') : 'Contact 페이지' }} </Button><Button variant=\"outline\" size=\"medium\" :loading=\"actionLoading\" @click=\"handleAction\" icon=\"🚀\" > {{ $t ? $t('home.test_action') : '테스트 액션' }} </Button><Button variant=\"success\" size=\"medium\" @click=\"showToast\" icon=\"💬\" > {{ $t ? $t('home.notification_test') : '알림 테스트' }} </Button><Button variant=\"warning\" size=\"medium\" @click=\"showModal = true\" icon=\"🔧\" > {{ $t ? $t('home.modal_test') : '모달 테스트' }} </Button></div><div style=\"margin-top: 3rem;\"><Tabs v-model=\"activeTab\" :tabs=\"tabsData\" variant=\"underline\" @tab-change=\"onTabChange\" ><template #demo1><div style=\"padding: 1rem;\"><h4>컴포넌트 데모</h4><p>이것은 탭 컴포넌트의 첫 번째 패널입니다.</p><Input v-model=\"demoInput\" label=\"데모 입력\" placeholder=\"여기에 입력해보세요\" help-text=\"컴포넌트 시스템이 정상적으로 작동하고 있습니다\" clearable /></div></template><template #demo2><div style=\"padding: 1rem;\"><h4>기능 목록</h4><div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;\"><Card v-for=\"feature in componentFeatures\" :key=\"feature.name\" :title=\"feature.name\" :content=\"feature.description\" :tags=\"[feature.status]\" hoverable clickable shadow=\"small\" /></div></div></template></Tabs></div><Modal v-model=\"showModal\" title=\"컴포넌트 시스템 테스트\" size=\"medium\" @confirm=\"handleModalConfirm\" @cancel=\"handleModalCancel\" ><p>이것은 모달 컴포넌트 테스트입니다.</p><p>ViewLogic의 컴포넌트 시스템이 정상적으로 작동하고 있습니다!</p><Input v-model=\"modalInput\" label=\"모달 내 입력\" placeholder=\"모달에서도 컴포넌트가 작동합니다\" style=\"margin-top: 1rem;\" /></Modal><Toast ref=\"toast\" position=\"top-right\" /></div></div></div></main><footer class=\"page-footer\"><div class=\"container\"><p>&copy; 2025 ViewLogic App. All rights reserved.</p></div></footer>";

export default component;