// Simple Toast implementation
const Toast = {
    show({ message, type = 'info', duration = 3000 }) {
        const toastDiv = document.createElement('div');
        toastDiv.textContent = message;
        toastDiv.style.cssText = `position:fixed;top:20px;right:20px;background:#333;color:white;padding:12px 20px;border-radius:4px;z-index:9999;`;
        if (type === 'success') toastDiv.style.background = '#28a745';
        if (type === 'error') toastDiv.style.background = '#dc3545';
        if (type === 'warning') toastDiv.style.background = '#ffc107';
        document.body.appendChild(toastDiv);
        setTimeout(() => {
            if (document.body.contains(toastDiv)) {
                document.body.removeChild(toastDiv);
            }
        }, duration);
    }
};

export default {
    data() {
        return {
            productId: null,
            product: {
                name: '',
                brand: '',
                price: 0,
                originalPrice: 0,
                rating: 0,
                reviewCount: 0,
                image: '',
                images: [],
                colors: null,
                sizes: null,
                features: [],
                description: '',
                specifications: {}
            },
            selectedImage: null,
            selectedColor: null,
            selectedSize: null,
            quantity: 1,
            inWishlist: false,
            activeTab: 'description',
            tabs: [
                { id: 'description', label: '상품 설명' },
                { id: 'specs', label: '상품 정보' },
                { id: 'reviews', label: '리뷰' },
                { id: 'shipping', label: '배송/교환' }
            ],
            reviews: [],
            relatedProducts: []
        };
    },

    mounted() {
        this.loadProductDetail();
        this.loadReviews();
        this.loadRelatedProducts();
    },

    methods: {
        loadProductDetail() {
            // URL 파라미터에서 상품 ID 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            this.productId = parseInt(urlParams.get('id'));

            // 샘플 상품 데이터 (실제로는 API 호출)
            const products = {
                1: {
                    id: 1,
                    name: '무선 블루투스 이어폰',
                    brand: 'TechSound Pro',
                    category: 'electronics',
                    price: 89000,
                    originalPrice: 129000,
                    discount: 31,
                    rating: 4.5,
                    reviewCount: 324,
                    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&crop=center',
                    images: [
                        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center'
                    ],
                    colors: ['#000000', '#FFFFFF', '#FF0000', '#0000FF'],
                    sizes: null,
                    freeShipping: true,
                    features: [
                        '최대 30시간 재생 가능',
                        '액티브 노이즈 캔슬링 (ANC)',
                        'IPX7 방수 등급',
                        '빠른 충전 지원 (10분 충전으로 3시간 재생)',
                        '블루투스 5.2 지원'
                    ],
                    description: `
                        <p>최고의 음질과 편안함을 제공하는 프리미엄 무선 이어폰입니다.</p>
                        <p>일상생활부터 운동까지, 모든 순간에 완벽한 사운드를 경험하세요.</p>
                        <h4>주요 특징</h4>
                        <ul>
                            <li>고음질 드라이버로 깨끗하고 풍부한 사운드</li>
                            <li>인체공학적 디자인으로 장시간 착용해도 편안함</li>
                            <li>터치 컨트롤로 간편한 조작</li>
                            <li>다중 기기 연결 지원</li>
                        </ul>
                    `,
                    specifications: {
                        '모델명': 'TSP-BT100',
                        '블루투스 버전': '5.2',
                        '배터리 수명': '이어폰 10시간, 케이스 포함 30시간',
                        '충전 시간': '약 1.5시간',
                        '무게': '이어폰 5g, 케이스 포함 45g',
                        '방수 등급': 'IPX7',
                        '주파수 응답': '20Hz - 20kHz',
                        '제조국': '대한민국'
                    }
                },
                2: {
                    id: 2,
                    name: '스마트워치 프로',
                    brand: 'FitTech',
                    category: 'electronics',
                    price: 299000,
                    originalPrice: 399000,
                    discount: 25,
                    rating: 4.8,
                    reviewCount: 562,
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
                    images: [
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&crop=center'
                    ],
                    colors: ['#000000', '#SILVER', '#GOLD'],
                    sizes: ['S', 'M', 'L'],
                    freeShipping: true,
                    features: [
                        'AMOLED 디스플레이',
                        '심박수 및 수면 모니터링',
                        'GPS 내장',
                        '5ATM 방수',
                        '7일 배터리 수명'
                    ],
                    description: '<p>건강과 일상을 스마트하게 관리하는 프리미엄 스마트워치</p>',
                    specifications: {
                        '디스플레이': '1.4인치 AMOLED',
                        '배터리': '7일',
                        '방수': '5ATM',
                        'GPS': '내장'
                    }
                }
            };

            this.product = products[this.productId] || products[1];
            
            // 위시리스트 상태 확인
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            this.inWishlist = wishlist.includes(this.productId);
        },

        loadReviews() {
            // 샘플 리뷰 데이터
            this.reviews = [
                {
                    id: 1,
                    name: '김**',
                    date: '2024-01-15',
                    rating: 5,
                    content: '음질이 정말 좋아요! 노이즈 캔슬링도 훌륭하고 배터리도 오래가서 만족합니다.'
                },
                {
                    id: 2,
                    name: '이**',
                    date: '2024-01-10',
                    rating: 4,
                    content: '전체적으로 만족스러운 제품입니다. 다만 귀가 작은 분들은 이어팁 교체가 필요할 수 있어요.'
                },
                {
                    id: 3,
                    name: '박**',
                    date: '2024-01-05',
                    rating: 5,
                    content: '가성비 최고! 이 가격에 이 정도 퀄리티면 정말 훌륭합니다.'
                }
            ];
        },

        loadRelatedProducts() {
            // 관련 상품 데이터
            this.relatedProducts = [
                {
                    id: 3,
                    name: '프리미엄 요가매트',
                    price: 35000,
                    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center'
                },
                {
                    id: 4,
                    name: '오가닉 코튼 티셔츠',
                    price: 29900,
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&crop=center'
                },
                {
                    id: 5,
                    name: '베스트셀러 소설 세트',
                    price: 45000,
                    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center'
                },
                {
                    id: 7,
                    name: '노이즈 캔슬링 헤드폰',
                    price: 259000,
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center'
                }
            ];
        },

        selectImage(image) {
            this.selectedImage = image;
        },

        increaseQuantity() {
            if (this.quantity < 99) {
                this.quantity++;
            }
        },

        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },

        buyNow() {
            // 옵션 체크
            if (this.product.colors && !this.selectedColor) {
                Toast.show({
                    message: '색상을 선택해주세요.',
                    type: 'warning',
                    duration: 2000
                });
                return;
            }

            if (this.product.sizes && !this.selectedSize) {
                Toast.show({
                    message: '사이즈를 선택해주세요.',
                    type: 'warning',
                    duration: 2000
                });
                return;
            }

            // 구매 프로세스 (실제로는 결제 페이지로 이동)
            Modal.show({
                title: '구매 확인',
                content: `
                    <p><strong>${this.product.name}</strong></p>
                    <p>수량: ${this.quantity}개</p>
                    <p>총 금액: ₩${this.formatPrice(this.product.price * this.quantity)}</p>
                    <p>구매하시겠습니까?</p>
                `,
                buttons: [
                    {
                        text: '구매하기',
                        class: 'btn btn-primary',
                        onClick: () => {
                            Modal.hide();
                            Toast.show({
                                message: '주문이 완료되었습니다.',
                                type: 'success',
                                duration: 3000
                            });
                        }
                    },
                    {
                        text: '취소',
                        class: 'btn btn-secondary',
                        onClick: () => Modal.hide()
                    }
                ]
            });
        },

        addToCart() {
            // 옵션 체크
            if (this.product.colors && !this.selectedColor) {
                Toast.show({
                    message: '색상을 선택해주세요.',
                    type: 'warning',
                    duration: 2000
                });
                return;
            }

            if (this.product.sizes && !this.selectedSize) {
                Toast.show({
                    message: '사이즈를 선택해주세요.',
                    type: 'warning',
                    duration: 2000
                });
                return;
            }

            // 장바구니에 추가
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const cartItem = {
                id: this.product.id,
                name: this.product.name,
                price: this.product.price,
                originalPrice: this.product.originalPrice,
                image: this.product.image,
                quantity: this.quantity,
                color: this.selectedColor,
                size: this.selectedSize,
                addedAt: new Date().toISOString()
            };

            // 같은 상품, 같은 옵션인지 확인
            const existingItemIndex = cart.findIndex(item => 
                item.id === cartItem.id && 
                item.color === cartItem.color && 
                item.size === cartItem.size
            );

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += this.quantity;
                cart[existingItemIndex].addedAt = new Date().toISOString(); // 최근 추가 시간 업데이트
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            // 쿠키에 장바구니 아이템 수 저장
            if (typeof updateCartItemCount === 'function') {
                updateCartItemCount();
            }

            // 장바구니 아이템 수 업데이트 이벤트 발생
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { 
                    itemCount: cart.reduce((total, item) => total + item.quantity, 0),
                    totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
                } 
            }));

            // 성공 메시지와 함께 장바구니 이동 옵션 제공
            let contentHtml = `
                <div style="text-align: center;">
                    <p><strong>${this.product.name}</strong></p>
                    <p>수량: ${this.quantity}개</p>`;
            
            if (this.selectedColor) {
                contentHtml += `<p>색상: ${this.selectedColor}</p>`;
            }
            
            if (this.selectedSize) {
                contentHtml += `<p>사이즈: ${this.selectedSize}</p>`;
            }
            
            contentHtml += `
                    <p style="margin-top: 1rem;">장바구니로 이동하시겠습니까?</p>
                </div>`;
            
            Modal.show({
                title: '장바구니에 추가되었습니다!',
                content: contentHtml,
                buttons: [
                    {
                        text: '장바구니 보기',
                        class: 'btn btn-primary',
                        onClick: () => {
                            Modal.hide();
                            window.router.navigateTo('cart');
                        }
                    },
                    {
                        text: '계속 쇼핑',
                        class: 'btn btn-secondary',
                        onClick: () => Modal.hide()
                    }
                ]
            });
        },

        toggleWishlist() {
            this.inWishlist = !this.inWishlist;
            
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            if (this.inWishlist) {
                wishlist.push(this.productId);
                Toast.show({
                    message: '위시리스트에 추가되었습니다.',
                    type: 'info',
                    duration: 2000
                });
            } else {
                const index = wishlist.indexOf(this.productId);
                if (index > -1) {
                    wishlist.splice(index, 1);
                }
                Toast.show({
                    message: '위시리스트에서 제거되었습니다.',
                    type: 'info',
                    duration: 2000
                });
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        },

        writeReview() {
            Modal.show({
                title: '리뷰 작성',
                content: `
                    <p>리뷰 작성 기능은 준비 중입니다.</p>
                    <p>빠른 시일 내에 제공하도록 하겠습니다.</p>
                `,
                buttons: [
                    {
                        text: '확인',
                        class: 'btn btn-primary',
                        onClick: () => Modal.hide()
                    }
                ]
            });
        },

        goToProduct(productId) {
            window.router.navigateTo(`product-detail?id=${productId}`);
        },

        navigateTo(route) {
            window.router.navigateTo(route);
        },

        formatPrice(price) {
            if (price == null || price === undefined) {
                return '0';
            }
            return price.toLocaleString('ko-KR');
        }
    }
};