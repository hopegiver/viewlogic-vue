export default {
  data() {
    return {
      activePageId: 'admin-overview',
      adminSectionOpen: true,
      userSectionOpen: false,
      lastUpdated: new Date().toLocaleDateString(),
      currentTitle: '',
      treeNodeStates: {
        'admin-userManagement': false,
        'admin-systemSettings': false,
        'admin-monitoring': false,
        'user-gettingStarted': false,
        'user-features': false,
        'user-dataManagement': false,
        'user-troubleshooting': false
      }
    };
  },
  
  computed: {
    getCurrentSectionTitle() {
      if (this.activePageId) {
        const parts = this.activePageId.split('-');
        if (parts.length >= 2) {
          return this.$t(`manual.${parts[0]}.${parts.slice(1).join('')}.title`);
        }
      }
      return this.$t('manual.title');
    }
  },
  
  watch: {
    activePageId() {
      this.updateTitle();
      this.updateUrlParams();
    }
  },
  
  methods: {
    toggleTreeNode(nodeId) {
      if (nodeId === 'admin') {
        this.adminSectionOpen = !this.adminSectionOpen;
        if (this.adminSectionOpen && this.userSectionOpen) {
          this.userSectionOpen = false;
          Object.keys(this.treeNodeStates).forEach(key => {
            if (key.startsWith('user-')) {
              this.treeNodeStates[key] = false;
            }
          });
        }
      } else if (nodeId === 'user') {
        this.userSectionOpen = !this.userSectionOpen;
        if (this.userSectionOpen && this.adminSectionOpen) {
          this.adminSectionOpen = false;
          Object.keys(this.treeNodeStates).forEach(key => {
            if (key.startsWith('admin-')) {
              this.treeNodeStates[key] = false;
            }
          });
        }
      } else {
        this.treeNodeStates[nodeId] = !this.treeNodeStates[nodeId];
      }
    },
    
    setActiveContent(pageId) {
      this.activePageId = pageId;
      
      // 해당 섹션이 속한 메뉴 열기
      if (pageId.startsWith('admin-')) {
        this.adminSectionOpen = true;
        this.userSectionOpen = false;
        Object.keys(this.treeNodeStates).forEach(key => {
          if (key.startsWith('user-')) {
            this.treeNodeStates[key] = false;
          }
        });
      } else if (pageId.startsWith('user-')) {
        this.userSectionOpen = true;
        this.adminSectionOpen = false;
        Object.keys(this.treeNodeStates).forEach(key => {
          if (key.startsWith('admin-')) {
            this.treeNodeStates[key] = false;
          }
        });
      }
      
      // 해당 섹션에 하위 메뉴가 있으면 열기
      if (this.treeNodeStates.hasOwnProperty(pageId)) {
        this.treeNodeStates[pageId] = true;
      }
      
      // 페이지 상단으로 스크롤
      const mainContent = document.querySelector('.manual-main');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    },
    
    updateUrlParams() {
      if (this.activePageId) {
        window.history.pushState({}, '', `./#/manual?id=${this.activePageId}`);
      } else {
        window.history.pushState({}, '', './#/manual');
      }
    },
    
    scrollToSubsection(subsectionId) {
      setTimeout(() => {
        const element = document.getElementById(subsectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    },
    
    updateTitle() {
      this.currentTitle = this.getCurrentSectionTitle;
    },
    
    printManual() {
      window.print();
    },
    
    exportToPDF() {
      const content = document.querySelector('.manual-content');
      if (content) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>${this.$t('manual.title')} - ${this.currentTitle}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1, h2, h3, h4 { color: #333; }
                .section { margin-bottom: 30px; }
                .subsection { margin-left: 20px; margin-bottom: 20px; }
                ol, ul { margin-left: 20px; }
                li { margin-bottom: 8px; }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              <h1>${this.$t('manual.title')} - ${this.currentTitle}</h1>
              ${content.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    },
    
    searchInManual(searchTerm) {
      if (!searchTerm) return;
      
      const content = document.querySelector('.manual-content');
      if (!content) return;
      
      // 이전 하이라이트 제거
      const highlighted = content.querySelectorAll('.search-highlight');
      highlighted.forEach(el => {
        el.classList.remove('search-highlight');
        el.style.backgroundColor = '';
      });
      
      const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      const matches = [];
      
      while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(searchTerm.toLowerCase())) {
          matches.push(node.parentElement);
        }
      }
      
      if (matches.length > 0) {
        matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        matches.forEach(el => {
          el.classList.add('search-highlight');
          el.style.backgroundColor = '#ffeb3b';
          setTimeout(() => {
            el.classList.remove('search-highlight');
            el.style.backgroundColor = '';
          }, 3000);
        });
      }
    },
    
    
    handleKeyDown(e) {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchTerm = prompt(this.$t('manual.searchPrompt'));
        if (searchTerm) {
          this.searchInManual(searchTerm);
        }
      }
      
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        this.printManual();
      }
      
      // 키보드 네비게이션 (방향키로 트리 탐색)
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // 추후 키보드 네비게이션 구현 시 사용
      }
    }
  },
  
  mounted() {
    // URL 파라미터 체크 (./#/manual?id=xxx 형식)
    const fullUrl = window.location.href;
    let pageId = null;
    
    // ./#/manual?id=xxx 형식에서 id 파라미터 추출
    if (fullUrl.includes('#/manual?id=')) {
      const urlMatch = fullUrl.match(/#\/manual\?id=([^&]+)/);
      if (urlMatch) {
        pageId = urlMatch[1];
      }
    }
    
    if (pageId) {
      this.activePageId = pageId;
      
      if (pageId.startsWith('admin-')) {
        this.adminSectionOpen = true;
        this.userSectionOpen = false;
      } else if (pageId.startsWith('user-')) {
        this.userSectionOpen = true;
        this.adminSectionOpen = false;
      }
      
      // 해당 섹션에 하위 메뉴가 있으면 열기
      if (this.treeNodeStates.hasOwnProperty(pageId)) {
        this.treeNodeStates[pageId] = true;
      }
    }
    
    // 초기 타이틀 설정
    this.updateTitle();
    
    
    // 키보드 이벤트 리스너 등록
    document.addEventListener('keydown', this.handleKeyDown);
  },
  
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
};