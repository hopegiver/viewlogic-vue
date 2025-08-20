/**
 * 로그인 페이지 로직
 * 사용자 인증 및 로그인 처리
 */

export default {
    name: 'Login',
    layout: null,

    data() {
        return {
            // 폼 데이터
            form: {
                email: '',
                password: '',
                remember: false
            },
            
            // 폼 검증 에러
            errors: {
                email: '',
                password: ''
            },
            
            // 로딩 상태
            isLoading: false,
            socialLoading: {
                google: false,
                kakao: false
            },
            
            // 에러 상태
            loginError: '',
            
            // 설정
            socialLoginEnabled: true,
            minPasswordLength: 6,
            
            // 리다이렉트 정보
            redirectRoute: null
        };
    },
    
    computed: {
        /**
         * 폼 유효성 검증
         */
        isFormValid() {
            return this.form.email && 
                   this.form.password && 
                   this.form.password.length >= this.minPasswordLength &&
                   !this.errors.email && 
                   !this.errors.password;
        },
        
        /**
         * 이메일 유효성 검증
         */
        isValidEmail() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(this.form.email);
        }
    },
    
    methods: {
        /**
         * 로그인 처리
         */
        async handleLogin() {
            if (!this.validateForm()) {
                return;
            }
            
            this.isLoading = true;
            this.clearError();
            
            try {
                // API 호출 시뮬레이션 (실제 구현 시 교체)
                const response = await this.simulateLoginAPI({
                    email: this.form.email,
                    password: this.form.password,
                    remember: this.form.remember
                });
                
                if (response.success) {
                    // 로그인 성공
                    this.handleLoginSuccess(response.data);
                } else {
                    // 로그인 실패
                    this.loginError = response.message || 
                        (this.$t ? this.$t('login.invalid_credentials') : '이메일 또는 비밀번호가 올바르지 않습니다.');
                }
                
            } catch (error) {
                console.error('Login error:', error);
                this.loginError = this.$t ? 
                    this.$t('login.network_error') : 
                    '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
            } finally {
                this.isLoading = false;
            }
        },
        
        /**
         * 소셜 로그인 처리
         */
        async handleSocialLogin(provider) {
            this.socialLoading[provider] = true;
            this.clearError();
            
            try {
                // 소셜 로그인 API 호출 시뮬레이션
                const response = await this.simulateSocialLoginAPI(provider);
                
                if (response.success) {
                    this.handleLoginSuccess(response.data);
                } else {
                    this.loginError = response.message || 
                        (this.$t ? this.$t('login.social_login_failed') : '소셜 로그인에 실패했습니다.');
                }
                
            } catch (error) {
                console.error(`${provider} login error:`, error);
                this.loginError = this.$t ? 
                    this.$t('login.social_login_error') : 
                    '소셜 로그인 중 오류가 발생했습니다.';
            } finally {
                this.socialLoading[provider] = false;
            }
        },
        
        /**
         * 로그인 성공 처리
         */
        handleLoginSuccess(userData) {
            // 토큰 저장
            if (userData.token) {
                if (this.form.remember) {
                    localStorage.setItem('authToken', userData.token);
                    localStorage.setItem('userData', JSON.stringify(userData.user));
                } else {
                    sessionStorage.setItem('authToken', userData.token);
                    sessionStorage.setItem('userData', JSON.stringify(userData.user));
                }
            }
            
            // 성공 알림
            if (this.$refs.toast) {
                this.$refs.toast.success(
                    this.$t ? this.$t('login.welcome_back', { name: userData.user?.name || '사용자' }) : 
                    `환영합니다, ${userData.user?.name || '사용자'}님!`,
                    {
                        title: this.$t ? this.$t('login.login_success') : '로그인 성공',
                        duration: 3000
                    }
                );
            }
            
            // 페이지 리다이렉트
            setTimeout(() => {
                const targetRoute = this.redirectRoute || 
                                 this.getQueryParam('redirect') || 
                                 'home';
                this.navigateTo(targetRoute);
            }, 1000);
        },
        
        /**
         * 폼 유효성 검증
         */
        validateForm() {
            let isValid = true;
            
            // 이메일 검증
            if (!this.form.email) {
                this.errors.email = this.$t ? this.$t('login.email_required') : '이메일을 입력하세요.';
                isValid = false;
            } else if (!this.isValidEmail) {
                this.errors.email = this.$t ? this.$t('login.email_invalid') : '올바른 이메일 주소를 입력하세요.';
                isValid = false;
            } else {
                this.errors.email = '';
            }
            
            // 비밀번호 검증
            if (!this.form.password) {
                this.errors.password = this.$t ? this.$t('login.password_required') : '비밀번호를 입력하세요.';
                isValid = false;
            } else if (this.form.password.length < this.minPasswordLength) {
                this.errors.password = this.$t ? 
                    this.$t('login.password_min_length', { length: this.minPasswordLength }) : 
                    `비밀번호는 ${this.minPasswordLength}자 이상이어야 합니다.`;
                isValid = false;
            } else {
                this.errors.password = '';
            }
            
            return isValid;
        },
        
        /**
         * 실시간 폼 검증
         */
        validateField(field) {
            switch (field) {
                case 'email':
                    if (this.form.email && !this.isValidEmail) {
                        this.errors.email = this.$t ? this.$t('login.email_invalid') : '올바른 이메일 주소를 입력하세요.';
                    } else {
                        this.errors.email = '';
                    }
                    break;
                    
                case 'password':
                    if (this.form.password && this.form.password.length < this.minPasswordLength) {
                        this.errors.password = this.$t ? 
                            this.$t('login.password_min_length', { length: this.minPasswordLength }) : 
                            `비밀번호는 ${this.minPasswordLength}자 이상이어야 합니다.`;
                    } else {
                        this.errors.password = '';
                    }
                    break;
            }
        },
        
        /**
         * 에러 메시지 초기화
         */
        clearError() {
            this.loginError = '';
        },
        
        /**
         * 로그인 API 시뮬레이션 (실제 구현 시 교체)
         */
        async simulateLoginAPI(credentials) {
            // 실제 API 호출로 교체 필요
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 데모용 로그인 검증
                    if (credentials.email === 'demo@viewlogic.com' && credentials.password === 'demo123') {
                        resolve({
                            success: true,
                            data: {
                                token: 'demo-jwt-token-' + Date.now(),
                                user: {
                                    id: 1,
                                    name: '데모 사용자',
                                    email: credentials.email,
                                    avatar: null
                                }
                            }
                        });
                    } else {
                        resolve({
                            success: false,
                            message: this.$t ? this.$t('login.invalid_credentials') : '이메일 또는 비밀번호가 올바르지 않습니다.'
                        });
                    }
                }, 1500); // 네트워크 지연 시뮬레이션
            });
        },
        
        /**
         * 소셜 로그인 API 시뮬레이션
         */
        async simulateSocialLoginAPI(provider) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 소셜 로그인 성공 시뮬레이션
                    resolve({
                        success: true,
                        data: {
                            token: `${provider}-jwt-token-` + Date.now(),
                            user: {
                                id: 2,
                                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} 사용자`,
                                email: `user@${provider}.com`,
                                avatar: null
                            }
                        }
                    });
                }, 2000);
            });
        },
        
        /**
         * 쿼리 파라미터 가져오기
         */
        getQueryParam(key) {
            return this.$router?.getQueryParam(key);
        },
        
        /**
         * 페이지 이동
         */
        navigateTo(route) {
            this.$router?.navigateTo(route);
        }
    },
    
    watch: {
        // 실시간 폼 검증
        'form.email'() {
            if (this.form.email) {
                this.validateField('email');
            }
        },
        
        'form.password'() {
            if (this.form.password) {
                this.validateField('password');
            }
        }
    },
    
    mounted() {
        // // 리다이렉트 정보 확인
        // this.redirectRoute = this.getQueryParam('redirect');
        
        // // 이미 로그인된 경우 리다이렉트
        // const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        // if (token) {
        //     this.navigateTo(this.redirectRoute || 'home');
        //     return;
        // }
        
        // // 데모 계정 정보 표시 (개발용)
        // if (process.env.NODE_ENV === 'development') {
        //     setTimeout(() => {
        //         if (this.$refs.toast) {
        //             this.$refs.toast.info(
        //                 '데모 계정: demo@viewlogic.com / demo123',
        //                 {
        //                     title: '개발 모드',
        //                     duration: 5000
        //                 }
        //             );
        //         }
        //     }, 1000);
        // }
        
        // // 포커스를 이메일 입력 필드로 이동
        // setTimeout(() => {
        //     const emailInput = document.querySelector('input[type="email"]');
        //     if (emailInput) {
        //         emailInput.focus();
        //     }
        // }, 100);
    }
};