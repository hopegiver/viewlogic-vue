export default {
    name: 'Products',
    
    data() {
        return {
            products: [
                { id: 1, name: '무선 이어폰', category: 'electronics', price: 89000, rating: 4.5, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop' },
                { id: 2, name: '스마트워치', category: 'electronics', price: 299000, rating: 4.8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' },
                { id: 3, name: '요가매트', category: 'sports', price: 35000, rating: 4.3, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop' },
                { id: 4, name: '티셔츠', category: 'clothing', price: 29900, rating: 4.6, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop' },
                { id: 5, name: '베스트셀러 책', category: 'books', price: 45000, rating: 4.9, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop' },
                { id: 6, name: '커피 원두', category: 'food', price: 18000, rating: 4.7, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop' }
            ],
            selectedCategory: 'all',
            searchQuery: ''
        };
    },

    computed: {
        filteredProducts() {
            let result = this.products;
            
            // 카테고리 필터
            if (this.selectedCategory !== 'all') {
                result = result.filter(p => p.category === this.selectedCategory);
            }
            
            // 검색 필터
            if (this.searchQuery) {
                result = result.filter(p => 
                    p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            return result;
        },
        
        categories() {
            return ['all', 'electronics', 'sports', 'clothing', 'books', 'food'];
        }
    },

    methods: {
        formatPrice(price) {
            return price.toLocaleString('ko-KR') + '원';
        },
        
        viewProduct(product) {
            this.$router?.navigateTo('product-detail', { id: product.id });
        },
        
        addToCart(product) {
            console.log('장바구니에 추가:', product.name);
            alert(product.name + '을(를) 장바구니에 추가했습니다.');
        }
    }
};