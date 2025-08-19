class VueCompatibleRouter {
    constructor(options = {}) {
        // 기본 환경설정
        this.config = {
            basePath: options.basePath || '/src',
            mode: options.mode || 'hash', // 'hash' 또는 'history'
            cacheMode: options.cacheMode || 'memory', // 'memory' 또는 'lru'
            cacheTTL: options.cacheTTL || 300000, // 5분 (밀리초)
            maxCacheSize: options.maxCacheSize || 50 // LRU 캐시 최대 크기
        };
        
        this.currentHash = '';
        this.currentVueApp = null;
        this.cache = new Map();
        this.cacheTimestamps = new Map();
        this.lruOrder = []; // LRU 순서 추적
        
        this.init();
    }

    init() {
        if (this.config.mode === 'hash') {
            window.addEventListener('hashchange', () => this.handleRouteChange());
            window.addEventListener('load', () => this.handleRouteChange());
            
            if (!window.location.hash) {
                window.location.hash = '#home';
            }
        } else {
            // History 모드
            window.addEventListener('popstate', () => this.handleRouteChange());
            window.addEventListener('load', () => this.handleRouteChange());
            
            if (window.location.pathname === '/') {
                this.navigateTo('home');
            }
        }
    }

    handleRouteChange() {
        let route;
        if (this.config.mode === 'hash') {
            route = window.location.hash.slice(1) || 'home';
        } else {
            route = window.location.pathname.slice(1) || 'home';
        }
        
        if (route !== this.currentHash) {
            this.currentHash = route;
            this.loadRoute(route);
        }
    }

    async loadRoute(routeName) {
        try {
            // 이전 Vue 앱 정리
            if (this.currentVueApp) {
                this.currentVueApp.unmount();
                this.currentVueApp = null;
            }

            // Vue 컴포넌트 생성 및 렌더링
            const component = await this.createVueComponent(routeName);
            await this.renderComponent(component, routeName);
        } catch (error) {
            this.showError(routeName);
        }
    }

    async createVueComponent(routeName) {
        const template = await this.loadTemplate(routeName);
        const script = await this.loadScript(routeName);
        const style = await this.loadStyle(routeName);
        
        // Vue 컴포넌트 생성
        const component = {
            ...script,
            template: template,
            methods: {
                ...script.methods,
                navigateTo: (route) => this.navigateTo(route),
                getCurrentRoute: () => this.getCurrentRoute()
            },
            _style: style,
            _routeName: routeName
        };
        
        return component;
    }

    async loadTemplate(routeName) {
        const cacheKey = `template_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const response = await fetch(`${this.config.basePath}/views/${routeName}.html`);
        if (!response.ok) throw new Error('Template not found');
        const template = await response.text();
        
        this.setCache(cacheKey, template);
        return template;
    }

    async loadScript(routeName) {
        const cacheKey = `script_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const module = await import(`..${this.config.basePath}/logic/${routeName}.js`);
        const script = module.default;
        
        this.setCache(cacheKey, script);
        return script;
    }

    async loadStyle(routeName) {
        const cacheKey = `style_${routeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const response = await fetch(`${this.config.basePath}/styles/${routeName}.css`);
        if (!response.ok) throw new Error('Style not found');
        const style = await response.text();
        
        this.setCache(cacheKey, style);
        return style;
    }

    async renderComponent(vueComponent, routeName) {
        const appElement = document.getElementById('app');
        if (!appElement) return;

        // 스타일 적용
        this.applyStyle(vueComponent._style, routeName);
        
        // Vue 3 앱 생성 및 마운트
        const { createApp } = Vue;
        this.currentVueApp = createApp(vueComponent);
        
        // Vue 3 전역 속성 설정
        this.currentVueApp.config.globalProperties.$router = {
            navigateTo: (route) => this.navigateTo(route),
            getCurrentRoute: () => this.getCurrentRoute(),
            currentRoute: this.currentHash
        };
        
        this.currentVueApp.mount('#app');
    }

    applyStyle(css, routeName) {
        // 기존 스타일 제거
        const existing = document.querySelector(`style[data-route="${routeName}"]`);
        if (existing) existing.remove();

        if (css) {
            const style = document.createElement('style');
            style.textContent = css;
            style.setAttribute('data-route', routeName);
            document.head.appendChild(style);
        }
    }

    showError(routeName) {
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h1>페이지를 찾을 수 없습니다</h1>
                    <p>${routeName} 페이지가 존재하지 않습니다.</p>
                    <button onclick="router.navigateTo('home')">홈으로 돌아가기</button>
                </div>
            `;
        }
    }

    navigateTo(routeName) {
        if (this.config.mode === 'hash') {
            window.location.hash = `#${routeName}`;
        } else {
            window.history.pushState({}, '', `/${routeName}`);
            this.handleRouteChange();
        }
    }

    getCurrentRoute() {
        return this.currentHash;
    }
    
    // 캐시 관리 메서드들
    setCache(key, value) {
        const now = Date.now();
        
        if (this.config.cacheMode === 'lru') {
            // LRU 캐시 관리
            if (this.cache.size >= this.config.maxCacheSize && !this.cache.has(key)) {
                const oldestKey = this.lruOrder.shift();
                this.cache.delete(oldestKey);
                this.cacheTimestamps.delete(oldestKey);
            }
            
            // 기존 키가 있으면 LRU 순서에서 제거
            const existingIndex = this.lruOrder.indexOf(key);
            if (existingIndex > -1) {
                this.lruOrder.splice(existingIndex, 1);
            }
            
            // 최신 순서로 추가
            this.lruOrder.push(key);
        }
        
        this.cache.set(key, value);
        this.cacheTimestamps.set(key, now);
    }
    
    getFromCache(key) {
        const now = Date.now();
        const timestamp = this.cacheTimestamps.get(key);
        
        // TTL 체크
        if (timestamp && (now - timestamp) > this.config.cacheTTL) {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
            
            if (this.config.cacheMode === 'lru') {
                const index = this.lruOrder.indexOf(key);
                if (index > -1) {
                    this.lruOrder.splice(index, 1);
                }
            }
            
            return null;
        }
        
        const value = this.cache.get(key);
        
        if (value && this.config.cacheMode === 'lru') {
            // LRU 순서 업데이트
            const index = this.lruOrder.indexOf(key);
            if (index > -1) {
                this.lruOrder.splice(index, 1);
                this.lruOrder.push(key);
            }
        }
        
        return value;
    }
    
    clearCache() {
        this.cache.clear();
        this.cacheTimestamps.clear();
        this.lruOrder = [];
    }
    
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: this.config.maxCacheSize,
            mode: this.config.cacheMode,
            ttl: this.config.cacheTTL
        };
    }
}

// 전역 라우터는 index.html에서 환경설정과 함께 생성됨