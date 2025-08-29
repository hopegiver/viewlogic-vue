export default {
    name: 'Contact',
    layout: 'default',
    data() {
        return {
            contactInfo: [
                {
                    icon: '📧',
                    title: 'Email',
                    value: 'contact@example.com'
                },
                {
                    icon: '📞',
                    title: 'Phone',
                    value: '+82-10-1234-5678'
                },
                {
                    icon: '📍',
                    title: 'Address',
                    value: '서울특별시 강남구'
                },
                {
                    icon: '🌐',
                    title: 'Website',
                    value: 'www.example.com'
                }
            ],
            form: {
                name: '',
                email: '',
                subject: '',
                message: ''
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            const formElement = document.getElementById('contactForm')
            if (formElement) {
                formElement.addEventListener('submit', this.handleFormSubmit)
            }
        })
    },
    beforeUnmount() {
        const formElement = document.getElementById('contactForm')
        if (formElement) {
            formElement.removeEventListener('submit', this.handleFormSubmit)
        }
    },
    methods: {
        handleFormSubmit(event) {
            event.preventDefault()
            
            const formData = new FormData(event.target)
            console.log('폼 전송:', Object.fromEntries(formData))
            
            alert('메시지가 전송되었습니다!')
            event.target.reset()
        }
    }
}