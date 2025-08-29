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
            products: [],
            filteredProducts: [],
            selectedCategory: 'all',
            sortBy: 'name',
            searchQuery: '',
            currentPage: 1,
            productsPerPage: 12,
            hasMore: true
        };
    },

    mounted() {
        this.initializeProducts();
        this.loadProducts();
    },

    methods: {
        initializeProducts() {
            // 샘플 상품 데이터 생성
            this.products = [
                {
                    id: 1,
                    name: '무선 블루투스 이어폰',
                    category: 'electronics',
                    price: 89000,
                    originalPrice: 129000,
                    discount: 31,
                    rating: 4.5,
                    reviewCount: 324,
                    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop&crop=center',
                    isNew: true,
                    isBest: true,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 2,
                    name: '스마트워치 프로',
                    category: 'electronics',
                    price: 299000,
                    originalPrice: 399000,
                    discount: 25,
                    rating: 4.8,
                    reviewCount: 562,
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: true,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 3,
                    name: '프리미엄 요가매트',
                    category: 'sports',
                    price: 35000,
                    originalPrice: null,
                    discount: 0,
                    rating: 4.3,
                    reviewCount: 128,
                    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop&crop=center',
                    isNew: true,
                    isBest: false,
                    freeShipping: false,
                    inWishlist: false
                },
                {
                    id: 4,
                    name: '오가닉 코튼 티셔츠',
                    category: 'clothing',
                    price: 29900,
                    originalPrice: 39900,
                    discount: 25,
                    rating: 4.6,
                    reviewCount: 89,
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: false,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 5,
                    name: '베스트셀러 소설 세트',
                    category: 'books',
                    price: 45000,
                    originalPrice: 60000,
                    discount: 25,
                    rating: 4.9,
                    reviewCount: 1024,
                    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: true,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 6,
                    name: '프리미엄 커피 원두',
                    category: 'food',
                    price: 18000,
                    originalPrice: null,
                    discount: 0,
                    rating: 4.7,
                    reviewCount: 456,
                    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&crop=center',
                    isNew: true,
                    isBest: false,
                    freeShipping: false,
                    inWishlist: false
                },
                {
                    id: 7,
                    name: '노이즈 캔슬링 헤드폰',
                    category: 'electronics',
                    price: 259000,
                    originalPrice: 359000,
                    discount: 28,
                    rating: 4.6,
                    reviewCount: 892,
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: true,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 8,
                    name: '운동화 에어맥스',
                    category: 'clothing',
                    price: 139000,
                    originalPrice: 189000,
                    discount: 26,
                    rating: 4.4,
                    reviewCount: 234,
                    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center',
                    isNew: true,
                    isBest: false,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 9,
                    name: '휴대용 블렌더',
                    category: 'electronics',
                    price: 49000,
                    originalPrice: null,
                    discount: 0,
                    rating: 4.2,
                    reviewCount: 167,
                    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: false,
                    freeShipping: false,
                    inWishlist: false
                },
                {
                    id: 10,
                    name: '유기농 꿀 세트',
                    category: 'food',
                    price: 32000,
                    originalPrice: 42000,
                    discount: 24,
                    rating: 4.8,
                    reviewCount: 78,
                    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop&crop=center',
                    isNew: true,
                    isBest: false,
                    freeShipping: false,
                    inWishlist: false
                },
                {
                    id: 11,
                    name: '프로그래밍 입문서',
                    category: 'books',
                    price: 28000,
                    originalPrice: 35000,
                    discount: 20,
                    rating: 4.5,
                    reviewCount: 445,
                    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: true,
                    freeShipping: true,
                    inWishlist: false
                },
                {
                    id: 12,
                    name: '덤벨 세트 10kg',
                    category: 'sports',
                    price: 75000,
                    originalPrice: 95000,
                    discount: 21,
                    rating: 4.6,
                    reviewCount: 332,
                    image: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=300&h=300&fit=crop&crop=center',
                    isNew: false,
                    isBest: false,
                    freeShipping: true,
                    inWishlist: false
                }
            ];
        },

        loadProducts() {
            // 초기 상품 로드
            this.filteredProducts = [...this.products];
            this.filterProducts();
        },

        filterProducts() {
            let filtered = [...this.products];

            // 카테고리 필터
            if (this.selectedCategory !== 'all') {
                filtered = filtered.filter(p => p.category === this.selectedCategory);
            }

            // 검색 필터
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(query) ||
                    this.getCategoryName(p.category).toLowerCase().includes(query)
                );
            }

            this.filteredProducts = filtered;
            this.sortProducts();
        },

        sortProducts() {
            const sorted = [...this.filteredProducts];
            
            switch(this.sortBy) {
                case 'name':
                    sorted.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'price-asc':
                    sorted.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    sorted.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    sorted.sort((a, b) => b.rating - a.rating);
                    break;
            }
            
            this.filteredProducts = sorted;
        },

        searchProducts() {
            this.filterProducts();
        },

        getCategoryName(category) {
            const categories = {
                'electronics': '전자제품',
                'clothing': '의류',
                'books': '도서',
                'food': '식품',
                'sports': '스포츠'
            };
            return categories[category] || category;
        },

        formatPrice(price) {
            return price.toLocaleString('ko-KR');
        },

        goToProductDetail(productId) {
            // 상품 상세 페이지로 이동
            window.router.navigateTo(`product-detail?id=${productId}`);
        },

        addToCart(product) {
            // 장바구니에 추가
            Toast.show({
                message: `${product.name}이(가) 장바구니에 추가되었습니다.`,
                type: 'success',
                duration: 2000
            });
            
            // 실제로는 장바구니 상태 관리 로직 추가
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // 쿠키에 장바구니 아이템 수 저장
            if (typeof updateCartItemCount === 'function') {
                updateCartItemCount();
            }
        },

        toggleWishlist(product) {
            product.inWishlist = !product.inWishlist;
            
            if (product.inWishlist) {
                Toast.show({
                    message: '위시리스트에 추가되었습니다.',
                    type: 'info',
                    duration: 2000
                });
            } else {
                Toast.show({
                    message: '위시리스트에서 제거되었습니다.',
                    type: 'info',
                    duration: 2000
                });
            }
            
            // 실제로는 위시리스트 상태 관리 로직 추가
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            if (product.inWishlist) {
                wishlist.push(product.id);
            } else {
                const index = wishlist.indexOf(product.id);
                if (index > -1) {
                    wishlist.splice(index, 1);
                }
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        },

        loadMore() {
            // 더 많은 상품 로드 (실제로는 API 호출)
            Toast.show({
                message: '더 많은 상품을 불러오는 중...',
                type: 'info',
                duration: 1500
            });
            
            // 샘플: hasMore를 false로 설정
            setTimeout(() => {
                this.hasMore = false;
                Toast.show({
                    message: '모든 상품을 불러왔습니다.',
                    type: 'success',
                    duration: 2000
                });
            }, 1000);
        }
    }
};