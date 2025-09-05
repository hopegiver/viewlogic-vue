export default {
    name: 'Cart',
    
    data() {
        return {
            cartItems: [
                { id: 1, name: '무선 이어폰', price: 89000, quantity: 1 },
                { id: 2, name: '스마트워치', price: 299000, quantity: 1 }
            ]
        };
    },

    computed: {
        totalPrice() {
            return this.cartItems.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );
        },
        
        itemCount() {
            return this.cartItems.reduce((count, item) => 
                count + item.quantity, 0
            );
        }
    },

    methods: {
        updateQuantity(item, change) {
            item.quantity = Math.max(1, item.quantity + change);
        },
        
        removeItem(item) {
            const index = this.cartItems.findIndex(i => i.id === item.id);
            if (index > -1) {
                this.cartItems.splice(index, 1);
            }
        },
        
        formatPrice(price) {
            return price.toLocaleString('ko-KR') + '원';
        },
        
        checkout() {
            if (this.cartItems.length > 0) {
                alert('주문 페이지로 이동합니다.');
                // this.$router?.navigateTo('checkout');
            }
        },
        
        continueShopping() {
            this.$router?.navigateTo('products');
        }
    }
};