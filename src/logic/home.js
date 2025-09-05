export default {
    name: 'Home',
    
    data() {
        return {
            message: 'ViewLogic 홈페이지',
            showModal: false,
            activeTab: 'demo1',
            tabsData: [
                { name: 'demo1', label: '컴포넌트 데모' },
                { name: 'demo2', label: '기능 목록' }
            ],
            features: [
                '🚀 빌드 없이 즉시 개발',
                '📁 파일 기반 자동 라우팅', 
                '🎨 20+ 내장 컴포넌트',
                '🔐 인증 시스템 내장',
                '🌐 다국어 지원'
            ]
        };
    },
    
    methods: {
        showToast(message, type = 'success') {
            if (this.$refs.toast) {
                this.$refs.toast[type](message);
            }
        },
        
        goToPage(page) {
            this.$router.navigateTo(page);
        }
    }
};