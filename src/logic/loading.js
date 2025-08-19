export default {
    name: 'LoadingComponent',
    data() {
        return {
            loadingText: '로딩 중...',
            dots: '',
            animationInterval: null
        }
    },
    mounted() {
        this.startAnimation();
    },
    unmounted() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    },
    methods: {
        startAnimation() {
            this.animationInterval = setInterval(() => {
                if (this.dots.length >= 3) {
                    this.dots = '';
                } else {
                    this.dots += '.';
                }
            }, 500);
        }
    }
}