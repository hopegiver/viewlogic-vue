/**
 * HtmlInclude 컴포넌트
 * 외부 HTML 파일이나 URL을 동적으로 로드하여 삽입하는 컴포넌트
 */
export default {
    name: 'HtmlInclude',
    template: `
        <div :class="wrapperClasses" :style="wrapperStyle">
            <div v-if="loading" class="html-include-loading">
                <div class="loading-spinner"></div>
                <span v-if="showLoadingText">{{ loadingText }}</span>
            </div>
            
            <div v-else-if="error" class="html-include-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">
                    <h4>{{ $t('html_include.error_title', '콘텐츠를 불러올 수 없습니다') }}</h4>
                    <p>{{ errorMessage }}</p>
                    <button v-if="retryable" @click="retry" class="btn btn-sm btn-outline">
                        {{ $t('html_include.retry', '다시 시도') }}
                    </button>
                </div>
            </div>
            
            <div 
                v-else 
                ref="contentContainer" 
                class="html-include-content"
                v-html="sanitizedContent"
            ></div>
        </div>
    `,
    emits: ['load', 'error', 'mounted', 'unmounted'],
    props: {
        // 로드할 HTML 파일 경로 또는 URL
        src: {
            type: String,
            required: true
        },
        // 래퍼 클래스
        wrapperClass: {
            type: String,
            default: ''
        },
        // 래퍼 스타일
        wrapperStyle: {
            type: Object,
            default: () => ({})
        },
        // 로딩 텍스트 표시 여부
        showLoadingText: {
            type: Boolean,
            default: true
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
        // 캐시 사용 여부
        useCache: {
            type: Boolean,
            default: true
        },
        // 자동 새로고침 간격 (밀리초, 0이면 비활성화)
        autoRefresh: {
            type: Number,
            default: 0
        },
        // HTML 새니타이즈 사용 여부 (보안)
        sanitize: {
            type: Boolean,
            default: true
        },
        // 허용할 태그 목록 (sanitize가 true일 때)
        allowedTags: {
            type: Array,
            default: () => [
                'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'a', 'img', 'strong', 'em', 'u', 'i', 'b',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'form', 'input', 'textarea', 'button', 'select', 'option',
                'br', 'hr', 'pre', 'code', 'blockquote'
            ]
        },
        // 허용할 속성 목록 (sanitize가 true일 때)
        allowedAttributes: {
            type: Array,
            default: () => ['class', 'id', 'href', 'src', 'alt', 'title', 'data-*']
        },
        // CORS 모드 ('cors', 'no-cors', 'same-origin')
        corsMode: {
            type: String,
            default: 'same-origin',
            validator: (value) => ['cors', 'no-cors', 'same-origin'].includes(value)
        },
        // 타임아웃 (밀리초)
        timeout: {
            type: Number,
            default: 10000
        }
    },
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: '',
            rawContent: '',
            refreshTimer: null,
            retryCount: 0,
            maxRetries: 3,
            abortController: null
        }
    },
    computed: {
        wrapperClasses() {
            return [
                'html-include',
                {
                    'html-include--loading': this.loading,
                    'html-include--error': this.error,
                    'html-include--loaded': !this.loading && !this.error
                },
                this.wrapperClass
            ];
        },
        
        sanitizedContent() {
            if (!this.sanitize) {
                return this.rawContent;
            }
            return this.sanitizeHtml(this.rawContent);
        },
        
        cacheKey() {
            return `html_include_${btoa(this.src).replace(/[/+=]/g, '_')}`;
        }
    },
    async mounted() {
        await this.loadContent();
        this.setupAutoRefresh();
        this.$emit('mounted');
    },
    beforeUnmount() {
        this.cleanup();
        this.$emit('unmounted');
    },
    watch: {
        src: {
            handler: 'loadContent',
            immediate: false
        }
    },
    methods: {
        async loadContent() {
            if (!this.src) {
                this.error = true;
                this.errorMessage = 'src가 지정되지 않았습니다';
                return;
            }

            // 기존 요청 중단
            if (this.abortController) {
                this.abortController.abort();
            }
            this.abortController = new AbortController();

            try {
                this.loading = true;
                this.error = false;
                this.errorMessage = '';

                // 캐시 확인
                if (this.useCache) {
                    const cached = this.getCachedContent();
                    if (cached) {
                        this.rawContent = cached;
                        this.loading = false;
                        this.retryCount = 0;
                        this.$emit('load', {
                            src: this.src,
                            content: cached,
                            fromCache: true
                        });
                        return;
                    }
                }

                // 컨텐츠 로드
                const content = await this.fetchContent();
                this.rawContent = content;

                // 캐시에 저장
                if (this.useCache) {
                    this.setCachedContent(content);
                }

                this.retryCount = 0;
                this.$emit('load', {
                    src: this.src,
                    content: content,
                    fromCache: false
                });

                // 스크립트 실행 (보안상 주의깊게)
                await this.$nextTick();
                this.executeScripts();

            } catch (error) {
                if (error.name === 'AbortError') {
                    return; // 요청이 중단된 경우
                }
                
                console.error('HtmlInclude error:', error);
                this.error = true;
                this.errorMessage = error.message || '알 수 없는 오류가 발생했습니다';
                this.$emit('error', {
                    src: this.src,
                    error: error
                });
            } finally {
                this.loading = false;
            }
        },

        async fetchContent() {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('타임아웃')), this.timeout);
            });

            const fetchPromise = fetch(this.src, {
                mode: this.corsMode,
                signal: this.abortController.signal,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,text/plain,*/*'
                }
            });

            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const content = await response.text();
            return content;
        },

        getCachedContent() {
            try {
                const cached = localStorage.getItem(this.cacheKey);
                if (cached) {
                    const data = JSON.parse(cached);
                    const router = window.router;
                    const ttl = router?.config?.cacheTTL || 300000; // 5분 기본값
                    
                    if (Date.now() - data.timestamp < ttl) {
                        return data.content;
                    } else {
                        localStorage.removeItem(this.cacheKey);
                    }
                }
            } catch (error) {
                console.warn('캐시 읽기 실패:', error);
            }
            return null;
        },

        setCachedContent(content) {
            try {
                const data = {
                    content: content,
                    timestamp: Date.now()
                };
                localStorage.setItem(this.cacheKey, JSON.stringify(data));
            } catch (error) {
                console.warn('캐시 저장 실패:', error);
            }
        },

        sanitizeHtml(html) {
            // 간단한 HTML 새니타이저 (실제 프로덕션에서는 DOMPurify 같은 라이브러리 권장)
            if (!html) return '';

            // script, style, iframe 태그 제거
            html = html.replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '');
            
            // on* 이벤트 속성 제거
            html = html.replace(/\son\w+="[^"]*"/gi, '');
            html = html.replace(/\son\w+='[^']*'/gi, '');
            
            // javascript: 프로토콜 제거
            html = html.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
            
            return html;
        },

        executeScripts() {
            if (!this.sanitize && this.$refs.contentContainer) {
                // sanitize가 false일 때만 스크립트 실행 (보안 주의!)
                const scripts = this.$refs.contentContainer.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.src) {
                        // 외부 스크립트 로드
                        const newScript = document.createElement('script');
                        newScript.src = script.src;
                        document.head.appendChild(newScript);
                    } else if (script.textContent) {
                        // 인라인 스크립트 실행
                        try {
                            const func = new Function(script.textContent);
                            func();
                        } catch (error) {
                            console.warn('스크립트 실행 실패:', error);
                        }
                    }
                });
            }
        },

        setupAutoRefresh() {
            if (this.autoRefresh > 0) {
                this.refreshTimer = setInterval(() => {
                    this.loadContent();
                }, this.autoRefresh);
            }
        },

        clearAutoRefresh() {
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
        },

        async retry() {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                await this.loadContent();
            }
        },

        refresh() {
            // 캐시 무효화하고 다시 로드
            if (this.useCache) {
                localStorage.removeItem(this.cacheKey);
            }
            this.loadContent();
        },

        cleanup() {
            this.clearAutoRefresh();
            if (this.abortController) {
                this.abortController.abort();
            }
        }
    }
};