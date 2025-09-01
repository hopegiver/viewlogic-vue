export default {
    name: 'Home',
    layout: 'default',
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
                { name: 'Button', description: '다양한 스타일과 상태를 가진 버튼 컴포넌트', status: '완료' },
                { name: 'Modal', description: '모달 다이얼로그 컴포넌트', status: '완료' },
                { name: 'Card', description: '콘텐츠를 카드 형태로 표시하는 컴포넌트', status: '완료' },
                { name: 'Toast', description: '알림 메시지 컴포넌트', status: '완료' },
                { name: 'Input', description: '다양한 타입의 입력 필드 컴포넌트', status: '완료' },
                { name: 'Tabs', description: '탭 네비게이션 컴포넌트', status: '완료' }
            ]
        };
    },
    methods: {
        // 액션 메서드들
        async handleAction() {
            this.actionLoading = true;
            this.message = 'Vue 3 반응형 시스템이 정상 작동합니다! 🎉';
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.actionLoading = false;
            this.message = 'Vue 3 + 컴포넌트 시스템으로 완벽하게 동작합니다!';
            
            setTimeout(() => {
                this.message = 'Vue 3 컴포넌트로 동작중입니다!';
            }, 3000);
        },
        
        showToast() {
            this.showToastMessage('컴포넌트 시스템이 정상적으로 작동하고 있습니다!', 'success', '성공');
        },
        
        // 모달 핸들러들
        handleModalConfirm() {
            console.log('모달 확인:', this.modalInput);
            this.showModal = false;
            this.showToastMessage(`모달 입력값: ${this.modalInput || '(비어있음)'}`, 'info', '모달 확인됨');
        },
        
        handleModalCancel() {
            console.log('모달 취소됨');
            this.modalInput = '';
        },
        
    
        // i18n 핸들러들
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
            this.$nextTick(() => {
                this.loadI18nData();
            });
        },
        
        // 유틸리티 메서드들
        showToastMessage(message, type = 'info', title = null, duration = 4000) {
            if (this.$refs.toast) {
                const options = { duration };
                if (title) options.title = title;
                this.$refs.toast[type](message, options);
            } else {
                console.log(`Toast ${type}: ${message}`);
            }
        },
        
        clearRouterCache() {
            if (window.router) {
                window.router.clearCache();
                this.showToastMessage('라우터 캐시가 초기화되었습니다!', 'success');
                console.log('Router cache cleared');
            }
        }
    }
};