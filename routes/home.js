/**
 * ViewLogic 빌드된 라우트: home
 * 빌드 시간: 2025-08-19T08:32:09.570Z
 * 빌드 버전: 1.0.0
 */

// 스타일 자동 적용
const STYLE_ID = 'route-style-home';
const STYLE_CONTENT = `.home-page {\n    padding: 20px;\n    max-width: 1200px;\n    margin: 0 auto;\n    background: white;\n    border-radius: 8px;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n.home-page h1 {\n    color: #333;\n    margin-bottom: 20px;\n    font-size: 2.5rem;\n    text-align: center;\n}\n\n.home-content {\n    padding: 20px;\n}\n\n.home-content > p {\n    font-size: 1.2rem;\n    text-align: center;\n    margin-bottom: 20px;\n    color: #666;\n}\n\n.home-message {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 20px;\n    border-radius: 12px;\n    text-align: center;\n    margin-bottom: 30px;\n    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);\n}\n\n.home-message p {\n    margin: 0;\n    font-size: 1.1rem;\n}\n\n.features {\n    background: #f8f9fa;\n    padding: 20px;\n    border-radius: 8px;\n    margin-bottom: 30px;\n}\n\n.features h3 {\n    color: #333;\n    margin-bottom: 15px;\n}\n\n.features ul {\n    list-style-type: none;\n    padding-left: 0;\n}\n\n.features li {\n    padding: 8px 0;\n    border-bottom: 1px solid #eee;\n}\n\n.features li:before {\n    content: "✓ ";\n    color: #28a745;\n    font-weight: bold;\n}\n\n.home-actions {\n    text-align: center;\n    margin-top: 30px;\n}\n\n.home-actions button {\n    background: #007bff;\n    color: white;\n    border: none;\n    padding: 12px 24px;\n    border-radius: 4px;\n    cursor: pointer;\n    margin: 0 10px;\n    font-size: 1rem;\n    transition: background 0.3s;\n}\n\n.home-actions button:hover {\n    background: #0056b3;\n}\n\n@media (max-width: 768px) {\n    .home-page {\n        padding: 15px;\n        margin: 10px;\n    }\n    \n    .home-page h1 {\n        font-size: 2rem;\n    }\n    \n    .home-actions button {\n        display: block;\n        width: 100%;\n        margin: 10px 0;\n    }\n}`;

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const styleElement = document.createElement('style');
    styleElement.id = STYLE_ID;
    styleElement.textContent = STYLE_CONTENT;
    document.head.appendChild(styleElement);
}

const component = {
  name: "Home",
  layout: "default",
  pageTitle: "Home - ViewLogic",
  showHeader: true,
  headerTitle: "ViewLogic App",
  headerSubtitle: "Vue 3 Compatible Router System",
  data() {
        return {
            message: 'Vue 3 컴포넌트로 동작중입니다!',
            features: [
                '해시 기반 라우팅',
                '동적 Vue SFC 조합',
                '뷰/로직/스타일 완전 분리',
                'Vue 3 Composition API 지원',
                'Vue 스타일 데이터 바인딩',
                '레이아웃 시스템 지원'
            ]
        }
    },
  methods: {
    handleAction() {
            this.message = 'Vue 3 반응형 시스템이 정상 작동합니다! 🎉'
            setTimeout(() => {
                this.message = 'Vue 3으로 완벽하게 동작합니다!'
            }, 3000)
        },
  },
  _routeName: "home",
  _isBuilt: true,
  _buildTime: "2025-08-19T08:32:09.570Z",
  _buildVersion: "1.0.0",
};

component.template = `<nav class="main-nav">\n    <ul>\n        <li><a href="#home" :class="{ active: currentRoute === 'home' }">Home</a></li>\n        <li><a href="#about" :class="{ active: currentRoute === 'about' }">About</a></li>\n        <li><a href="#contact" :class="{ active: currentRoute === 'contact' }">Contact</a></li>\n    </ul>\n</nav>\n\n<header v-if="showHeader" class="page-header">\n    <div class="container">\n        <h1>{{ headerTitle || pageTitle }}</h1>\n        <p v-if="headerSubtitle" class="subtitle">{{ headerSubtitle }}</p>\n    </div>\n</header>\n\n<main class="main-content">\n    <div class="container">\n        <!-- 페이지 콘텐츠가 여기에 삽입됩니다 -->\n        <div class="home-page">\n    <div class="hero-section">\n        <h2>Welcome to ViewLogic</h2>\n        <p>Vue SFC 호환 라우터에 오신 것을 환영합니다!</p>\n    </div>\n    \n    <div class="home-content">\n        <div class="home-message">\n            <p><strong>{{ message || 'Vue 스타일 컴포넌트로 동작중입니다!' }}</strong></p>\n        </div>\n        \n        <div class="features">\n            <h3>주요 기능:</h3>\n            <ul>\n                <li v-for="feature in features" :key="feature">{{ feature }}</li>\n            </ul>\n        </div>\n        \n        <div class="home-actions">\n            <button @click="navigateTo('about')" class="btn btn-primary">About 페이지</button>\n            <button @click="navigateTo('contact')" class="btn btn-secondary">Contact 페이지</button>\n            <button @click="handleAction" class="btn btn-outline">테스트 액션</button>\n        </div>\n    </div>\n</div>\n    </div>\n</main>\n\n<footer class="page-footer">\n    <div class="container">\n        <p>&copy; 2024 ViewLogic App. All rights reserved.</p>\n    </div>\n</footer>`;

export default component;