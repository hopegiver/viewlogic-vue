export default {
    name: 'Synovus',
    
    data() {
        return {
            searchQuery: '',
            selectedGenre: 'all',
            sortBy: 'latest',
            hasMoreScenarios: true,
            currentPage: 1,
            
            // 샘플 시나리오 데이터
            scenarios: [
                {
                    id: 1,
                    title: '달빛 아래의 비밀',
                    author: '문라이트',
                    genre: 'romance',
                    description: '평범한 대학생 소영이 신비로운 남자를 만나면서 벌어지는 로맨틱 판타지',
                    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
                    rating: 4.8,
                    subscribers: 15234,
                    episodeCount: 45,
                    lastUpdate: new Date('2024-01-15'),
                    lastEpisodeTitle: '45화: 운명의 선택',
                    tags: ['로맨스', '판타지', '현대물'],
                    isNew: true,
                    isHot: true,
                    isCompleted: false,
                    isSubscribed: false,
                    hasUpdate: true
                },
                {
                    id: 2,
                    title: '황제의 검',
                    author: '검성',
                    genre: 'fantasy',
                    description: '몰락한 검사 가문의 후예가 전설의 검을 찾아 떠나는 대서사 판타지',
                    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
                    rating: 4.9,
                    subscribers: 28756,
                    episodeCount: 120,
                    lastUpdate: new Date('2024-01-14'),
                    lastEpisodeTitle: '120화: 최후의 결전',
                    tags: ['판타지', '액션', '모험'],
                    isNew: false,
                    isHot: true,
                    isCompleted: true,
                    isSubscribed: true,
                    hasUpdate: false
                },
                {
                    id: 3,
                    title: '카페 오너의 일기',
                    author: '커피러버',
                    genre: 'drama',
                    description: '작은 카페를 운영하며 만나는 다양한 사람들과의 따뜻한 이야기',
                    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=400&fit=crop',
                    rating: 4.6,
                    subscribers: 8934,
                    episodeCount: 30,
                    lastUpdate: new Date('2024-01-13'),
                    lastEpisodeTitle: '30화: 새로운 시작',
                    tags: ['일상', '힐링', '드라마'],
                    isNew: false,
                    isHot: false,
                    isCompleted: false,
                    isSubscribed: true,
                    hasUpdate: true
                },
                {
                    id: 4,
                    title: '미스터리 하우스',
                    author: '추리작가',
                    genre: 'mystery',
                    description: '오래된 저택에서 벌어지는 기묘한 사건들을 파헤치는 스릴러',
                    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
                    rating: 4.7,
                    subscribers: 12456,
                    episodeCount: 25,
                    lastUpdate: new Date('2024-01-12'),
                    lastEpisodeTitle: '25화: 숨겨진 진실',
                    tags: ['미스터리', '스릴러', '추리'],
                    isNew: false,
                    isHot: false,
                    isCompleted: false,
                    isSubscribed: false,
                    hasUpdate: false
                },
                {
                    id: 5,
                    title: '시간을 거슬러',
                    author: '타임트래블러',
                    genre: 'fantasy',
                    description: '시간 여행 능력을 얻은 주인공의 과거와 미래를 오가는 모험',
                    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
                    rating: 4.5,
                    subscribers: 19678,
                    episodeCount: 80,
                    lastUpdate: new Date('2024-01-11'),
                    lastEpisodeTitle: '80화: 시간의 균열',
                    tags: ['판타지', 'SF', '타임트래블'],
                    isNew: true,
                    isHot: false,
                    isCompleted: false,
                    isSubscribed: false,
                    hasUpdate: false
                },
                {
                    id: 6,
                    title: '웃음의 마법사',
                    author: '코미디킹',
                    genre: 'comedy',
                    description: '평범한 직장인이 우연히 얻은 유머 능력으로 세상을 바꿔나가는 이야기',
                    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop',
                    rating: 4.4,
                    subscribers: 7823,
                    episodeCount: 35,
                    lastUpdate: new Date('2024-01-10'),
                    lastEpisodeTitle: '35화: 웃음의 힘',
                    tags: ['코미디', '일상', '유머'],
                    isNew: false,
                    isHot: false,
                    isCompleted: false,
                    isSubscribed: false,
                    hasUpdate: false
                }
            ]
        };
    },

    computed: {
        // 필터링된 시나리오 목록
        filteredScenarios() {
            let filtered = this.scenarios;

            // 장르 필터
            if (this.selectedGenre !== 'all') {
                filtered = filtered.filter(scenario => scenario.genre === this.selectedGenre);
            }

            // 검색 필터
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(scenario => 
                    scenario.title.toLowerCase().includes(query) ||
                    scenario.author.toLowerCase().includes(query) ||
                    scenario.tags.some(tag => tag.toLowerCase().includes(query))
                );
            }

            // 정렬
            filtered.sort((a, b) => {
                switch (this.sortBy) {
                    case 'popular':
                        return b.subscribers - a.subscribers;
                    case 'rating':
                        return b.rating - a.rating;
                    case 'subscribers':
                        return b.subscribers - a.subscribers;
                    case 'latest':
                    default:
                        return b.lastUpdate - a.lastUpdate;
                }
            });

            return filtered;
        },

        // 인기 시나리오 (구독자 수 기준 상위 3개)
        featuredScenarios() {
            return this.scenarios
                .filter(scenario => scenario.isHot)
                .sort((a, b) => b.subscribers - a.subscribers)
                .slice(0, 3);
        },

        // 구독한 시나리오 목록
        subscribedScenarios() {
            return this.scenarios.filter(scenario => scenario.isSubscribed);
        }
    },

    methods: {
        // 시나리오 상세 보기
        viewScenario(scenario) {
            console.log('시나리오 상세 보기:', scenario.title);
            // 시나리오 상세 페이지로 이동 (쿼리 파라미터 사용)
            this.$router?.navigateTo(`scenario-detail?id=${scenario.id}`);
        },

        // 구독 토글
        toggleSubscription(scenario) {
            scenario.isSubscribed = !scenario.isSubscribed;
            
            if (scenario.isSubscribed) {
                scenario.subscribers += 1;
                console.log(`"${scenario.title}" 구독 완료`);
                alert(`"${scenario.title}"을(를) 구독했습니다! 새로운 에피소드가 업데이트되면 알려드릴게요.`);
            } else {
                scenario.subscribers -= 1;
                console.log(`"${scenario.title}" 구독 해제`);
                alert(`"${scenario.title}" 구독을 해제했습니다.`);
            }
        },

        // 이어보기
        continueReading(scenario) {
            console.log('이어보기:', scenario.title);
            alert(`"${scenario.title}" ${scenario.lastEpisodeTitle}부터 이어보기를 시작합니다.`);
        },

        // 더 많은 시나리오 로드
        loadMoreScenarios() {
            console.log('더 많은 시나리오 로드');
            // 실제로는 API 호출로 추가 데이터를 가져옴
            this.currentPage += 1;
            if (this.currentPage >= 3) {
                this.hasMoreScenarios = false;
            }
            alert('더 많은 시나리오를 불러왔습니다!');
        },

        // 숫자 포맷팅
        formatNumber(num) {
            if (num >= 10000) {
                return Math.floor(num / 1000) + 'K';
            }
            return num.toLocaleString();
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
        }
    },

    mounted() {
        console.log('시나버스 페이지가 로드되었습니다.');
    }
};