export default {
    name: 'Videos',
    layout: 'default',
    data() {
        return {
            selectedCategory: 'all',
            sortBy: 'latest',
            videos: [],
            filteredVideos: [],
            hasMoreVideos: true,
            currentPage: 1,
            videosPerPage: 12
        }
    },
    
    mounted() {
        this.loadVideos();
    },
    
    methods: {
        loadVideos() {
            const sampleVideos = [
                {
                    id: 1,
                    title: 'Vue.js 3.0 완벽 가이드 - 초보자를 위한 입문 강좌',
                    thumbnail: 'https://picsum.photos/320/180?random=1',
                    duration: '12:35',
                    channel: 'Tech Academy',
                    channelAvatar: 'https://i.pravatar.cc/40?img=1',
                    views: 125000,
                    uploadedAt: '2주 전',
                    category: 'education',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 2,
                    title: '🎵 2024 인기 K-POP 플레이리스트 | 최신곡 모음',
                    thumbnail: 'https://picsum.photos/320/180?random=2',
                    duration: '45:20',
                    channel: 'Music World',
                    channelAvatar: 'https://i.pravatar.cc/40?img=2',
                    views: 890000,
                    uploadedAt: '3일 전',
                    category: 'music',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 3,
                    title: '서울 브이로그 | 카페 투어와 맛집 탐방',
                    thumbnail: 'https://picsum.photos/320/180?random=3',
                    duration: '18:45',
                    channel: '데일리 브이로그',
                    channelAvatar: 'https://i.pravatar.cc/40?img=3',
                    views: 45000,
                    uploadedAt: '1주 전',
                    category: 'vlog',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 4,
                    title: 'LOL 챔피언십 2024 하이라이트 - 역대급 경기',
                    thumbnail: 'https://picsum.photos/320/180?random=4',
                    duration: '25:10',
                    channel: 'Gaming Pro',
                    channelAvatar: 'https://i.pravatar.cc/40?img=4',
                    views: 2100000,
                    uploadedAt: '5일 전',
                    category: 'gaming',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 5,
                    title: '홈트레이닝 30분 전신운동 루틴',
                    thumbnail: 'https://picsum.photos/320/180?random=5',
                    duration: '30:00',
                    channel: 'Fitness Life',
                    channelAvatar: 'https://i.pravatar.cc/40?img=5',
                    views: 156000,
                    uploadedAt: '1개월 전',
                    category: 'sports',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 6,
                    title: 'JavaScript 고급 개념 - 클로저와 프로토타입',
                    thumbnail: 'https://picsum.photos/320/180?random=6',
                    duration: '22:15',
                    channel: 'Tech Academy',
                    channelAvatar: 'https://i.pravatar.cc/40?img=1',
                    views: 89000,
                    uploadedAt: '3주 전',
                    category: 'education',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 7,
                    title: '🎮 신작 게임 리뷰 - 2024 GOTY 후보작',
                    thumbnail: 'https://picsum.photos/320/180?random=7',
                    duration: '15:30',
                    channel: 'Game Review',
                    channelAvatar: 'https://i.pravatar.cc/40?img=7',
                    views: 340000,
                    uploadedAt: '6일 전',
                    category: 'gaming',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 8,
                    title: '요즘 뜨는 카페 인테리어 트렌드',
                    thumbnail: 'https://picsum.photos/320/180?random=8',
                    duration: '10:25',
                    channel: '라이프스타일',
                    channelAvatar: 'https://i.pravatar.cc/40?img=8',
                    views: 67000,
                    uploadedAt: '2주 전',
                    category: 'vlog',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 9,
                    title: 'React vs Vue vs Angular - 2024 프레임워크 비교',
                    thumbnail: 'https://picsum.photos/320/180?random=9',
                    duration: '28:40',
                    channel: 'Dev Master',
                    channelAvatar: 'https://i.pravatar.cc/40?img=9',
                    views: 210000,
                    uploadedAt: '4일 전',
                    category: 'education',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 10,
                    title: '🎧 작업할 때 듣기 좋은 Lo-Fi 플레이리스트',
                    thumbnail: 'https://picsum.photos/320/180?random=10',
                    duration: '1:23:45',
                    channel: 'Lo-Fi Station',
                    channelAvatar: 'https://i.pravatar.cc/40?img=10',
                    views: 560000,
                    uploadedAt: '1개월 전',
                    category: 'music',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 11,
                    title: '프리미어리그 주간 베스트 골 모음',
                    thumbnail: 'https://picsum.photos/320/180?random=11',
                    duration: '8:15',
                    channel: 'Sports Highlight',
                    channelAvatar: 'https://i.pravatar.cc/40?img=11',
                    views: 1200000,
                    uploadedAt: '2일 전',
                    category: 'sports',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                },
                {
                    id: 12,
                    title: '제주도 여행 브이로그 - 3박 4일 완벽 코스',
                    thumbnail: 'https://picsum.photos/320/180?random=12',
                    duration: '35:20',
                    channel: '여행 다이어리',
                    channelAvatar: 'https://i.pravatar.cc/40?img=12',
                    views: 98000,
                    uploadedAt: '1주 전',
                    category: 'vlog',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
                }
            ];
            
            this.videos = sampleVideos;
            this.filterVideos('all');
        },
        
        filterVideos(category) {
            this.selectedCategory = category;
            if (category === 'all') {
                this.filteredVideos = [...this.videos];
            } else {
                this.filteredVideos = this.videos.filter(video => video.category === category);
            }
            this.sortVideos();
        },
        
        sortVideos() {
            const sorted = [...this.filteredVideos];
            
            switch(this.sortBy) {
                case 'popular':
                    sorted.sort((a, b) => b.views - a.views);
                    break;
                case 'views':
                    sorted.sort((a, b) => b.views - a.views);
                    break;
                case 'latest':
                default:
                    break;
            }
            
            this.filteredVideos = sorted;
        },
        
        formatViews(views) {
            if (views >= 1000000) {
                return (views / 1000000).toFixed(1) + 'M';
            } else if (views >= 1000) {
                return (views / 1000).toFixed(0) + 'K';
            }
            return views.toString();
        },
        
        viewVideo(videoId) {
            window.location.hash = `#/video-detail?id=${videoId}`;
        },
        
        loadMoreVideos() {
            this.currentPage++;
            
            const moreVideos = Array.from({ length: 6 }, (_, i) => ({
                id: this.videos.length + i + 1,
                title: `추가 동영상 ${this.videos.length + i + 1}`,
                thumbnail: `https://picsum.photos/320/180?random=${this.videos.length + i + 100}`,
                duration: `${Math.floor(Math.random() * 30)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                channel: `Channel ${this.videos.length + i + 1}`,
                channelAvatar: `https://i.pravatar.cc/40?img=${(this.videos.length + i + 1) % 70}`,
                views: Math.floor(Math.random() * 1000000),
                uploadedAt: '방금 전',
                category: ['education', 'music', 'gaming', 'vlog', 'sports'][Math.floor(Math.random() * 5)],
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
            }));
            
            this.videos.push(...moreVideos);
            this.filterVideos(this.selectedCategory);
            
            if (this.currentPage >= 5) {
                this.hasMoreVideos = false;
            }
        }
    }
};