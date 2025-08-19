// 빌드된 라우트: contact
// 빌드 시간: 2025-08-19T06:37:11.197Z

// 스타일 자동 적용
const style = `.contact-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.contact-page h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5rem;
    text-align: center;
}

.contact-content {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 30px;
}

.contact-info h2,
.contact-form h2 {
    color: #2c3e50;
    margin-bottom: 25px;
    font-size: 1.8rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.info-item {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    opacity: 1;
    transform: translateX(0);
    transition: all 0.3s ease;
}

.info-item h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #495057;
}

.info-item p {
    color: #6c757d;
    font-weight: 500;
}

.contact-form {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #495057;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #dee2e6;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007bff;
}

.form-group.focused label {
    color: #007bff;
}

.contact-form button {
    background: #28a745;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    width: 100%;
}

.contact-form button:hover {
    background: #218838;
    transform: translateY(-2px);
}

.contact-actions {
    text-align: center;
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid #dee2e6;
}

.contact-actions button {
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

.contact-actions button:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

.success-message {
    background: #d4edda;
    color: #155724;
    padding: 15px;
    border-radius: 6px;
    margin-top: 20px;
    border: 1px solid #c3e6cb;
    text-align: center;
    font-weight: 500;
}

@media (max-width: 768px) {
    .contact-page {
        padding: 15px;
        margin: 10px;
    }
    
    .contact-page h1 {
        font-size: 2rem;
    }
    
    .contact-content {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .contact-form {
        padding: 20px;
    }
    
    .contact-actions button {
        display: block;
        width: 100%;
        margin: 10px 0;
    }
}`;
if (typeof document !== 'undefined') {
    const styleId = 'route-style-contact';
    if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }
}

const component = {
  "name": "Contact",
  "data": data() {
        return {
            contactInfo: [
                {
                    icon: '📧',
                    title: 'Email',
                    value: 'contact@example.com'
                },
                {
                    icon: '📞',
                    title: 'Phone',
                    value: '+82-10-1234-5678'
                },
                {
                    icon: '📍',
                    title: 'Address',
                    value: '서울특별시 강남구'
                },
                {
                    icon: '🌐',
                    title: 'Website',
                    value: 'www.example.com'
                }
            ],
            form: {
                name: '',
                email: '',
                subject: '',
                message: ''
            }
        }
    },
  "mounted": mounted() {
        this.$nextTick(() => {
            const formElement = document.getElementById('contactForm')
            if (formElement) {
                formElement.addEventListener('submit', this.handleFormSubmit)
            }
        })
    },
  "beforeUnmount": beforeUnmount() {
        const formElement = document.getElementById('contactForm')
        if (formElement) {
            formElement.removeEventListener('submit', this.handleFormSubmit)
        }
    },
  "methods": {
      "handleFormSubmit": handleFormSubmit(event) {
            event.preventDefault()
            
            const formData = new FormData(event.target)
            console.log('폼 전송:', Object.fromEntries(formData))
            
            alert('메시지가 전송되었습니다!')
            event.target.reset()
        }
    },
  "_routeName": "contact",
  "_isBuilt": true,
  "_buildTime": "2025-08-19T06:37:11.197Z"
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
        <div class="contact-page">
    <h1>Contact</h1>
    <div class="contact-content">
        <div class="contact-info">
            <h2>연락처 정보</h2>
            <div class="info-grid">
                <div class="info-item" v-for="info in contactInfo" :key="info.title">
                    <h3>{{ info.icon }} {{ info.title }}</h3>
                    <p>{{ info.value }}</p>
                </div>
            </div>
        </div>
        
        <div class="contact-form">
            <h2>메시지 보내기</h2>
            <form id="contactForm">
                <div class="form-group">
                    <label for="name">이름</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="subject">제목</label>
                    <input type="text" id="subject" name="subject" required>
                </div>
                <div class="form-group">
                    <label for="message">메시지</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit">전송</button>
            </form>
        </div>
        
        <div class="contact-actions">
            <button @click="navigateTo('home')">Home</button>
            <button @click="navigateTo('about')">About</button>
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