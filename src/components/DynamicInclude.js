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
            const router = window.router;
            let template, logic, style, uiComponents = {};

            if (router && router.routeLoader) {
                const isProd = router.config && router.config.environment === 'production';
                if (isProd) {
                    // 운영 모드: 라우트 스크립트 번들만 존재함
                    logic = await router.routeLoader.loadScript(pageName);
                    template = logic.template || router.routeLoader.generateDefaultTemplate?.(pageName) || `<div class="route-${pageName}"></div>`;
                    style = '';
                } else {
                    // 개발 모드: 개별 파일 사용
                    try {
                        [template, logic, style] = await Promise.all([
                            router.routeLoader.loadTemplate(pageName).catch(() => '<div></div>'),
                            router.routeLoader.loadScript(pageName),
                            router.routeLoader.loadStyle(pageName).catch(() => '')
                        ]);
                    } catch (e) {
                        // 일부 실패 시 관대한 폴백
                        if (!template) template = '<div></div>';
                        if (!style) style = '';
                        if (!logic) throw e;
                    }
                }
                if (router.componentLoader) {
                    try {
                        uiComponents = await router.componentLoader.loadAllComponents();
                    } catch (_) {
                        uiComponents = {};
                    }
                }
            } else {
                // 라우터가 없을 때: 직접 파일 로드 (개발 기본 경로 기준)
                const base = this.basePath || '/src';
                const [tplRes, cssRes, mod] = await Promise.all([
                    fetch(`${base}/views/${pageName}.html`).catch(() => null),
                    fetch(`${base}/styles/${pageName}.css`).catch(() => null),
                    import(`${base}/logic/${pageName}.js`)
                ]);
                template = tplRes && tplRes.ok ? await tplRes.text() : '<div></div>';
                style = cssRes && cssRes.ok ? await cssRes.text() : '';
                logic = mod.default || {};
                uiComponents = {};
            }
            
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
                        _pageName: pageName,
                        $lang: (router && router.i18nManager && router.i18nManager.getCurrentLanguage) ? router.i18nManager.getCurrentLanguage() : (window.i18n && window.i18n.getCurrentLanguage ? window.i18n.getCurrentLanguage() : undefined)
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
                    $t(key, paramsOrDefault, maybeDefault) {
                        const params = typeof paramsOrDefault === 'object' ? paramsOrDefault : undefined;
                        const def = typeof paramsOrDefault === 'string' ? paramsOrDefault : maybeDefault;
                        if (router && router.i18nManager && router.i18nManager.t) {
                            return router.i18nManager.t(key, params) || def || key;
                        }
                        if (window.i18n && window.i18n.t) {
                            return window.i18n.t(key, params) || def || key;
                        }
                        return def || key;
                    },
                    $i18n() {
                        return (router && router.i18nManager) ? router.i18nManager : (window.i18n || null);
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
                    // i18n 언어 변경 반영
                    const mgr = router && router.i18nManager;
                    if (mgr && mgr.on) {
                        this.__i18nHandler = (evt) => {
                            try {
                                // evt는 { from, to, messages }
                                this.$lang = evt && evt.to ? evt.to : mgr.getCurrentLanguage && mgr.getCurrentLanguage();
                            } catch (_) {}
                        };
                        mgr.on('languageChanged', this.__i18nHandler);
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
                    // i18n 리스너 해제
                    const mgr = router && router.i18nManager;
                    if (mgr && mgr.off && this.__i18nHandler) {
                        mgr.off('languageChanged', this.__i18nHandler);
                        this.__i18nHandler = null;
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