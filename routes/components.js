/**
 * ViewLogic 통합 컴포넌트 시스템
 * 빌드 시간: 2025-08-20T07:33:39.968Z
 * 빌드 버전: 1.0.0
 * 포함된 컴포넌트: Accordion, Alert, Badge, Breadcrumb, Button, Card, Checkbox, DatePicker, FileUpload, Input, LanguageSwitcher, Loading, Modal, Pagination, Progress, Radio, Select, Sidebar, Table, Tabs, Toast, Tooltip
 */

// Component: Accordion
const AccordionComponent = {
    name: "Accordion",
    template: "\n        <div class=\"accordion\" :class=\"accordionClasses\">\n            <div\n                v-for=\"(item, index) in items\"\n                :key=\"item.key || index\"\n                class=\"accordion-item\"\n                :class=\"getItemClasses(item, index)\"\n            >\n                <div\n                    class=\"accordion-header\"\n                    :class=\"getHeaderClasses(item, index)\"\n                    @click=\"toggleItem(index)\"\n                    :aria-expanded=\"isExpanded(index)\"\n                    :aria-controls=\"'accordion-content-' + index\"\n                >\n                    <span v-if=\"item.icon\" :class=\"['accordion-icon', item.icon]\"></span>\n                    <span class=\"accordion-title\">{{ item.title }}</span>\n                    <span v-if=\"item.badge\" class=\"accordion-badge\">{{ item.badge }}</span>\n                    <span class=\"accordion-arrow\" :class=\"{ 'accordion-arrow-expanded': isExpanded(index) }\">\n                        ›\n                    </span>\n                </div>\n                \n                <transition name=\"accordion-content\" @enter=\"enter\" @leave=\"leave\">\n                    <div\n                        v-if=\"isExpanded(index)\"\n                        :id=\"'accordion-content-' + index\"\n                        class=\"accordion-content\"\n                        :class=\"getContentClasses(item, index)\"\n                    >\n                        <div class=\"accordion-body\">\n                            <slot :name=\"'content-' + index\" :item=\"item\" :index=\"index\">\n                                <div v-html=\"item.content\"></div>\n                            </slot>\n                        </div>\n                    </div>\n                </transition>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","change"],
    props: {
        items: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: [Number, Array],
            default: null,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        collapsible: {
            type: Boolean,
            default: true,
        },
        variant: {
            type: String,
            default: "default",
            validator: (value) => ['default', 'flush', 'bordered'].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
    },
    data() {
        return {
            expandedItems: this.getInitialExpanded()
        };
    },
    computed: {
        accordionClasses() {
            return [
                'accordion',
                `accordion-${this.variant}`,
                `accordion-${this.size}`,
                {
                    'accordion-multiple': this.multiple
                }
            ];
        },
    },
    methods: {
        getInitialExpanded() {
            if (this.modelValue === null) {
                return this.multiple ? [] : -1;
            }
            return this.multiple ? [...this.modelValue] : this.modelValue;
        },
        isExpanded(index) {
            if (this.multiple) {
                return this.expandedItems.includes(index);
            }
            return this.expandedItems === index;
        },
        toggleItem(index) {
            if (this.items[index].disabled) return;
            
            if (this.multiple) {
                const currentIndex = this.expandedItems.indexOf(index);
                if (currentIndex > -1) {
                    if (this.collapsible) {
                        this.expandedItems.splice(currentIndex, 1);
                    }
                } else {
                    this.expandedItems.push(index);
                }
            } else {
                if (this.expandedItems === index && this.collapsible) {
                    this.expandedItems = -1;
                } else {
                    this.expandedItems = index;
                }
            }
            
            this.$emit('update:modelValue', this.expandedItems);
            this.$emit('change', {
                index,
                item: this.items[index],
                expanded: this.isExpanded(index)
            });
        },
        getItemClasses(item, index) {
            return {
                'accordion-item-expanded': this.isExpanded(index),
                'accordion-item-disabled': item.disabled
            };
        },
        getHeaderClasses(item, index) {
            return {
                'accordion-header-expanded': this.isExpanded(index),
                'accordion-header-disabled': item.disabled
            };
        },
        getContentClasses(item, index) {
            return {
                'accordion-content-expanded': this.isExpanded(index)
            };
        },
        enter(el) {
            el.style.height = '0';
            el.offsetHeight; // force reflow
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.style.height = el.scrollHeight + 'px';
            el.offsetHeight; // force reflow
            el.style.height = '0';
        },
    },
    watch: {
        modelValue(newValue) {
            this.expandedItems = this.multiple ? [...newValue] : newValue;
        },
    },
};

// Component: Alert
const AlertComponent = {
    name: "Alert",
    template: "\n        <transition name=\"alert\" @after-leave=\"$emit('destroyed')\">\n            <div v-if=\"visible\" :class=\"alertClasses\" role=\"alert\">\n                <div v-if=\"icon || closable\" class=\"alert-header\">\n                    <span v-if=\"icon\" :class=\"['alert-icon', iconClass]\">\n                        {{ iconText }}\n                    </span>\n                    <button v-if=\"closable\" class=\"alert-close\" @click=\"close\" aria-label=\"닫기\">\n                        ×\n                    </button>\n                </div>\n                \n                <div class=\"alert-content\">\n                    <h4 v-if=\"title\" class=\"alert-title\">{{ title }}</h4>\n                    <div class=\"alert-message\">\n                        <slot>{{ message }}</slot>\n                    </div>\n                    \n                    <div v-if=\"actions.length > 0 || $slots.actions\" class=\"alert-actions\">\n                        <slot name=\"actions\">\n                            <button\n                                v-for=\"action in actions\"\n                                :key=\"action.text\"\n                                :class=\"['alert-action', 'alert-action-' + (action.type || 'default')]\"\n                                @click=\"handleAction(action)\"\n                            >\n                                {{ action.text }}\n                            </button>\n                        </slot>\n                    </div>\n                </div>\n            </div>\n        </transition>\n    ",
    emits: ["update:modelValue","close","destroyed","action"],
    props: {
        modelValue: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            default: "",
        },
        message: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "info",
            validator: (value) => ['success', 'info', 'warning', 'error'].includes(value),
        },
        variant: {
            type: String,
            default: "filled",
            validator: (value) => ['filled', 'outlined', 'minimal'].includes(value),
        },
        closable: {
            type: Boolean,
            default: false,
        },
        autoClose: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
            default: 5000,
        },
        icon: {
            type: Boolean,
            default: true,
        },
        actions: {
            type: Array,
            default: () => [],
        },
        persistent: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            visible: this.modelValue,
            timer: null
        };
    },
    computed: {
        alertClasses() {
            return [
                'alert',
                `alert-${this.type}`,
                `alert-${this.variant}`,
                {
                    'alert-closable': this.closable,
                    'alert-with-icon': this.icon,
                    'alert-with-title': this.title,
                    'alert-with-actions': this.actions.length > 0 || this.$slots.actions
                }
            ];
        },
        iconClass() {
            const iconMap = {
                success: 'alert-icon-success',
                info: 'alert-icon-info',
                warning: 'alert-icon-warning',
                error: 'alert-icon-error'
            };
            return iconMap[this.type] || 'alert-icon-info';
        },
        iconText() {
            const iconMap = {
                success: '✓',
                info: 'ℹ',
                warning: '⚠',
                error: '✕'
            };
            return iconMap[this.type] || 'ℹ';
        },
    },
    methods: {
        close() {
            this.visible = false;
            this.$emit('update:modelValue', false);
            this.$emit('close');
            this.clearTimer();
        },
        handleAction(action) {
            this.$emit('action', action);
            if (action.close !== false) {
                this.close();
            }
        },
        startTimer() {
            if (this.autoClose && this.duration > 0) {
                this.timer = setTimeout(() => {
                    this.close();
                }, this.duration);
            }
        },
        clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
    },
    watch: {
        modelValue(newValue) {
            this.visible = newValue;
            if (newValue) {
                this.startTimer();
            } else {
                this.clearTimer();
            }
        },
    },
    mounted() {
        if (this.visible) {
            this.startTimer();
        }
    },
    unmounted() {
        this.clearTimer();
    },
};

// Component: Badge
const BadgeComponent = {
    name: "Badge",
    template: "\n        <span :class=\"badgeClasses\" @click=\"handleClick\">\n            <span v-if=\"icon\" :class=\"['badge-icon', icon]\"></span>\n            <span class=\"badge-text\">\n                <slot>{{ text }}</slot>\n            </span>\n            <button v-if=\"closable\" class=\"badge-close\" @click.stop=\"handleClose\">×</button>\n        </span>\n    ",
    emits: ["click","close"],
    props: {
        text: {
            type: String,
            default: "",
        },
        variant: {
            type: String,
            default: "primary",
            validator: (value) => [
                'primary', 'secondary', 'success', 'warning', 'danger', 
                'info', 'light', 'dark', 'outline'
            ].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        shape: {
            type: String,
            default: "rounded",
            validator: (value) => ['rounded', 'pill', 'square'].includes(value),
        },
        icon: {
            type: String,
            default: "",
        },
        closable: {
            type: Boolean,
            default: false,
        },
        clickable: {
            type: Boolean,
            default: false,
        },
        dot: {
            type: Boolean,
            default: false,
        },
        pulse: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        badgeClasses() {
            return [
                'badge',
                `badge-${this.variant}`,
                `badge-${this.size}`,
                `badge-${this.shape}`,
                {
                    'badge-clickable': this.clickable,
                    'badge-closable': this.closable,
                    'badge-with-icon': this.icon,
                    'badge-dot': this.dot,
                    'badge-pulse': this.pulse
                }
            ];
        },
    },
    methods: {
        handleClick(event) {
            if (this.clickable) {
                this.$emit('click', event);
            }
        },
        handleClose(event) {
            this.$emit('close', event);
        },
    },
};

// Component: Breadcrumb
const BreadcrumbComponent = {
    name: "Breadcrumb",
    template: "\n        <nav class=\"breadcrumb-wrapper\" :class=\"wrapperClasses\" aria-label=\"경로\">\n            <ol class=\"breadcrumb\" :class=\"breadcrumbClasses\">\n                <li\n                    v-for=\"(item, index) in items\"\n                    :key=\"item.key || index\"\n                    class=\"breadcrumb-item\"\n                    :class=\"getItemClasses(item, index)\"\n                >\n                    <a\n                        v-if=\"!isLast(index) && item.href\"\n                        :href=\"item.href\"\n                        class=\"breadcrumb-link\"\n                        @click=\"handleClick(item, index, $event)\"\n                    >\n                        <span v-if=\"item.icon\" :class=\"['breadcrumb-icon', item.icon]\"></span>\n                        <span class=\"breadcrumb-text\">{{ item.label }}</span>\n                    </a>\n                    \n                    <span v-else class=\"breadcrumb-current\">\n                        <span v-if=\"item.icon\" :class=\"['breadcrumb-icon', item.icon]\"></span>\n                        <span class=\"breadcrumb-text\">{{ item.label }}</span>\n                    </span>\n                    \n                    <span\n                        v-if=\"!isLast(index)\"\n                        class=\"breadcrumb-separator\"\n                        :class=\"separatorClasses\"\n                        aria-hidden=\"true\"\n                    >\n                        {{ separatorIcon }}\n                    </span>\n                </li>\n            </ol>\n        </nav>\n    ",
    emits: ["click"],
    props: {
        items: {
            type: Array,
            required: true,
            validator: (items) => {
                return items.every(item => item.label);
            },
        },
        separator: {
            type: String,
            default: "/",
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        variant: {
            type: String,
            default: "default",
            validator: (value) => ['default', 'pills', 'arrows'].includes(value),
        },
        maxItems: {
            type: Number,
            default: null,
        },
        showHome: {
            type: Boolean,
            default: false,
        },
        homeIcon: {
            type: String,
            default: "🏠",
        },
    },
    computed: {
        wrapperClasses() {
            return [
                'breadcrumb-wrapper',
                `breadcrumb-size-${this.size}`
            ];
        },
        breadcrumbClasses() {
            return [
                'breadcrumb',
                `breadcrumb-${this.variant}`
            ];
        },
        separatorClasses() {
            return [
                'breadcrumb-separator',
                `breadcrumb-separator-${this.variant}`
            ];
        },
        separatorIcon() {
            if (this.variant === 'arrows') {
                return '›';
            }
            return this.separator;
        },
        processedItems() {
            let result = [...this.items];
            
            // 홈 아이콘 추가
            if (this.showHome && result.length > 0 && !result[0].isHome) {
                result.unshift({
                    label: this.homeIcon,
                    href: '/',
                    isHome: true,
                    icon: 'breadcrumb-home-icon'
                });
            }
            
            // 최대 항목 수 제한
            if (this.maxItems && result.length > this.maxItems) {
                const start = result.slice(0, 1);
                const end = result.slice(-this.maxItems + 2);
                result = [
                    ...start,
                    { label: '...', isEllipsis: true },
                    ...end
                ];
            }
            
            return result;
        },
    },
    methods: {
        isLast(index) {
            return index === this.processedItems.length - 1;
        },
        getItemClasses(item, index) {
            return {
                'breadcrumb-item-active': this.isLast(index),
                'breadcrumb-item-home': item.isHome,
                'breadcrumb-item-ellipsis': item.isEllipsis,
                'breadcrumb-item-clickable': !this.isLast(index) && item.href
            };
        },
        handleClick(item, index, event) {
            if (item.isEllipsis) {
                event.preventDefault();
                return;
            }
            
            this.$emit('click', { item, index, event });
            
            if (item.handler && typeof item.handler === 'function') {
                event.preventDefault();
                item.handler(item, index);
            }
        },
    },
};

// Component: Button
const ButtonComponent = {
    name: "Button",
    template: "\n        <button \n            :class=\"buttonClasses\" \n            :disabled=\"disabled || loading\"\n            @click=\"handleClick\"\n            :type=\"type\"\n        >\n            <span v-if=\"loading\" class=\"btn-spinner\"></span>\n            <span v-if=\"icon && !loading\" :class=\"'btn-icon ' + icon\"></span>\n            <span class=\"btn-text\" v-if=\"!loading || showTextWhileLoading\">\n                <slot>{{ text }}</slot>\n            </span>\n            <span v-if=\"loading && loadingText\" class=\"btn-loading-text\">{{ loadingText }}</span>\n        </button>\n    ",
    emits: ["click"],
    props: {
        variant: {
            type: String,
            default: "primary",
            validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline'].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        loadingText: {
            type: String,
            default: "",
        },
        showTextWhileLoading: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: "",
        },
        icon: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "button",
            validator: (value) => ['button', 'submit', 'reset'].includes(value),
        },
        block: {
            type: Boolean,
            default: false,
        },
        rounded: {
            type: Boolean,
            default: false,
        },
    },
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
    emits: ["click"],
    props: {
        title: {
            type: String,
            default: "",
        },
        subtitle: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        imageAlt: {
            type: String,
            default: "",
        },
        variant: {
            type: String,
            default: "default",
            validator: (value) => ['default', 'primary', 'secondary', 'success', 'warning', 'danger'].includes(value),
        },
        shadow: {
            type: String,
            default: "medium",
            validator: (value) => ['none', 'small', 'medium', 'large'].includes(value),
        },
        hoverable: {
            type: Boolean,
            default: false,
        },
        clickable: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        tags: {
            type: Array,
            default: () => [],
        },
        tagVariant: {
            type: String,
            default: "tag-primary",
        },
        showDefaultActions: {
            type: Boolean,
            default: false,
        },
    },
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

// Component: Checkbox
const CheckboxComponent = {
    name: "Checkbox",
    template: "\n        <div class=\"checkbox-wrapper\" :class=\"wrapperClasses\">\n            <label :for=\"checkboxId\" class=\"checkbox-label\" :class=\"labelClasses\">\n                <input\n                    :id=\"checkboxId\"\n                    type=\"checkbox\"\n                    class=\"checkbox-input\"\n                    :checked=\"isChecked\"\n                    :disabled=\"disabled\"\n                    :required=\"required\"\n                    :value=\"value\"\n                    @change=\"handleChange\"\n                    ref=\"checkbox\"\n                />\n                <span class=\"checkbox-box\" :class=\"boxClasses\">\n                    <span v-if=\"isChecked\" class=\"checkbox-check\">✓</span>\n                    <span v-else-if=\"indeterminate\" class=\"checkbox-indeterminate\">-</span>\n                </span>\n                <span v-if=\"label || $slots.default\" class=\"checkbox-text\">\n                    <slot>{{ label }}</slot>\n                </span>\n            </label>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"checkbox-help\">\n                <p v-if=\"errorMessage\" class=\"checkbox-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"checkbox-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","change"],
    props: {
        modelValue: {
            type: [Boolean, Array],
            default: false,
        },
        value: {
            type: [String, Number, Boolean],
            default: true,
        },
        label: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        indeterminate: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        variant: {
            type: String,
            default: "primary",
            validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value),
        },
        helpText: {
            type: String,
            default: "",
        },
        errorMessage: {
            type: String,
            default: "",
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            checkboxId: `checkbox-${Math.random().toString(36).substr(2, 9)}`
        };
    },
    computed: {
        isChecked() {
            if (Array.isArray(this.modelValue)) {
                return this.modelValue.includes(this.value);
            }
            return Boolean(this.modelValue);
        },
        wrapperClasses() {
            return [
                'checkbox-wrapper',
                `checkbox-size-${this.size}`,
                `checkbox-variant-${this.variant}`,
                {
                    'checkbox-disabled': this.disabled,
                    'checkbox-error': this.errorMessage,
                    'checkbox-inline': this.inline,
                    'checkbox-checked': this.isChecked,
                    'checkbox-indeterminate': this.indeterminate
                }
            ];
        },
        labelClasses() {
            return [
                'checkbox-label',
                {
                    'checkbox-label-disabled': this.disabled
                }
            ];
        },
        boxClasses() {
            return [
                'checkbox-box',
                {
                    'checkbox-box-checked': this.isChecked,
                    'checkbox-box-indeterminate': this.indeterminate,
                    'checkbox-box-disabled': this.disabled
                }
            ];
        },
    },
    methods: {
        handleChange(event) {
            const isChecked = event.target.checked;
            
            if (Array.isArray(this.modelValue)) {
                let newValue = [...this.modelValue];
                
                if (isChecked) {
                    if (!newValue.includes(this.value)) {
                        newValue.push(this.value);
                    }
                } else {
                    const index = newValue.indexOf(this.value);
                    if (index > -1) {
                        newValue.splice(index, 1);
                    }
                }
                
                this.$emit('update:modelValue', newValue);
            } else {
                this.$emit('update:modelValue', isChecked);
            }
            
            this.$emit('change', isChecked, this.value);
        },
        focus() {
            this.$refs.checkbox.focus();
        },
        blur() {
            this.$refs.checkbox.blur();
        },
    },
    watch: {
        indeterminate(newValue) {
            if (this.$refs.checkbox) {
                this.$refs.checkbox.indeterminate = newValue;
            }
        },
    },
    mounted() {
        if (this.$refs.checkbox) {
            this.$refs.checkbox.indeterminate = this.indeterminate;
        }
    },
};

// Component: DatePicker
const DatePickerComponent = {
    name: "DatePicker",
    template: "\n        <div class=\"datepicker-wrapper\" :class=\"wrapperClasses\">\n            <label v-if=\"label\" :for=\"inputId\" class=\"datepicker-label\">{{ label }}</label>\n            \n            <div class=\"datepicker-input-container\" @click=\"toggleCalendar\">\n                <input\n                    :id=\"inputId\"\n                    type=\"text\"\n                    class=\"datepicker-input\"\n                    :class=\"inputClasses\"\n                    :value=\"displayValue\"\n                    :placeholder=\"placeholder\"\n                    :disabled=\"disabled\"\n                    :readonly=\"true\"\n                    ref=\"input\"\n                />\n                <span class=\"datepicker-icon\">📅</span>\n                <button v-if=\"clearable && modelValue\" class=\"datepicker-clear\" @click.stop=\"clear\">\n                    ×\n                </button>\n            </div>\n            \n            <transition name=\"datepicker-dropdown\">\n                <div v-if=\"isOpen\" class=\"datepicker-dropdown\" :class=\"dropdownClasses\">\n                    <!-- 헤더 -->\n                    <div class=\"datepicker-header\">\n                        <button class=\"datepicker-nav\" @click=\"previousMonth\">‹</button>\n                        <div class=\"datepicker-title\">\n                            <select v-model=\"currentYear\" class=\"datepicker-year-select\">\n                                <option v-for=\"year in availableYears\" :key=\"year\" :value=\"year\">\n                                    {{ year }}\n                                </option>\n                            </select>\n                            <select v-model=\"currentMonth\" class=\"datepicker-month-select\">\n                                <option v-for=\"(month, index) in monthNames\" :key=\"index\" :value=\"index\">\n                                    {{ month }}\n                                </option>\n                            </select>\n                        </div>\n                        <button class=\"datepicker-nav\" @click=\"nextMonth\">›</button>\n                    </div>\n                    \n                    <!-- 요일 -->\n                    <div class=\"datepicker-weekdays\">\n                        <div v-for=\"day in weekDays\" :key=\"day\" class=\"datepicker-weekday\">\n                            {{ day }}\n                        </div>\n                    </div>\n                    \n                    <!-- 날짜 -->\n                    <div class=\"datepicker-calendar\">\n                        <div\n                            v-for=\"date in calendarDates\"\n                            :key=\"date.key\"\n                            class=\"datepicker-date\"\n                            :class=\"getDateClasses(date)\"\n                            @click=\"selectDate(date)\"\n                        >\n                            {{ date.day }}\n                        </div>\n                    </div>\n                    \n                    <!-- 하단 버튼 -->\n                    <div v-if=\"showFooter\" class=\"datepicker-footer\">\n                        <button class=\"datepicker-today-btn\" @click=\"selectToday\">\n                            오늘\n                        </button>\n                        <button class=\"datepicker-clear-btn\" @click=\"clear\">\n                            취소\n                        </button>\n                    </div>\n                </div>\n            </transition>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"datepicker-help\">\n                <p v-if=\"errorMessage\" class=\"datepicker-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"datepicker-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","change","clear"],
    props: {
        modelValue: {
            type: [Date, String],
            default: null,
        },
        label: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "날짜를 선택하세요",
        },
        format: {
            type: String,
            default: "YYYY-MM-DD",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: true,
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
        minDate: {
            type: [Date, String],
            default: null,
        },
        maxDate: {
            type: [Date, String],
            default: null,
        },
        disabledDates: {
            type: Array,
            default: () => [],
        },
        highlightedDates: {
            type: Array,
            default: () => [],
        },
        firstDayOfWeek: {
            type: Number,
            default: 0,
            validator: (value) => value >= 0 && value <= 6,
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        helpText: {
            type: String,
            default: "",
        },
        errorMessage: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            isOpen: false,
            currentDate: new Date(),
            inputId: `datepicker-${Math.random().toString(36).substr(2, 9)}`,
            monthNames: [
                '1월', '2월', '3월', '4월', '5월', '6월',
                '7월', '8월', '9월', '10월', '11월', '12월'
            ],
            weekDays: ['일', '월', '화', '수', '목', '금', '토']
        };
    },
    computed: {
        wrapperClasses() {
            return [
                'datepicker-wrapper',
                `datepicker-size-${this.size}`,
                {
                    'datepicker-disabled': this.disabled,
                    'datepicker-error': this.errorMessage,
                    'datepicker-open': this.isOpen
                }
            ];
        },
        inputClasses() {
            return [
                'datepicker-input',
                {
                    'datepicker-input-disabled': this.disabled,
                    'datepicker-input-error': this.errorMessage
                }
            ];
        },
        dropdownClasses() {
            return [
                'datepicker-dropdown'
            ];
        },
        selectedDate() {
            if (!this.modelValue) return null;
            return typeof this.modelValue === 'string' ? new Date(this.modelValue) : this.modelValue;
        },
        displayValue() {
            if (!this.selectedDate) return '';
            return this.formatDate(this.selectedDate, this.format);
        },
        availableYears() {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let i = currentYear - 50; i <= currentYear + 10; i++) {
                years.push(i);
            }
            return years;
        },
        calendarDates() {
            const dates = [];
            const firstDay = new Date(this.currentYear, this.currentMonth, 1);
            const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
            
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - ((firstDay.getDay() - this.firstDayOfWeek + 7) % 7));
            
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                dates.push({
                    key: this.formatDate(date, 'YYYY-MM-DD'),
                    date: new Date(date),
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    isCurrentMonth: date.getMonth() === this.currentMonth,
                    isToday: this.isSameDay(date, new Date()),
                    isSelected: this.selectedDate && this.isSameDay(date, this.selectedDate),
                    isDisabled: this.isDateDisabled(date),
                    isHighlighted: this.isDateHighlighted(date)
                });
            }
            
            return dates;
        },
    },
    methods: {
        toggleCalendar() {
            if (this.disabled) return;
            this.isOpen = !this.isOpen;
        },
        closeCalendar() {
            this.isOpen = false;
        },
        selectDate(dateObj) {
            if (dateObj.isDisabled) return;
            
            const newDate = new Date(dateObj.date);
            this.$emit('update:modelValue', newDate);
            this.$emit('change', newDate);
            this.closeCalendar();
        },
        selectToday() {
            const today = new Date();
            this.$emit('update:modelValue', today);
            this.$emit('change', today);
            this.closeCalendar();
        },
        clear() {
            this.$emit('update:modelValue', null);
            this.$emit('clear');
            this.closeCalendar();
        },
        previousMonth() {
            this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1);
        },
        nextMonth() {
            this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1);
        },
        getDateClasses(dateObj) {
            return {
                'datepicker-date-current-month': dateObj.isCurrentMonth,
                'datepicker-date-other-month': !dateObj.isCurrentMonth,
                'datepicker-date-today': dateObj.isToday,
                'datepicker-date-selected': dateObj.isSelected,
                'datepicker-date-disabled': dateObj.isDisabled,
                'datepicker-date-highlighted': dateObj.isHighlighted
            };
        },
        isSameDay(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() &&
                   date1.getMonth() === date2.getMonth() &&
                   date1.getDate() === date2.getDate();
        },
        isDateDisabled(date) {
            if (this.minDate && date < new Date(this.minDate)) return true;
            if (this.maxDate && date > new Date(this.maxDate)) return true;
            
            const dateString = this.formatDate(date, 'YYYY-MM-DD');
            return this.disabledDates.includes(dateString);
        },
        isDateHighlighted(date) {
            const dateString = this.formatDate(date, 'YYYY-MM-DD');
            return this.highlightedDates.includes(dateString);
        },
        formatDate(date, format) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day);
        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.closeCalendar();
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        
        // 초기 날짜 설정
        if (this.selectedDate) {
            this.currentDate = new Date(this.selectedDate);
        }
    },
    unmounted() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    watch: {
        modelValue(newValue) {
            if (newValue) {
                const date = typeof newValue === 'string' ? new Date(newValue) : newValue;
                this.currentDate = new Date(date);
            }
        },
    },
};

// Component: FileUpload
const FileUploadComponent = {
    name: "FileUpload",
    template: "\n        <div class=\"file-upload-wrapper\" :class=\"wrapperClasses\">\n            <label v-if=\"label\" class=\"file-upload-label\">{{ label }}</label>\n            \n            <!-- 드래그 앤 드롭 영역 -->\n            <div\n                class=\"file-upload-area\"\n                :class=\"areaClasses\"\n                @click=\"openFileDialog\"\n                @drop=\"handleDrop\"\n                @dragover=\"handleDragOver\"\n                @dragenter=\"handleDragEnter\"\n                @dragleave=\"handleDragLeave\"\n            >\n                <input\n                    ref=\"fileInput\"\n                    type=\"file\"\n                    class=\"file-upload-input\"\n                    :accept=\"accept\"\n                    :multiple=\"multiple\"\n                    :disabled=\"disabled\"\n                    @change=\"handleFileSelect\"\n                    style=\"display: none;\"\n                />\n                \n                <div class=\"file-upload-content\">\n                    <div v-if=\"!files.length\" class=\"file-upload-placeholder\">\n                        <div class=\"file-upload-icon\">\n                            <span v-if=\"dragActive\">📤</span>\n                            <span v-else-if=\"uploadProgress > 0\">🔄</span>\n                            <span v-else>📁</span>\n                        </div>\n                        <div class=\"file-upload-text\">\n                            <p class=\"file-upload-primary-text\">\n                                {{ dragActive ? '파일을 여기에 드롭하세요' : '파일을 선택하거나 드래그하세요' }}\n                            </p>\n                            <p class=\"file-upload-secondary-text\">\n                                {{ acceptText }}\n                            </p>\n                        </div>\n                        <button type=\"button\" class=\"file-upload-button\" :disabled=\"disabled\">\n                            파일 선택\n                        </button>\n                    </div>\n                    \n                    <!-- 업로드된 파일 목록 -->\n                    <div v-else class=\"file-upload-files\">\n                        <div\n                            v-for=\"(file, index) in files\"\n                            :key=\"file.id || index\"\n                            class=\"file-upload-file\"\n                            :class=\"getFileClasses(file)\"\n                        >\n                            <div class=\"file-upload-file-info\">\n                                <div class=\"file-upload-file-icon\">\n                                    {{ getFileIcon(file) }}\n                                </div>\n                                <div class=\"file-upload-file-details\">\n                                    <div class=\"file-upload-file-name\" :title=\"file.name\">\n                                        {{ file.name }}\n                                    </div>\n                                    <div class=\"file-upload-file-size\">\n                                        {{ formatFileSize(file.size) }}\n                                    </div>\n                                    <div v-if=\"file.progress !== undefined\" class=\"file-upload-file-progress\">\n                                        <div class=\"progress-bar\">\n                                            <div class=\"progress-fill\" :style=\"{ width: file.progress + '%' }\"></div>\n                                        </div>\n                                        <span class=\"progress-text\">{{ file.progress }}%</span>\n                                    </div>\n                                </div>\n                            </div>\n                            \n                            <div class=\"file-upload-file-actions\">\n                                <button\n                                    v-if=\"file.status === 'error'\"\n                                    class=\"file-upload-retry\"\n                                    @click.stop=\"retryUpload(file, index)\"\n                                    title=\"다시 시도\"\n                                >\n                                    🔄\n                                </button>\n                                <button\n                                    class=\"file-upload-remove\"\n                                    @click.stop=\"removeFile(index)\"\n                                    title=\"제거\"\n                                >\n                                    ×\n                                </button>\n                            </div>\n                        </div>\n                        \n                        <button\n                            v-if=\"multiple\"\n                            type=\"button\"\n                            class=\"file-upload-add-more\"\n                            @click=\"openFileDialog\"\n                            :disabled=\"disabled\"\n                        >\n                            + 파일 추가\n                        </button>\n                    </div>\n                </div>\n            </div>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"file-upload-help\">\n                <p v-if=\"errorMessage\" class=\"file-upload-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"file-upload-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","change","upload","error","progress"],
    props: {
        modelValue: {
            type: [File, Array],
            default: null,
        },
        label: {
            type: String,
            default: "",
        },
        accept: {
            type: String,
            default: "",
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        maxSize: {
            type: Number,
            default: null,
        },
        maxFiles: {
            type: Number,
            default: null,
        },
        autoUpload: {
            type: Boolean,
            default: false,
        },
        uploadUrl: {
            type: String,
            default: "",
        },
        uploadHeaders: {
            type: Object,
            default: () => ({}),
        },
        uploadData: {
            type: Object,
            default: () => ({}),
        },
        preview: {
            type: Boolean,
            default: true,
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        helpText: {
            type: String,
            default: "",
        },
        errorMessage: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            files: [],
            dragActive: false,
            uploadProgress: 0,
            nextFileId: 1
        };
    },
    computed: {
        wrapperClasses() {
            return [
                'file-upload-wrapper',
                `file-upload-size-${this.size}`,
                {
                    'file-upload-disabled': this.disabled,
                    'file-upload-error': this.errorMessage,
                    'file-upload-multiple': this.multiple
                }
            ];
        },
        areaClasses() {
            return [
                'file-upload-area',
                {
                    'file-upload-area-drag-active': this.dragActive,
                    'file-upload-area-disabled': this.disabled,
                    'file-upload-area-has-files': this.files.length > 0
                }
            ];
        },
        acceptText() {
            if (!this.accept) return '모든 파일';
            
            const types = this.accept.split(',').map(type => type.trim());
            const extensions = types.filter(type => type.startsWith('.'));
            const mimeTypes = types.filter(type => !type.startsWith('.'));
            
            let text = '';
            if (extensions.length > 0) {
                text += extensions.join(', ');
            }
            if (mimeTypes.length > 0) {
                if (text) text += ', ';
                text += mimeTypes.map(type => {
                    if (type.startsWith('image/')) return '이미지';
                    if (type.startsWith('video/')) return '비디오';
                    if (type.startsWith('audio/')) return '오디오';
                    return type;
                }).join(', ');
            }
            
            return text || '모든 파일';
        },
    },
    methods: {
        openFileDialog() {
            if (this.disabled) return;
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            this.addFiles(files);
            // 입력 초기화
            event.target.value = '';
        },
        handleDrop(event) {
            event.preventDefault();
            this.dragActive = false;
            
            if (this.disabled) return;
            
            const files = Array.from(event.dataTransfer.files);
            this.addFiles(files);
        },
        handleDragOver(event) {
            event.preventDefault();
        },
        handleDragEnter(event) {
            event.preventDefault();
            this.dragActive = true;
        },
        handleDragLeave(event) {
            event.preventDefault();
            if (!this.$el.contains(event.relatedTarget)) {
                this.dragActive = false;
            }
        },
        addFiles(newFiles) {
            const validFiles = newFiles.filter(file => this.validateFile(file));
            
            if (this.multiple) {
                if (this.maxFiles && this.files.length + validFiles.length > this.maxFiles) {
                    const remaining = this.maxFiles - this.files.length;
                    validFiles.splice(remaining);
                }
                
                const filesWithId = validFiles.map(file => ({
                    ...file,
                    id: this.nextFileId++,
                    status: 'pending'
                }));
                
                this.files.push(...filesWithId);
            } else {
                if (validFiles.length > 0) {
                    this.files = [{
                        ...validFiles[0],
                        id: this.nextFileId++,
                        status: 'pending'
                    }];
                }
            }
            
            this.updateModelValue();
            
            if (this.autoUpload) {
                this.uploadFiles();
            }
        },
        removeFile(index) {
            this.files.splice(index, 1);
            this.updateModelValue();
        },
        validateFile(file) {
            // 크기 검증
            if (this.maxSize && file.size > this.maxSize) {
                this.$emit('error', {
                    type: 'size',
                    file,
                    message: `파일 크기가 너무 큽니다. 최대 ${this.formatFileSize(this.maxSize)}`
                });
                return false;
            }
            
            // 파일 형식 검증
            if (this.accept && !this.isAcceptedFileType(file)) {
                this.$emit('error', {
                    type: 'type',
                    file,
                    message: '지원되지 않는 파일 형식입니다.'
                });
                return false;
            }
            
            return true;
        },
        isAcceptedFileType(file) {
            const acceptTypes = this.accept.split(',').map(type => type.trim());
            
            return acceptTypes.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase());
                } else {
                    return file.type === type || file.type.startsWith(type.replace('*', ''));
                }
            });
        },
        updateModelValue() {
            const fileList = this.files.map(f => f.file || f);
            
            if (this.multiple) {
                this.$emit('update:modelValue', fileList);
            } else {
                this.$emit('update:modelValue', fileList[0] || null);
            }
            
            this.$emit('change', fileList);
        },
        uploadFiles() {
            if (!this.uploadUrl) return;
            
            this.files.forEach((file, index) => {
                if (file.status === 'pending') {
                    this.uploadFile(file, index);
                }
            });
        },
        async uploadFile(file, index) {
            const formData = new FormData();
            formData.append('file', file);
            
            // 추가 데이터 추가
            Object.keys(this.uploadData).forEach(key => {
                formData.append(key, this.uploadData[key]);
            });
            
            try {
                file.status = 'uploading';
                file.progress = 0;
                
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        file.progress = Math.round((event.loaded / event.total) * 100);
                    }
                });
                
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        file.status = 'success';
                        file.progress = 100;
                        this.$emit('upload-success', { file, response: xhr.response });
                    } else {
                        file.status = 'error';
                        this.$emit('upload-error', { file, error: xhr.statusText });
                    }
                };
                
                xhr.onerror = () => {
                    file.status = 'error';
                    this.$emit('upload-error', { file, error: '업로드 실패' });
                };
                
                // 헤더 설정
                Object.keys(this.uploadHeaders).forEach(key => {
                    xhr.setRequestHeader(key, this.uploadHeaders[key]);
                });
                
                xhr.open('POST', this.uploadUrl);
                xhr.send(formData);
                
            } catch (error) {
                file.status = 'error';
                this.$emit('upload-error', { file, error });
            }
        },
        retryUpload(file, index) {
            file.status = 'pending';
            delete file.progress;
            this.uploadFile(file, index);
        },
        getFileClasses(file) {
            return {
                'file-upload-file-pending': file.status === 'pending',
                'file-upload-file-uploading': file.status === 'uploading',
                'file-upload-file-success': file.status === 'success',
                'file-upload-file-error': file.status === 'error'
            };
        },
        getFileIcon(file) {
            const type = file.type || '';
            
            if (type.startsWith('image/')) return '🖼️';
            if (type.startsWith('video/')) return '🎥';
            if (type.startsWith('audio/')) return '🎧';
            if (type.includes('pdf')) return '📄';
            if (type.includes('word')) return '📄';
            if (type.includes('excel') || type.includes('spreadsheet')) return '📈';
            if (type.includes('powerpoint') || type.includes('presentation')) return '📉';
            if (type.includes('zip') || type.includes('rar')) return '🗜️';
            
            return '📁';
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        },
    },
    watch: {
        modelValue(newValue) {
            if (!newValue) {
                this.files = [];
            }
        },
    },
};

// Component: Input
const InputComponent = {
    name: "Input",
    template: "\n        <div :class=\"wrapperClasses\">\n            <label v-if=\"label\" :for=\"inputId\" class=\"input-label\" :class=\"{ 'required': required }\">\n                {{ label }}\n            </label>\n            \n            <div class=\"input-container\">\n                <span v-if=\"prefixIcon\" class=\"input-prefix-icon\" :class=\"prefixIcon\"></span>\n                \n                <input\n                    :id=\"inputId\"\n                    :type=\"inputType\"\n                    :class=\"inputClasses\"\n                    :value=\"modelValue\"\n                    :placeholder=\"placeholder\"\n                    :disabled=\"disabled\"\n                    :readonly=\"readonly\"\n                    :required=\"required\"\n                    :min=\"min\"\n                    :max=\"max\"\n                    :step=\"step\"\n                    :maxlength=\"maxlength\"\n                    @input=\"handleInput\"\n                    @blur=\"handleBlur\"\n                    @focus=\"handleFocus\"\n                    @keyup.enter=\"handleEnter\"\n                    ref=\"input\"\n                />\n                \n                <span v-if=\"suffixIcon\" class=\"input-suffix-icon\" :class=\"suffixIcon\"></span>\n                \n                <button\n                    v-if=\"clearable && modelValue && !disabled && !readonly\"\n                    class=\"input-clear\"\n                    @click=\"clearInput\"\n                    type=\"button\"\n                >\n                    ×\n                </button>\n                \n                <button\n                    v-if=\"type === 'password'\"\n                    class=\"input-password-toggle\"\n                    @click=\"togglePasswordVisibility\"\n                    type=\"button\"\n                >\n                    {{ showPassword ? '🙈' : '👁' }}\n                </button>\n            </div>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"input-help\">\n                <p v-if=\"errorMessage\" class=\"input-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"input-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","input","blur","focus","enter"],
    props: {
        modelValue: {
            type: [String, Number],
            default: "",
        },
        type: {
            type: String,
            default: "text",
            validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'url', 'search'].includes(value),
        },
        label: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
        helpText: {
            type: String,
            default: "",
        },
        errorMessage: {
            type: String,
            default: "",
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        prefixIcon: {
            type: String,
            default: "",
        },
        suffixIcon: {
            type: String,
            default: "",
        },
        min: {
            type: [String, Number],
            default: undefined,
        },
        max: {
            type: [String, Number],
            default: undefined,
        },
        step: {
            type: [String, Number],
            default: undefined,
        },
        maxlength: {
            type: [String, Number],
            default: undefined,
        },
    },
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

// Component: LanguageSwitcher
const LanguageSwitcherComponent = {
    name: "LanguageSwitcher",
    template: "\n        <div class=\"language-switcher\" :class=\"switcherClasses\">\n            <button\n                v-if=\"variant === 'button'\"\n                class=\"language-button\"\n                @click=\"toggleDropdown\"\n                :disabled=\"loading\"\n            >\n                <span class=\"language-icon\">🌐</span>\n                <span class=\"language-text\">{{ currentLanguageLabel }}</span>\n                <span class=\"language-arrow\" :class=\"{ 'language-arrow-open': showDropdown }\">▼</span>\n            </button>\n            \n            <select\n                v-else-if=\"variant === 'select'\"\n                class=\"language-select\"\n                :value=\"currentLanguage\"\n                @change=\"changeLanguage\"\n                :disabled=\"loading\"\n            >\n                <option\n                    v-for=\"lang in availableLanguages\"\n                    :key=\"lang.code\"\n                    :value=\"lang.code\"\n                >\n                    {{ lang.label }}\n                </option>\n            </select>\n            \n            <div\n                v-else\n                class=\"language-inline\"\n            >\n                <button\n                    v-for=\"lang in availableLanguages\"\n                    :key=\"lang.code\"\n                    class=\"language-option\"\n                    :class=\"{ 'language-option-active': lang.code === currentLanguage }\"\n                    @click=\"setLanguage(lang.code)\"\n                    :disabled=\"loading || lang.code === currentLanguage\"\n                >\n                    {{ lang.label }}\n                </button>\n            </div>\n            \n            <!-- 드롭다운 메뉴 -->\n            <div\n                v-if=\"variant === 'button' && showDropdown\"\n                class=\"language-dropdown\"\n                @click.stop\n            >\n                <button\n                    v-for=\"lang in availableLanguages\"\n                    :key=\"lang.code\"\n                    class=\"language-dropdown-option\"\n                    :class=\"{ 'language-dropdown-option-active': lang.code === currentLanguage }\"\n                    @click=\"setLanguage(lang.code)\"\n                    :disabled=\"loading\"\n                >\n                    <span class=\"language-flag\">{{ lang.flag }}</span>\n                    <span class=\"language-name\">{{ lang.label }}</span>\n                    <span v-if=\"lang.code === currentLanguage\" class=\"language-check\">✓</span>\n                </button>\n            </div>\n            \n            <!-- 로딩 오버레이 -->\n            <div v-if=\"loading\" class=\"language-loading\">\n                <div class=\"language-spinner\"></div>\n            </div>\n        </div>\n    ",
    emits: ["language-changed"],
    props: {
        variant: {
            type: String,
            default: "button",
            validator: (value) => ['button', 'select', 'inline'].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        showLabels: {
            type: Boolean,
            default: true,
        },
        useQueryParam: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            currentLanguage: 'ko',
            showDropdown: false,
            loading: false,
            availableLanguages: [
                {
                    code: 'ko',
                    label: '한국어',
                    flag: '🇰🇷'
                },
                {
                    code: 'en',
                    label: 'English',
                    flag: '🇺🇸'
                }
            ]
        };
    },
    computed: {
        switcherClasses() {
            return [
                `language-switcher-${this.variant}`,
                `language-switcher-${this.size}`,
                {
                    'language-switcher-loading': this.loading,
                    'language-switcher-dropdown-open': this.showDropdown
                }
            ];
        },
        currentLanguageLabel() {
            const lang = this.availableLanguages.find(l => l.code === this.currentLanguage);
            return lang ? lang.label : this.currentLanguage;
        },
    },
    mounted() {
        // i18n 시스템에서 현재 언어 가져오기
        if (window.i18n) {
            this.currentLanguage = window.i18n.getCurrentLanguage();
            
            // 언어 변경 이벤트 리스너 등록
            window.i18n.on('languageChanged', this.onLanguageChanged);
        }
        
        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', this.closeDropdown);
    },
    unmounted() {
        // 이벤트 리스너 제거
        if (window.i18n) {
            window.i18n.off('languageChanged', this.onLanguageChanged);
        }
        document.removeEventListener('click', this.closeDropdown);
    },
    methods: {
        async setLanguage(languageCode) {
            if (this.loading || languageCode === this.currentLanguage) {
                return;
            }
            
            this.loading = true;
            this.showDropdown = false;
            
            try {
                if (window.i18n) {
                    const success = await window.i18n.setLanguage(languageCode);
                    if (success) {
                        this.currentLanguage = languageCode;
                        
                        // 쿼리 파라미터 업데이트
                        if (this.useQueryParam && window.router) {
                            window.router.setQueryParams({ lang: languageCode });
                        }
                        
                        this.$emit('language-changed', {
                            language: languageCode,
                            label: this.currentLanguageLabel
                        });
                    }
                } else {
                    console.warn('i18n system not available');
                }
            } catch (error) {
                console.error('Failed to change language:', error);
            } finally {
                this.loading = false;
            }
        },
        changeLanguage(event) {
            this.setLanguage(event.target.value);
        },
        toggleDropdown() {
            if (!this.loading) {
                this.showDropdown = !this.showDropdown;
            }
        },
        closeDropdown() {
            this.showDropdown = false;
        },
        onLanguageChanged(data) {
            this.currentLanguage = data.to;
        },
    },
};

// Component: Loading
const LoadingComponent = {
    name: "Loading",
    template: "\n        <div v-if=\"visible\" :class=\"loadingClasses\">\n            <div class=\"loading-backdrop\" v-if=\"overlay\" @click=\"handleBackdropClick\"></div>\n            \n            <div class=\"loading-content\" :class=\"contentClasses\">\n                <div class=\"loading-spinner\" :class=\"spinnerClasses\">\n                    <div v-if=\"type === 'dots'\" class=\"spinner-dots\">\n                        <div class=\"dot\" v-for=\"i in 3\" :key=\"i\"></div>\n                    </div>\n                    <div v-else-if=\"type === 'bars'\" class=\"spinner-bars\">\n                        <div class=\"bar\" v-for=\"i in 4\" :key=\"i\"></div>\n                    </div>\n                    <div v-else-if=\"type === 'pulse'\" class=\"spinner-pulse\">\n                        <div class=\"pulse-ring\"></div>\n                    </div>\n                    <div v-else-if=\"type === 'ring'\" class=\"spinner-ring\">\n                        <div class=\"ring\"></div>\n                    </div>\n                    <div v-else class=\"spinner-circle\">\n                        <div class=\"circle\"></div>\n                    </div>\n                </div>\n                \n                <div v-if=\"text || $slots.default\" class=\"loading-text\">\n                    <slot>{{ text }}</slot>\n                </div>\n                \n                <div v-if=\"progress !== null\" class=\"loading-progress\">\n                    <div class=\"progress-bar\">\n                        <div class=\"progress-fill\" :style=\"{ width: progress + '%' }\"></div>\n                    </div>\n                    <div class=\"progress-text\">{{ progress }}%</div>\n                </div>\n                \n                <button v-if=\"cancelable\" class=\"loading-cancel\" @click=\"handleCancel\">\n                    취소\n                </button>\n            </div>\n        </div>\n    ",
    emits: ["complete"],
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        text: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "circle",
            validator: (value) => ['circle', 'dots', 'bars', 'pulse', 'ring'].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        color: {
            type: String,
            default: "primary",
            validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value),
        },
        overlay: {
            type: Boolean,
            default: false,
        },
        backdrop: {
            type: Boolean,
            default: true,
        },
        position: {
            type: String,
            default: "center",
            validator: (value) => ['center', 'top', 'bottom', 'inline'].includes(value),
        },
        progress: {
            type: Number,
            default: null,
            validator: (value) => value === null || (value >= 0 && value <= 100),
        },
        cancelable: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        loadingClasses() {
            return [
                'loading',
                `loading-${this.position}`,
                {
                    'loading-overlay': this.overlay,
                    'loading-with-backdrop': this.backdrop && this.overlay
                }
            ];
        },
        contentClasses() {
            return [
                'loading-content',
                `loading-size-${this.size}`,
                {
                    'loading-with-text': this.text || this.$slots.default,
                    'loading-with-progress': this.progress !== null
                }
            ];
        },
        spinnerClasses() {
            return [
                'loading-spinner',
                `spinner-${this.type}`,
                `spinner-${this.color}`
            ];
        },
    },
    methods: {
        handleBackdropClick() {
            if (!this.backdrop) {
                this.$emit('backdrop-click');
            }
        },
        handleCancel() {
            this.$emit('cancel');
        },
    },
};

// Component: Modal
const ModalComponent = {
    name: "Modal",
    template: "\n        <teleport to=\"body\" v-if=\"modelValue\">\n            <div class=\"modal-overlay\" @click=\"handleOverlayClick\" :class=\"{ 'modal-overlay-visible': modelValue }\">\n                <div \n                    class=\"modal-container\" \n                    :class=\"[sizeClass, { 'modal-container-visible': modelValue }]\"\n                    @click.stop\n                >\n                    <div class=\"modal-header\" v-if=\"showHeader\">\n                        <h3 class=\"modal-title\" v-if=\"title\">{{ title }}</h3>\n                        <slot name=\"header\" v-else></slot>\n                        <button \n                            v-if=\"showCloseButton\" \n                            class=\"modal-close\" \n                            @click=\"closeModal\"\n                            aria-label=\"닫기\"\n                        >\n                            ×\n                        </button>\n                    </div>\n                    \n                    <div class=\"modal-body\">\n                        <slot></slot>\n                    </div>\n                    \n                    <div class=\"modal-footer\" v-if=\"showFooter\">\n                        <slot name=\"footer\">\n                            <button \n                                v-if=\"showCancelButton\" \n                                class=\"btn btn-secondary\" \n                                @click=\"handleCancel\"\n                            >\n                                {{ cancelText }}\n                            </button>\n                            <button \n                                v-if=\"showConfirmButton\" \n                                class=\"btn btn-primary\" \n                                @click=\"handleConfirm\"\n                                :disabled=\"confirmDisabled\"\n                            >\n                                {{ confirmText }}\n                            </button>\n                        </slot>\n                    </div>\n                </div>\n            </div>\n        </teleport>\n    ",
    emits: ["update:modelValue","close","cancel","confirm"],
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "",
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large', 'extra-large'].includes(value),
        },
        closable: {
            type: Boolean,
            default: true,
        },
        closeOnOverlay: {
            type: Boolean,
            default: true,
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
        showCloseButton: {
            type: Boolean,
            default: true,
        },
        showCancelButton: {
            type: Boolean,
            default: true,
        },
        showConfirmButton: {
            type: Boolean,
            default: true,
        },
        cancelText: {
            type: String,
            default: "취소",
        },
        confirmText: {
            type: String,
            default: "확인",
        },
        confirmDisabled: {
            type: Boolean,
            default: false,
        },
    },
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

// Component: Pagination
const PaginationComponent = {
    name: "Pagination",
    template: "\n        <nav class=\"pagination-wrapper\" :class=\"wrapperClasses\">\n            <div v-if=\"showInfo\" class=\"pagination-info\">\n                <slot name=\"info\">\n                    {{ infoText }}\n                </slot>\n            </div>\n            \n            <ul class=\"pagination\" :class=\"paginationClasses\">\n                <!-- 첫 페이지 -->\n                <li v-if=\"showFirstLast\" class=\"pagination-item\">\n                    <button\n                        class=\"pagination-link\"\n                        :disabled=\"currentPage === 1\"\n                        @click=\"goToPage(1)\"\n                        :aria-label=\"'첫 페이지로 이동'\"\n                    >\n                        ««\n                    </button>\n                </li>\n                \n                <!-- 이전 페이지 -->\n                <li class=\"pagination-item\">\n                    <button\n                        class=\"pagination-link\"\n                        :disabled=\"currentPage === 1\"\n                        @click=\"goToPage(currentPage - 1)\"\n                        :aria-label=\"'이전 페이지로 이동'\"\n                    >\n                        ‹\n                    </button>\n                </li>\n                \n                <!-- 시작 생략 -->\n                <li v-if=\"showStartEllipsis\" class=\"pagination-item pagination-ellipsis\">\n                    <span class=\"pagination-link\">…</span>\n                </li>\n                \n                <!-- 페이지 번호들 -->\n                <li\n                    v-for=\"page in visiblePages\"\n                    :key=\"page\"\n                    class=\"pagination-item\"\n                    :class=\"{ 'pagination-active': page === currentPage }\"\n                >\n                    <button\n                        class=\"pagination-link\"\n                        @click=\"goToPage(page)\"\n                        :aria-label=\"'페이지 ' + page + '로 이동'\"\n                        :aria-current=\"page === currentPage ? 'page' : null\"\n                    >\n                        {{ page }}\n                    </button>\n                </li>\n                \n                <!-- 끝 생략 -->\n                <li v-if=\"showEndEllipsis\" class=\"pagination-item pagination-ellipsis\">\n                    <span class=\"pagination-link\">…</span>\n                </li>\n                \n                <!-- 다음 페이지 -->\n                <li class=\"pagination-item\">\n                    <button\n                        class=\"pagination-link\"\n                        :disabled=\"currentPage === totalPages\"\n                        @click=\"goToPage(currentPage + 1)\"\n                        :aria-label=\"'다음 페이지로 이동'\"\n                    >\n                        ›\n                    </button>\n                </li>\n                \n                <!-- 마지막 페이지 -->\n                <li v-if=\"showFirstLast\" class=\"pagination-item\">\n                    <button\n                        class=\"pagination-link\"\n                        :disabled=\"currentPage === totalPages\"\n                        @click=\"goToPage(totalPages)\"\n                        :aria-label=\"'마지막 페이지로 이동'\"\n                    >\n                        »»\n                    </button>\n                </li>\n            </ul>\n            \n            <!-- 페이지 크기 선택 -->\n            <div v-if=\"showPageSize\" class=\"pagination-page-size\">\n                <label class=\"pagination-page-size-label\">\n                    페이지당 항목 수:\n                    <select v-model=\"localPageSize\" @change=\"handlePageSizeChange\" class=\"pagination-page-size-select\">\n                        <option v-for=\"size in pageSizeOptions\" :key=\"size\" :value=\"size\">\n                            {{ size }}\n                        </option>\n                    </select>\n                </label>\n            </div>\n        </nav>\n    ",
    emits: ["update:modelValue","change","page-change"],
    props: {
        currentPage: {
            type: Number,
            default: 1,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        totalItems: {
            type: Number,
            default: 0,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        maxVisiblePages: {
            type: Number,
            default: 5,
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        variant: {
            type: String,
            default: "default",
            validator: (value) => ['default', 'outline', 'minimal'].includes(value),
        },
        showFirstLast: {
            type: Boolean,
            default: true,
        },
        showInfo: {
            type: Boolean,
            default: false,
        },
        showPageSize: {
            type: Boolean,
            default: false,
        },
        pageSizeOptions: {
            type: Array,
            default: () => [10, 20, 50, 100],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            localPageSize: this.pageSize
        };
    },
    computed: {
        wrapperClasses() {
            return [
                'pagination-wrapper',
                `pagination-size-${this.size}`,
                {
                    'pagination-disabled': this.disabled
                }
            ];
        },
        paginationClasses() {
            return [
                'pagination',
                `pagination-${this.variant}`
            ];
        },
        visiblePages() {
            const total = this.totalPages;
            const current = this.currentPage;
            const max = this.maxVisiblePages;
            
            if (total <= max) {
                return Array.from({ length: total }, (_, i) => i + 1);
            }
            
            const half = Math.floor(max / 2);
            let start = Math.max(1, current - half);
            let end = Math.min(total, start + max - 1);
            
            if (end - start + 1 < max) {
                start = Math.max(1, end - max + 1);
            }
            
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
        showStartEllipsis() {
            return this.visiblePages[0] > 2;
        },
        showEndEllipsis() {
            return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
        },
        infoText() {
            const start = (this.currentPage - 1) * this.localPageSize + 1;
            const end = Math.min(start + this.localPageSize - 1, this.totalItems);
            return `${start}-${end} / 총 ${this.totalItems}개`;
        },
    },
    methods: {
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages && page !== this.currentPage && !this.disabled) {
                this.$emit('page-change', page);
            }
        },
        handlePageSizeChange() {
            this.$emit('page-size-change', this.localPageSize);
        },
    },
    watch: {
        pageSize(newValue) {
            this.localPageSize = newValue;
        },
    },
};

// Component: Progress
const ProgressComponent = {
    name: "Progress",
    template: "\n        <div class=\"progress-wrapper\" :class=\"wrapperClasses\">\n            <div v-if=\"label || showPercent\" class=\"progress-header\">\n                <span v-if=\"label\" class=\"progress-label\">{{ label }}</span>\n                <span v-if=\"showPercent\" class=\"progress-percent\">{{ displayPercent }}%</span>\n            </div>\n            \n            <div class=\"progress-container\" :class=\"containerClasses\">\n                <div class=\"progress-track\">\n                    <div \n                        class=\"progress-bar\" \n                        :class=\"barClasses\"\n                        :style=\"barStyle\"\n                    >\n                        <span v-if=\"showText && !showPercent\" class=\"progress-text\">\n                            <slot>{{ text }}</slot>\n                        </span>\n                    </div>\n                </div>\n                \n                <!-- 다중 진행률 -->\n                <div\n                    v-if=\"multiple && steps.length > 0\"\n                    v-for=\"(step, index) in steps\"\n                    :key=\"index\"\n                    class=\"progress-step\"\n                    :class=\"getStepClasses(step, index)\"\n                    :style=\"getStepStyle(step)\"\n                >\n                    <span v-if=\"step.label\" class=\"progress-step-label\">{{ step.label }}</span>\n                </div>\n            </div>\n            \n            <!-- 단계별 진행률 표시 -->\n            <div v-if=\"showSteps && steps.length > 0\" class=\"progress-steps\">\n                <div\n                    v-for=\"(step, index) in steps\"\n                    :key=\"index\"\n                    class=\"progress-step-item\"\n                    :class=\"getStepItemClasses(step, index)\"\n                >\n                    <div class=\"progress-step-circle\">\n                        <span v-if=\"step.icon\" :class=\"step.icon\"></span>\n                        <span v-else>{{ index + 1 }}</span>\n                    </div>\n                    <div v-if=\"step.label\" class=\"progress-step-text\">\n                        {{ step.label }}\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
    props: {
        value: {
            type: Number,
            default: 0,
            validator: (value) => value >= 0 && value <= 100,
        },
        label: {
            type: String,
            default: "",
        },
        text: {
            type: String,
            default: "",
        },
        variant: {
            type: String,
            default: "primary",
            validator: (value) => [
                'primary', 'secondary', 'success', 'warning', 'danger', 'info'
            ].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        striped: {
            type: Boolean,
            default: false,
        },
        animated: {
            type: Boolean,
            default: false,
        },
        showPercent: {
            type: Boolean,
            default: false,
        },
        showText: {
            type: Boolean,
            default: false,
        },
        indeterminate: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        steps: {
            type: Array,
            default: () => [],
        },
        showSteps: {
            type: Boolean,
            default: false,
        },
        currentStep: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        displayPercent() {
            return Math.round(this.value);
        },
        wrapperClasses() {
            return [
                'progress-wrapper',
                `progress-size-${this.size}`,
                {
                    'progress-multiple': this.multiple,
                    'progress-stepped': this.showSteps
                }
            ];
        },
        containerClasses() {
            return [
                'progress-container',
                {
                    'progress-striped': this.striped,
                    'progress-animated': this.animated,
                    'progress-indeterminate': this.indeterminate
                }
            ];
        },
        barClasses() {
            return [
                'progress-bar',
                `progress-bar-${this.variant}`,
                {
                    'progress-bar-striped': this.striped,
                    'progress-bar-animated': this.animated
                }
            ];
        },
        barStyle() {
            if (this.indeterminate) {
                return {};
            }
            return {
                width: `${this.value}%`,
                transition: 'width 0.3s ease'
            };
        },
    },
    methods: {
        getStepClasses(step, index) {
            return [
                'progress-step',
                `progress-step-${step.variant || 'primary'}`,
                {
                    'progress-step-active': index === this.currentStep,
                    'progress-step-completed': index < this.currentStep
                }
            ];
        },
        getStepStyle(step) {
            return {
                width: `${step.value || 0}%`
            };
        },
        getStepItemClasses(step, index) {
            return [
                'progress-step-item',
                {
                    'progress-step-item-active': index === this.currentStep,
                    'progress-step-item-completed': index < this.currentStep,
                    'progress-step-item-disabled': step.disabled
                }
            ];
        },
    },
};

// Component: Radio
const RadioComponent = {
    name: "Radio",
    template: "\n        <div class=\"radio-wrapper\" :class=\"wrapperClasses\">\n            <label :for=\"radioId\" class=\"radio-label\" :class=\"labelClasses\">\n                <input\n                    :id=\"radioId\"\n                    type=\"radio\"\n                    class=\"radio-input\"\n                    :checked=\"isChecked\"\n                    :disabled=\"disabled\"\n                    :required=\"required\"\n                    :value=\"value\"\n                    :name=\"name\"\n                    @change=\"handleChange\"\n                    ref=\"radio\"\n                />\n                <span class=\"radio-circle\" :class=\"circleClasses\">\n                    <span v-if=\"isChecked\" class=\"radio-dot\"></span>\n                </span>\n                <span v-if=\"label || $slots.default\" class=\"radio-text\">\n                    <slot>{{ label }}</slot>\n                </span>\n            </label>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"radio-help\">\n                <p v-if=\"errorMessage\" class=\"radio-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"radio-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","change"],
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            default: null,
        },
        value: {
            type: [String, Number, Boolean],
            required: true,
        },
        label: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        variant: {
            type: String,
            default: "primary",
            validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value),
        },
        helpText: {
            type: String,
            default: "",
        },
        errorMessage: {
            type: String,
            default: "",
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            radioId: `radio-${Math.random().toString(36).substr(2, 9)}`
        };
    },
    computed: {
        isChecked() {
            return this.modelValue === this.value;
        },
        wrapperClasses() {
            return [
                'radio-wrapper',
                `radio-size-${this.size}`,
                `radio-variant-${this.variant}`,
                {
                    'radio-disabled': this.disabled,
                    'radio-error': this.errorMessage,
                    'radio-inline': this.inline,
                    'radio-checked': this.isChecked
                }
            ];
        },
        labelClasses() {
            return [
                'radio-label',
                {
                    'radio-label-disabled': this.disabled
                }
            ];
        },
        circleClasses() {
            return [
                'radio-circle',
                {
                    'radio-circle-checked': this.isChecked,
                    'radio-circle-disabled': this.disabled
                }
            ];
        },
    },
    methods: {
        handleChange(event) {
            if (event.target.checked) {
                this.$emit('update:modelValue', this.value);
                this.$emit('change', this.value);
            }
        },
        focus() {
            this.$refs.radio.focus();
        },
        blur() {
            this.$refs.radio.blur();
        },
    },
};

// Component: Select
const SelectComponent = {
    name: "Select",
    template: "\n        <div class=\"select-wrapper\" :class=\"wrapperClasses\">\n            <label v-if=\"label\" :for=\"selectId\" class=\"select-label\" :class=\"{ 'required': required }\">\n                {{ label }}\n            </label>\n            \n            <div class=\"select-container\" @click=\"toggleDropdown\" ref=\"container\">\n                <div class=\"select-display\" :class=\"displayClasses\">\n                    <span v-if=\"selectedOption\" class=\"select-value\">\n                        <slot name=\"option\" :option=\"selectedOption\">\n                            {{ selectedOption[labelKey] }}\n                        </slot>\n                    </span>\n                    <span v-else class=\"select-placeholder\">{{ placeholder }}</span>\n                    \n                    <span class=\"select-arrow\" :class=\"{ 'select-arrow-up': isOpen }\">\n                        ▼\n                    </span>\n                </div>\n                \n                <div v-if=\"clearable && modelValue\" class=\"select-clear\" @click.stop=\"clearSelection\">\n                    ×\n                </div>\n            </div>\n            \n            <!-- 드롭다운 옵션 -->\n            <transition name=\"select-dropdown\">\n                <div v-if=\"isOpen\" class=\"select-dropdown\" :class=\"dropdownClasses\">\n                    <div v-if=\"searchable\" class=\"select-search\">\n                        <input\n                            v-model=\"searchTerm\"\n                            type=\"text\"\n                            class=\"select-search-input\"\n                            :placeholder=\"searchPlaceholder\"\n                            @click.stop\n                            ref=\"searchInput\"\n                        />\n                    </div>\n                    \n                    <div class=\"select-options\" ref=\"optionsList\">\n                        <div\n                            v-for=\"(option, index) in filteredOptions\"\n                            :key=\"getOptionKey(option)\"\n                            class=\"select-option\"\n                            :class=\"getOptionClasses(option, index)\"\n                            @click=\"selectOption(option)\"\n                            @mouseenter=\"highlightedIndex = index\"\n                        >\n                            <slot name=\"option\" :option=\"option\" :selected=\"isSelected(option)\">\n                                {{ option[labelKey] }}\n                            </slot>\n                            \n                            <span v-if=\"isSelected(option)\" class=\"select-check\">✓</span>\n                        </div>\n                        \n                        <div v-if=\"filteredOptions.length === 0\" class=\"select-no-options\">\n                            {{ noOptionsText }}\n                        </div>\n                    </div>\n                </div>\n            </transition>\n            \n            <div v-if=\"helpText || errorMessage\" class=\"select-help\">\n                <p v-if=\"errorMessage\" class=\"select-error\">{{ errorMessage }}</p>\n                <p v-else-if=\"helpText\" class=\"select-help-text\">{{ helpText }}</p>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","change","clear","focus","blur"],
    props: {
        modelValue: {
            type: [String, Number, Object, Array],
            default: null,
        },
        options: {
            type: Array,
            required: true,
        },
        label: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "선택하세요",
        },
        labelKey: {
            type: String,
            default: "label",
        },
        valueKey: {
            type: String,
            default: "value",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        searchable: {
            type: Boolean,
            default: false,
        },
        searchPlaceholder: {
            type: String,
            default: "검색...",
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        helpText: {
            type: String,
            default: "",
        },
        errorMessage: {
            type: String,
            default: "",
        },
        noOptionsText: {
            type: String,
            default: "옵션이 없습니다",
        },
        maxHeight: {
            type: String,
            default: "200px",
        },
    },
    data() {
        return {
            isOpen: false,
            searchTerm: '',
            highlightedIndex: -1,
            selectId: `select-${Math.random().toString(36).substr(2, 9)}`
        };
    },
    computed: {
        wrapperClasses() {
            return [
                'select-wrapper',
                `select-size-${this.size}`,
                {
                    'select-disabled': this.disabled,
                    'select-error': this.errorMessage,
                    'select-open': this.isOpen,
                    'select-multiple': this.multiple
                }
            ];
        },
        displayClasses() {
            return [
                'select-display',
                {
                    'select-display-placeholder': !this.selectedOption,
                    'select-display-disabled': this.disabled
                }
            ];
        },
        dropdownClasses() {
            return [
                'select-dropdown',
                {
                    'select-dropdown-searchable': this.searchable
                }
            ];
        },
        selectedOption() {
            if (this.multiple) {
                return this.modelValue && this.modelValue.length > 0 ? this.modelValue : null;
            }
            
            if (!this.modelValue) return null;
            
            return this.options.find(option => {
                return this.getOptionValue(option) === this.modelValue;
            });
        },
        filteredOptions() {
            if (!this.searchable || !this.searchTerm) {
                return this.options;
            }
            
            const term = this.searchTerm.toLowerCase();
            return this.options.filter(option => {
                return option[this.labelKey].toLowerCase().includes(term);
            });
        },
    },
    methods: {
        toggleDropdown() {
            if (this.disabled) return;
            
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                this.$nextTick(() => {
                    if (this.searchable && this.$refs.searchInput) {
                        this.$refs.searchInput.focus();
                    }
                });
            }
        },
        selectOption(option) {
            if (this.multiple) {
                let newValue = [...(this.modelValue || [])];
                const optionValue = this.getOptionValue(option);
                const index = newValue.findIndex(val => val === optionValue);
                
                if (index > -1) {
                    newValue.splice(index, 1);
                } else {
                    newValue.push(optionValue);
                }
                
                this.$emit('update:modelValue', newValue);
            } else {
                this.$emit('update:modelValue', this.getOptionValue(option));
                this.isOpen = false;
            }
            
            this.$emit('change', option);
        },
        clearSelection() {
            this.$emit('update:modelValue', this.multiple ? [] : null);
            this.$emit('clear');
        },
        isSelected(option) {
            if (this.multiple) {
                const values = this.modelValue || [];
                return values.includes(this.getOptionValue(option));
            }
            
            return this.getOptionValue(option) === this.modelValue;
        },
        getOptionValue(option) {
            return typeof option === 'object' ? option[this.valueKey] : option;
        },
        getOptionKey(option) {
            return this.getOptionValue(option);
        },
        getOptionClasses(option, index) {
            return {
                'select-option-selected': this.isSelected(option),
                'select-option-highlighted': this.highlightedIndex === index
            };
        },
        handleClickOutside(event) {
            if (!this.$refs.container.contains(event.target)) {
                this.isOpen = false;
            }
        },
        handleKeydown(event) {
            if (!this.isOpen) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.toggleDropdown();
                }
                return;
            }
            
            switch (event.key) {
                case 'Escape':
                    this.isOpen = false;
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.highlightedIndex = Math.min(
                        this.highlightedIndex + 1,
                        this.filteredOptions.length - 1
                    );
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (this.highlightedIndex >= 0) {
                        this.selectOption(this.filteredOptions[this.highlightedIndex]);
                    }
                    break;
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeydown);
    },
    unmounted() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeydown);
    },
    watch: {
        isOpen(newValue) {
            if (newValue) {
                this.searchTerm = '';
                this.highlightedIndex = -1;
            }
        },
    },
};

// Component: Sidebar
const SidebarComponent = {
    name: "Sidebar",
    template: "\n        <aside :class=\"sidebarClasses\" :style=\"sidebarStyle\">\n            <!-- 오버레이 -->\n            <div v-if=\"overlay && isOpen\" class=\"sidebar-overlay\" @click=\"close\"></div>\n            \n            <!-- 사이드바 콘텐츠 -->\n            <div class=\"sidebar-content\">\n                <!-- 헤더 -->\n                <div v-if=\"$slots.header || title\" class=\"sidebar-header\">\n                    <slot name=\"header\">\n                        <h3 v-if=\"title\" class=\"sidebar-title\">{{ title }}</h3>\n                    </slot>\n                    <button v-if=\"closable\" class=\"sidebar-close\" @click=\"close\">\n                        ×\n                    </button>\n                </div>\n                \n                <!-- 메인 콘텐츠 -->\n                <div class=\"sidebar-body\">\n                    <nav v-if=\"navigation && menuItems.length > 0\" class=\"sidebar-nav\">\n                        <ul class=\"sidebar-menu\">\n                            <li\n                                v-for=\"item in menuItems\"\n                                :key=\"item.key || item.label\"\n                                class=\"sidebar-menu-item\"\n                                :class=\"getMenuItemClasses(item)\"\n                            >\n                                <a\n                                    v-if=\"!item.children\"\n                                    :href=\"item.href\"\n                                    class=\"sidebar-menu-link\"\n                                    :class=\"{ 'sidebar-menu-link-active': item.active }\"\n                                    @click=\"handleMenuClick(item, $event)\"\n                                >\n                                    <span v-if=\"item.icon\" :class=\"['sidebar-menu-icon', item.icon]\"></span>\n                                    <span class=\"sidebar-menu-text\">{{ item.label }}</span>\n                                    <span v-if=\"item.badge\" class=\"sidebar-menu-badge\">{{ item.badge }}</span>\n                                </a>\n                                \n                                <div v-else class=\"sidebar-menu-group\">\n                                    <div\n                                        class=\"sidebar-menu-group-header\"\n                                        @click=\"toggleGroup(item)\"\n                                    >\n                                        <span v-if=\"item.icon\" :class=\"['sidebar-menu-icon', item.icon]\"></span>\n                                        <span class=\"sidebar-menu-text\">{{ item.label }}</span>\n                                        <span class=\"sidebar-menu-arrow\" :class=\"{ 'sidebar-menu-arrow-open': item.expanded }\">\n                                            ›\n                                        </span>\n                                    </div>\n                                    \n                                    <transition name=\"sidebar-submenu\">\n                                        <ul v-if=\"item.expanded\" class=\"sidebar-submenu\">\n                                            <li\n                                                v-for=\"subItem in item.children\"\n                                                :key=\"subItem.key || subItem.label\"\n                                                class=\"sidebar-submenu-item\"\n                                            >\n                                                <a\n                                                    :href=\"subItem.href\"\n                                                    class=\"sidebar-submenu-link\"\n                                                    :class=\"{ 'sidebar-submenu-link-active': subItem.active }\"\n                                                    @click=\"handleMenuClick(subItem, $event)\"\n                                                >\n                                                    <span v-if=\"subItem.icon\" :class=\"['sidebar-submenu-icon', subItem.icon]\"></span>\n                                                    <span class=\"sidebar-submenu-text\">{{ subItem.label }}</span>\n                                                    <span v-if=\"subItem.badge\" class=\"sidebar-submenu-badge\">{{ subItem.badge }}</span>\n                                                </a>\n                                            </li>\n                                        </ul>\n                                    </transition>\n                                </div>\n                            </li>\n                        </ul>\n                    </nav>\n                    \n                    <div class=\"sidebar-slot-content\">\n                        <slot></slot>\n                    </div>\n                </div>\n                \n                <!-- 푸터 -->\n                <div v-if=\"$slots.footer\" class=\"sidebar-footer\">\n                    <slot name=\"footer\"></slot>\n                </div>\n            </div>\n            \n            <!-- 리사이즈 핸들 -->\n            <div v-if=\"resizable\" class=\"sidebar-resize-handle\" @mousedown=\"startResize\"></div>\n        </aside>\n    ",
    emits: ["update:modelValue","toggle"],
    props: {
        modelValue: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            default: "",
        },
        position: {
            type: String,
            default: "left",
            validator: (value) => ['left', 'right'].includes(value),
        },
        width: {
            type: [String, Number],
            default: "280px",
        },
        minWidth: {
            type: [String, Number],
            default: "200px",
        },
        maxWidth: {
            type: [String, Number],
            default: "400px",
        },
        collapsible: {
            type: Boolean,
            default: false,
        },
        collapsed: {
            type: Boolean,
            default: false,
        },
        collapsedWidth: {
            type: [String, Number],
            default: "64px",
        },
        overlay: {
            type: Boolean,
            default: false,
        },
        closable: {
            type: Boolean,
            default: false,
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        navigation: {
            type: Boolean,
            default: false,
        },
        menuItems: {
            type: Array,
            default: () => [],
        },
        variant: {
            type: String,
            default: "default",
            validator: (value) => ['default', 'dark', 'light'].includes(value),
        },
    },
    data() {
        return {
            isOpen: this.modelValue,
            isCollapsed: this.collapsed,
            currentWidth: this.width,
            isResizing: false
        };
    },
    computed: {
        sidebarClasses() {
            return [
                'sidebar',
                `sidebar-${this.position}`,
                `sidebar-${this.variant}`,
                {
                    'sidebar-open': this.isOpen,
                    'sidebar-collapsed': this.isCollapsed,
                    'sidebar-overlay': this.overlay,
                    'sidebar-resizable': this.resizable,
                    'sidebar-navigation': this.navigation
                }
            ];
        },
        sidebarStyle() {
            const width = this.isCollapsed ? this.collapsedWidth : this.currentWidth;
            const widthValue = typeof width === 'number' ? `${width}px` : width;
            
            return {
                width: widthValue,
                [this.position]: this.isOpen ? '0' : `-${widthValue}`
            };
        },
    },
    methods: {
        open() {
            this.isOpen = true;
            this.$emit('update:modelValue', true);
            this.$emit('open');
        },
        close() {
            this.isOpen = false;
            this.$emit('update:modelValue', false);
            this.$emit('close');
        },
        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        collapse() {
            this.isCollapsed = true;
            this.$emit('collapse');
        },
        expand() {
            this.isCollapsed = false;
            this.$emit('expand');
        },
        toggleCollapse() {
            if (this.isCollapsed) {
                this.expand();
            } else {
                this.collapse();
            }
        },
        handleMenuClick(item, event) {
            if (item.disabled) {
                event.preventDefault();
                return;
            }
            
            this.$emit('menu-click', item, event);
            
            if (item.handler && typeof item.handler === 'function') {
                event.preventDefault();
                item.handler(item);
            }
        },
        toggleGroup(item) {
            if (item.children) {
                item.expanded = !item.expanded;
                this.$emit('group-toggle', item);
            }
        },
        getMenuItemClasses(item) {
            return {
                'sidebar-menu-item-active': item.active,
                'sidebar-menu-item-disabled': item.disabled,
                'sidebar-menu-item-group': item.children,
                'sidebar-menu-item-expanded': item.expanded
            };
        },
        startResize(event) {
            this.isResizing = true;
            const startX = event.clientX;
            const startWidth = parseInt(this.currentWidth);
            
            const handleMouseMove = (e) => {
                if (!this.isResizing) return;
                
                const delta = this.position === 'left' ? e.clientX - startX : startX - e.clientX;
                const newWidth = Math.max(
                    parseInt(this.minWidth),
                    Math.min(parseInt(this.maxWidth), startWidth + delta)
                );
                
                this.currentWidth = `${newWidth}px`;
                this.$emit('resize', newWidth);
            };
            
            const handleMouseUp = () => {
                this.isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
    },
    watch: {
        modelValue(newValue) {
            this.isOpen = newValue;
        },
        collapsed(newValue) {
            this.isCollapsed = newValue;
        },
    },
};

// Component: Table
const TableComponent = {
    name: "Table",
    template: "\n        <div class=\"table-wrapper\">\n            <!-- 검색 및 필터 -->\n            <div v-if=\"searchable || filterable\" class=\"table-header\">\n                <div v-if=\"searchable\" class=\"table-search\">\n                    <input\n                        v-model=\"searchTerm\"\n                        type=\"text\"\n                        :placeholder=\"searchPlaceholder\"\n                        class=\"table-search-input\"\n                    />\n                </div>\n                <div v-if=\"filterable && filters.length > 0\" class=\"table-filters\">\n                    <select\n                        v-for=\"filter in filters\"\n                        :key=\"filter.key\"\n                        v-model=\"activeFilters[filter.key]\"\n                        class=\"table-filter-select\"\n                    >\n                        <option value=\"\">{{ filter.label }}</option>\n                        <option\n                            v-for=\"option in filter.options\"\n                            :key=\"option.value\"\n                            :value=\"option.value\"\n                        >\n                            {{ option.label }}\n                        </option>\n                    </select>\n                </div>\n            </div>\n\n            <!-- 테이블 -->\n            <div class=\"table-container\" :class=\"tableClasses\">\n                <table class=\"table\" :class=\"{ 'table-loading': loading }\">\n                    <thead>\n                        <tr>\n                            <th\n                                v-for=\"column in columns\"\n                                :key=\"column.key\"\n                                :class=\"getColumnClasses(column)\"\n                                @click=\"handleSort(column)\"\n                            >\n                                <div class=\"table-header-content\">\n                                    <span>{{ column.label }}</span>\n                                    <span\n                                        v-if=\"column.sortable\"\n                                        class=\"table-sort-icon\"\n                                        :class=\"getSortIconClass(column.key)\"\n                                    >\n                                        ↕\n                                    </span>\n                                </div>\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr\n                            v-for=\"(row, index) in paginatedData\"\n                            :key=\"getRowKey(row, index)\"\n                            :class=\"getRowClasses(row, index)\"\n                            @click=\"handleRowClick(row, index)\"\n                        >\n                            <td\n                                v-for=\"column in columns\"\n                                :key=\"column.key\"\n                                :class=\"getCellClasses(column, row)\"\n                            >\n                                <slot\n                                    :name=\"column.key\"\n                                    :row=\"row\"\n                                    :value=\"getNestedValue(row, column.key)\"\n                                    :index=\"index\"\n                                >\n                                    {{ formatValue(getNestedValue(row, column.key), column) }}\n                                </slot>\n                            </td>\n                        </tr>\n                        <tr v-if=\"paginatedData.length === 0\" class=\"table-empty\">\n                            <td :colspan=\"columns.length\" class=\"table-empty-cell\">\n                                {{ emptyText }}\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n\n            <!-- 로딩 상태 -->\n            <div v-if=\"loading\" class=\"table-loading-overlay\">\n                <div class=\"table-spinner\"></div>\n            </div>\n\n            <!-- 페이지네이션 -->\n            <div v-if=\"pagination && totalPages > 1\" class=\"table-pagination\">\n                <div class=\"pagination-info\">\n                    {{ paginationInfo }}\n                </div>\n                <div class=\"pagination-controls\">\n                    <button\n                        @click=\"goToPage(1)\"\n                        :disabled=\"currentPage === 1\"\n                        class=\"pagination-btn\"\n                    >\n                        ««\n                    </button>\n                    <button\n                        @click=\"goToPage(currentPage - 1)\"\n                        :disabled=\"currentPage === 1\"\n                        class=\"pagination-btn\"\n                    >\n                        ‹\n                    </button>\n                    <span class=\"pagination-pages\">\n                        <button\n                            v-for=\"page in visiblePages\"\n                            :key=\"page\"\n                            @click=\"goToPage(page)\"\n                            :class=\"['pagination-btn', { active: page === currentPage }]\"\n                        >\n                            {{ page }}\n                        </button>\n                    </span>\n                    <button\n                        @click=\"goToPage(currentPage + 1)\"\n                        :disabled=\"currentPage === totalPages\"\n                        class=\"pagination-btn\"\n                    >\n                        ›\n                    </button>\n                    <button\n                        @click=\"goToPage(totalPages)\"\n                        :disabled=\"currentPage === totalPages\"\n                        class=\"pagination-btn\"\n                    >\n                        »»\n                    </button>\n                </div>\n            </div>\n        </div>\n    ",
    emits: ["sort","select","row-click","cell-click"],
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            required: true,
            validator: (columns) => {
                return columns.every(col => col.key && col.label);
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        striped: {
            type: Boolean,
            default: false,
        },
        bordered: {
            type: Boolean,
            default: false,
        },
        hoverable: {
            type: Boolean,
            default: false,
        },
        compact: {
            type: Boolean,
            default: false,
        },
        selectable: {
            type: Boolean,
            default: false,
        },
        searchable: {
            type: Boolean,
            default: false,
        },
        searchPlaceholder: {
            type: String,
            default: "검색...",
        },
        filterable: {
            type: Boolean,
            default: false,
        },
        filters: {
            type: Array,
            default: () => [],
        },
        pagination: {
            type: Boolean,
            default: false,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        emptyText: {
            type: String,
            default: "데이터가 없습니다",
        },
        rowKey: {
            type: String,
            default: "id",
        },
    },
    data() {
        return {
            searchTerm: '',
            sortBy: '',
            sortDirection: 'asc',
            currentPage: 1,
            activeFilters: {}
        };
    },
    computed: {
        tableClasses() {
            return {
                'table-striped': this.striped,
                'table-bordered': this.bordered,
                'table-hoverable': this.hoverable,
                'table-compact': this.compact,
                'table-selectable': this.selectable
            };
        },
        filteredData() {
            let result = [...this.data];

            // 검색 필터링
            if (this.searchable && this.searchTerm) {
                const term = this.searchTerm.toLowerCase();
                result = result.filter(row => {
                    return this.columns.some(column => {
                        const value = this.getNestedValue(row, column.key);
                        return String(value).toLowerCase().includes(term);
                    });
                });
            }

            // 필터 적용
            if (this.filterable) {
                Object.keys(this.activeFilters).forEach(key => {
                    const filterValue = this.activeFilters[key];
                    if (filterValue) {
                        result = result.filter(row => {
                            const value = this.getNestedValue(row, key);
                            return String(value) === String(filterValue);
                        });
                    }
                });
            }

            return result;
        },
        sortedData() {
            if (!this.sortBy) return this.filteredData;

            return [...this.filteredData].sort((a, b) => {
                const aVal = this.getNestedValue(a, this.sortBy);
                const bVal = this.getNestedValue(b, this.sortBy);

                let result = 0;
                if (aVal < bVal) result = -1;
                else if (aVal > bVal) result = 1;

                return this.sortDirection === 'desc' ? -result : result;
            });
        },
        paginatedData() {
            if (!this.pagination) return this.sortedData;

            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.sortedData.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.sortedData.length / this.pageSize);
        },
        visiblePages() {
            const total = this.totalPages;
            const current = this.currentPage;
            const delta = 2;

            let start = Math.max(1, current - delta);
            let end = Math.min(total, current + delta);

            const pages = [];
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
        paginationInfo() {
            const start = (this.currentPage - 1) * this.pageSize + 1;
            const end = Math.min(start + this.pageSize - 1, this.sortedData.length);
            const total = this.sortedData.length;
            return `${start}-${end} / ${total}`;
        },
    },
    methods: {
        handleSort(column) {
            if (!column.sortable) return;

            if (this.sortBy === column.key) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = column.key;
                this.sortDirection = 'asc';
            }

            this.$emit('sort', { column: column.key, direction: this.sortDirection });
        },
        handleRowClick(row, index) {
            if (this.selectable) {
                this.$emit('row-click', { row, index });
            }
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.$emit('page-change', page);
            }
        },
        getNestedValue(obj, path) {
            return path.split('.').reduce((o, p) => o && o[p], obj);
        },
        formatValue(value, column) {
            if (column.formatter && typeof column.formatter === 'function') {
                return column.formatter(value);
            }
            return value;
        },
        getRowKey(row, index) {
            return this.getNestedValue(row, this.rowKey) || index;
        },
        getColumnClasses(column) {
            return {
                'table-sortable': column.sortable,
                'table-sorted': this.sortBy === column.key,
                [`table-align-${column.align || 'left'}`]: true,
                [`table-width-${column.width}`]: column.width
            };
        },
        getRowClasses(row, index) {
            return {
                'table-row-selected': this.selectable && row.selected,
                'table-row-even': index % 2 === 0,
                'table-row-odd': index % 2 === 1
            };
        },
        getCellClasses(column, row) {
            return {
                [`table-align-${column.align || 'left'}`]: true,
                'table-cell-number': column.type === 'number',
                'table-cell-date': column.type === 'date'
            };
        },
        getSortIconClass(columnKey) {
            if (this.sortBy !== columnKey) return '';
            return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
        },
    },
    watch: {
        searchTerm() {
            this.currentPage = 1;
        },
        activeFilters: {
            handler() {
                this.currentPage = 1;
            },
            deep: true,
        },
    },
};

// Component: Tabs
const TabsComponent = {
    name: "Tabs",
    template: "\n        <div :class=\"tabsClasses\">\n            <div class=\"tabs-header\" role=\"tablist\">\n                <button\n                    v-for=\"(tab, index) in tabs\"\n                    :key=\"tab.name\"\n                    :class=\"getTabClasses(tab, index)\"\n                    :disabled=\"tab.disabled\"\n                    @click=\"selectTab(tab, index)\"\n                    role=\"tab\"\n                    :aria-selected=\"activeTab === tab.name\"\n                    :aria-controls=\"'tab-panel-' + tab.name\"\n                >\n                    <span v-if=\"tab.icon\" :class=\"['tab-icon', tab.icon]\"></span>\n                    <span class=\"tab-label\">{{ tab.label }}</span>\n                    <span v-if=\"tab.badge\" class=\"tab-badge\">{{ tab.badge }}</span>\n                    <button\n                        v-if=\"tab.closable && closable\"\n                        class=\"tab-close\"\n                        @click.stop=\"closeTab(tab, index)\"\n                        :aria-label=\"'Close ' + tab.label\"\n                    >\n                        ×\n                    </button>\n                </button>\n                \n                <div v-if=\"addable\" class=\"tab-add\">\n                    <button class=\"tab-add-button\" @click=\"addTab\" aria-label=\"Add new tab\">\n                        +\n                    </button>\n                </div>\n            </div>\n            \n            <div class=\"tabs-content\">\n                <div\n                    v-for=\"(tab, index) in tabs\"\n                    :key=\"tab.name\"\n                    v-show=\"activeTab === tab.name\"\n                    :class=\"getTabPanelClasses(tab)\"\n                    role=\"tabpanel\"\n                    :id=\"'tab-panel-' + tab.name\"\n                    :aria-labelledby=\"'tab-' + tab.name\"\n                >\n                    <component \n                        v-if=\"tab.component\" \n                        :is=\"tab.component\" \n                        v-bind=\"tab.props || {}\"\n                        @update=\"(data) => updateTabData(tab, data)\"\n                    />\n                    <div v-else-if=\"tab.content\" v-html=\"tab.content\"></div>\n                    <slot v-else :name=\"tab.name\" :tab=\"tab\" :index=\"index\"></slot>\n                </div>\n            </div>\n        </div>\n    ",
    emits: ["update:modelValue","tab-change","tab-close","tab-add","tab-update"],
    props: {
        modelValue: {
            type: String,
            default: "",
        },
        tabs: {
            type: Array,
            required: true,
            validator: (tabs) => {
                return tabs.every(tab => 
                    tab.name && tab.label && 
                    typeof tab.name === 'string' && 
                    typeof tab.label === 'string'
                );
            },
        },
        variant: {
            type: String,
            default: "default",
            validator: (value) => ['default', 'pills', 'underline', 'card'].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        closable: {
            type: Boolean,
            default: false,
        },
        addable: {
            type: Boolean,
            default: false,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
        animated: {
            type: Boolean,
            default: true,
        },
    },
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
        tabs: {
            handler(newTabs) {
                // 활성 탭이 더 이상 존재하지 않는 경우 첫 번째 탭으로 이동
                if (!newTabs.find(tab => tab.name === this.activeTab) && newTabs.length > 0) {
                    this.selectTab(newTabs[0], 0);
                }
            },
            deep: true,
        },
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
    emits: ["close"],
    props: {
        position: {
            type: String,
            default: "top-right",
            validator: (value) => [
                'top-left', 'top-right', 'top-center',
                'bottom-left', 'bottom-right', 'bottom-center'
            ].includes(value),
        },
        maxToasts: {
            type: Number,
            default: 5,
        },
    },
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

// Component: Tooltip
const TooltipComponent = {
    name: "Tooltip",
    template: "\n        <div class=\"tooltip-wrapper\" @mouseenter=\"show\" @mouseleave=\"hide\" @focus=\"show\" @blur=\"hide\">\n            <slot></slot>\n            \n            <teleport to=\"body\">\n                <transition name=\"tooltip\" @after-leave=\"resetPosition\">\n                    <div\n                        v-if=\"visible\"\n                        ref=\"tooltip\"\n                        :class=\"tooltipClasses\"\n                        :style=\"tooltipStyle\"\n                        role=\"tooltip\"\n                        :aria-hidden=\"!visible\"\n                    >\n                        <div class=\"tooltip-content\">\n                            <div v-if=\"title\" class=\"tooltip-title\">{{ title }}</div>\n                            <div class=\"tooltip-text\">\n                                <slot name=\"content\">\n                                    {{ content }}\n                                </slot>\n                            </div>\n                        </div>\n                        <div class=\"tooltip-arrow\" :class=\"arrowClasses\"></div>\n                    </div>\n                </transition>\n            </teleport>\n        </div>\n    ",
    emits: ["show","hide"],
    props: {
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        placement: {
            type: String,
            default: "top",
            validator: (value) => [
                'top', 'top-start', 'top-end',
                'bottom', 'bottom-start', 'bottom-end',
                'left', 'left-start', 'left-end',
                'right', 'right-start', 'right-end'
            ].includes(value),
        },
        trigger: {
            type: String,
            default: "hover",
            validator: (value) => ['hover', 'click', 'focus', 'manual'].includes(value),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        delay: {
            type: [Number, Object],
            default: 0,
        },
        offset: {
            type: [Number, Array],
            default: 8,
        },
        variant: {
            type: String,
            default: "dark",
            validator: (value) => ['dark', 'light', 'primary', 'success', 'warning', 'danger'].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ['small', 'medium', 'large'].includes(value),
        },
        maxWidth: {
            type: [String, Number],
            default: "300px",
        },
        zIndex: {
            type: Number,
            default: 9999,
        },
    },
    data() {
        return {
            visible: false,
            position: {
                top: 0,
                left: 0
            },
            actualPlacement: this.placement,
            showTimer: null,
            hideTimer: null
        };
    },
    computed: {
        tooltipClasses() {
            return [
                'tooltip',
                `tooltip-${this.variant}`,
                `tooltip-${this.size}`,
                `tooltip-${this.actualPlacement}`
            ];
        },
        arrowClasses() {
            return [
                'tooltip-arrow',
                `tooltip-arrow-${this.actualPlacement.split('-')[0]}`
            ];
        },
        tooltipStyle() {
            const maxWidth = typeof this.maxWidth === 'number' ? `${this.maxWidth}px` : this.maxWidth;
            return {
                top: `${this.position.top}px`,
                left: `${this.position.left}px`,
                maxWidth,
                zIndex: this.zIndex
            };
        },
        showDelay() {
            if (typeof this.delay === 'number') {
                return this.delay;
            }
            return this.delay.show || 0;
        },
        hideDelay() {
            if (typeof this.delay === 'number') {
                return this.delay;
            }
            return this.delay.hide || 0;
        },
    },
    methods: {
        show() {
            if (this.disabled || this.trigger === 'manual') return;
            
            this.clearTimers();
            
            if (this.showDelay > 0) {
                this.showTimer = setTimeout(() => {
                    this.doShow();
                }, this.showDelay);
            } else {
                this.doShow();
            }
        },
        hide() {
            if (this.disabled || this.trigger === 'manual') return;
            
            this.clearTimers();
            
            if (this.hideDelay > 0) {
                this.hideTimer = setTimeout(() => {
                    this.doHide();
                }, this.hideDelay);
            } else {
                this.doHide();
            }
        },
        doShow() {
            this.visible = true;
            this.$nextTick(() => {
                this.updatePosition();
            });
            this.$emit('show');
        },
        doHide() {
            this.visible = false;
            this.$emit('hide');
        },
        toggle() {
            if (this.visible) {
                this.hide();
            } else {
                this.show();
            }
        },
        updatePosition() {
            if (!this.$refs.tooltip || !this.$el) return;
            
            const trigger = this.$el;
            const tooltip = this.$refs.tooltip;
            
            const triggerRect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            const offset = Array.isArray(this.offset) ? this.offset : [this.offset, this.offset];
            const [offsetX, offsetY] = offset;
            
            let top = 0;
            let left = 0;
            let placement = this.placement;
            
            // 기본 위치 계산
            switch (placement.split('-')[0]) {
                case 'top':
                    top = triggerRect.top - tooltipRect.height - offsetY;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = triggerRect.bottom + offsetY;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.left - tooltipRect.width - offsetX;
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.right + offsetX;
                    break;
            }
            
            // start/end 정렬 조정
            if (placement.includes('-start')) {
                if (['top', 'bottom'].includes(placement.split('-')[0])) {
                    left = triggerRect.left;
                } else {
                    top = triggerRect.top;
                }
            } else if (placement.includes('-end')) {
                if (['top', 'bottom'].includes(placement.split('-')[0])) {
                    left = triggerRect.right - tooltipRect.width;
                } else {
                    top = triggerRect.bottom - tooltipRect.height;
                }
            }
            
            // 화면 경계 감지 및 자동 조정
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            // 화면을 벗어나는 경우 위치 조정
            if (left < 0) {
                left = 8;
            } else if (left + tooltipRect.width > viewport.width) {
                left = viewport.width - tooltipRect.width - 8;
            }
            
            if (top < 0) {
                top = 8;
            } else if (top + tooltipRect.height > viewport.height) {
                top = viewport.height - tooltipRect.height - 8;
            }
            
            this.position = { top, left };
            this.actualPlacement = placement;
        },
        clearTimers() {
            if (this.showTimer) {
                clearTimeout(this.showTimer);
                this.showTimer = null;
            }
            if (this.hideTimer) {
                clearTimeout(this.hideTimer);
                this.hideTimer = null;
            }
        },
        resetPosition() {
            this.position = { top: 0, left: 0 };
        },
        handleClickOutside(event) {
            if (this.trigger === 'click' && !this.$el.contains(event.target)) {
                this.hide();
            }
        },
    },
    mounted() {
        if (this.trigger === 'click') {
            this.$el.addEventListener('click', this.toggle);
            document.addEventListener('click', this.handleClickOutside);
        }
    },
    unmounted() {
        this.clearTimers();
        if (this.trigger === 'click') {
            document.removeEventListener('click', this.handleClickOutside);
        }
    },
};

// 글로벌 컴포넌트 등록 함수
export function registerComponents(vueApp) {
    if (!vueApp || typeof vueApp.component !== "function") {
        console.warn("Invalid Vue app instance provided to registerComponents");
        return;
    }

    vueApp.component('Accordion', AccordionComponent);
    vueApp.component('Alert', AlertComponent);
    vueApp.component('Badge', BadgeComponent);
    vueApp.component('Breadcrumb', BreadcrumbComponent);
    vueApp.component('Button', ButtonComponent);
    vueApp.component('Card', CardComponent);
    vueApp.component('Checkbox', CheckboxComponent);
    vueApp.component('DatePicker', DatePickerComponent);
    vueApp.component('FileUpload', FileUploadComponent);
    vueApp.component('Input', InputComponent);
    vueApp.component('LanguageSwitcher', LanguageSwitcherComponent);
    vueApp.component('Loading', LoadingComponent);
    vueApp.component('Modal', ModalComponent);
    vueApp.component('Pagination', PaginationComponent);
    vueApp.component('Progress', ProgressComponent);
    vueApp.component('Radio', RadioComponent);
    vueApp.component('Select', SelectComponent);
    vueApp.component('Sidebar', SidebarComponent);
    vueApp.component('Table', TableComponent);
    vueApp.component('Tabs', TabsComponent);
    vueApp.component('Toast', ToastComponent);
    vueApp.component('Tooltip', TooltipComponent);

    console.log("📦 ViewLogic 컴포넌트 시스템 등록 완료:", [
        "Accordion", "Alert", "Badge", "Breadcrumb", "Button", "Card", "Checkbox", "DatePicker", "FileUpload", "Input", "LanguageSwitcher", "Loading", "Modal", "Pagination", "Progress", "Radio", "Select", "Sidebar", "Table", "Tabs", "Toast", "Tooltip"
    ]);
}

// 컴포넌트 맵
export const components = {
    Accordion: AccordionComponent,
    Alert: AlertComponent,
    Badge: BadgeComponent,
    Breadcrumb: BreadcrumbComponent,
    Button: ButtonComponent,
    Card: CardComponent,
    Checkbox: CheckboxComponent,
    DatePicker: DatePickerComponent,
    FileUpload: FileUploadComponent,
    Input: InputComponent,
    LanguageSwitcher: LanguageSwitcherComponent,
    Loading: LoadingComponent,
    Modal: ModalComponent,
    Pagination: PaginationComponent,
    Progress: ProgressComponent,
    Radio: RadioComponent,
    Select: SelectComponent,
    Sidebar: SidebarComponent,
    Table: TableComponent,
    Tabs: TabsComponent,
    Toast: ToastComponent,
    Tooltip: TooltipComponent,
};

export default {
    registerComponents,
    components
};