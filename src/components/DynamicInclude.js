/**
 * DynamicInclude 컴포넌트
 * ViewLogic 페이지를 동적으로 로드하여 컴포넌트처럼 사용
 * 라우터 의존성 없이 독립적으로 작동
 */
export default {
    name: 'DynamicInclude',
    template: `
        <div :class="['dynamic-include', { loading, error }]">
            <!-- 로딩 상태 -->
            <div v-if="loading" class="dynamic-include-loading">
                <div class="loading-spinner"></div>
                <span v-if="loadingText">{{ loadingText }}</span>
            </div>
            
            <!-- 에러 상태 -->
            <div v-else-if="error" class="dynamic-include-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">
                    <h4>페이지를 불러올 수 없습니다</h4>
                    <p>{{ errorMessage }}</p>
                    <button v-if="retryable" @click="loadPage" class="btn btn-sm btn-outline">
                        다시 시도
                    </button>
                </div>
            </div>
            
            <!-- 동적 컴포넌트 -->
            <component 
                v-else-if="dynamicComponent"
                :is="dynamicComponent"
                v-bind="params"
                class="dynamic-include-content"
            />
        </div>
    `,
    
    props: {
        // 로드할 페이지 이름
        page: {
            type: String,
            required: true
        },
        // 전달할 파라미터
        params: {
            type: Object,
            default: () => ({})
        },
        // 로딩 텍스트
        loadingText: {
            type: String,
            default: '로딩 중...'
        },
        // 재시도 가능 여부
        retryable: {
            type: Boolean,
            default: true
        },
        // 기본 경로 설정
        basePath: {
            type: String,
            default: '/src'
        }
    },
    
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: '',
            dynamicComponent: null
        }
    },
    
    async mounted() {
        await this.loadPage();
    },
    
    watch: {
        page: 'loadPage'
    },
    
    methods: {
        async loadPage() {
            if (!this.page) return;

            try {
                this.loading = true;
                this.error = false;
                
                // 컴포넌트 생성 (캐시 없이 매번 새로 생성)
                const component = await this.createComponent(this.page);
                this.dynamicComponent = Vue.markRaw(component);
                
                this.$emit('load', { page: this.page });
                
            } catch (error) {
                console.error('DynamicInclude error:', error);
                this.error = true;
                this.errorMessage = error.message || '알 수 없는 오류';
                this.$emit('error', { page: this.page, error });
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * 내부 컴포넌트 생성 함수
         */
        async createComponent(pageName) {
            
            // 라우터의 기존 함수들을 사용하여 파일 로드
            const [template, logic, style] = await Promise.all([
                window.router.loadTemplate(pageName),
                window.router.loadScript(pageName),
                window.router.loadStyle(pageName)
            ]);
            
            // UI 컴포넌트들 로드
            const uiComponents = await window.router.getUIComponents();
            
            // 컴포넌트 정의 생성
            const component = {
                name: `Dynamic${this.toPascalCase(pageName)}`,
                template: `
                    <div class="dynamic-page-wrapper dynamic-${pageName}">
                        ${template}
                    </div>`,
                ...logic,
                // UI 컴포넌트들 등록
                components: uiComponents,
                // props 병합 (기존 props 유지하면서 params 추가)
                props: {
                    ...(logic.props || {}),
                    ...this.createDynamicProps()
                },
                // data 함수 래핑
                data() {
                    const originalData = logic.data ? logic.data.call(this) : {};
                    return {
                        ...originalData,
                        _isDynamic: true,
                        _pageName: pageName
                    };
                },
                // methods 확장
                methods: {
                    ...(logic.methods || {}),
                    // 기본 네비게이션 함수들
                    navigateTo(route) {
                        if (window.router) {
                            window.router.navigateTo(route);
                        } else {
                            window.location.hash = `#${route}`;
                        }
                    },
                    // i18n 함수
                    $t(key, defaultValue) {
                        if (window.i18n?.isEnabled?.()) {
                            return window.i18n.t(key) || defaultValue || key;
                        }
                        return defaultValue || key;
                    },
                    // 동적 스타일 적용
                    applyDynamicStyle(css, pageName) {
                        const styleId = `dynamic-style-${pageName}`;
                        
                        // 기존 스타일 제거
                        const existing = document.querySelector(`#${styleId}`);
                        if (existing) existing.remove();
                        
                        // 새 스타일 추가
                        const styleElement = document.createElement('style');
                        styleElement.id = styleId;
                        styleElement.textContent = css;
                        document.head.appendChild(styleElement);
                        
                        // 컴포넌트 제거 시 스타일도 제거하도록 저장
                        this._dynamicStyleId = styleId;
                    }
                },
                // 라이프사이클
                mounted() {
                    // 스타일 동적 적용
                    if (style) {
                        this.applyDynamicStyle(style, pageName);
                    }
                    
                    if (logic.mounted) {
                        logic.mounted.call(this);
                    }
                    this.$emit('mounted');
                },
                beforeUnmount() {
                    // 동적 스타일 정리
                    if (this._dynamicStyleId) {
                        const styleElement = document.querySelector(`#${this._dynamicStyleId}`);
                        if (styleElement) {
                            styleElement.remove();
                        }
                    }
                    
                    if (logic.beforeUnmount) {
                        logic.beforeUnmount.call(this);
                    }
                    this.$emit('unmount');
                }
            };
            
            return component;
        },
        
        
        /**
         * 동적 props 생성
         */
        createDynamicProps() {
            const props = {};
            Object.keys(this.params).forEach(key => {
                props[key] = {
                    type: null,
                    default: undefined
                };
            });
            return props;
        },
        
        /**
         * PascalCase 변환
         */
        toPascalCase(str) {
            return str.replace(/(^|-)([a-z])/g, (match, p1, p2) => p2.toUpperCase());
        },
        
    }
};