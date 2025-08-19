export default {
    name: 'Home',
    layout: 'default',  // 사용할 레이아웃 지정
    pageTitle: 'Home - ViewLogic',
    showHeader: true,
    headerTitle: 'ViewLogic App',
    headerSubtitle: 'Vue 3 Compatible Router System',
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
        }
    }
}