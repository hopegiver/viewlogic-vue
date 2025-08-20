/**
 * ViewLogic 경량 라우트: contact
 * 빌드 시간: 2025-08-20T02:13:26.530Z
 * 빌드 버전: 1.0.0
 * 컴포넌트: 통합 components.js 사용
 */

// 스타일 자동 적용
const STYLE_ID = 'route-style-contact';
const STYLE_CONTENT = `.contact-page {\n    padding: 20px;\n    max-width: 1200px;\n    margin: 0 auto;\n    background: white;\n    border-radius: 8px;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n.contact-page h1 {\n    color: #333;\n    margin-bottom: 20px;\n    font-size: 2.5rem;\n    text-align: center;\n}\n\n.contact-content {\n    padding: 20px;\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 40px;\n    margin-bottom: 30px;\n}\n\n.contact-info h2,\n.contact-form h2 {\n    color: #2c3e50;\n    margin-bottom: 25px;\n    font-size: 1.8rem;\n}\n\n.info-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n    gap: 20px;\n}\n\n.info-item {\n    background: #f8f9fa;\n    padding: 20px;\n    border-radius: 8px;\n    text-align: center;\n    opacity: 1;\n    transform: translateX(0);\n    transition: all 0.3s ease;\n}\n\n.info-item h3 {\n    font-size: 1.2rem;\n    margin-bottom: 10px;\n    color: #495057;\n}\n\n.info-item p {\n    color: #6c757d;\n    font-weight: 500;\n}\n\n.contact-form {\n    background: #f8f9fa;\n    padding: 30px;\n    border-radius: 8px;\n}\n\n.form-group {\n    margin-bottom: 20px;\n}\n\n.form-group label {\n    display: block;\n    margin-bottom: 8px;\n    font-weight: 600;\n    color: #495057;\n}\n\n.form-group input,\n.form-group textarea {\n    width: 100%;\n    padding: 12px;\n    border: 2px solid #dee2e6;\n    border-radius: 6px;\n    font-size: 1rem;\n    transition: border-color 0.3s ease;\n}\n\n.form-group input:focus,\n.form-group textarea:focus {\n    outline: none;\n    border-color: #007bff;\n}\n\n.form-group.focused label {\n    color: #007bff;\n}\n\n.contact-form button {\n    background: #28a745;\n    color: white;\n    border: none;\n    padding: 12px 30px;\n    border-radius: 6px;\n    cursor: pointer;\n    font-size: 1.1rem;\n    transition: all 0.3s ease;\n    width: 100%;\n}\n\n.contact-form button:hover {\n    background: #218838;\n    transform: translateY(-2px);\n}\n\n.contact-actions {\n    text-align: center;\n    margin-top: 30px;\n    padding-top: 30px;\n    border-top: 1px solid #dee2e6;\n}\n\n.contact-actions button {\n    background: #007bff;\n    color: white;\n    border: none;\n    padding: 12px 24px;\n    border-radius: 6px;\n    cursor: pointer;\n    margin: 0 10px;\n    font-size: 1rem;\n    transition: all 0.3s ease;\n}\n\n.contact-actions button:hover {\n    background: #0056b3;\n    transform: translateY(-2px);\n}\n\n.success-message {\n    background: #d4edda;\n    color: #155724;\n    padding: 15px;\n    border-radius: 6px;\n    margin-top: 20px;\n    border: 1px solid #c3e6cb;\n    text-align: center;\n    font-weight: 500;\n}\n\n@media (max-width: 768px) {\n    .contact-page {\n        padding: 15px;\n        margin: 10px;\n    }\n    \n    .contact-page h1 {\n        font-size: 2rem;\n    }\n    \n    .contact-content {\n        grid-template-columns: 1fr;\n        gap: 30px;\n    }\n    \n    .info-grid {\n        grid-template-columns: 1fr;\n        gap: 15px;\n    }\n    \n    .contact-form {\n        padding: 20px;\n    }\n    \n    .contact-actions button {\n        display: block;\n        width: 100%;\n        margin: 10px 0;\n    }\n}`;

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    const styleElement = document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = STYLE_CONTENT;
    document.head.appendChild(styleElement);
}

const component = {
    name: "Contact",
    data() {
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
    mounted() {
        this.$nextTick(() => {
            const formElement = document.getElementById('contactForm')
            if (formElement) {
                formElement.addEventListener('submit', this.handleFormSubmit)
            }
        })
    },
    beforeUnmount() {
        const formElement = document.getElementById('contactForm')
        if (formElement) {
            formElement.removeEventListener('submit', this.handleFormSubmit)
        }
    },
    methods: {
        handleFormSubmit(event) {
            event.preventDefault()
            
            const formData = new FormData(event.target)
            console.log('폼 전송:', Object.fromEntries(formData))
            
            alert('메시지가 전송되었습니다!')
            event.target.reset()
        },
    },
    _routeName: "contact",
    _isBuilt: true,
    _buildTime: "2025-08-20T02:13:26.530Z",
    _buildVersion: "1.0.0",
};

component.template = `<nav class="main-nav">\n    <ul>\n        <li><a @click="navigateTo('home')" :class="{ active: currentRoute === 'home' }">Home</a></li>\n        <li><a @click="navigateTo('about')" :class="{ active: currentRoute === 'about' }">About</a></li>\n        <li><a @click="navigateTo('contact')" :class="{ active: currentRoute === 'contact' }">Contact</a></li>\n    </ul>\n</nav>\n\n<header v-if="showHeader" class="page-header">\n    <div class="container">\n        <h1>{{ headerTitle || pageTitle }}</h1>\n        <p v-if="headerSubtitle" class="subtitle">{{ headerSubtitle }}</p>\n    </div>\n</header>\n\n<main class="main-content">\n    <div class="container">\n        <!-- 페이지 콘텐츠가 여기에 삽입됩니다 -->\n        <div class="contact-page">\n    <h1>Contact</h1>\n    <div class="contact-content">\n        <div class="contact-info">\n            <h2>연락처 정보</h2>\n            <div class="info-grid">\n                <div class="info-item" v-for="info in contactInfo" :key="info.title">\n                    <h3>{{ info.icon }} {{ info.title }}</h3>\n                    <p>{{ info.value }}</p>\n                </div>\n            </div>\n        </div>\n        \n        <div class="contact-form">\n            <h2>메시지 보내기</h2>\n            <form id="contactForm">\n                <div class="form-group">\n                    <label for="name">이름</label>\n                    <input type="text" id="name" name="name" required>\n                </div>\n                <div class="form-group">\n                    <label for="email">이메일</label>\n                    <input type="email" id="email" name="email" required>\n                </div>\n                <div class="form-group">\n                    <label for="subject">제목</label>\n                    <input type="text" id="subject" name="subject" required>\n                </div>\n                <div class="form-group">\n                    <label for="message">메시지</label>\n                    <textarea id="message" name="message" rows="5" required></textarea>\n                </div>\n                <button type="submit">전송</button>\n            </form>\n        </div>\n        \n        <div class="contact-actions">\n            <button @click="navigateTo('home')">Home</button>\n            <button @click="navigateTo('about')">About</button>\n        </div>\n    </div>\n</div>\n    </div>\n</main>\n\n<footer class="page-footer">\n    <div class="container">\n        <p>&copy; 2025 ViewLogic App. All rights reserved.</p>\n    </div>\n</footer>`;

export default component;