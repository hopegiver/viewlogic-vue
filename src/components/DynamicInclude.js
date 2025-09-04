export default {
    name: 'DynamicInclude',
    template: `
        <div class="dynamic-include">
            <div v-if="loading">로딩 중...</div>
            <div v-else-if="error">{{ errorMessage }}</div>
            <component v-else :is="dynamicComponent" />
        </div>
    `,
    
    props: {
        page: { 
            type: String, 
            required: true 
        }
    },
    
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: '',
            dynamicComponent: null
        };
    },
    
    async mounted() {
        await this.loadPage();
    },
    
    watch: {
        page: {
            handler() {
                this.$nextTick(() => {
                    this.loadPage();
                });
            },
            immediate: false
        }
    },
    
    methods: {
        async loadPage() {
            if (!this.page) return;
            
            // 중복 로딩 방지
            if (this.loading) return;
            
            this.loading = true;
            this.error = false;
            
            try {
                // 라우터가 준비될 때까지 대기
                if (!window.router?.routeLoader) {
                    await new Promise(resolve => {
                        const check = () => {
                            if (window.router?.routeLoader) {
                                resolve();
                            } else {
                                setTimeout(check, 50);
                            }
                        };
                        check();
                    });
                }
                
                // 컴포넌트 로드
                const component = await window.router.routeLoader.createVueComponent(this.page);
                
                // 개발 모드에서 스타일 적용
                if (component._style) {
                    this.applyStyle(component._style, `dynamic-${this.page}`);
                }
                
                this.dynamicComponent = Vue.markRaw(component);
                console.log(`DynamicInclude: ${this.page} component loaded successfully`);
                
            } catch (err) {
                console.error(`DynamicInclude error for ${this.page}:`, err);
                this.error = true;
                this.errorMessage = err.message || '페이지를 로드할 수 없습니다';
            } finally {
                this.loading = false;
            }
        },
        
        applyStyle(css, routeName) {
            // 기존 스타일 제거
            const existing = document.querySelector(`style[data-route="${routeName}"]`);
            if (existing) existing.remove();

            if (css) {
                const style = document.createElement('style');
                style.textContent = css;
                style.setAttribute('data-route', routeName);
                document.head.appendChild(style);
                console.log(`DynamicInclude: Style applied for ${routeName}`);
            }
        }
    }
};