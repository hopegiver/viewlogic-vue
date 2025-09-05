export default {
    name: 'Signup',
    layout: null,
    
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                agree: false
            },
            errors: {},
            isLoading: false
        };
    },
    
    computed: {
        isFormValid() {
            return this.form.name && 
                   this.form.email && 
                   this.form.password.length >= 6 &&
                   this.form.password === this.form.confirmPassword &&
                   this.form.agree;
        }
    },
    
    methods: {
        async handleSignup() {
            if (!this.isFormValid) return;
            
            this.isLoading = true;
            
            // 간단한 회원가입 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('회원가입이 완료되었습니다!');
            this.$router?.navigateTo('login');
            
            this.isLoading = false;
        },
        
        goToLogin() {
            this.$router?.navigateTo('login');
        }
    }
};