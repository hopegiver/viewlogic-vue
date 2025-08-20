/**
 * 회원가입 페이지 로직
 * 사용자 회원가입 및 계정 생성 처리
 */

export default {
    name: 'Signup',
    layout: null,
    pageTitle: 'Sign Up - ViewLogic',
    showHeader: false, // 회원가입 페이지는 헤더 숨김
    
    data() {
        return {
            // 폼 데이터
            form: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                agreeTerms: false
            },
            
            // 폼 검증 에러
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                agreeTerms: ''
            },
            
            // 로딩 상태
            isLoading: false,
            socialLoading: {
                google: false,
                kakao: false
            },
            
            // 에러 상태
            signupError: '',
            
            // 설정
            socialSignupEnabled: true,
            minPasswordLength: 8,
            
            // 리다이렉트 정보
            redirectRoute: null
        };
    },
    
    computed: {
        /**
         * 폼 유효성 검증
         */
        isFormValid() {
            return this.form.firstName && 
                   this.form.lastName &&
                   this.form.email && 
                   this.form.password && 
                   this.form.confirmPassword &&
                   this.form.password.length >= this.minPasswordLength &&
                   this.form.password === this.form.confirmPassword &&
                   this.form.agreeTerms &&
                   !this.errors.firstName &&
                   !this.errors.lastName &&
                   !this.errors.email && 
                   !this.errors.password &&
                   !this.errors.confirmPassword;
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
         * 회원가입 처리
         */
        async handleSignup() {
            if (!this.validateForm()) {
                return;
            }
            
            this.isLoading = true;
            this.clearError();
            
            try {
                // API 호출 시뮬레이션 (실제 구현 시 교체)
                const response = await this.simulateSignupAPI({
                    firstName: this.form.firstName,
                    lastName: this.form.lastName,
                    email: this.form.email,
                    password: this.form.password
                });
                
                if (response.success) {
                    // 회원가입 성공
                    this.handleSignupSuccess(response.data);
                } else {
                    // 회원가입 실패
                    this.signupError = response.message || 
                        (this.$t ? this.$t('signup.signup_failed') : '회원가입에 실패했습니다.');
                }
                
            } catch (error) {
                console.error('Signup error:', error);
                this.signupError = this.$t ? 
                    this.$t('signup.network_error') : 
                    '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
            } finally {
                this.isLoading = false;
            }
        },
        
        /**
         * 소셜 회원가입 처리
         */
        async handleSocialSignup(provider) {
            this.socialLoading[provider] = true;
            this.clearError();
            
            try {
                // 소셜 회원가입 API 호출 시뮬레이션
                const response = await this.simulateSocialSignupAPI(provider);
                
                if (response.success) {
                    this.handleSignupSuccess(response.data);
                } else {
                    this.signupError = response.message || 
                        (this.$t ? this.$t('signup.social_signup_failed') : '소셜 회원가입에 실패했습니다.');
                }
                
            } catch (error) {
                console.error(`${provider} signup error:`, error);
                this.signupError = this.$t ? 
                    this.$t('signup.social_signup_error') : 
                    '소셜 회원가입 중 오류가 발생했습니다.';
            } finally {
                this.socialLoading[provider] = false;
            }
        },
        
        /**
         * 회원가입 성공 처리
         */
        handleSignupSuccess(userData) {
            // 토큰 저장
            if (userData.token) {
                localStorage.setItem('authToken', userData.token);
                localStorage.setItem('userData', JSON.stringify(userData.user));
            }
            
            // 성공 알림
            if (this.$refs.toast) {
                this.$refs.toast.success(
                    this.$t ? this.$t('signup.welcome_message', { name: userData.user?.firstName || '사용자' }) : 
                    `환영합니다, ${userData.user?.firstName || '사용자'}님!`,
                    {
                        title: this.$t ? this.$t('signup.signup_success') : '회원가입 성공',
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
            
            // 이름 검증
            if (!this.form.firstName) {
                this.errors.firstName = this.$t ? this.$t('signup.first_name_required') : '이름을 입력하세요.';
                isValid = false;
            } else {
                this.errors.firstName = '';
            }
            
            if (!this.form.lastName) {
                this.errors.lastName = this.$t ? this.$t('signup.last_name_required') : '성을 입력하세요.';
                isValid = false;
            } else {
                this.errors.lastName = '';
            }
            
            // 이메일 검증
            if (!this.form.email) {
                this.errors.email = this.$t ? this.$t('signup.email_required') : '이메일을 입력하세요.';
                isValid = false;
            } else if (!this.isValidEmail) {
                this.errors.email = this.$t ? this.$t('signup.email_invalid') : '올바른 이메일 주소를 입력하세요.';
                isValid = false;
            } else {
                this.errors.email = '';
            }
            
            // 비밀번호 검증
            if (!this.form.password) {
                this.errors.password = this.$t ? this.$t('signup.password_required') : '비밀번호를 입력하세요.';
                isValid = false;
            } else if (this.form.password.length < this.minPasswordLength) {
                this.errors.password = this.$t ? 
                    this.$t('signup.password_min_length', { length: this.minPasswordLength }) : 
                    `비밀번호는 ${this.minPasswordLength}자 이상이어야 합니다.`;
                isValid = false;
            } else {
                this.errors.password = '';
            }
            
            // 비밀번호 확인 검증
            if (!this.form.confirmPassword) {
                this.errors.confirmPassword = this.$t ? this.$t('signup.confirm_password_required') : '비밀번호 확인을 입력하세요.';
                isValid = false;
            } else if (this.form.password !== this.form.confirmPassword) {
                this.errors.confirmPassword = this.$t ? this.$t('signup.password_mismatch') : '비밀번호가 일치하지 않습니다.';
                isValid = false;
            } else {
                this.errors.confirmPassword = '';
            }
            
            // 약관 동의 검증
            if (!this.form.agreeTerms) {
                this.errors.agreeTerms = this.$t ? this.$t('signup.terms_required') : '이용약관에 동의해주세요.';
                isValid = false;
            } else {
                this.errors.agreeTerms = '';
            }
            
            return isValid;
        },
        
        /**
         * 실시간 폼 검증
         */
        validateField(field) {
            switch (field) {
                case 'firstName':
                    if (this.form.firstName) {
                        this.errors.firstName = '';
                    }
                    break;
                    
                case 'lastName':
                    if (this.form.lastName) {
                        this.errors.lastName = '';
                    }
                    break;
                    
                case 'email':
                    if (this.form.email && !this.isValidEmail) {
                        this.errors.email = this.$t ? this.$t('signup.email_invalid') : '올바른 이메일 주소를 입력하세요.';
                    } else {
                        this.errors.email = '';
                    }
                    break;
                    
                case 'password':
                    if (this.form.password && this.form.password.length < this.minPasswordLength) {
                        this.errors.password = this.$t ? 
                            this.$t('signup.password_min_length', { length: this.minPasswordLength }) : 
                            `비밀번호는 ${this.minPasswordLength}자 이상이어야 합니다.`;
                    } else {
                        this.errors.password = '';
                    }
                    
                    // 비밀번호 확인도 다시 검증
                    if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
                        this.errors.confirmPassword = this.$t ? this.$t('signup.password_mismatch') : '비밀번호가 일치하지 않습니다.';
                    } else if (this.form.confirmPassword) {
                        this.errors.confirmPassword = '';
                    }
                    break;
                    
                case 'confirmPassword':
                    if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
                        this.errors.confirmPassword = this.$t ? this.$t('signup.password_mismatch') : '비밀번호가 일치하지 않습니다.';
                    } else {
                        this.errors.confirmPassword = '';
                    }
                    break;
            }
        },
        
        /**
         * 에러 메시지 초기화
         */
        clearError() {
            this.signupError = '';
        },
        
        /**
         * 회원가입 API 시뮬레이션 (실제 구현 시 교체)
         */
        async simulateSignupAPI(userData) {
            // 실제 API 호출로 교체 필요
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 이메일 중복 체크 시뮬레이션
                    if (userData.email === 'test@example.com') {
                        resolve({
                            success: false,
                            message: this.$t ? this.$t('signup.email_exists') : '이미 사용중인 이메일입니다.'
                        });
                    } else {
                        resolve({
                            success: true,
                            data: {
                                token: 'demo-jwt-token-' + Date.now(),
                                user: {
                                    id: Date.now(),
                                    firstName: userData.firstName,
                                    lastName: userData.lastName,
                                    email: userData.email,
                                    avatar: null
                                }
                            }
                        });
                    }
                }, 2000); // 네트워크 지연 시뮬레이션
            });
        },
        
        /**
         * 소셜 회원가입 API 시뮬레이션
         */
        async simulateSocialSignupAPI(provider) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 소셜 회원가입 성공 시뮬레이션
                    resolve({
                        success: true,
                        data: {
                            token: `${provider}-jwt-token-` + Date.now(),
                            user: {
                                id: Date.now(),
                                firstName: `${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
                                lastName: '사용자',
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
        'form.firstName'() {
            if (this.form.firstName) {
                this.validateField('firstName');
            }
        },
        
        'form.lastName'() {
            if (this.form.lastName) {
                this.validateField('lastName');
            }
        },
        
        'form.email'() {
            if (this.form.email) {
                this.validateField('email');
            }
        },
        
        'form.password'() {
            if (this.form.password) {
                this.validateField('password');
            }
        },
        
        'form.confirmPassword'() {
            if (this.form.confirmPassword) {
                this.validateField('confirmPassword');
            }
        }
    },
    
    mounted() {
        // // 회원가입 페이지에서는 body의 패딩을 제거
        // document.body.style.paddingTop = '0';
        // document.body.style.overflow = 'hidden';
        
        // // 리다이렉트 정보 확인
        // this.redirectRoute = this.getQueryParam('redirect');
        
        // // 이미 로그인된 경우 리다이렉트
        // const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        // if (token) {
        //     this.navigateTo(this.redirectRoute || 'home');
        //     return;
        // }
        
        // // 포커스를 첫 번째 입력 필드로 이동
        // setTimeout(() => {
        //     const firstNameInput = document.querySelector('input[name="firstName"]');
        //     if (firstNameInput) {
        //         firstNameInput.focus();
        //     }
        // }, 100);
    },

    unmounted() {
        // 회원가입 페이지를 떠날 때 body 스타일 복원
        document.body.style.paddingTop = '60px';
        document.body.style.overflow = '';
    }
};