const STYLE_ID = 'route-style-components';
const STYLE_CONTENT = ".components-page{padding:2rem 0;min-height:100vh;}.components-header{text-align:center;margin-bottom:3rem;}.components-header h1{font-size:2.5rem;color:var(--primary-color);margin-bottom:1rem;}.components-header .lead{font-size:1.2rem;color:#666;}.component-tabs{display:flex;justify-content:center;gap:0.5rem;margin-bottom:3rem;flex-wrap:wrap;}.tab-btn{padding:0.5rem 1.5rem;background:#f5f5f5;border:1px solid #ddd;border-radius:25px;cursor:pointer;transition:all 0.3s ease;font-size:0.95rem;}.tab-btn:hover{background:#e8e8e8;}.tab-btn.active{background:var(--primary-color);color:white;border-color:var(--primary-color);}.components-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:2rem;padding:0 1rem;}.component-card{background:white;border:1px solid #e0e0e0;border-radius:8px;padding:1.5rem;transition:transform 0.3s ease,box-shadow 0.3s ease;}.component-card:hover{transform:translateY(-2px);box-shadow:0 8px 16px rgba(0,0,0,0.1);}.component-card h3{color:#333;margin-bottom:0.5rem;font-size:1.3rem;}.component-desc{color:#666;font-size:0.9rem;margin-bottom:1.5rem;}.component-preview{background:#f9f9f9;border:1px solid #e0e0e0;border-radius:4px;padding:1.5rem;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;min-height:80px;}.component-code{background:#2d2d2d;border-radius:4px;padding:1rem;cursor:pointer;position:relative;transition:background 0.3s ease;}.component-code:hover{background:#1e1e1e;}.component-code::after{content:'📋 클릭하여 복사';position:absolute;top:0.5rem;right:0.5rem;font-size:0.75rem;color:#888;}.component-code pre{margin:0;overflow-x:auto;}.component-code code{color:#f8f8f2;font-family:'Consolas','Monaco',monospace;font-size:0.85rem;line-height:1.5;}.btn{padding:0.5rem 1rem;border:none;border-radius:4px;cursor:pointer;font-size:0.9rem;transition:all 0.3s ease;}.btn-primary{background:var(--primary-color);color:white;}.btn-primary:hover{background:#0056b3;}.btn-secondary{background:#6c757d;color:white;}.btn-secondary:hover{background:#5a6268;}.btn-success{background:#28a745;color:white;}.btn-success:hover{background:#218838;}.btn-info{background:#17a2b8;color:white;}.btn-info:hover{background:#138496;}.btn-outline{background:white;color:var(--primary-color);border:1px solid var(--primary-color);}.btn-outline:hover{background:var(--primary-color);color:white;}.form-input,.form-select{padding:0.5rem;border:1px solid #ddd;border-radius:4px;font-size:0.9rem;min-width:200px;}.form-checkbox,.form-radio{margin-right:0.5rem;}.checkbox-label,.radio-label{display:flex;align-items:center;cursor:pointer;}.badge{display:inline-block;padding:0.25rem 0.5rem;border-radius:12px;font-size:0.8rem;font-weight:bold;margin:0 0.25rem;}.badge-primary{background:var(--primary-color);color:white;}.badge-success{background:#28a745;color:white;}.badge-warning{background:#ffc107;color:#333;}.progress-bar{width:100%;height:20px;background:#e0e0e0;border-radius:10px;overflow:hidden;}.progress-fill{height:100%;background:var(--primary-color);transition:width 0.3s ease;}.loading-spinner{width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid var(--primary-color);border-radius:50%;animation:spin 1s linear infinite;}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.alert{padding:1rem;border-radius:4px;font-size:0.9rem;}.alert-info{background:#d1ecf1;color:#0c5460;border:1px solid #bee5eb;}.pagination{display:flex;gap:0.25rem;}.page-btn{padding:0.25rem 0.75rem;border:1px solid #ddd;background:white;cursor:pointer;font-size:0.9rem;}.page-btn:hover{background:#f5f5f5;}.page-btn.active{background:var(--primary-color);color:white;border-color:var(--primary-color);}.breadcrumb{font-size:0.9rem;color:#666;}.breadcrumb a{color:var(--primary-color);text-decoration:none;margin:0 0.25rem;}.breadcrumb a:hover{text-decoration:underline;}.data-table{width:100%;border-collapse:collapse;font-size:0.9rem;}.data-table th,.data-table td{padding:0.5rem;border:1px solid #ddd;text-align:left;}.data-table th{background:#f5f5f5;font-weight:bold;}.tabs-example .tab-nav{display:flex;border-bottom:2px solid #e0e0e0;}.tabs-example .tab{padding:0.5rem 1rem;background:none;border:none;cursor:pointer;font-size:0.9rem;border-bottom:2px solid transparent;margin-bottom:-2px;}.tabs-example .tab.active{color:var(--primary-color);border-bottom-color:var(--primary-color);}.card-example{width:100%;height:60px;background:white;border:1px solid #ddd;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#999;}.card-example::after{content:'Card Component';}.sidebar-example{width:100%;height:60px;display:flex;}.sidebar-mini{width:60px;background:#2c3e50;color:white;display:flex;align-items:center;justify-content:center;font-size:0.8rem;}.accordion-item{border:1px solid #ddd;border-radius:4px;}.accordion-header{padding:0.75rem;background:#f5f5f5;cursor:pointer;font-size:0.9rem;}.file-upload{display:flex;align-items:center;}@media (max-width:768px){.components-grid{grid-template-columns:1fr;padding:0 0.5rem;}.component-tabs{padding:0 1rem;}.components-header h1{font-size:2rem;}}";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = STYLE_CONTENT;
  document.head.appendChild(styleEl);
}

const component = {
    name: 'Components',
    layout: 'default',
    data() {
        return {
            currentCategory: 'all',
            componentCards: [],
            tabButtons: []
        };
    },

    mounted() {
        this.initializeComponents();
        this.bindEvents();
    },

    methods: {
        initializeComponents() {
            // 컴포넌트 카드와 탭 버튼 초기화
            this.componentCards = document.querySelectorAll('.component-card');
            this.tabButtons = document.querySelectorAll('.tab-btn');
        },

        bindEvents() {
            // 카테고리 탭 이벤트
            this.tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterByCategory(e.target.dataset.category);
                    this.setActiveTab(e.target);
                });
            });

            // 모달 데모 버튼
            const modalDemo = document.getElementById('modal-demo');
            if (modalDemo) {
                modalDemo.addEventListener('click', () => {
                    this.showModalDemo();
                });
            }

            // 토스트 데모 버튼
            const toastDemo = document.getElementById('toast-demo');
            if (toastDemo) {
                toastDemo.addEventListener('click', () => {
                    this.showToastDemo();
                });
            }

            // 코드 복사 기능
            const codeBlocks = document.querySelectorAll('.component-code');
            codeBlocks.forEach(block => {
                block.addEventListener('click', (e) => {
                    this.copyCode(e.currentTarget);
                });
            });
        },

        filterByCategory(category) {
            this.currentCategory = category;
            
            this.componentCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.dataset.category;
                    card.style.display = cardCategory === category ? 'block' : 'none';
                }
            });
        },

        setActiveTab(activeButton) {
            this.tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            activeButton.classList.add('active');
        },

        showModalDemo() {
            // 간단한 모달 구현
            const modalHtml = `
                <div class="demo-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
                    <div style="background:white;padding:20px;border-radius:8px;max-width:400px;margin:20px;">
                        <h3 style="margin:0 0 15px 0;">모달 컴포넌트 예제</h3>
                        <p>이것은 모달 컴포넌트의 데모입니다.</p>
                        <p>다양한 콘텐츠를 모달 안에 표시할 수 있습니다.</p>
                        <div style="margin-top:20px;text-align:right;">
                            <button onclick="this.closest('.demo-modal').remove()" style="padding:8px 16px;margin-left:10px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">확인</button>
                            <button onclick="this.closest('.demo-modal').remove()" style="padding:8px 16px;margin-left:10px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;">취소</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        },

        showToastDemo() {
            const types = ['success', 'info', 'warning', 'error'];
            const messages = [
                '성공적으로 처리되었습니다!',
                '정보 메시지입니다.',
                '주의가 필요합니다.',
                '오류가 발생했습니다.'
            ];
            
            const randomIndex = Math.floor(Math.random() * types.length);
            
            // 간단한 토스트 메시지 표시
            const toastDiv = document.createElement('div');
            toastDiv.className = `toast-message ${types[randomIndex]}`;
            toastDiv.textContent = messages[randomIndex];
            toastDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:white;padding:12px 20px;border-radius:4px;z-index:9999;';
            
            document.body.appendChild(toastDiv);
            
            setTimeout(() => {
                document.body.removeChild(toastDiv);
            }, 3000);
        },

        copyCode(codeBlock) {
            const code = codeBlock.querySelector('code').textContent;
            
            // 클립보드에 복사
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    Toast.show({
                        message: '코드가 클립보드에 복사되었습니다!',
                        type: 'success',
                        duration: 2000
                    });
                }).catch(() => {
                    this.fallbackCopy(code);
                });
            } else {
                this.fallbackCopy(code);
            }
        },

        fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                Toast.show({
                    message: '코드가 클립보드에 복사되었습니다!',
                    type: 'success',
                    duration: 2000
                });
            } catch (err) {
                Toast.show({
                    message: '복사에 실패했습니다.',
                    type: 'error',
                    duration: 2000
                });
            }
            
            document.body.removeChild(textarea);
        }
    },

    beforeDestroy() {
        // 이벤트 리스너 정리
        this.tabButtons.forEach(btn => {
            btn.removeEventListener('click', null);
        });
    }
,
  _routeName: "components",
  _isBuilt: true,
  _buildTime: "2025-08-29T07:55:51.937Z",
  _buildVersion: "1.0.0"
};

component.template = "<nav class=\"main-nav\" x-data=\"{ cartItemCount: (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0, mobileMenuOpen: false, currentRoute: window.location.hash.slice(2) || 'home' }\" x-init=\" // 쿠키 변경 감지를 위한 이벤트 리스너 window.addEventListener('cartUpdated', () => { cartItemCount = (typeof getCookie !== 'undefined' ? getCookie('cartItemCount') : null) || 0; }); // 라우트 변경 감지 window.addEventListener('hashchange', () => { currentRoute = window.location.hash.slice(2) || 'home'; }); \"><div class=\"nav-container\"><div class=\"nav-brand\"><a @click=\"navigateTo('home')\" class=\"brand-link\"><span class=\"brand-logo\">🚀</span><span class=\"brand-text\">ViewLogic</span></a></div><button class=\"nav-toggle\" @click=\"toggleMobileMenu\" :class=\"{ active: mobileMenuOpen }\"><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span><span class=\"nav-toggle-bar\"></span></button><div class=\"nav-menu\" :class=\"{ active: mobileMenuOpen }\"><ul class=\"nav-links\"><li><a @click=\"navigateTo('home'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'home' }\">Home</a></li><li><a @click=\"navigateTo('about'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'about' }\">About</a></li><li class=\"has-dropdown\"><a href=\"javascript:void(0)\" class=\"dropdown-toggle\">서비스</a><ul class=\"dropdown-menu\"><li><a @click=\"navigateTo('products'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'products' }\">상품</a></li><li><a @click=\"navigateTo('blog'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'blog' }\">블로그</a></li><li><a @click=\"navigateTo('videos'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'videos' }\">동영상</a></li></ul></li><li><a @click=\"navigateTo('components'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'components' }\">컴포넌트</a></li><li><a @click=\"navigateTo('contact'); closeMobileMenu()\" :class=\"{ active: currentRoute === 'contact' }\">Contact</a></li></ul></div><div class=\"nav-utils\" :class=\"{ active: mobileMenuOpen }\"><div class=\"cart-widget\" @click=\"navigateTo('cart'); closeMobileMenu()\"><span class=\"cart-icon\">🛒</span><span class=\"cart-count\" x-show=\"cartItemCount > 0\" x-text=\"cartItemCount\"></span></div><div class=\"nav-auth\"><a @click=\"navigateTo('login'); closeMobileMenu()\" class=\"auth-link login-link\">로그인</a><a @click=\"navigateTo('signup'); closeMobileMenu()\" class=\"auth-link signup-link\">회원가입</a></div></div></div></nav><header v-if=\"showHeader\" class=\"page-header\"><div class=\"container\"><h1>{{ headerTitle || pageTitle }}</h1><p v-if=\"headerSubtitle\" class=\"subtitle\">{{ headerSubtitle }}</p></div></header><main class=\"main-content\"><div class=\"container\"><div class=\"components-page\"><div class=\"component-tabs\"><button class=\"tab-btn active\" data-category=\"all\">전체</button><button class=\"tab-btn\" data-category=\"form\">폼 요소</button><button class=\"tab-btn\" data-category=\"layout\">레이아웃</button><button class=\"tab-btn\" data-category=\"feedback\">피드백</button><button class=\"tab-btn\" data-category=\"navigation\">네비게이션</button><button class=\"tab-btn\" data-category=\"data\">데이터 표시</button></div><div class=\"components-grid\"><div class=\"component-card\" data-category=\"form\"><h3>Button</h3><p class=\"component-desc\">다양한 스타일과 크기의 버튼 컴포넌트</p><div class=\"component-preview\"><button class=\"btn btn-primary\">Primary</button><button class=\"btn btn-secondary\">Secondary</button><button class=\"btn btn-success\">Success</button></div><div class=\"component-code\"><pre><code>&lt;button class=\"btn btn-primary\"&gt;버튼&lt;/button&gt;</code></pre></div></div><div class=\"component-card\" data-category=\"layout\"><h3>Card</h3><p class=\"component-desc\">콘텐츠를 담는 카드 레이아웃 컴포넌트</p><div class=\"component-preview\"><div class=\"card-example\"></div></div><div class=\"component-code\"><pre><code>import Card from '@/components/Card'; Card.create({ title: '제목', content: '내용' });</code></pre></div></div><div class=\"component-card\" data-category=\"feedback\"><h3>Modal</h3><p class=\"component-desc\">팝업 다이얼로그 컴포넌트</p><div class=\"component-preview\"><button class=\"btn btn-primary\" id=\"modal-demo\">모달 열기</button></div><div class=\"component-code\"><pre><code>import Modal from '@/components/Modal'; Modal.show({ title: '제목', content: '내용' });</code></pre></div></div><div class=\"component-card\" data-category=\"feedback\"><h3>Toast</h3><p class=\"component-desc\">알림 메시지 컴포넌트</p><div class=\"component-preview\"><button class=\"btn btn-info\" id=\"toast-demo\">토스트 표시</button></div><div class=\"component-code\"><pre><code>import Toast from '@/components/Toast'; Toast.show({ message: '메시지', type: 'success' });</code></pre></div></div><div class=\"component-card\" data-category=\"form\"><h3>Input</h3><p class=\"component-desc\">텍스트 입력 필드 컴포넌트</p><div class=\"component-preview\"><input type=\"text\" class=\"form-input\" placeholder=\"텍스트 입력\"></div><div class=\"component-code\"><pre><code>import Input from '@/components/Input'; Input.create({ placeholder: '입력하세요' });</code></pre></div></div><div class=\"component-card\" data-category=\"form\"><h3>Select</h3><p class=\"component-desc\">드롭다운 선택 컴포넌트</p><div class=\"component-preview\"><select class=\"form-select\"><option>옵션 1</option><option>옵션 2</option></select></div><div class=\"component-code\"><pre><code>import Select from '@/components/Select'; Select.create({ options: ['옵션1', '옵션2'] });</code></pre></div></div><div class=\"component-card\" data-category=\"form\"><h3>Checkbox</h3><p class=\"component-desc\">체크박스 컴포넌트</p><div class=\"component-preview\"><label class=\"checkbox-label\"><input type=\"checkbox\" class=\"form-checkbox\"><span>체크박스</span></label></div><div class=\"component-code\"><pre><code>import Checkbox from '@/components/Checkbox'; Checkbox.create({ label: '옵션' });</code></pre></div></div><div class=\"component-card\" data-category=\"form\"><h3>Radio</h3><p class=\"component-desc\">라디오 버튼 컴포넌트</p><div class=\"component-preview\"><label class=\"radio-label\"><input type=\"radio\" name=\"demo\" class=\"form-radio\"><span>옵션 1</span></label></div><div class=\"component-code\"><pre><code>import Radio from '@/components/Radio'; Radio.create({ name: 'group', options: ['옵션1'] });</code></pre></div></div><div class=\"component-card\" data-category=\"data\"><h3>Table</h3><p class=\"component-desc\">데이터 테이블 컴포넌트</p><div class=\"component-preview\"><table class=\"data-table\"><thead><tr><th>열1</th><th>열2</th></tr></thead><tbody><tr><td>데이터1</td><td>데이터2</td></tr></tbody></table></div><div class=\"component-code\"><pre><code>import Table from '@/components/Table'; Table.create({ columns: [], data: [] });</code></pre></div></div><div class=\"component-card\" data-category=\"navigation\"><h3>Tabs</h3><p class=\"component-desc\">탭 네비게이션 컴포넌트</p><div class=\"component-preview\"><div class=\"tabs-example\"><div class=\"tab-nav\"><button class=\"tab active\">탭1</button><button class=\"tab\">탭2</button></div></div></div><div class=\"component-code\"><pre><code>import Tabs from '@/components/Tabs'; Tabs.create({ tabs: ['탭1', '탭2'] });</code></pre></div></div><div class=\"component-card\" data-category=\"data\"><h3>Badge</h3><p class=\"component-desc\">상태 표시 뱃지 컴포넌트</p><div class=\"component-preview\"><span class=\"badge badge-primary\">Primary</span><span class=\"badge badge-success\">Success</span><span class=\"badge badge-warning\">Warning</span></div><div class=\"component-code\"><pre><code>import Badge from '@/components/Badge'; Badge.create({ text: 'New', type: 'primary' });</code></pre></div></div><div class=\"component-card\" data-category=\"feedback\"><h3>Progress</h3><p class=\"component-desc\">진행 상태 표시 컴포넌트</p><div class=\"component-preview\"><div class=\"progress-bar\"><div class=\"progress-fill\" style=\"width: 60%\"></div></div></div><div class=\"component-code\"><pre><code>import Progress from '@/components/Progress'; Progress.create({ value: 60, max: 100 });</code></pre></div></div><div class=\"component-card\" data-category=\"feedback\"><h3>Loading</h3><p class=\"component-desc\">로딩 인디케이터 컴포넌트</p><div class=\"component-preview\"><div class=\"loading-spinner\"></div></div><div class=\"component-code\"><pre><code>import Loading from '@/components/Loading'; Loading.show();</code></pre></div></div><div class=\"component-card\" data-category=\"feedback\"><h3>Alert</h3><p class=\"component-desc\">경고 메시지 컴포넌트</p><div class=\"component-preview\"><div class=\"alert alert-info\">정보 메시지입니다.</div></div><div class=\"component-code\"><pre><code>import Alert from '@/components/Alert'; Alert.show({ message: '메시지', type: 'info' });</code></pre></div></div><div class=\"component-card\" data-category=\"navigation\"><h3>Pagination</h3><p class=\"component-desc\">페이지네이션 컴포넌트</p><div class=\"component-preview\"><div class=\"pagination\"><button class=\"page-btn\">이전</button><button class=\"page-btn active\">1</button><button class=\"page-btn\">2</button><button class=\"page-btn\">3</button><button class=\"page-btn\">다음</button></div></div><div class=\"component-code\"><pre><code>import Pagination from '@/components/Pagination'; Pagination.create({ total: 100, perPage: 10 });</code></pre></div></div><div class=\"component-card\" data-category=\"navigation\"><h3>Breadcrumb</h3><p class=\"component-desc\">경로 탐색 컴포넌트</p><div class=\"component-preview\"><nav class=\"breadcrumb\"><a href=\"#\">Home</a> / <a href=\"#\">Category</a> / <span>Current</span></nav></div><div class=\"component-code\"><pre><code>import Breadcrumb from '@/components/Breadcrumb'; Breadcrumb.create({ paths: ['Home', 'Category'] });</code></pre></div></div><div class=\"component-card\" data-category=\"layout\"><h3>Sidebar</h3><p class=\"component-desc\">사이드바 레이아웃 컴포넌트</p><div class=\"component-preview\"><div class=\"sidebar-example\"><div class=\"sidebar-mini\">사이드바</div></div></div><div class=\"component-code\"><pre><code>import Sidebar from '@/components/Sidebar'; Sidebar.create({ items: [] });</code></pre></div></div><div class=\"component-card\" data-category=\"layout\"><h3>Accordion</h3><p class=\"component-desc\">아코디언 컴포넌트</p><div class=\"component-preview\"><div class=\"accordion-item\"><div class=\"accordion-header\">▼ 섹션 1</div></div></div><div class=\"component-code\"><pre><code>import Accordion from '@/components/Accordion'; Accordion.create({ sections: [] });</code></pre></div></div><div class=\"component-card\" data-category=\"feedback\"><h3>Tooltip</h3><p class=\"component-desc\">툴팁 컴포넌트</p><div class=\"component-preview\"><button class=\"btn btn-secondary\" data-tooltip=\"툴팁 내용\">마우스를 올려보세요</button></div><div class=\"component-code\"><pre><code>import Tooltip from '@/components/Tooltip'; Tooltip.create({ target: element, text: '툴팁' });</code></pre></div></div><div class=\"component-card\" data-category=\"form\"><h3>DatePicker</h3><p class=\"component-desc\">날짜 선택 컴포넌트</p><div class=\"component-preview\"><input type=\"date\" class=\"form-input\"></div><div class=\"component-code\"><pre><code>import DatePicker from '@/components/DatePicker'; DatePicker.create({ format: 'YYYY-MM-DD' });</code></pre></div></div><div class=\"component-card\" data-category=\"form\"><h3>FileUpload</h3><p class=\"component-desc\">파일 업로드 컴포넌트</p><div class=\"component-preview\"><div class=\"file-upload\"><button class=\"btn btn-outline\">파일 선택</button></div></div><div class=\"component-code\"><pre><code>import FileUpload from '@/components/FileUpload'; FileUpload.create({ accept: '.jpg,.png' });</code></pre></div></div></div></div></div></main><footer class=\"page-footer\"><div class=\"container\"><p>&copy; 2025 ViewLogic App. All rights reserved.</p></div></footer>";

export default component;