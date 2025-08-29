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
            cartItems: [],
            selectedItems: [],
            couponCode: '',
            appliedCoupon: null,
            showDeleteModal: false,
            itemToDelete: null,
            freeShippingThreshold: 50000, // 5만원 이상 무료배송
            recommendedProducts: []
        };
    },

    computed: {
        isAllSelected() {
            return this.cartItems.length > 0 && this.selectedItems.length === this.cartItems.length;
        },

        selectedSubtotal() {
            return this.cartItems
                .filter(item => this.selectedItems.includes(this.getItemKey(item)))
                .reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        selectedDiscount() {
            const originalTotal = this.cartItems
                .filter(item => this.selectedItems.includes(this.getItemKey(item)))
                .reduce((total, item) => {
                    const originalPrice = item.originalPrice || item.price;
                    return total + (originalPrice * item.quantity);
                }, 0);
            
            let discount = originalTotal - this.selectedSubtotal;
            
            // 쿠폰 할인 추가
            if (this.appliedCoupon) {
                if (this.appliedCoupon.type === 'percent') {
                    discount += this.selectedSubtotal * (this.appliedCoupon.value / 100);
                } else if (this.appliedCoupon.type === 'amount') {
                    discount += this.appliedCoupon.value;
                }
            }
            
            return discount;
        },

        shippingFee() {
            return this.selectedSubtotal >= this.freeShippingThreshold ? 0 : 3000;
        },

        selectedTotal() {
            return Math.max(0, this.selectedSubtotal - this.selectedDiscount + this.shippingFee);
        }
    },

    mounted() {
        this.loadCartItems();
        this.loadRecommendedProducts();
        
        // 장바구니 개수를 쿠키에 업데이트
        this.updateCartStorage();
        
        // 장바구니 업데이트 이벤트 리스너
        window.addEventListener('cartUpdated', this.handleCartUpdate);
    },

    unmounted() {
        window.removeEventListener('cartUpdated', this.handleCartUpdate);
    },

    methods: {
        loadCartItems() {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // 장바구니가 비어있을 때 샘플 데이터 추가
            if (storedCart.length === 0) {
                this.cartItems = [
                    {
                        id: 1,
                        name: '프리미엄 무선 이어폰',
                        price: 159000,
                        originalPrice: 199000,
                        quantity: 1,
                        color: '화이트',
                        size: null,
                        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop&crop=center'
                    },
                    {
                        id: 2,
                        name: '스마트워치 Pro',
                        price: 299000,
                        originalPrice: 349000,
                        quantity: 2,
                        color: '블랙',
                        size: '42mm',
                        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center'
                    },
                    {
                        id: 3,
                        name: '노트북 스탠드',
                        price: 89000,
                        originalPrice: null,
                        quantity: 1,
                        color: '실버',
                        size: null,
                        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop&crop=center'
                    }
                ];
                // 샘플 데이터를 로컬 스토리지에 저장
                localStorage.setItem('cart', JSON.stringify(this.cartItems));
                
                // 쿠키에 장바구니 아이템 수 저장
                if (typeof updateCartItemCount === 'function') {
                    updateCartItemCount();
                }
            } else {
                this.cartItems = storedCart;
            }
            
            // 모든 아이템을 기본적으로 선택
            this.selectedItems = this.cartItems.map(item => this.getItemKey(item));
        },

        loadRecommendedProducts() {
            // 추천 상품 데이터 (실제로는 API 호출)
            this.recommendedProducts = [
                {
                    id: 8,
                    name: '무선 충전 패드',
                    price: 39000,
                    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop&crop=center'
                },
                {
                    id: 9,
                    name: '스마트폰 케이스',
                    price: 25000,
                    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=150&h=150&fit=crop&crop=center'
                },
                {
                    id: 10,
                    name: '블루투스 스피커',
                    price: 89000,
                    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop&crop=center'
                }
            ];
        },

        getItemKey(item) {
            return item.id + '-' + (item.color || 'none') + '-' + (item.size || 'none');
        },

        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedItems = [];
            } else {
                this.selectedItems = this.cartItems.map(item => this.getItemKey(item));
            }
        },

        toggleItemSelect(itemKey) {
            const index = this.selectedItems.indexOf(itemKey);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            } else {
                this.selectedItems.push(itemKey);
            }
        },

        increaseQuantity(item) {
            if (item.quantity < 99) {
                item.quantity++;
                this.updateCartStorage();
            }
        },

        decreaseQuantity(item) {
            if (item.quantity > 1) {
                item.quantity--;
                this.updateCartStorage();
            }
        },

        updateQuantity(item, newQuantity) {
            const quantity = parseInt(newQuantity);
            if (quantity >= 1 && quantity <= 99) {
                item.quantity = quantity;
                this.updateCartStorage();
            }
        },

        updateCartStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
            
            // 쿠키에 장바구니 아이템 수 저장
            const totalItems = this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
            document.cookie = 'cartItemCount=' + totalItems + '; path=/; max-age=31536000';
            
            this.dispatchCartUpdateEvent();
        },

        removeItem(itemKey) {
            this.itemToDelete = itemKey;
            this.showDeleteModal = true;
        },

        removeSelectedItems() {
            if (this.selectedItems.length === 0) return;

            if (confirm('선택한 ' + this.selectedItems.length + '개의 상품을 장바구니에서 삭제하시겠습니까?')) {
                this.cartItems = this.cartItems.filter(item => 
                    !this.selectedItems.includes(this.getItemKey(item))
                );
                this.selectedItems = [];
                this.updateCartStorage();
                
                if (this.$refs.toast) {
                    this.$refs.toast.show({
                        message: '선택한 상품이 삭제되었습니다.',
                        type: 'success'
                    });
                }
            }
        },

        confirmDelete() {
            if (this.itemToDelete) {
                this.cartItems = this.cartItems.filter(item => 
                    this.getItemKey(item) !== this.itemToDelete
                );
                
                // 선택 목록에서도 제거
                const selectedIndex = this.selectedItems.indexOf(this.itemToDelete);
                if (selectedIndex > -1) {
                    this.selectedItems.splice(selectedIndex, 1);
                }
                
                this.updateCartStorage();
                Toast.show({
                    message: '상품이 장바구니에서 삭제되었습니다.',
                    type: 'success'
                });
            }
            this.cancelDelete();
        },

        cancelDelete() {
            this.showDeleteModal = false;
            this.itemToDelete = null;
        },

        applyCoupon() {
            if (!this.couponCode.trim()) {
                Toast.show({
                    message: '쿠폰 코드를 입력해주세요.',
                    type: 'warning'
                });
                return;
            }

            // 샘플 쿠폰 데이터
            const coupons = {
                'WELCOME10': { type: 'percent', value: 10, name: '신규 회원 10% 할인' },
                'SAVE5000': { type: 'amount', value: 5000, name: '5천원 할인' },
                'FREESHIP': { type: 'shipping', value: 0, name: '무료배송 쿠폰' }
            };

            const coupon = coupons[this.couponCode.toUpperCase()];
            
            if (coupon) {
                this.appliedCoupon = coupon;
                Toast.show({
                    message: coupon.name + ' 쿠폰이 적용되었습니다.',
                    type: 'success'
                });
            } else {
                Toast.show({
                    message: '유효하지 않은 쿠폰 코드입니다.',
                    type: 'error'
                });
            }
        },

        proceedToCheckout() {
            if (this.selectedItems.length === 0) {
                Toast.show({
                    message: '주문할 상품을 선택해주세요.',
                    type: 'warning'
                });
                return;
            }

            const selectedProducts = this.cartItems.filter(item => 
                this.selectedItems.includes(this.getItemKey(item))
            );

            const productItems = selectedProducts.map(item => 
                '<div class="checkout-item">' +
                    '<span>' + item.name + (item.color ? ' (' + item.color + ')' : '') + (item.size ? ' (' + item.size + ')' : '') + '</span>' +
                    '<span>' + item.quantity + '개</span>' +
                    '<span>₩' + this.formatPrice(item.price * item.quantity) + '</span>' +
                '</div>'
            ).join('');

            Modal.show({
                title: '주문 확인',
                content: '<div class="checkout-summary">' +
                    '<h4>주문 상품 (' + selectedProducts.length + '개)</h4>' +
                    productItems +
                    '<div class="checkout-total">' +
                        '<strong>총 결제 금액: ₩' + this.formatPrice(this.selectedTotal) + '</strong>' +
                    '</div>' +
                    '<p style="margin-top: 1rem;">주문을 진행하시겠습니까?</p>' +
                '</div>',
                buttons: [
                    {
                        text: '결제하기',
                        class: 'btn btn-primary',
                        onClick: () => {
                            Modal.hide();
                            Toast.show({
                                message: '주문이 완료되었습니다!',
                                type: 'success',
                                duration: 3000
                            });
                            
                            // 주문된 상품들을 장바구니에서 제거
                            this.cartItems = this.cartItems.filter(item => 
                                !this.selectedItems.includes(this.getItemKey(item))
                            );
                            this.selectedItems = [];
                            this.updateCartStorage();
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

        goToProduct(productId) {
            window.router.navigateTo('product-detail?id=' + productId);
        },

        navigateTo(route) {
            window.router.navigateTo(route);
        },

        handleCartUpdate() {
            this.loadCartItems();
        },

        dispatchCartUpdateEvent() {
            const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            const totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { 
                    itemCount: totalItems,
                    totalAmount: totalAmount
                }
            }));
        },

        formatPrice(price) {
            if (price == null || price === undefined) {
                return '0';
            }
            return price.toLocaleString('ko-KR');
        }
    }
};