/**
 * ViewLogic 빌드된 라우트: home
 * 빌드 시간: 2025-08-20T01:33:38.539Z
 * 빌드 버전: 1.0.0
 * 포함된 컴포넌트: Button, Card, Input, Modal, Tabs, Toast
 */

// 인라인 컴포넌트들
// Component: Button
const ButtonComponent = {
    name: "Button",
    template: "\n        <button \n            :class=\"buttonClasses\" \n            :disabled=\"disabled || loading\"\n            @click=\"handleClick\"\n            :type=\"type\"\n        >\n            <span v-if=\"loading\" class=\"btn-spinner\"></span>\n            <span v-if=\"icon && !loading\" :class=\"'btn-icon ' + icon\"></span>\n            <span class=\"btn-text\" v-if=\"!loading || showTextWhileLoading\">\n                <slot>{{ text }}</slot>\n            </span>\n            <span v-if=\"loading && loadingText\" class=\"btn-loading-text\">{{ loadingText }}</span>\n        </button>\n    ",
    props: {"variant":{"default":"primary"},"size":{"default":"medium"},"disabled":{"default":false},"loading":{"default":false},"loadingText":{"default":""},"showTextWhileLoading":{"default":false},"text":{"default":""},"icon":{"default":""},"type":{"default":"button"},"block":{"default":false},"rounded":{"default":false}},
    computed: {
        buttonClasses() {
            return [
                'btn',
                `btn-${this.variant}`,
                `btn-${this.size}`,
                {
                    'btn-loading': this.loading,
                    'btn-disabled': this.disabled,
                    'btn-block': this.block,
                    'btn-rounded': this.rounded,
                    'btn-with-icon': this.icon
                }
            ];
        },
    },
    methods: {
        handleClick(event) {
            if (!this.disabled && !this.loading) {
                this.$emit('click', event);
            }
        },
    },
};
// Component: Card
const CardComponent = {
    name: "Card",
    template: "\n        <div :class=\"cardClasses\" @click=\"handleClick\">\n            <div v-if=\"hasHeader\" class=\"card-header\">\n                <div v-if=\"image\" class=\"card-image\">\n                    <img :src=\"image\" :alt=\"imageAlt\" />\n                </div>\n                <div v-if=\"title || $slots.header\" class=\"card-header-content\">\n                    <h3 v-if=\"title\" class=\"card-title\">{{ title }}</h3>\n                    <p v-if=\"subtitle\" class=\"card-subtitle\">{{ subtitle }}</p>\n                    <slot name=\"header\"></slot>\n                </div>\n                <div v-if=\"$slots.actions || showDefaultActions\" class=\"card-actions\">\n                    <slot name=\"actions\">\n                        <button v-if=\"showDefaultActions\" class=\"btn btn-sm btn-outline\">더보기</button>\n                    </slot>\n                </div>\n            </div>\n            \n            <div class=\"card-body\" v-if=\"$slots.default || content\">\n                <p v-if=\"content\" class=\"card-content\">{{ content }}</p>\n                <slot></slot>\n            </div>\n            \n            <div v-if=\"$slots.footer || tags.length > 0\" class=\"card-footer\">\n                <div v-if=\"tags.length > 0\" class=\"card-tags\">\n                    <span \n                        v-for=\"tag in tags\" \n                        :key=\"tag\" \n                        class=\"card-tag\"\n                        :class=\"tagVariant\"\n                    >\n                        {{ tag }}\n                    </span>\n                </div>\n                <slot name=\"footer\"></slot>\n            </div>\n            \n            <div v-if=\"loading\" class=\"card-loading\">\n                <div class=\"loading-spinner\"></div>\n            </div>\n        </div>\n    ",
    props: {"title":{"default":""},"subtitle":{"default":""},"content":{"default":""},"image":{"default":""},"imageAlt":{"default":""},"variant":{"default":"default"},"shadow":{"default":"medium"},"hoverable":{"default":false},"clickable":{"default":false},"loading":{"default":false},"tags":{},"tagVariant":{"default":"tag-primary"},"showDefaultActions":{"default":false}},
    computed: {
        cardClasses() {
            return [
                'card',
                `card-${this.variant}`,
                `card-shadow-${this.shadow}`,
                {
                    'card-hoverable': this.hoverable,
                    'card-clickable': this.clickable,
                    'card-loading': this.loading
                }
            ];
        },
        hasHeader() {
            return this.title || this.subtitle || this.image || this.$slots.header || this.$slots.actions || this.showDefaultActions;
        },
    },
    methods: {
        handleClick(event) {
            if (this.clickable && !this.loading) {
                this.$emit('click', event);
            }
        },
    },
};
// Component: Input
const InputComponent = {
    name: "Input",
    template: "\n        <div :class=\"wrapperClasses\">\n            <label v-if=\"label\" :for=\"inputId\" class=\"input-label\" :class=\"{ 'required': required }\">\n                {{ label }}\n            </label>\n            \n            <div class=\"input-container\">\n                <span v-if=\"prefixIcon\" class=\"input-prefix-icon\" :class=\"prefixIcon\"></span>\n                \n                <input\n                    :id=\"inputId\"\n                    :type=\"inputType\"\n                    :class=\"inputClasses\"\n                    :value=\"modelValue\"\n                    :placeholder=\"placeholder\"\n                    :disabled=\"disabled\"\n                    :readonly=\"readonly\"\n                    :required=\"required\"\n                    :min=\"min\"\n                    :max=\"max\"\n                    :step=\"step\"\n                    :maxlength=\"maxlength\"\n                    @input=\"handleInput\"\n                    @blur=\"handleBlur\"\n                    @focus=\"handleFocus\"\n                    @keyup.enter=\"handleEnter\"\n                    ref=\"input\"\n                />\n                \n                <span v-if=\"suffixIcon\" class=\"input-suffix-icon\" :class=\"suffixIcon\"></span>\n                \n                <button\n                    v-if=\"clearable && modelValue && !disabled && !readonly\"\n                    class=\"input-clear\"\n                    @click=\"clearInput\"\n                    type=\"button\"\n                >\n                    ×\n                </button>\n                \n                <button\n                    v-if=\"type === 'password'\"\n                    class=\"input-password-toggle\"\n                    @click=\"togglePasswordVisibility\"\n                    type=\"button\"\n                >\n                    {{ showPassword ? '🙈' : '👁' }}\n                </button>\n            </div>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"input-help\">\n                <p v-if=\"errorMessage\" class=\"input-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"input-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    props: {"modelValue":{"type":[null,null],"default":""},"type":{"default":"text"},"label":{"default":""},"placeholder":{"default":""},"helpText":{"default":""},"errorMessage":{"default":""},"size":{"default":"medium"},"disabled":{"default":false},"readonly":{"default":false},"required":{"default":false},"clearable":{"default":false},"prefixIcon":{"default":""},"suffixIcon":{"default":""},"min":{"type":[null,null]},"max":{"type":[null,null]},"step":{"type":[null,null]},"maxlength":{"type":[null,null]}},
    data() {
        return {
            inputId: `input-${Math.random().toString(36).substr(2, 9)}`,
            showPassword: false,
            focused: false
        };
    },
    computed: {
        inputType() {
            if (this.type === 'password') {
                return this.showPassword ? 'text' : 'password';
            }
            return this.type;
        },
        wrapperClasses() {
            return [
                'input-wrapper',
                `input-size-${this.size}`,
                {
                    'input-focused': this.focused,
                    'input-disabled': this.disabled,
                    'input-readonly': this.readonly,
                    'input-error': this.errorMessage,
                    'input-with-prefix': this.prefixIcon,
                    'input-with-suffix': this.suffixIcon || this.clearable || this.type === 'password'
                }
            ];
        },
        inputClasses() {
            return [
                'input-field',
                {
                    'input-with-prefix-icon': this.prefixIcon,
                    'input-with-suffix-icon': this.suffixIcon || this.clearable || this.type === 'password'
                }
            ];
        },
    },
    methods: {
        handleInput(event) {
            let value = event.target.value;
            
            if (this.type === 'number') {
                value = value === '' ? '' : Number(value);
            }
            
            this.$emit('update:modelValue', value);
            this.$emit('input', value);
        },
        handleBlur(event) {
            this.focused = false;
            this.$emit('blur', event);
        },
        handleFocus(event) {
            this.focused = true;
            this.$emit('focus', event);
        },
        handleEnter(event) {
            this.$emit('enter', event);
        },
        clearInput() {
            this.$emit('update:modelValue', '');
            this.$emit('clear');
            this.focus();
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        focus() {
            this.$refs.input.focus();
        },
        blur() {
            this.$refs.input.blur();
        },
    },
};
// Component: Modal
const ModalComponent = {
    name: "Modal",
    template: "\n        <teleport to=\"body\" v-if=\"modelValue\">\n            <div class=\"modal-overlay\" @click=\"handleOverlayClick\" :class=\"{ 'modal-overlay-visible': modelValue }\">\n                <div \n                    class=\"modal-container\" \n                    :class=\"[sizeClass, { 'modal-container-visible': modelValue }]\"\n                    @click.stop\n                >\n                    <div class=\"modal-header\" v-if=\"showHeader\">\n                        <h3 class=\"modal-title\" v-if=\"title\">{{ title }}</h3>\n                        <slot name=\"header\" v-else></slot>\n                        <button \n                            v-if=\"showCloseButton\" \n                            class=\"modal-close\" \n                            @click=\"closeModal\"\n                            aria-label=\"닫기\"\n                        >\n                            ×\n                        </button>\n                    </div>\n                    \n                    <div class=\"modal-body\">\n                        <slot></slot>\n                    </div>\n                    \n                    <div class=\"modal-footer\" v-if=\"showFooter\">\n                        <slot name=\"footer\">\n                            <button \n                                v-if=\"showCancelButton\" \n                                class=\"btn btn-secondary\" \n                                @click=\"handleCancel\"\n                            >\n                                {{ cancelText }}\n                            </button>\n                            <button \n                                v-if=\"showConfirmButton\" \n                                class=\"btn btn-primary\" \n                                @click=\"handleConfirm\"\n                                :disabled=\"confirmDisabled\"\n                            >\n                                {{ confirmText }}\n                            </button>\n                        </slot>\n                    </div>\n                </div>\n            </div>\n        </teleport>\n    ",
    props: {"modelValue":{"default":false},"title":{"default":""},"size":{"default":"medium"},"closable":{"default":true},"closeOnOverlay":{"default":true},"showHeader":{"default":true},"showFooter":{"default":true},"showCloseButton":{"default":true},"showCancelButton":{"default":true},"showConfirmButton":{"default":true},"cancelText":{"default":"취소"},"confirmText":{"default":"확인"},"confirmDisabled":{"default":false}},
    computed: {
        sizeClass() {
            return `modal-${this.size}`;
        },
    },
    methods: {
        closeModal() {
            if (this.closable) {
                this.$emit('update:modelValue', false);
                this.$emit('close');
            }
        },
        handleOverlayClick() {
            if (this.closeOnOverlay && this.closable) {
                this.closeModal();
            }
        },
        handleCancel() {
            this.$emit('cancel');
            this.closeModal();
        },
        handleConfirm() {
            this.$emit('confirm');
        },
    },
    mounted() {
        // ESC 키로 모달 닫기
        const handleEscape = (event) => {
            if (event.key === 'Escape' && this.modelValue && this.closable) {
                this.closeModal();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        this.$unmounted = () => {
            document.removeEventListener('keydown', handleEscape);
        };
    },
    unmounted() {
        if (this.$unmounted) {
            this.$unmounted();
        }
    },
};
// Component: Tabs
const TabsComponent = {
    name: "Tabs",
    template: "\n        <div :class=\"tabsClasses\">\n            <div class=\"tabs-header\" role=\"tablist\">\n                <button\n                    v-for=\"(tab, index) in tabs\"\n                    :key=\"tab.name\"\n                    :class=\"getTabClasses(tab, index)\"\n                    :disabled=\"tab.disabled\"\n                    @click=\"selectTab(tab, index)\"\n                    role=\"tab\"\n                    :aria-selected=\"activeTab === tab.name\"\n                    :aria-controls=\"'tab-panel-' + tab.name\"\n                >\n                    <span v-if=\"tab.icon\" :class=\"['tab-icon', tab.icon]\"></span>\n                    <span class=\"tab-label\">{{ tab.label }}</span>\n                    <span v-if=\"tab.badge\" class=\"tab-badge\">{{ tab.badge }}</span>\n                    <button\n                        v-if=\"tab.closable && closable\"\n                        class=\"tab-close\"\n                        @click.stop=\"closeTab(tab, index)\"\n                        :aria-label=\"'Close ' + tab.label\"\n                    >\n                        ×\n                    </button>\n                </button>\n                \n                <div v-if=\"addable\" class=\"tab-add\">\n                    <button class=\"tab-add-button\" @click=\"addTab\" aria-label=\"Add new tab\">\n                        +\n                    </button>\n                </div>\n            </div>\n            \n            <div class=\"tabs-content\">\n                <div\n                    v-for=\"(tab, index) in tabs\"\n                    :key=\"tab.name\"\n                    v-show=\"activeTab === tab.name\"\n                    :class=\"getTabPanelClasses(tab)\"\n                    role=\"tabpanel\"\n                    :id=\"'tab-panel-' + tab.name\"\n                    :aria-labelledby=\"'tab-' + tab.name\"\n                >\n                    <component \n                        v-if=\"tab.component\" \n                        :is=\"tab.component\" \n                        v-bind=\"tab.props || {}\"\n                        @update=\"(data) => updateTabData(tab, data)\"\n                    />\n                    <div v-else-if=\"tab.content\" v-html=\"tab.content\"></div>\n                    <slot v-else :name=\"tab.name\" :tab=\"tab\" :index=\"index\"></slot>\n                </div>\n            </div>\n        </div>\n    ",
    props: {"modelValue":{"default":""},"tabs":{"required":true},"variant":{"default":"default"},"size":{"default":"medium"},"closable":{"default":false},"addable":{"default":false},"lazy":{"default":false},"animated":{"default":true}},
    data() {
        return {
            activeTab: this.modelValue || (this.tabs.length > 0 ? this.tabs[0].name : ''),
            loadedTabs: new Set()
        };
    },
    computed: {
        tabsClasses() {
            return [
                'tabs',
                `tabs-${this.variant}`,
                `tabs-${this.size}`,
                {
                    'tabs-animated': this.animated,
                    'tabs-closable': this.closable,
                    'tabs-addable': this.addable
                }
            ];
        },
    },
    methods: {
        selectTab(tab, index) {
            if (tab.disabled) return;
            
            this.activeTab = tab.name;
            this.$emit('update:modelValue', tab.name);
            this.$emit('tab-change', { tab, index, previousTab: this.activeTab });
            
            // lazy 로딩 탭 추적
            if (this.lazy) {
                this.loadedTabs.add(tab.name);
            }
        },
        closeTab(tab, index) {
            if (!tab.closable) return;
            
            this.$emit('tab-close', { tab, index });
            
            // 현재 활성 탭이 닫히는 경우 다른 탭으로 이동
            if (this.activeTab === tab.name) {
                const remainingTabs = this.tabs.filter((_, i) => i !== index);
                if (remainingTabs.length > 0) {
                    const nextTab = remainingTabs[Math.max(0, index - 1)];
                    this.selectTab(nextTab, Math.max(0, index - 1));
                }
            }
        },
        addTab() {
            this.$emit('tab-add');
        },
        getTabClasses(tab, index) {
            return [
                'tab',
                {
                    'tab-active': this.activeTab === tab.name,
                    'tab-disabled': tab.disabled,
                    'tab-closable': tab.closable && this.closable,
                    'tab-with-icon': tab.icon,
                    'tab-with-badge': tab.badge
                }
            ];
        },
        getTabPanelClasses(tab) {
            return [
                'tab-panel',
                {
                    'tab-panel-active': this.activeTab === tab.name,
                    'tab-panel-lazy': this.lazy && !this.loadedTabs.has(tab.name)
                }
            ];
        },
        updateTabData(tab, data) {
            this.$emit('tab-update', { tab, data });
        },
    },
    watch: {
        modelValue(newValue) {
            if (newValue !== this.activeTab) {
                const tab = this.tabs.find(t => t.name === newValue);
                if (tab) {
                    this.activeTab = newValue;
                    if (this.lazy) {
                        this.loadedTabs.add(newValue);
                    }
                }
            }
        },
        tabs: {"deep":true},
    },
    mounted() {
        // 초기 활성 탭을 lazy 로딩 목록에 추가
        if (this.lazy && this.activeTab) {
            this.loadedTabs.add(this.activeTab);
        }
    },
};
// Component: Toast
const ToastComponent = {
    name: "Toast",
    template: "\n        <teleport to=\"body\">\n            <div class=\"toast-container\" :class=\"positionClass\">\n                <transition-group name=\"toast\" tag=\"div\">\n                    <div\n                        v-for=\"toast in toasts\"\n                        :key=\"toast.id\"\n                        :class=\"getToastClasses(toast)\"\n                        @click=\"closeToast(toast.id)\"\n                    >\n                        <div class=\"toast-icon\" v-if=\"toast.icon\">\n                            <span :class=\"toast.icon\"></span>\n                        </div>\n                        <div class=\"toast-content\">\n                            <h4 v-if=\"toast.title\" class=\"toast-title\">{{ toast.title }}</h4>\n                            <p class=\"toast-message\">{{ toast.message }}</p>\n                        </div>\n                        <button \n                            v-if=\"toast.closable\" \n                            class=\"toast-close\" \n                            @click.stop=\"closeToast(toast.id)\"\n                        >\n                            ×\n                        </button>\n                    </div>\n                </transition-group>\n            </div>\n        </teleport>\n    ",
    props: {"position":{"default":"top-right"},"maxToasts":{"default":5}},
    data() {
        return {
            toasts: [],
            toastId: 0
        };
    },
    computed: {
        positionClass() {
            return `toast-position-${this.position}`;
        },
    },
    methods: {
        show(options) {
            const toast = {
                id: ++this.toastId,
                type: options.type || 'info',
                title: options.title || '',
                message: options.message || '',
                duration: options.duration !== undefined ? options.duration : 4000,
                closable: options.closable !== false,
                icon: this.getIcon(options.type || 'info'),
                ...options
            };
            
            // 최대 토스트 개수 제한
            if (this.toasts.length >= this.maxToasts) {
                this.toasts.shift();
            }
            
            this.toasts.push(toast);
            
            // 자동 닫기
            if (toast.duration > 0) {
                setTimeout(() => {
                    this.closeToast(toast.id);
                }, toast.duration);
            }
            
            return toast.id;
        },
        closeToast(id) {
            const index = this.toasts.findIndex(toast => toast.id === id);
            if (index > -1) {
                const toast = this.toasts[index];
                this.$emit('close', toast);
                this.toasts.splice(index, 1);
            }
        },
        closeAll() {
            this.toasts = [];
        },
        getToastClasses(toast) {
            return [
                'toast',
                `toast-${toast.type}`,
                {
                    'toast-with-title': toast.title,
                    'toast-closable': toast.closable
                }
            ];
        },
        getIcon(type) {
            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };
            return icons[type] || icons.info;
        },
        success(message, options = {}) {
            return this.show({ ...options, type: 'success', message });
        },
        error(message, options = {}) {
            return this.show({ ...options, type: 'error', message });
        },
        warning(message, options = {}) {
            return this.show({ ...options, type: 'warning', message });
        },
        info(message, options = {}) {
            return this.show({ ...options, type: 'info', message });
        },
    },
};

// 컴포넌트 자동 등록 함수
const registerInlineComponents = (vueApp) => {
    if (!vueApp || typeof vueApp.component !== "function") return;
    vueApp.component('Button', ButtonComponent);
    vueApp.component('Card', CardComponent);
    vueApp.component('Input', InputComponent);
    vueApp.component('Modal', ModalComponent);
    vueApp.component('Tabs', TabsComponent);
    vueApp.component('Toast', ToastComponent);
};

// 스타일 자동 적용
const STYLE_ID = 'route-style-home';
const STYLE_CONTENT = `.home-page {\n    padding: 20px;\n    max-width: 1200px;\n    margin: 0 auto;\n    background: white;\n    border-radius: 8px;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n.home-page h1 {\n    color: #333;\n    margin-bottom: 20px;\n    font-size: 2.5rem;\n    text-align: center;\n}\n\n.home-content {\n    padding: 20px;\n}\n\n.home-content > p {\n    font-size: 1.2rem;\n    text-align: center;\n    margin-bottom: 20px;\n    color: #666;\n}\n\n.home-message {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 20px;\n    border-radius: 12px;\n    text-align: center;\n    margin-bottom: 30px;\n    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);\n}\n\n.home-message p {\n    margin: 0;\n    font-size: 1.1rem;\n}\n\n.features {\n    background: #f8f9fa;\n    padding: 20px;\n    border-radius: 8px;\n    margin-bottom: 30px;\n}\n\n.features h3 {\n    color: #333;\n    margin-bottom: 15px;\n}\n\n.features ul {\n    list-style-type: none;\n    padding-left: 0;\n}\n\n.features li {\n    padding: 8px 0;\n    border-bottom: 1px solid #eee;\n}\n\n.features li:before {\n    content: "✓ ";\n    color: #28a745;\n    font-weight: bold;\n}\n\n.home-actions {\n    text-align: center;\n    margin-top: 30px;\n}\n\n.home-actions button {\n    background: #007bff;\n    color: white;\n    border: none;\n    padding: 12px 24px;\n    border-radius: 4px;\n    cursor: pointer;\n    margin: 0 10px;\n    font-size: 1rem;\n    transition: background 0.3s;\n}\n\n.home-actions button:hover {\n    background: #0056b3;\n}\n\n@media (max-width: 768px) {\n    .home-page {\n        padding: 15px;\n        margin: 10px;\n    }\n    \n    .home-page h1 {\n        font-size: 2rem;\n    }\n    \n    .home-actions button {\n        display: block;\n        width: 100%;\n        margin: 10px 0;\n    }\n}`;

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const styleElement = document.createElement('style');
    styleElement.id = STYLE_ID;
    styleElement.textContent = STYLE_CONTENT;
    document.head.appendChild(styleElement);
}

const component = {
    name: "Home",
    layout: "default",
    pageTitle: "Home - ViewLogic",
    showHeader: true,
    headerTitle: "ViewLogic App",
    headerSubtitle: "Vue 3 Compatible Router System with Components",
    data() {
        return {
            message: 'Vue 3 컴포넌트로 동작중입니다!',
            actionLoading: false,
            showModal: false,
            modalInput: '',
            demoInput: '',
            activeTab: 'demo1',
            features: [
                '해시 기반 라우팅',
                '동적 Vue SFC 조합',
                '뷰/로직/스타일 완전 분리',
                'Vue 3 Composition API 지원',
                'Vue 스타일 데이터 바인딩',
                '레이아웃 시스템 지원',
                '재사용 가능한 컴포넌트 시스템',
                '로딩 상태 관리',
                '에러 처리 시스템'
            ],
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
    },
    mounted() {
        // 컴포넌트 시스템 로드 완료 알림
        setTimeout(() => {
            if (this.$refs.toast) {
                this.$refs.toast.success('컴포넌트 시스템이 로드되었습니다!', {
                    title: '시스템 준비 완료',
                    duration: 3000
                });
            }
        }, 1000);
    },
    _routeName: "home",
    _isBuilt: true,
    _buildTime: "2025-08-20T01:33:38.539Z",
    _buildVersion: "1.0.0",
    _components: ["Button","Card","Input","Modal","Tabs","Toast"],
};

component.template = `<nav class="main-nav">\n    <ul>\n        <li><a @click="navigateTo('home')" :class="{ active: currentRoute === 'home' }">Home</a></li>\n        <li><a @click="navigateTo('about')" :class="{ active: currentRoute === 'about' }">About</a></li>\n        <li><a @click="navigateTo('contact')" :class="{ active: currentRoute === 'contact' }">Contact</a></li>\n    </ul>\n</nav>\n\n<header v-if="showHeader" class="page-header">\n    <div class="container">\n        <h1>{{ headerTitle || pageTitle }}</h1>\n        <p v-if="headerSubtitle" class="subtitle">{{ headerSubtitle }}</p>\n    </div>\n</header>\n\n<main class="main-content">\n    <div class="container">\n        <!-- 페이지 콘텐츠가 여기에 삽입됩니다 -->\n        <div class="home-page">\n    <div class="hero-section">\n        <h2>Welcome to ViewLogic</h2>\n        <p>Vue SFC 호환 라우터에 오신 것을 환영합니다!</p>\n    </div>\n    \n    <div class="home-content">\n        <Card \n            title="ViewLogic Router" \n            subtitle="Vue 3 호환 라우터 시스템"\n            :hoverable="true"\n            shadow="medium"\n        >\n            <p><strong>{{ message || 'Vue 스타일 컴포넌트로 동작중입니다!' }}</strong></p>\n            \n            <template #footer>\n                <div class="card-tags">\n                    <span class="card-tag tag-primary">Vue 3</span>\n                    <span class="card-tag tag-success">Router</span>\n                </div>\n            </template>\n        </Card>\n        \n        <Card \n            title="주요 기능" \n            :hoverable="true"\n            shadow="small"\n            style="margin-top: 1rem;"\n        >\n            <ul>\n                <li v-for="feature in features" :key="feature">{{ feature }}</li>\n            </ul>\n        </Card>\n        \n        <div class="home-actions" style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">\n            <Button \n                variant="primary" \n                size="medium"\n                @click="navigateTo('about')"\n                icon="📖"\n            >\n                About 페이지\n            </Button>\n            \n            <Button \n                variant="secondary" \n                size="medium"\n                @click="navigateTo('contact')"\n                icon="📞"\n            >\n                Contact 페이지\n            </Button>\n            \n            <Button \n                variant="outline" \n                size="medium"\n                :loading="actionLoading"\n                @click="handleAction"\n                icon="🚀"\n            >\n                테스트 액션\n            </Button>\n\n            <Button \n                variant="success" \n                size="medium"\n                @click="showToast"\n                icon="💬"\n            >\n                알림 테스트\n            </Button>\n\n            <Button \n                variant="warning" \n                size="medium"\n                @click="showModal = true"\n                icon="🔧"\n            >\n                모달 테스트\n            </Button>\n        </div>\n\n        <!-- 탭 컴포넌트 데모 -->\n        <div style="margin-top: 3rem;">\n            <Tabs \n                v-model="activeTab" \n                :tabs="tabsData" \n                variant="underline"\n                @tab-change="onTabChange"\n            >\n                <template #demo1>\n                    <div style="padding: 1rem;">\n                        <h4>컴포넌트 데모</h4>\n                        <p>이것은 탭 컴포넌트의 첫 번째 패널입니다.</p>\n                        \n                        <Input \n                            v-model="demoInput"\n                            label="데모 입력"\n                            placeholder="여기에 입력해보세요"\n                            help-text="컴포넌트 시스템이 정상적으로 작동하고 있습니다"\n                            clearable\n                        />\n                    </div>\n                </template>\n                \n                <template #demo2>\n                    <div style="padding: 1rem;">\n                        <h4>기능 목록</h4>\n                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">\n                            <Card \n                                v-for="feature in componentFeatures" \n                                :key="feature.name"\n                                :title="feature.name"\n                                :content="feature.description"\n                                :tags="[feature.status]"\n                                hoverable\n                                clickable\n                                shadow="small"\n                            />\n                        </div>\n                    </div>\n                </template>\n            </Tabs>\n        </div>\n\n        <!-- 모달 컴포넌트 -->\n        <Modal \n            v-model="showModal"\n            title="컴포넌트 시스템 테스트"\n            size="medium"\n            @confirm="handleModalConfirm"\n            @cancel="handleModalCancel"\n        >\n            <p>이것은 모달 컴포넌트 테스트입니다.</p>\n            <p>ViewLogic의 컴포넌트 시스템이 정상적으로 작동하고 있습니다!</p>\n            \n            <Input \n                v-model="modalInput"\n                label="모달 내 입력"\n                placeholder="모달에서도 컴포넌트가 작동합니다"\n                style="margin-top: 1rem;"\n            />\n        </Modal>\n\n        <!-- Toast 컴포넌트 -->\n        <Toast ref="toast" position="top-right" />\n    </div>\n</div>\n    </div>\n</main>\n\n<footer class="page-footer">\n    <div class="container">\n        <p>&copy; 2025 ViewLogic App. All rights reserved.</p>\n    </div>\n</footer>`;

// 빌드된 컴포넌트 등록 메서드 추가
component.registerInlineComponents = registerInlineComponents;

export default component;