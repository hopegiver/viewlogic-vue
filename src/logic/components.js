export default {
    name: 'Components',
    layout: 'default',
    data() {
        return {
            currentCategory: 'all',
            componentCards: [],
            tabButtons: []
        };
    },

    mounted() {
        this.initializeComponents();
        this.bindEvents();
    },

    methods: {
        initializeComponents() {
            // 컴포넌트 카드와 탭 버튼 초기화
            this.componentCards = document.querySelectorAll('.component-card');
            this.tabButtons = document.querySelectorAll('.tab-btn');
        },

        bindEvents() {
            // 카테고리 탭 이벤트
            this.tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterByCategory(e.target.dataset.category);
                    this.setActiveTab(e.target);
                });
            });

            // 모달 데모 버튼
            const modalDemo = document.getElementById('modal-demo');
            if (modalDemo) {
                modalDemo.addEventListener('click', () => {
                    this.showModalDemo();
                });
            }

            // 토스트 데모 버튼
            const toastDemo = document.getElementById('toast-demo');
            if (toastDemo) {
                toastDemo.addEventListener('click', () => {
                    this.showToastDemo();
                });
            }

            // 코드 복사 기능
            const codeBlocks = document.querySelectorAll('.component-code');
            codeBlocks.forEach(block => {
                block.addEventListener('click', (e) => {
                    this.copyCode(e.currentTarget);
                });
            });
        },

        filterByCategory(category) {
            this.currentCategory = category;
            
            this.componentCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.dataset.category;
                    card.style.display = cardCategory === category ? 'block' : 'none';
                }
            });
        },

        setActiveTab(activeButton) {
            this.tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            activeButton.classList.add('active');
        },

        showModalDemo() {
            // 간단한 모달 구현
            const modalHtml = `
                <div class="demo-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
                    <div style="background:white;padding:20px;border-radius:8px;max-width:400px;margin:20px;">
                        <h3 style="margin:0 0 15px 0;">모달 컴포넌트 예제</h3>
                        <p>이것은 모달 컴포넌트의 데모입니다.</p>
                        <p>다양한 콘텐츠를 모달 안에 표시할 수 있습니다.</p>
                        <div style="margin-top:20px;text-align:right;">
                            <button onclick="this.closest('.demo-modal').remove()" style="padding:8px 16px;margin-left:10px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">확인</button>
                            <button onclick="this.closest('.demo-modal').remove()" style="padding:8px 16px;margin-left:10px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;">취소</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        },

        showToastDemo() {
            const types = ['success', 'info', 'warning', 'error'];
            const messages = [
                '성공적으로 처리되었습니다!',
                '정보 메시지입니다.',
                '주의가 필요합니다.',
                '오류가 발생했습니다.'
            ];
            
            const randomIndex = Math.floor(Math.random() * types.length);
            
            // 간단한 토스트 메시지 표시
            const toastDiv = document.createElement('div');
            toastDiv.className = `toast-message ${types[randomIndex]}`;
            toastDiv.textContent = messages[randomIndex];
            toastDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:white;padding:12px 20px;border-radius:4px;z-index:9999;';
            
            document.body.appendChild(toastDiv);
            
            setTimeout(() => {
                document.body.removeChild(toastDiv);
            }, 3000);
        },

        copyCode(codeBlock) {
            const code = codeBlock.querySelector('code').textContent;
            
            // 클립보드에 복사
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    Toast.show({
                        message: '코드가 클립보드에 복사되었습니다!',
                        type: 'success',
                        duration: 2000
                    });
                }).catch(() => {
                    this.fallbackCopy(code);
                });
            } else {
                this.fallbackCopy(code);
            }
        },

        fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                Toast.show({
                    message: '코드가 클립보드에 복사되었습니다!',
                    type: 'success',
                    duration: 2000
                });
            } catch (err) {
                Toast.show({
                    message: '복사에 실패했습니다.',
                    type: 'error',
                    duration: 2000
                });
            }
            
            document.body.removeChild(textarea);
        }
    },

    beforeDestroy() {
        // 이벤트 리스너 정리
        this.tabButtons.forEach(btn => {
            btn.removeEventListener('click', null);
        });
    }
};