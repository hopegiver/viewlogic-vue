// 빌드된 라우트: about
// 빌드 시간: 2025-08-19T06:37:11.189Z

// 스타일 자동 적용
const style = `.about-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.about-page h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5rem;
    text-align: center;
}

.about-content {
    padding: 20px;
}

.intro-section {
    text-align: center;
    margin-bottom: 40px;
}

.intro-section h2 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.8rem;
}

.intro-section p {
    font-size: 1.2rem;
    color: #666;
    line-height: 1.6;
}

.features-section {
    margin-bottom: 40px;
}

.features-section h2 {
    color: #2c3e50;
    margin-bottom: 30px;
    text-align: center;
    font-size: 1.8rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.feature-card {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    opacity: 1;
    transform: translateY(0);
}

.feature-card:hover {
    background: #e9ecef;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #495057;
}

.feature-card p {
    color: #6c757d;
    line-height: 1.5;
}

.about-actions {
    text-align: center;
    margin-top: 40px;
}

.about-actions button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    margin: 0 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.about-actions button:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .about-page {
        padding: 15px;
        margin: 10px;
    }
    
    .about-page h1 {
        font-size: 2rem;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .about-actions button {
        display: block;
        width: 100%;
        margin: 10px 0;
    }
}`;
if (typeof document !== 'undefined') {
    const styleId = 'route-style-about';
    if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }
}

const component = {
  "name": "About",
  "data": data() {
        return {
            features: [
                {
                    icon: '🔗',
                    title: '해시 라우팅',
                    description: 'URL 해시를 기반으로 한 SPA 라우팅'
                },
                {
                    icon: '🚀',
                    title: '동적 생성',
                    description: '라우트 파일들의 자동 생성'
                },
                {
                    icon: '🔧',
                    title: '뷰/로직 분리',
                    description: 'HTML, CSS, JS 완전 분리'
                },
                {
                    icon: '⚡',
                    title: '프레임워크 호환',
                    description: 'React, Vue 모두 사용 가능'
                }
            ]
        }
    },
  "_routeName": "about",
  "_isBuilt": true,
  "_buildTime": "2025-08-19T06:37:11.189Z"
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
        <div class="about-page">
    <h1>About</h1>
    <div class="about-content">
        <div class="intro-section">
            <h2>프로젝트 소개</h2>
            <p>이 프로젝트는 React와 Vue 모두 호환 가능한 해시 기반 라우터입니다.</p>
        </div>
        
        <div class="features-section">
            <h2>핵심 기능</h2>
            <div class="feature-grid">
                <div class="feature-card" v-for="feature in features" :key="feature.title">
                    <h3>{{ feature.icon }} {{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                </div>
            </div>
        </div>
        
        <div class="about-actions">
            <button @click="navigateTo('home')">Home</button>
            <button @click="navigateTo('contact')">Contact</button>
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