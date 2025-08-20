/**
 * ViewLogic 통합 컴포넌트 시스템
 * 빌드 시간: 2025-08-20T01:49:20.050Z
 * 빌드 버전: 1.0.0
 * 포함된 컴포넌트: Button, Card, Input, Modal, Tabs, Toast
 */

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

// 글로벌 컴포넌트 등록 함수
export function registerComponents(vueApp) {
    if (!vueApp || typeof vueApp.component !== "function") {
        console.warn("Invalid Vue app instance provided to registerComponents");
        return;
    }

    vueApp.component('Button', ButtonComponent);
    vueApp.component('Card', CardComponent);
    vueApp.component('Input', InputComponent);
    vueApp.component('Modal', ModalComponent);
    vueApp.component('Tabs', TabsComponent);
    vueApp.component('Toast', ToastComponent);

    console.log("📦 ViewLogic 컴포넌트 시스템 등록 완료:", [
        "Button", "Card", "Input", "Modal", "Tabs", "Toast"
    ]);
}

// 컴포넌트 맵
export const components = {
    Button: ButtonComponent,
    Card: CardComponent,
    Input: InputComponent,
    Modal: ModalComponent,
    Tabs: TabsComponent,
    Toast: ToastComponent,
};

export default {
    registerComponents,
    components
};