// 빌드된 라우트: home
// 빌드 시간: 2025-08-19T06:37:11.202Z

// 스타일 자동 적용
const style = `.home-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.home-page h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5rem;
    text-align: center;
}

.home-content {
    padding: 20px;
}

.home-content > p {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 20px;
    color: #666;
}

.home-message {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.home-message p {
    margin: 0;
    font-size: 1.1rem;
}

.features {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
}

.features h3 {
    color: #333;
    margin-bottom: 15px;
}

.features ul {
    list-style-type: none;
    padding-left: 0;
}

.features li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.features li:before {
    content: "✓ ";
    color: #28a745;
    font-weight: bold;
}

.home-actions {
    text-align: center;
    margin-top: 30px;
}

.home-actions button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 10px;
    font-size: 1rem;
    transition: background 0.3s;
}

.home-actions button:hover {
    background: #0056b3;
}

@media (max-width: 768px) {
    .home-page {
        padding: 15px;
        margin: 10px;
    }
    
    .home-page h1 {
        font-size: 2rem;
    }
    
    .home-actions button {
        display: block;
        width: 100%;
        margin: 10px 0;
    }
}`;
if (typeof document !== 'undefined') {
    const styleId = 'route-style-home';
    if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }
}

const component = {
  "name": "Home",
  "layout": "default",
  "pageTitle": "Home - ViewLogic",
  "showHeader": true,
  "headerTitle": "ViewLogic App",
  "headerSubtitle": "Vue 3 Compatible Router System",
  "data": data() {
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
  "methods": {
      "handleAction": handleAction() {
            this.message = 'Vue 3 반응형 시스템이 정상 작동합니다! 🎉'
            setTimeout(() => {
                this.message = 'Vue 3으로 완벽하게 동작합니다!'
            }, 3000)
        }
    },
  "_routeName": "home",
  "_isBuilt": true,
  "_buildTime": "2025-08-19T06:37:11.202Z"
};

component.template = `<nav class="main-nav">
    <ul>
        <li><a href="#home" :class="{ active: currentRoute === 'home' }">Home</a></li>
        <li><a href="#about" :class="{ active: currentRoute === 'about' }">About</a></li>
        <li><a href="#contact" :class="{ active: currentRoute === 'contact' }">Contact</a></li>
    </ul>
</nav>

<header v-if="showHeader" class="page-header">
    <div class="container">
        <h1>{{ headerTitle || pageTitle }}</h1>
        <p v-if="headerSubtitle" class="subtitle">{{ headerSubtitle }}</p>
    </div>
</header>

<main class="main-content">
    <div class="container">
        <!-- 페이지 콘텐츠가 여기에 삽입됩니다 -->
        <div class="home-page">
    <div class="hero-section">
        <h2>Welcome to ViewLogic</h2>
        <p>Vue SFC 호환 라우터에 오신 것을 환영합니다!</p>
    </div>
    
    <div class="home-content">
        <div class="home-message">
            <p><strong>{{ message || 'Vue 스타일 컴포넌트로 동작중입니다!' }}</strong></p>
        </div>
        
        <div class="features">
            <h3>주요 기능:</h3>
            <ul>
                <li v-for="feature in features" :key="feature">{{ feature }}</li>
            </ul>
        </div>
        
        <div class="home-actions">
            <button @click="navigateTo('about')" class="btn btn-primary">About 페이지</button>
            <button @click="navigateTo('contact')" class="btn btn-secondary">Contact 페이지</button>
            <button @click="handleAction" class="btn btn-outline">테스트 액션</button>
        </div>
    </div>
</div>
    </div>
</main>

<footer class="page-footer">
    <div class="container">
        <p>&copy; 2024 ViewLogic App. All rights reserved.</p>
    </div>
</footer>`;

export default component;