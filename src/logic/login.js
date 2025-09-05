export default {
    name: 'Login',
    layout: null,
    
    data() {
        return {
            form: {
                email: '',
                password: '',
                remember: false
            },
            errors: {},
            isLoading: false,
            loginError: ''
        };
    },
    
    computed: {
        isFormValid() {
            return this.form.email && this.form.password.length >= 6;
        }
    },
    
    methods: {
        async handleLogin() {
            if (!this.isFormValid) return;
            
            this.isLoading = true;
            
            // 간단한 데모 로그인 (실제 API 호출로 교체)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (this.form.email === 'demo@viewlogic.com' && this.form.password === 'demo123') {
                localStorage.setItem('authToken', 'demo-token-' + Date.now());
                this.$router?.navigateTo('home');
            } else {
                this.loginError = '이메일 또는 비밀번호가 올바르지 않습니다.';
            }
            
            this.isLoading = false;
        },
        
        goToSignup() {
            this.$router?.navigateTo('signup');
        },
        
        goToHome() {
            this.$router?.navigateTo('home');
        }
    }
};