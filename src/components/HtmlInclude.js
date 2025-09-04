export default {
    name: 'HtmlInclude',
    template: `
        <div class="html-include">
            <div v-if="loading">로딩 중...</div>
            <div v-else-if="error">{{ errorMessage }}</div>
            <div v-else v-html="content"></div>
        </div>
    `,
    
    props: {
        src: { type: String, required: true }
    },
    
    data: () => ({
        loading: false,
        error: false,
        errorMessage: '',
        content: ''
    }),
    
    async mounted() {
        await this.load();
    },
    
    watch: {
        src: 'load'
    },
    
    methods: {
        async load() {
            if (!this.src) return;
            
            try {
                this.loading = true;
                this.error = false;
                
                const response = await fetch(this.src);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                this.content = await response.text();
                
            } catch (error) {
                this.error = true;
                this.errorMessage = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
};