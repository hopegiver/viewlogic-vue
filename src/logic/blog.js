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
    name: 'Blog',
    layout: 'default',
    data() {
        return {
            posts: [],
            filteredPosts: [],
            searchQuery: '',
            selectedCategory: 'all',
            selectedTags: [],
            sortBy: 'date-desc',
            currentPage: 1,
            postsPerPage: 6,
            categories: [
                { id: 'all', name: '전체', count: 0 },
                { id: 'tech', name: '기술', count: 0 },
                { id: 'tutorial', name: '튜토리얼', count: 0 },
                { id: 'lifestyle', name: '라이프스타일', count: 0 },
                { id: 'review', name: '리뷰', count: 0 }
            ],
            popularTags: [],
            recentPosts: [],
            archives: []
        };
    },

    computed: {
        paginatedPosts() {
            const start = (this.currentPage - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;
            return this.filteredPosts.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredPosts.length / this.postsPerPage);
        },

        visiblePages() {
            const pages = [];
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, this.currentPage + 2);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        }
    },

    mounted() {
        this.initializePosts();
        this.loadPosts();
        this.generateSidebarData();
    },

    methods: {
        initializePosts() {
            // 샘플 블로그 포스트 데이터
            this.posts = [
                {
                    id: 1,
                    title: 'Vue 3 Composition API 완벽 가이드',
                    excerpt: 'Vue 3의 Composition API를 활용해서 더 효율적인 컴포넌트를 작성하는 방법을 알아봅시다. 기존 Options API와의 차이점부터 실제 사용 예제까지 상세히 다룹니다.',
                    content: 'Vue 3 Composition API에 대한 자세한 내용...',
                    author: 'ViewLogic Team',
                    date: '2024-01-15',
                    category: 'tech',
                    tags: ['Vue.js', 'JavaScript', 'Frontend'],
                    thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=400&h=250&fit=crop&crop=center',
                    views: 1205,
                    likes: 42,
                    readingTime: 8,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 2,
                    title: 'CSS Grid vs Flexbox: 언제 무엇을 사용할까?',
                    excerpt: 'CSS의 두 가지 주요 레이아웃 시스템인 Grid와 Flexbox를 비교하고, 각각을 언제 사용하면 좋을지 실제 예제와 함께 알아봅시다.',
                    content: 'CSS Grid와 Flexbox 비교에 대한 내용...',
                    author: 'CSS Ninja',
                    date: '2024-01-12',
                    category: 'tutorial',
                    tags: ['CSS', 'Layout', 'Design'],
                    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
                    views: 892,
                    likes: 35,
                    readingTime: 6,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 3,
                    title: '개발자를 위한 생산성 도구 TOP 10',
                    excerpt: '개발 효율성을 높여주는 필수 도구들을 소개합니다. 코드 에디터부터 디버깅 도구까지, 생산성을 극대화하는 도구들을 만나보세요.',
                    content: '생산성 도구에 대한 내용...',
                    author: 'ProductivityPro',
                    date: '2024-01-10',
                    category: 'review',
                    tags: ['Tools', 'Productivity', 'Development'],
                    thumbnail: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=250&fit=crop&crop=center',
                    views: 1456,
                    likes: 67,
                    readingTime: 12,
                    isLiked: true,
                    isBookmarked: false
                },
                {
                    id: 4,
                    title: '재택근무 개발자의 하루 루틴',
                    excerpt: '집에서 일하는 개발자로서 건강하고 효율적인 하루를 보내는 방법을 공유합니다. 워크-라이프 밸런스를 유지하는 팁도 함께!',
                    content: '재택근무 루틴에 대한 내용...',
                    author: 'HomeWorker',
                    date: '2024-01-08',
                    category: 'lifestyle',
                    tags: ['Lifestyle', 'Remote', 'Work'],
                    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=400&h=250&fit=crop&crop=center',
                    views: 743,
                    likes: 28,
                    readingTime: 5,
                    isLiked: false,
                    isBookmarked: true
                },
                {
                    id: 5,
                    title: 'JavaScript ES2024 새로운 기능들',
                    excerpt: 'JavaScript의 최신 버전에서 추가된 새로운 기능들을 살펴보고, 실제 프로젝트에서 어떻게 활용할 수 있는지 알아봅시다.',
                    content: 'ES2024 기능에 대한 내용...',
                    author: 'JS Explorer',
                    date: '2024-01-05',
                    category: 'tech',
                    tags: ['JavaScript', 'ES2024', 'Features'],
                    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop&crop=center',
                    views: 1021,
                    likes: 51,
                    readingTime: 9,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 6,
                    title: 'React vs Vue vs Angular 2024년 비교',
                    excerpt: '2024년 현재 시점에서 세 가지 주요 프론트엔드 프레임워크를 비교해봅시다. 각각의 장단점과 어떤 상황에서 사용하면 좋을지 분석합니다.',
                    content: '프레임워크 비교에 대한 내용...',
                    author: 'Framework Guru',
                    date: '2024-01-03',
                    category: 'tech',
                    tags: ['React', 'Vue', 'Angular', 'Comparison'],
                    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center',
                    views: 1834,
                    likes: 89,
                    readingTime: 15,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 7,
                    title: 'Node.js 성능 최적화 가이드',
                    excerpt: 'Node.js 애플리케이션의 성능을 향상시키는 다양한 방법들을 알아봅시다. 메모리 관리부터 비동기 처리 최적화까지!',
                    content: 'Node.js 최적화에 대한 내용...',
                    author: 'Backend Master',
                    date: '2023-12-28',
                    category: 'tutorial',
                    tags: ['Node.js', 'Performance', 'Backend'],
                    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&crop=center',
                    views: 967,
                    likes: 44,
                    readingTime: 11,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 8,
                    title: '디자인 시스템 구축하기',
                    excerpt: '일관성 있는 사용자 경험을 위한 디자인 시스템을 구축하는 방법을 단계별로 설명합니다. 컴포넌트 라이브러리부터 스타일 가이드까지!',
                    content: '디자인 시스템에 대한 내용...',
                    author: 'Design System Pro',
                    date: '2023-12-25',
                    category: 'tutorial',
                    tags: ['Design', 'System', 'UI/UX'],
                    thumbnail: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=250&fit=crop&crop=center',
                    views: 678,
                    likes: 31,
                    readingTime: 7,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 9,
                    title: '개발자가 알아야 할 보안 기초',
                    excerpt: '웹 애플리케이션 보안의 기본 개념부터 실제 적용 방법까지. 안전한 코드 작성을 위한 필수 지식을 정리했습니다.',
                    content: '웹 보안에 대한 내용...',
                    author: 'Security Expert',
                    date: '2023-12-22',
                    category: 'tech',
                    tags: ['Security', 'Web', 'Safety'],
                    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop&crop=center',
                    views: 1123,
                    likes: 58,
                    readingTime: 10,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 10,
                    title: '개발자의 커리어 성장 로드맵',
                    excerpt: '주니어에서 시니어 개발자로 성장하기 위한 단계별 가이드입니다. 기술 스택부터 소프트 스킬까지 균형있는 성장 방법을 제시합니다.',
                    content: '커리어에 대한 내용...',
                    author: 'Career Coach',
                    date: '2023-12-20',
                    category: 'lifestyle',
                    tags: ['Career', 'Growth', 'Developer'],
                    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
                    views: 2156,
                    likes: 112,
                    readingTime: 13,
                    isLiked: false,
                    isBookmarked: true
                },
                {
                    id: 11,
                    title: 'GraphQL vs REST API 실전 비교',
                    excerpt: 'GraphQL과 REST API의 실제 사용 경험을 바탕으로 각각의 장단점을 비교하고, 프로젝트에 맞는 선택 기준을 제시합니다.',
                    content: 'API 비교에 대한 내용...',
                    author: 'API Specialist',
                    date: '2023-12-18',
                    category: 'tech',
                    tags: ['GraphQL', 'REST', 'API'],
                    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center',
                    views: 845,
                    likes: 39,
                    readingTime: 8,
                    isLiked: false,
                    isBookmarked: false
                },
                {
                    id: 12,
                    title: 'TypeScript 마이그레이션 경험담',
                    excerpt: '대규모 JavaScript 프로젝트를 TypeScript로 마이그레이션한 실제 경험을 공유합니다. 마주쳤던 문제들과 해결 과정을 상세히 기록했습니다.',
                    content: 'TypeScript 마이그레이션에 대한 내용...',
                    author: 'Migration Expert',
                    date: '2023-12-15',
                    category: 'tutorial',
                    tags: ['TypeScript', 'Migration', 'JavaScript'],
                    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
                    views: 1234,
                    likes: 65,
                    readingTime: 14,
                    isLiked: true,
                    isBookmarked: false
                }
            ];
        },

        loadPosts() {
            this.filteredPosts = [...this.posts];
            this.updateCategoryCounts();
            this.filterPosts();
        },

        updateCategoryCounts() {
            // 카테고리별 포스트 수 업데이트
            const categoryCounts = {};
            this.posts.forEach(post => {
                categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
            });

            this.categories.forEach(category => {
                if (category.id === 'all') {
                    category.count = this.posts.length;
                } else {
                    category.count = categoryCounts[category.id] || 0;
                }
            });
        },

        generateSidebarData() {
            // 인기 태그 생성
            const tagCounts = {};
            this.posts.forEach(post => {
                post.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });

            this.popularTags = Object.entries(tagCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 15);

            // 최근 포스트
            this.recentPosts = this.posts
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);

            // 아카이브 생성
            const archiveCounts = {};
            this.posts.forEach(post => {
                const month = this.formatMonth(post.date);
                archiveCounts[month] = (archiveCounts[month] || 0) + 1;
            });

            this.archives = Object.entries(archiveCounts)
                .map(([month, count]) => ({ month, count }))
                .sort((a, b) => b.month.localeCompare(a.month))
                .slice(0, 12);
        },

        searchPosts() {
            this.currentPage = 1;
            this.filterPosts();
        },

        filterByCategory(categoryId) {
            this.selectedCategory = categoryId;
            this.currentPage = 1;
            this.filterPosts();
        },

        toggleTag(tagName) {
            const index = this.selectedTags.indexOf(tagName);
            if (index > -1) {
                this.selectedTags.splice(index, 1);
            } else {
                this.selectedTags.push(tagName);
            }
            this.currentPage = 1;
            this.filterPosts();
        },

        filterPosts() {
            let filtered = [...this.posts];

            // 카테고리 필터
            if (this.selectedCategory !== 'all') {
                filtered = filtered.filter(post => post.category === this.selectedCategory);
            }

            // 검색 필터
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(post => 
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.author.toLowerCase().includes(query) ||
                    post.tags.some(tag => tag.toLowerCase().includes(query))
                );
            }

            // 태그 필터
            if (this.selectedTags.length > 0) {
                filtered = filtered.filter(post => 
                    this.selectedTags.every(tag => post.tags.includes(tag))
                );
            }

            this.filteredPosts = filtered;
            this.sortPosts();
        },

        sortPosts() {
            const sorted = [...this.filteredPosts];
            
            switch(this.sortBy) {
                case 'date-desc':
                    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'date-asc':
                    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                    break;
                case 'views':
                    sorted.sort((a, b) => b.views - a.views);
                    break;
                case 'title':
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                    break;
            }
            
            this.filteredPosts = sorted;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                // 페이지 변경 시 스크롤을 상단으로
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        goToPost(postId) {
            window.router.navigateTo(`blog-detail?id=${postId}`);
        },

        toggleLike(post) {
            post.isLiked = !post.isLiked;
            post.likes += post.isLiked ? 1 : -1;
            
            Toast.show({
                message: post.isLiked ? '포스트를 좋아합니다!' : '좋아요를 취소했습니다.',
                type: 'success',
                duration: 2000
            });
        },

        toggleBookmark(post) {
            post.isBookmarked = !post.isBookmarked;
            
            Toast.show({
                message: post.isBookmarked ? '북마크에 저장했습니다.' : '북마크에서 제거했습니다.',
                type: 'info',
                duration: 2000
            });
        },

        getCategoryName(categoryId) {
            const category = this.categories.find(cat => cat.id === categoryId);
            return category ? category.name : categoryId;
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        formatMonth(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long'
            });
        },

        getTagSize(count) {
            // 태그 클라우드에서 태그 크기 계산
            const minSize = 12;
            const maxSize = 18;
            const maxCount = Math.max(...this.popularTags.map(tag => tag.count));
            return minSize + (count / maxCount) * (maxSize - minSize);
        },

        filterByMonth(month) {
            // 아카이브에서 월별 필터링
            this.searchQuery = '';
            this.selectedCategory = 'all';
            this.selectedTags = [];
            
            this.filteredPosts = this.posts.filter(post => {
                return this.formatMonth(post.date) === month;
            });
            
            this.currentPage = 1;
            this.sortPosts();
            
            Toast.show({
                message: `${month} 포스트를 필터링했습니다.`,
                type: 'info',
                duration: 2000
            });
        }
    }
};