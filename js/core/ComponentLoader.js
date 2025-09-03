/**
 * ComponentLoader
 * 동적으로 컴포넌트를 로드하고 등록하는 시스템
 */
export class ComponentLoader {
    constructor(router = null, options = {}) {
        // 하위 호환성을 위해 첫 번째 파라미터가 객체이면 기존 방식으로 처리
        if (router && typeof router === 'object' && !router.config) {
            // 기존 방식: new ComponentLoader(options)
            options = router;
            router = null;
        }
        
        this.config = {
            basePath: options.basePath || '/src/components',
            cache: options.cache !== false,
            globalComponents: options.globalComponents || [],
            debug: options.debug || false,
            ...options
        };
        
        // 라우터 인스턴스 참조 (선택적)
        this.router = router;
        
        this.componentCache = new Map();
        this.loadingPromises = new Map();
        this.registeredComponents = new Set();
        this.unifiedComponentsModule = null;
    }
    
    /**
     * 컴포넌트를 비동기로 로드
     */
    async loadComponent(componentName) {
        // 캐시에서 먼저 확인
        if (this.config.cache && this.componentCache.has(componentName)) {
            return this.componentCache.get(componentName);
        }
        
        // 이미 로딩 중인 경우 기존 Promise 반환
        if (this.loadingPromises.has(componentName)) {
            return this.loadingPromises.get(componentName);
        }
        
        const loadPromise = this._loadComponentFromFile(componentName);
        this.loadingPromises.set(componentName, loadPromise);
        
        try {
            const component = await loadPromise;
            
            // 캐시에 저장
            if (this.config.cache) {
                this.componentCache.set(componentName, component);
            }
            
            return component;
        } finally {
            this.loadingPromises.delete(componentName);
        }
    }
    
    /**
     * 파일에서 컴포넌트 로드
     */
    async _loadComponentFromFile(componentName) {
        const componentPath = `${this.config.basePath}/${componentName}.js`;
        
        try {
            const module = await import(componentPath);
            const component = module.default;
            
            if (!component) {
                throw new Error(`Component '${componentName}' has no default export`);
            }
            
            // 컴포넌트 이름이 없으면 설정
            if (!component.name) {
                component.name = componentName;
            }
            
            console.log(`✅ Component '${componentName}' loaded successfully`);
            return component;
            
        } catch (error) {
            console.error(`❌ Failed to load component '${componentName}':`, error);
            throw new Error(`Component '${componentName}' not found: ${error.message}`);
        }
    }
    
    /**
     * Vue 앱에 컴포넌트 등록
     */
    registerComponent(vueApp, componentName, component) {
        if (!vueApp || !vueApp.component) {
            throw new Error('Invalid Vue app instance');
        }
        
        vueApp.component(componentName, component);
        this.registeredComponents.add(componentName);
        console.log(`📝 Component '${componentName}' registered globally`);
    }
    
    /**
     * Vue 앱에 여러 컴포넌트 일괄 등록
     */
    async registerComponents(vueApp, componentNames) {
        const loadPromises = componentNames.map(async (name) => {
            try {
                const component = await this.loadComponent(name);
                this.registerComponent(vueApp, name, component);
                return { name, component, success: true };
            } catch (error) {
                console.warn(`Failed to register component '${name}':`, error);
                return { name, error, success: false };
            }
        });
        
        const results = await Promise.all(loadPromises);
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        console.log(`📦 Component registration complete: ${successful.length} successful, ${failed.length} failed`);
        
        return {
            successful: successful.map(r => r.name),
            failed: failed.map(r => ({ name: r.name, error: r.error }))
        };
    }
    
    /**
     * 전역 컴포넌트들을 자동으로 등록
     */
    async registerGlobalComponents(vueApp) {
        if (this.config.globalComponents.length === 0) {
            return { successful: [], failed: [] };
        }
        
        console.log(`🌍 Registering global components: ${this.config.globalComponents.join(', ')}`);
        return this.registerComponents(vueApp, this.config.globalComponents);
    }
    
    /**
     * 컴포넌트가 이미 등록되었는지 확인
     */
    isComponentRegistered(componentName) {
        return this.registeredComponents.has(componentName);
    }
    
    /**
     * 캐시된 컴포넌트 가져오기
     */
    getCachedComponent(componentName) {
        return this.componentCache.get(componentName);
    }
    
    /**
     * 캐시 클리어
     */
    clearCache(componentName = null) {
        if (componentName) {
            this.componentCache.delete(componentName);
            console.log(`🗑️ Component cache cleared for: ${componentName}`);
        } else {
            this.componentCache.clear();
            console.log(`🗑️ All component cache cleared`);
        }
    }
    
    /**
     * 캐시 상태 정보
     */
    getCacheInfo() {
        return {
            cachedComponents: Array.from(this.componentCache.keys()),
            registeredComponents: Array.from(this.registeredComponents),
            loadingComponents: Array.from(this.loadingPromises.keys()),
            cacheSize: this.componentCache.size
        };
    }
    
    /**
     * 모든 UI 컴포넌트들을 가져오기
     */
    async loadAllComponents() {
        // 프로덕션 모드에서 통합 컴포넌트 모듈 사용
        if (this.unifiedComponentsModule && this.unifiedComponentsModule.components) {
            console.log(`📦 Using unified components (${Object.keys(this.unifiedComponentsModule.components).length} components)`);
            return this.unifiedComponentsModule.components;
        }
        
        // 개발 모드: 개별 컴포넌트 로딩
        // 구성 옵션 우선 적용: componentNames(string[]) 또는 getComponentNames(()=>string[])
        let componentNames = [];
        if (Array.isArray(this.config.componentNames) && this.config.componentNames.length > 0) {
            componentNames = [...this.config.componentNames];
        } else if (typeof this.config.getComponentNames === 'function') {
            try {
                const resolved = await this.config.getComponentNames();
                if (Array.isArray(resolved) && resolved.length > 0) {
                    componentNames = [...resolved];
                }
            } catch (e) {
                console.warn('getComponentNames() failed, falling back to defaults:', e);
            }
        }
        
        // 폴백: 기존 하드코딩 목록
        if (componentNames.length === 0) {
            componentNames = [
                'Button', 'Modal', 'Card', 'Toast', 'Input', 'Tabs',
                'Checkbox', 'Alert', 'DynamicInclude', 'HtmlInclude'
            ];
        }
        
        const components = {};
        
        for (const name of componentNames) {
            try {
                const component = await this.loadComponent(name);
                if (component) {
                    components[name] = component;
                }
            } catch (error) {
                console.warn(`❌ Failed to load component ${name}:`, error.message);
            }
        }
        
        console.log(`🔄 Total components loaded: ${Object.keys(components).length}`);
        return components;
    }

    /**
     * 통합 컴포넌트 모듈 로딩 (프로덕션용)
     */
    async loadUnifiedComponents(routesPath) {
        try {
            // 통합 _components.js 파일 로드 (성능 최적화된 통합 컴포넌트)
            const componentsPath = `${routesPath}/_components.js`;
            
            console.log('📦 Loading unified components from:', componentsPath);
            
            const componentsModule = await import(componentsPath);
            console.log('📦 All components module loaded');
            
            // 컴포넌트 등록 함수가 있는지 확인
            if (typeof componentsModule.registerComponents === 'function') {
                // 통합 컴포넌트 모듈 설정
                this.setUnifiedComponentsModule(componentsModule);
                console.log('📦 Available components:', Object.keys(componentsModule.components || {}));
                return true;
            } else {
                throw new Error('registerComponents function not found in components module');
            }
            
        } catch (error) {
            console.error('❌ Failed to load unified components:', error);
            console.error('❌ Error details:', error.stack);
            throw error;
        }
    }

    /**
     * 통합 컴포넌트 모듈 설정 (프로덕션용)
     */
    setUnifiedComponentsModule(module) {
        this.unifiedComponentsModule = module;
        console.log('🧩 Unified components module set for ComponentLoader');
    }

    /**
     * 컴포넌트 사전 로드 (프리로딩)
     */
    async preloadComponents(componentNames) {
        console.log(`🚀 Preloading components: ${componentNames.join(', ')}`);
        
        const preloadPromises = componentNames.map(async (name) => {
            try {
                await this.loadComponent(name);
                return { name, success: true };
            } catch (error) {
                console.warn(`Failed to preload component '${name}':`, error);
                return { name, success: false, error };
            }
        });
        
        const results = await Promise.all(preloadPromises);
        const successful = results.filter(r => r.success).map(r => r.name);
        const failed = results.filter(r => !r.success);
        
        console.log(`📦 Component preloading complete: ${successful.length} successful, ${failed.length} failed`);
        
        return { successful, failed };
    }
}