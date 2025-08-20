export default {
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
};