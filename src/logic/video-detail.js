export default {
    name: 'VideoDetail',
    layout: 'default',
    data() {
        return {
            currentVideo: {
                id: 1,
                title: 'Vue.js 3.0 완벽 가이드',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                views: 125000,
                likes: 5200,
                uploadedAt: '2024년 1월 15일',
                channel: 'Tech Academy',
                channelAvatar: 'https://i.pravatar.cc/80?img=1',
                subscribers: 152000,
                description: '이 강좌에서는 Vue.js 3.0의 기초부터 고급 기능까지 학습합니다.',
                commentCount: 342
            },
            relatedVideos: [
                {
                    id: 101,
                    title: 'Vue.js Composition API 완벽 정리',
                    thumbnail: 'https://picsum.photos/168/94?random=101',
                    duration: '15:30',
                    channel: 'Tech Academy',
                    views: 45000,
                    uploadedAt: '1주 전'
                },
                {
                    id: 102,
                    title: 'React vs Vue 2024 비교',
                    thumbnail: 'https://picsum.photos/168/94?random=102',
                    duration: '22:45',
                    channel: 'Dev Master',
                    views: 89000,
                    uploadedAt: '3일 전'
                }
            ],
            comments: [
                {
                    id: 1,
                    userName: '개발자김',
                    userAvatar: 'https://i.pravatar.cc/40?img=20',
                    text: '정말 도움이 많이 되었습니다!',
                    createdAt: '2일 전',
                    likes: 45
                },
                {
                    id: 2,
                    userName: '초보코더',
                    userAvatar: 'https://i.pravatar.cc/40?img=35',
                    text: '설명이 이해하기 쉬워요',
                    createdAt: '3일 전',
                    likes: 12
                }
            ],
            isLiked: false,
            isDisliked: false,
            isSaved: false,
            isSubscribed: false,
            newComment: '',
            showFullDescription: false,
            commentSort: 'newest',
            hasMoreComments: true,
            isLoggedIn: false
        }
    },
    
    mounted() {
        // 비디오 ID가 있으면 처리 (옵션)
        if (this.params.id) {
            this.currentVideo.id = this.params.id;
            this.currentVideo.title = `동영상 ${this.params.id}번`;
        }
    },
    
    computed: {
        truncatedDescription() {
            if (!this.currentVideo.description || this.currentVideo.description.length <= 200) {
                return this.currentVideo.description || '';
            }
            return this.currentVideo.description.substring(0, 200) + '...';
        }
    },
    
    methods: {
        formatViews(views) {
            if (!views) return '0';
            if (views >= 1000000) {
                return (views / 1000000).toFixed(1) + 'M';
            } else if (views >= 1000) {
                return (views / 1000).toFixed(0) + 'K';
            }
            return views.toString();
        },
        
        formatNumber(num) {
            if (!num) return '0';
            if (num >= 1000) {
                return (num / 1000).toFixed(0) + '천';
            }
            return num.toString();
        },
        
        likeVideo() {
            this.isLiked = !this.isLiked;
            if (this.isLiked) {
                this.currentVideo.likes++;
            } else {
                this.currentVideo.likes--;
            }
        },
        
        dislikeVideo() {
            this.isDisliked = !this.isDisliked;
            if (this.isLiked && this.isDisliked) {
                this.isLiked = false;
                this.currentVideo.likes--;
            }
        },
        
        shareVideo() {
            alert('링크가 복사되었습니다!');
        },
        
        saveVideo() {
            this.isSaved = !this.isSaved;
        },
        
        toggleSubscribe() {
            this.isSubscribed = !this.isSubscribed;
        },
        
        toggleDescription() {
            this.showFullDescription = !this.showFullDescription;
        },
        
        submitComment() {
            if (!this.newComment.trim()) return;
            
            this.comments.unshift({
                id: this.comments.length + 1,
                userName: '사용자',
                userAvatar: 'https://i.pravatar.cc/40?img=99',
                text: this.newComment,
                createdAt: '방금 전',
                likes: 0
            });
            
            this.newComment = '';
        },
        
        cancelComment() {
            this.newComment = '';
        },
        
        likeComment(commentId) {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                comment.likes++;
            }
        },
        
        dislikeComment(commentId) {
            console.log('Dislike comment:', commentId);
        },
        
        replyToComment(commentId) {
            console.log('Reply to comment:', commentId);
        },
        
        toggleReplies(commentId) {
            console.log('Toggle replies:', commentId);
        },
        
        sortComments() {
            // 댓글 정렬 로직
            if (this.commentSort === 'newest') {
                this.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (this.commentSort === 'popular') {
                this.comments.sort((a, b) => b.likes - a.likes);
            }
        },
        
        loadMoreComments() {
            // 더 많은 댓글 로드 시뮬레이션
            const moreComments = [
                {
                    id: this.comments.length + 1,
                    userName: '추가댓글' + (this.comments.length + 1),
                    userAvatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
                    text: '추가로 로드된 댓글입니다.',
                    createdAt: Math.floor(Math.random() * 7) + 1 + '일 전',
                    likes: Math.floor(Math.random() * 50)
                }
            ];
            this.comments.push(...moreComments);
            
            // 임의로 더 불러올 댓글이 없다고 설정
            if (this.comments.length >= 10) {
                this.hasMoreComments = false;
            }
        },
        
        playVideo(videoId) {
            window.location.hash = `#/video-detail?id=${videoId}`;
            window.location.reload();
        }
    }
};