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
            postId: null,
            post: {
                title: '',
                content: '',
                author: '',
                date: '',
                category: '',
                tags: [],
                thumbnail: '',
                views: 0,
                likes: 0,
                readingTime: 0,
                isLiked: false,
                isBookmarked: false
            },
            comments: [],
            newComment: {
                name: '',
                email: '',
                content: ''
            },
            relatedPosts: [],
            popularPosts: [],
            relatedTags: [],
            previousPost: null,
            nextPost: null,
            tableOfContents: [],
            categories: {
                'tech': '기술',
                'tutorial': '튜토리얼',
                'lifestyle': '라이프스타일',
                'review': '리뷰'
            }
        };
    },

    computed: {
        canSubmitComment() {
            return this.newComment.name.trim() && 
                   this.newComment.email.trim() && 
                   this.newComment.content.trim();
        }
    },

    mounted() {
        this.loadPostDetail();
        this.loadComments();
        this.loadSidebarData();
        this.generateTableOfContents();
    },

    methods: {
        loadPostDetail() {
            // URL 파라미터에서 포스트 ID 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            this.postId = parseInt(urlParams.get('id'));

            // 샘플 포스트 데이터 (실제로는 API 호출)
            const posts = {
                1: {
                    id: 1,
                    title: 'Vue 3 Composition API 완벽 가이드',
                    content: `
                        <h2>Vue 3 Composition API란?</h2>
                        <p>Vue 3의 Composition API는 컴포넌트 로직을 구성하는 새로운 방식을 제공합니다. Options API의 한계를 극복하고, 더 유연하고 재사용 가능한 코드를 작성할 수 있게 해줍니다.</p>
                        
                        <h3>주요 특징</h3>
                        <ul>
                            <li><strong>논리적 관심사 분리</strong>: 관련된 코드를 함께 그룹화</li>
                            <li><strong>재사용성 향상</strong>: 컴포저블 함수로 로직 재사용</li>
                            <li><strong>TypeScript 지원</strong>: 더 나은 타입 추론</li>
                        </ul>

                        <h3>기본 사용법</h3>
                        <pre><code>import { ref, reactive, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const user = reactive({
      name: '홍길동',
      age: 30
    })
    
    const doubleCount = computed(() => count.value * 2)
    
    onMounted(() => {
      console.log('컴포넌트가 마운트되었습니다.')
    })
    
    function increment() {
      count.value++
    }
    
    return {
      count,
      user,
      doubleCount,
      increment
    }
  }
}</code></pre>

                        <h3>Options API vs Composition API</h3>
                        <p>기존 Options API와 비교했을 때 Composition API의 장점은 다음과 같습니다:</p>
                        
                        <h4>Options API의 한계</h4>
                        <p>Options API는 컴포넌트가 복잡해질수록 관련 로직이 여러 옵션에 분산되는 문제가 있습니다. 예를 들어, 사용자 정보를 관리하는 로직이 data, methods, computed, mounted 등에 흩어져 있어 코드를 이해하고 유지보수하기 어려워집니다.</p>

                        <h4>Composition API의 해결책</h4>
                        <p>Composition API는 관련된 로직을 함께 그룹화할 수 있게 해줍니다. 사용자 정보 관리 로직을 하나의 함수로 추출하여 재사용할 수 있습니다.</p>

                        <pre><code>// composables/useUser.js
import { ref, computed } from 'vue'

export function useUser() {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  
  const login = async (credentials) => {
    // 로그인 로직
    user.value = await api.login(credentials)
  }
  
  const logout = () => {
    user.value = null
  }
  
  return {
    user,
    isLoggedIn,
    login,
    logout
  }
}</code></pre>

                        <h3>실전 예제: 할 일 관리</h3>
                        <p>간단한 할 일 관리 기능을 Composition API로 구현해보겠습니다:</p>

                        <pre><code>import { ref, computed } from 'vue'

export function useTodos() {
  const todos = ref([])
  const newTodo = ref('')
  
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed)
  )
  
  const pendingTodos = computed(() => 
    todos.value.filter(todo => !todo.completed)
  )
  
  const addTodo = () => {
    if (newTodo.value.trim()) {
      todos.value.push({
        id: Date.now(),
        text: newTodo.value,
        completed: false
      })
      newTodo.value = ''
    }
  }
  
  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  const removeTodo = (id) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }
  
  return {
    todos,
    newTodo,
    completedTodos,
    pendingTodos,
    addTodo,
    toggleTodo,
    removeTodo
  }
}</code></pre>

                        <h3>생명주기 훅 사용하기</h3>
                        <p>Composition API에서는 생명주기 훅을 함수로 사용합니다:</p>

                        <pre><code>import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('컴포넌트가 마운트되었습니다.')
    })
    
    onUpdated(() => {
      console.log('컴포넌트가 업데이트되었습니다.')
    })
    
    onUnmounted(() => {
      console.log('컴포넌트가 언마운트되었습니다.')
    })
  }
}</code></pre>

                        <h3>결론</h3>
                        <p>Vue 3 Composition API는 더 유연하고 재사용 가능한 코드를 작성할 수 있게 해주는 강력한 도구입니다. 특히 복잡한 컴포넌트나 로직을 여러 컴포넌트에서 재사용해야 하는 경우에 그 진가를 발휘합니다.</p>

                        <p>하지만 모든 경우에 Composition API를 사용해야 하는 것은 아닙니다. 간단한 컴포넌트의 경우 Options API가 더 직관적일 수 있으니, 프로젝트의 요구사항과 팀의 상황에 맞게 적절히 선택하여 사용하시기 바랍니다.</p>
                    `,
                    author: 'ViewLogic Team',
                    date: '2024-01-15',
                    category: 'tech',
                    tags: ['Vue.js', 'JavaScript', 'Frontend'],
                    thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&h=400&fit=crop&crop=center',
                    views: 1205,
                    likes: 42,
                    readingTime: 8,
                    isLiked: false,
                    isBookmarked: false
                },
                2: {
                    id: 2,
                    title: 'CSS Grid vs Flexbox: 언제 무엇을 사용할까?',
                    content: `
                        <h2>CSS Layout의 진화</h2>
                        <p>웹 개발의 역사를 보면 레이아웃을 다루는 방법이 지속적으로 발전해왔습니다. Table 레이아웃에서 시작해서 Float, Positioning을 거쳐 현재의 Flexbox와 Grid에 이르기까지, 각 시대마다 최적의 해결책이 등장했습니다.</p>
                        
                        <h3>Flexbox: 1차원 레이아웃의 왕</h3>
                        <p>Flexbox는 한 방향(행 또는 열)으로 요소를 배치하는데 특화된 레이아웃 시스템입니다.</p>
                        
                        <pre><code>.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}</code></pre>

                        <h4>Flexbox의 주요 특징</h4>
                        <ul>
                            <li>1차원 레이아웃 (행 또는 열)</li>
                            <li>동적 크기 조절</li>
                            <li>정렬과 분배가 쉬움</li>
                            <li>컨테이너와 아이템 모두에 속성 적용</li>
                        </ul>

                        <h3>Grid: 2차원 레이아웃의 강자</h3>
                        <p>CSS Grid는 행과 열을 동시에 다루는 2차원 레이아웃 시스템입니다.</p>

                        <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}</code></pre>

                        <h4>Grid의 주요 특징</h4>
                        <ul>
                            <li>2차원 레이아웃 (행과 열)</li>
                            <li>정확한 위치 제어</li>
                            <li>복잡한 레이아웃 구현 가능</li>
                            <li>명시적 그리드 라인 정의</li>
                        </ul>

                        <h3>언제 무엇을 사용할까?</h3>
                        
                        <h4>Flexbox를 사용해야 할 때</h4>
                        <ul>
                            <li><strong>컴포넌트 레이아웃</strong>: 버튼, 카드, 네비게이션 등</li>
                            <li><strong>1차원 정렬</strong>: 아이템들을 한 줄로 배치</li>
                            <li><strong>동적 크기</strong>: 컨텐츠에 따라 크기가 변하는 경우</li>
                            <li><strong>중앙 정렬</strong>: 요소를 쉽게 중앙에 배치</li>
                        </ul>

                        <h4>Grid를 사용해야 할 때</h4>
                        <ul>
                            <li><strong>페이지 레이아웃</strong>: 전체 페이지 구조 설계</li>
                            <li><strong>2차원 정렬</strong>: 행과 열을 모두 고려해야 하는 경우</li>
                            <li><strong>복잡한 레이아웃</strong>: 겹치는 영역이나 복잡한 구조</li>
                            <li><strong>정확한 위치</strong>: 특정 위치에 요소를 배치해야 하는 경우</li>
                        </ul>

                        <h3>실전 예제</h3>
                        
                        <h4>Flexbox로 네비게이션 바 만들기</h4>
                        <pre><code>.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-item {
  flex-shrink: 0;
}</code></pre>

                        <h4>Grid로 카드 레이아웃 만들기</h4>
                        <pre><code>.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}</code></pre>

                        <h3>함께 사용하기</h3>
                        <p>Flexbox와 Grid는 서로 경쟁하는 기술이 아닙니다. 오히려 함께 사용했을 때 더 강력해집니다:</p>

                        <pre><code>.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}</code></pre>

                        <h3>성능 고려사항</h3>
                        <p>일반적으로 Flexbox와 Grid 모두 성능이 우수하지만, 몇 가지 고려할 점이 있습니다:</p>

                        <ul>
                            <li><strong>Flexbox</strong>: 동적 계산이 많아 매우 복잡한 레이아웃에서는 성능 저하 가능</li>
                            <li><strong>Grid</strong>: 명시적 정의로 예측 가능한 성능, 대용량 그리드에서도 안정적</li>
                        </ul>

                        <h3>브라우저 지원</h3>
                        <p>현재 Flexbox와 Grid 모두 모든 모던 브라우저에서 잘 지원됩니다. IE11에서도 기본적인 기능은 사용 가능하지만, 일부 버그가 있으니 주의가 필요합니다.</p>

                        <h3>결론</h3>
                        <p>Flexbox와 Grid는 각각의 용도가 다릅니다. 간단히 정리하면:</p>
                        <ul>
                            <li><strong>Flexbox</strong>: 컴포넌트 내부의 1차원 레이아웃</li>
                            <li><strong>Grid</strong>: 페이지 전체의 2차원 레이아웃</li>
                        </ul>

                        <p>두 기술을 적절히 조합해서 사용하면 현대적이고 반응형인 웹 레이아웃을 효과적으로 구현할 수 있습니다.</p>
                    `,
                    author: 'CSS Ninja',
                    date: '2024-01-12',
                    category: 'tutorial',
                    tags: ['CSS', 'Layout', 'Design'],
                    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center',
                    views: 892,
                    likes: 35,
                    readingTime: 6,
                    isLiked: false,
                    isBookmarked: false
                }
            };

            this.post = posts[this.postId] || posts[1];
            
            // 조회수 증가
            this.post.views += 1;
            
            // 북마크 상태 확인
            const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
            this.post.isBookmarked = bookmarks.includes(this.postId);
        },

        loadComments() {
            // 샘플 댓글 데이터
            this.comments = [
                {
                    id: 1,
                    name: '김개발',
                    email: 'kim@example.com',
                    content: '정말 유용한 정보네요! Composition API를 이해하는데 큰 도움이 되었습니다.',
                    date: '2024-01-16',
                    likes: 5,
                    replies: [
                        {
                            id: 2,
                            name: 'ViewLogic Team',
                            email: 'team@viewlogic.com',
                            content: '도움이 되셨다니 기쁩니다! 앞으로도 좋은 콘텐츠로 찾아뵙겠습니다.',
                            date: '2024-01-16'
                        }
                    ]
                },
                {
                    id: 3,
                    name: '프론트엔드러',
                    email: 'frontend@example.com',
                    content: 'Options API에서 Composition API로 마이그레이션 할 때 주의해야 할 점도 알려주시면 좋겠어요.',
                    date: '2024-01-17',
                    likes: 3,
                    replies: []
                }
            ];
        },

        loadSidebarData() {
            // 관련 포스트 (같은 카테고리 또는 태그)
            this.relatedPosts = [
                {
                    id: 5,
                    title: 'JavaScript ES2024 새로운 기능들',
                    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=150&h=100&fit=crop&crop=center',
                    date: '2024-01-05'
                },
                {
                    id: 6,
                    title: 'React vs Vue vs Angular 2024년 비교',
                    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=100&fit=crop&crop=center',
                    date: '2024-01-03'
                },
                {
                    id: 9,
                    title: '개발자가 알아야 할 보안 기초',
                    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&h=100&fit=crop&crop=center',
                    date: '2023-12-22'
                }
            ];

            // 인기 포스트
            this.popularPosts = [
                { id: 10, title: '개발자의 커리어 성장 로드맵', views: 2156, rank: 1 },
                { id: 6, title: 'React vs Vue vs Angular 2024년 비교', views: 1834, rank: 2 },
                { id: 3, title: '개발자를 위한 생산성 도구 TOP 10', views: 1456, rank: 3 },
                { id: 12, title: 'TypeScript 마이그레이션 경험담', views: 1234, rank: 4 },
                { id: 1, title: 'Vue 3 Composition API 완벽 가이드', views: 1205, rank: 5 }
            ];

            // 관련 태그
            this.relatedTags = [
                { name: 'Vue.js', count: 5 },
                { name: 'JavaScript', count: 8 },
                { name: 'Frontend', count: 12 },
                { name: 'React', count: 6 },
                { name: 'TypeScript', count: 4 }
            ];

            // 이전/다음 포스트
            this.previousPost = { id: 2, title: 'CSS Grid vs Flexbox: 언제 무엇을 사용할까?' };
            this.nextPost = null; // 첫 번째 포스트라고 가정
        },

        generateTableOfContents() {
            // 포스트 콘텐츠에서 제목 태그 추출하여 목차 생성
            this.tableOfContents = [
                { id: 'vue3-composition-api', text: 'Vue 3 Composition API란?', level: 2 },
                { id: 'main-features', text: '주요 특징', level: 3 },
                { id: 'basic-usage', text: '기본 사용법', level: 3 },
                { id: 'vs-options-api', text: 'Options API vs Composition API', level: 3 },
                { id: 'practical-example', text: '실전 예제: 할 일 관리', level: 3 },
                { id: 'lifecycle-hooks', text: '생명주기 훅 사용하기', level: 3 },
                { id: 'conclusion', text: '결론', level: 3 }
            ];
        },

        toggleLike() {
            this.post.isLiked = !this.post.isLiked;
            this.post.likes += this.post.isLiked ? 1 : -1;
            
            Toast.show({
                message: this.post.isLiked ? '포스트를 좋아합니다!' : '좋아요를 취소했습니다.',
                type: 'success',
                duration: 2000
            });
        },

        toggleBookmark() {
            this.post.isBookmarked = !this.post.isBookmarked;
            
            const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
            if (this.post.isBookmarked) {
                bookmarks.push(this.postId);
            } else {
                const index = bookmarks.indexOf(this.postId);
                if (index > -1) {
                    bookmarks.splice(index, 1);
                }
            }
            localStorage.setItem('blog-bookmarks', JSON.stringify(bookmarks));
            
            Toast.show({
                message: this.post.isBookmarked ? '북마크에 저장했습니다.' : '북마크에서 제거했습니다.',
                type: 'info',
                duration: 2000
            });
        },

        sharePost() {
            if (navigator.share) {
                navigator.share({
                    title: this.post.title,
                    text: this.post.excerpt,
                    url: window.location.href
                });
            } else {
                this.copyLink();
            }
        },

        shareOn(platform) {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(this.post.title);
            
            const urls = {
                twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
            };
            
            if (urls[platform]) {
                window.open(urls[platform], '_blank', 'width=600,height=400');
            }
        },

        copyLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                Toast.show({
                    message: '링크가 클립보드에 복사되었습니다.',
                    type: 'success',
                    duration: 2000
                });
            });
        },

        submitComment() {
            if (!this.canSubmitComment) return;
            
            const newComment = {
                id: Date.now(),
                name: this.newComment.name,
                email: this.newComment.email,
                content: this.newComment.content,
                date: new Date().toISOString().split('T')[0],
                likes: 0,
                replies: []
            };
            
            this.comments.unshift(newComment);
            
            // 폼 초기화
            this.newComment = {
                name: '',
                email: '',
                content: ''
            };
            
            Toast.show({
                message: '댓글이 등록되었습니다.',
                type: 'success',
                duration: 2000
            });
        },

        likeComment(comment) {
            comment.likes += 1;
            Toast.show({
                message: '댓글에 좋아요를 눌렀습니다.',
                type: 'info',
                duration: 1500
            });
        },

        replyToComment(comment) {
            Modal.show({
                title: '답글 작성',
                content: `
                    <p><strong>${comment.name}</strong>님의 댓글에 답글을 작성합니다:</p>
                    <blockquote style="background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #ccc;">
                        ${comment.content}
                    </blockquote>
                    <p>답글 기능은 준비 중입니다.</p>
                `,
                buttons: [
                    {
                        text: '확인',
                        class: 'btn btn-primary',
                        onClick: () => Modal.hide()
                    }
                ]
            });
        },

        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },

        goToPost(postId) {
            window.router.navigateTo(`blog-detail?id=${postId}`);
        },

        searchByTag(tag) {
            window.router.navigateTo(`blog?tag=${encodeURIComponent(tag)}`);
        },

        navigateTo(route) {
            window.router.navigateTo(route);
        },

        getCategoryName(categoryId) {
            return this.categories[categoryId] || categoryId;
        },

        getAuthorAvatar(author) {
            // 작성자별 아바타 (실제로는 사용자 프로필 이미지)
            const avatars = {
                'ViewLogic Team': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
                'CSS Ninja': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
                '김개발': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
                '프론트엔드러': 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=80&h=80&fit=crop&crop=face'
            };
            return avatars[author] || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=face';
        },

        getCommentAvatar(name) {
            return 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face';
        },

        getAuthorDescription(author) {
            const descriptions = {
                'ViewLogic Team': '모던 웹 개발에 대한 실무 경험과 인사이트를 공유하는 개발팀입니다.',
                'CSS Ninja': 'CSS와 디자인에 특화된 프론트엔드 개발자입니다. 아름다운 웹을 만드는 것이 목표입니다.',
                'ProductivityPro': '개발 생산성과 도구에 관심이 많은 시니어 개발자입니다.',
                'Backend Master': '백엔드 개발과 성능 최적화 전문가입니다.'
            };
            return descriptions[author] || '열정적인 개발자입니다.';
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        getTagSize(count) {
            const minSize = 12;
            const maxSize = 16;
            const maxCount = Math.max(...this.relatedTags.map(tag => tag.count));
            return minSize + (count / maxCount) * (maxSize - minSize);
        }
    }
};