export default {
    name: 'ScenarioDetail',
    
    data() {
        return {
            scenarioId: null,
            selectedEpisode: null,
            selectedEpisodeIndex: 0,
            currentEpisode: null,
            previewPercentage: 10,
            
            // 새 리뷰 작성
            newReview: {
                rating: 5,
                content: ''
            },
            
            // 시나리오 상세 정보
            scenario: {
                id: 1,
                title: '달빛 아래의 비밀',
                author: '문라이트',
                genre: '로맨스',
                description: '평범한 대학생 소영이 신비로운 남자를 만나면서 벌어지는 로맨틱 판타지. 달빛이 비치는 밤마다 나타나는 그 남자의 정체는 과연 무엇일까? 현실과 판타지를 오가는 몽환적인 이야기가 펼쳐집니다.',
                coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
                rating: 4.8,
                reviewCount: 1247,
                subscribers: 15234,
                episodeCount: 45,
                lastUpdate: new Date('2024-01-15'),
                tags: ['로맨스', '판타지', '현대물', '달빛', '미스터리'],
                isNew: true,
                isHot: true,
                isCompleted: false,
                isSubscribed: false,
                isBookmarked: false,
                isPurchased: false,
                status: 'ongoing', // ongoing, completed, hiatus
                originalPrice: 15000,
                salePrice: 9900,
                discount: 34,
                monthlyPrice: 2900
            },
            
            // 에피소드 목록
            episodes: [
                {
                    id: 1,
                    number: 1,
                    title: '운명적인 만남',
                    preview: '평범한 대학생 소영이 도서관에서 이상한 책을 발견하게 되는데...',
                    publishDate: new Date('2024-01-01'),
                    readTime: 15,
                    isFree: true,
                    isNew: false,
                    price: 0,
                    content: `
                        <p>달빛이 유독 밝은 밤이었다.</p>
                        <p>소영은 도서관 구석진 자리에서 과제를 하고 있었다. 시계는 이미 11시를 넘어서고 있었지만, 내일까지 제출해야 하는 레포트 때문에 집에 갈 수도 없었다.</p>
                        <p>"이런, 또 졸았나..."</p>
                        <p>소영은 고개를 들며 목을 돌렸다. 그때였다.</p>
                        <p>창가 쪽에서 이상한 빛이 번쩍였다. 달빛인가 싶었지만, 그 빛은 달빛치고는 너무나 푸른빛이었다.</p>
                        <p>호기심에 이끌려 창가로 다가간 소영은 그곳에서 한 권의 오래된 책을 발견했다.</p>
                        <p>『달의 비밀』</p>
                        <p>표지에 적힌 제목이었다. 책을 펼치는 순간, 소영의 운명이 바뀌기 시작했다...</p>
                    `,
                    previewContent: `
                        <p>달빛이 유독 밝은 밤이었다.</p>
                        <p>소영은 도서관 구석진 자리에서 과제를 하고 있었다. 시계는 이미 11시를 넘어서고 있었지만, 내일까지 제출해야 하는 레포트 때문에 집에 갈 수도 없었다.</p>
                        <p>"이런, 또 졸았나..."</p>
                    `
                },
                {
                    id: 2,
                    number: 2,
                    title: '신비로운 남자의 등장',
                    preview: '책을 펼친 순간, 소영 앞에 신비로운 남자가 나타나는데...',
                    publishDate: new Date('2024-01-03'),
                    readTime: 18,
                    isFree: true,
                    isNew: false,
                    price: 0,
                    content: `
                        <p>책을 펼치는 순간, 도서관 안이 갑자기 달빛으로 가득 찼다.</p>
                        <p>"누구세요?"</p>
                        <p>소영은 놀라서 뒤를 돌았다. 그곳에는 키가 크고 신비로운 분위기의 남자가 서 있었다.</p>
                        <p>"드디어 만났군요." 남자가 말했다. 그의 목소리는 달빛처럼 부드러웠다.</p>
                        <p>"당신은... 누구세요?" 소영이 다시 물었다.</p>
                        <p>"저는..." 남자가 미소를 지으며 대답했다. "달의 수호자입니다."</p>
                    `,
                    previewContent: `
                        <p>책을 펼치는 순간, 도서관 안이 갑자기 달빛으로 가득 찼다.</p>
                        <p>"누구세요?"</p>
                    `
                },
                {
                    id: 3,
                    number: 3,
                    title: '달의 수호자의 비밀',
                    preview: '달의 수호자라고 밝힌 남자, 그의 정체에 대한 충격적인 진실이...',
                    publishDate: new Date('2024-01-05'),
                    readTime: 20,
                    isFree: true,
                    isNew: false,
                    price: 0,
                    content: `<p>달의 수호자에 대한 이야기가 시작됩니다...</p>`,
                    previewContent: `<p>달의 수호자에 대한 이야기...</p>`
                },
                {
                    id: 4,
                    number: 4,
                    title: '선택의 기로',
                    preview: '소영은 평범한 일상과 환상적인 모험 사이에서 선택해야 하는데...',
                    publishDate: new Date('2024-01-07'),
                    readTime: 22,
                    isFree: true,
                    isNew: false,
                    price: 300,
                    content: `<p>선택의 시간이 다가왔습니다...</p>`,
                    previewContent: `<p>선택의 시간이...</p>`
                },
                {
                    id: 5,
                    number: 5,
                    title: '첫 번째 임무',
                    preview: '소영이 달의 수호자와 함께하는 첫 번째 임무가 시작되는데...',
                    publishDate: new Date('2024-01-09'),
                    readTime: 25,
                    isFree: false,
                    isNew: false,
                    price: 300,
                    content: `<p>첫 번째 임무의 시작...</p>`,
                    previewContent: `<p>첫 번째 임무...</p>`
                },
                {
                    id: 6,
                    number: 6,
                    title: '위험한 적의 등장',
                    preview: '평화로운 임무 중 갑작스럽게 나타난 위험한 적, 소영은 어떻게 할까?',
                    publishDate: new Date('2024-01-11'),
                    readTime: 28,
                    isFree: false,
                    isNew: true,
                    price: 300,
                    content: `<p>위험한 적이 나타났습니다...</p>`,
                    previewContent: `<p>위험한 적이...</p>`
                }
            ],
            
            // 리뷰 목록
            reviews: [
                {
                    id: 1,
                    username: '로맨스러버',
                    rating: 5,
                    content: '정말 몰입도가 높은 작품이에요! 소영과 달의 수호자의 로맨스가 너무 설레네요. 다음 화가 기대됩니다!',
                    date: new Date('2024-01-14'),
                    likes: 24,
                    isLiked: false
                },
                {
                    id: 2,
                    username: '달빛소녀',
                    rating: 4,
                    content: '판타지 요소가 잘 어우러져서 재미있게 읽고 있어요. 작가님의 문체도 매력적이고요.',
                    date: new Date('2024-01-13'),
                    likes: 18,
                    isLiked: true
                },
                {
                    id: 3,
                    username: '소설매니아',
                    rating: 5,
                    content: '캐릭터들의 감정 묘사가 정말 생생해요. 특히 주인공의 심리 변화가 잘 그려져서 감정이입이 잘 됩니다.',
                    date: new Date('2024-01-12'),
                    likes: 31,
                    isLiked: false
                }
            ]
        };
    },
    
    computed: {
        // 무료 에피소드 개수 (전체의 10%)
        freeEpisodeCount() {
            return Math.ceil(this.scenario.episodeCount * 0.1);
        },
        
        // 무료 에피소드들에 대한 정보 업데이트
        updatedEpisodes() {
            return this.episodes.map((episode, index) => ({
                ...episode,
                isFree: index < this.freeEpisodeCount
            }));
        }
    },
    
    methods: {
        // 뒤로 가기
        goBack() {
            this.$router?.navigateTo('synovus');
        },
        
        // 구독 토글
        toggleSubscription() {
            this.scenario.isSubscribed = !this.scenario.isSubscribed;
            if (this.scenario.isSubscribed) {
                this.scenario.subscribers += 1;
                alert(`"${this.scenario.title}"을(를) 구독했습니다!`);
            } else {
                this.scenario.subscribers -= 1;
                alert(`"${this.scenario.title}" 구독을 해제했습니다.`);
            }
        },
        
        // 공유하기
        shareScenario() {
            const url = `${window.location.origin}/#/scenario-detail/${this.scenario.id}`;
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            });
        },
        
        // 북마크 추가/제거
        addToBookmark() {
            this.scenario.isBookmarked = !this.scenario.isBookmarked;
            alert(this.scenario.isBookmarked ? '북마크에 추가되었습니다!' : '북마크에서 제거되었습니다!');
        },
        
        // 에피소드 선택
        selectEpisode(episode, index) {
            if (!episode.isFree && !this.scenario.isPurchased) {
                // 유료 에피소드인 경우 미리보기만 표시
                this.selectedEpisode = episode;
                this.selectedEpisodeIndex = index;
            } else {
                // 무료 또는 구매한 에피소드인 경우 전체 내용 표시
                this.selectedEpisode = episode;
                this.selectedEpisodeIndex = index;
            }
            this.currentEpisode = episode.id;
            
            // 페이지 맨 위로 스크롤
            document.querySelector('.episode-viewer')?.scrollIntoView({ behavior: 'smooth' });
        },
        
        // 뷰어 닫기
        closeViewer() {
            this.selectedEpisode = null;
            this.selectedEpisodeIndex = 0;
            this.currentEpisode = null;
        },
        
        // 에피소드 네비게이션
        navigateEpisode(direction) {
            let newIndex;
            if (direction === 'prev') {
                newIndex = Math.max(0, this.selectedEpisodeIndex - 1);
            } else {
                newIndex = Math.min(this.episodes.length - 1, this.selectedEpisodeIndex + 1);
            }
            
            if (newIndex !== this.selectedEpisodeIndex) {
                this.selectEpisode(this.episodes[newIndex], newIndex);
            }
        },
        
        // 개별 에피소드 구매
        purchaseEpisode(episode) {
            if (confirm(`"${episode.title}"을(를) ${this.formatPrice(episode.price)}에 구매하시겠습니까?`)) {
                // 실제로는 결제 API 호출
                setTimeout(() => {
                    episode.isPurchased = true;
                    alert('구매가 완료되었습니다! 전체 내용을 확인하세요.');
                    this.selectEpisode(episode, this.selectedEpisodeIndex);
                }, 1000);
            }
        },
        
        // 전체/월간 구매 옵션
        purchaseOption(type) {
            let message, price;
            
            if (type === 'full') {
                message = `전체 에피소드를 ${this.formatPrice(this.scenario.salePrice)}에 구매하시겠습니까?\n(${this.scenario.discount}% 할인 적용)`;
                price = this.scenario.salePrice;
            } else if (type === 'monthly') {
                message = `월간 이용권을 ${this.formatPrice(this.scenario.monthlyPrice)}에 구매하시겠습니까?`;
                price = this.scenario.monthlyPrice;
            }
            
            if (confirm(message)) {
                // 실제로는 결제 API 호출
                setTimeout(() => {
                    this.scenario.isPurchased = true;
                    alert('구매가 완료되었습니다! 이제 모든 에피소드를 무제한으로 이용할 수 있습니다.');
                    if (this.selectedEpisode) {
                        this.selectEpisode(this.selectedEpisode, this.selectedEpisodeIndex);
                    }
                }, 1500);
            }
        },
        
        // 리뷰 제출
        submitReview() {
            if (!this.newReview.content.trim()) {
                alert('리뷰 내용을 입력해주세요.');
                return;
            }
            
            const review = {
                id: Date.now(),
                username: '익명의 독자',
                rating: this.newReview.rating,
                content: this.newReview.content.trim(),
                date: new Date(),
                likes: 0,
                isLiked: false
            };
            
            this.reviews.unshift(review);
            this.scenario.reviewCount += 1;
            
            // 평점 재계산 (간단한 평균)
            const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
            this.scenario.rating = (totalRating / this.reviews.length).toFixed(1);
            
            // 폼 초기화
            this.newReview = { rating: 5, content: '' };
            
            alert('리뷰가 등록되었습니다!');
        },
        
        // 리뷰 좋아요 토글
        toggleReviewLike(review) {
            review.isLiked = !review.isLiked;
            review.likes += review.isLiked ? 1 : -1;
        },
        
        // 상태 텍스트 반환
        getStatusText(status) {
            const statusMap = {
                ongoing: '연재중',
                completed: '완결',
                hiatus: '휴재중'
            };
            return statusMap[status] || '알 수 없음';
        },
        
        // 숫자 포맷팅
        formatNumber(num) {
            if (num >= 10000) {
                return Math.floor(num / 1000) + 'K';
            }
            return num.toLocaleString();
        },
        
        // 가격 포맷팅
        formatPrice(price) {
            return price.toLocaleString() + '원';
        },
        
        // 날짜 포맷팅
        formatDate(date) {
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            if (days === 0) return '오늘';
            if (days === 1) return '어제';
            if (days < 7) return `${days}일 전`;
            if (days < 30) return `${Math.floor(days / 7)}주 전`;
            return `${Math.floor(days / 30)}개월 전`;
        },
        
        // URL에서 시나리오 ID 추출 (쿼리 파라미터)
        extractScenarioId() {
            const hash = window.location.hash;
            const url = new URL(hash.substring(1), window.location.origin);
            const searchParams = new URLSearchParams(url.search || hash.split('?')[1]);
            const id = searchParams.get('id');
            
            if (id) {
                this.scenarioId = parseInt(id);
                this.loadScenarioData();
            }
        },
        
        // 시나리오 데이터 로드
        loadScenarioData() {
            // 실제로는 API에서 시나리오 데이터를 가져옴
            console.log('시나리오 데이터 로딩:', this.scenarioId);
            
            // 무료 에피소드 정보 업데이트
            this.episodes.forEach((episode, index) => {
                episode.isFree = index < this.freeEpisodeCount;
            });
        }
    },
    
    mounted() {
        console.log('시나리오 상세 페이지가 로드되었습니다.');
        this.extractScenarioId();
    }
};