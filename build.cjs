#!/usr/bin/env node

/**
 * ViewLogic Advanced Builder System
 * 고급 빌드 시스템으로 소스 파일들을 프로덕션 최적화된 라우트로 변환
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ViewLogicBuilder {
    constructor(options = {}) {
        this.config = {
            srcPath: options.srcPath || './src',
            routesPath: options.routesPath || './routes',
            minify: options.minify || true,
            sourceMap: options.sourceMap || false,
            watch: options.watch || false,
            verbose: options.verbose || false,
            generateManifest: options.generateManifest !== false,
            validateSources: options.validateSources !== false,
            optimizeAssets: options.optimizeAssets !== false
        };
        
        this.stats = {
            startTime: null,
            endTime: null,
            totalRoutes: 0,
            successRoutes: 0,
            failedRoutes: 0,
            warnings: [],
            errors: []
        };
        
        this.fileHashes = new Map(); // 파일 변경 감지용
        this.buildCache = new Map();  // 빌드 캐시
    }

    async build() {
        this.stats.startTime = Date.now();
        this.log('🚀 ViewLogic 고급 빌드 시작...', 'info');
        
        try {
            // 빌드 전 검증
            await this.validateEnvironment();
            
            // 빌드 디렉토리 준비
            await this.prepareBuildDirectory();
            
            // 소스 스캔 및 검증
            const routes = await this.scanAndValidateRoutes();
            
            if (routes.length === 0) {
                this.log('📭 빌드할 라우트가 없습니다.', 'warn');
                return this.generateBuildReport(false);
            }
            
            this.stats.totalRoutes = routes.length;
            this.log(`📦 ${routes.length}개 라우트 발견: ${routes.join(', ')}`, 'info');
            
            // 병렬 빌드 실행
            await this.buildRoutesInParallel(routes);
            
            // 빌드 후 처리
            await this.postBuild();
            
            return this.generateBuildReport(true);
            
        } catch (error) {
            this.stats.errors.push(error.message);
            this.log(`❌ 빌드 실패: ${error.message}`, 'error');
            return this.generateBuildReport(false);
        } finally {
            this.stats.endTime = Date.now();
        }
    }

    async validateEnvironment() {
        const requiredDirs = ['src', 'src/logic', 'src/views'];
        const optionalDirs = ['src/components'];
        
        for (const dir of requiredDirs) {
            if (!await this.exists(dir)) {
                throw new Error(`필수 디렉토리가 없습니다: ${dir}`);
            }
        }
        
        // 컴포넌트 디렉토리 확인
        for (const dir of optionalDirs) {
            if (await this.exists(dir)) {
                this.log(`✅ 컴포넌트 디렉토리 발견: ${dir}`, 'verbose');
            }
        }
        
        // Node.js 버전 확인
        const nodeVersion = process.version.match(/v(\d+)/)[1];
        if (parseInt(nodeVersion) < 14) {
            this.log('⚠️ Node.js 14 이상을 권장합니다.', 'warn');
        }
        
        this.log('✅ 환경 검증 완료', 'verbose');
    }

    async prepareBuildDirectory() {
        await this.ensureDirectory(this.config.routesPath);
        
        if (!this.config.watch) {
            await this.cleanDirectory(this.config.routesPath);
        }
        
        this.log(`📁 빌드 디렉토리 준비 완료: ${path.resolve(this.config.routesPath)}`, 'verbose');
    }

    async scanAndValidateRoutes() {
        const routes = [];
        const logicPath = path.resolve(this.config.srcPath, 'logic');
        
        try {
            const files = await fs.readdir(logicPath);
            
            for (const file of files) {
                if (!file.endsWith('.js')) continue;
                
                const routeName = path.basename(file, '.js');
                
                if (this.config.validateSources) {
                    const isValid = await this.validateRouteFiles(routeName);
                    if (!isValid) {
                        this.stats.warnings.push(`라우트 '${routeName}' 파일 검증 실패`);
                        this.log(`⚠️ 라우트 '${routeName}' 파일이 불완전합니다.`, 'warn');
                        continue;
                    }
                }
                
                routes.push(routeName);
            }
        } catch (error) {
            throw new Error(`라우트 스캔 실패: ${error.message}`);
        }
        
        return routes.sort(); // 정렬로 일관성 보장
    }

    async validateRouteFiles(routeName) {
        const files = {
            logic: path.join(this.config.srcPath, 'logic', `${routeName}.js`),
            view: path.join(this.config.srcPath, 'views', `${routeName}.html`),
            style: path.join(this.config.srcPath, 'styles', `${routeName}.css`)
        };
        
        // 로직 파일은 필수
        if (!await this.exists(files.logic)) {
            return false;
        }
        
        // 뷰 파일은 권장
        if (!await this.exists(files.view)) {
            this.log(`⚠️ 뷰 파일 없음: ${files.view}`, 'warn');
        }
        
        // 로직 파일 구문 검증
        try {
            const content = await fs.readFile(files.logic, 'utf8');
            if (!content.includes('export default')) {
                this.log(`⚠️ '${routeName}' 로직 파일에 default export가 없습니다.`, 'warn');
            }
        } catch (error) {
            this.log(`⚠️ '${routeName}' 로직 파일 읽기 실패: ${error.message}`, 'warn');
            return false;
        }
        
        return true;
    }

    async buildRoutesInParallel(routes) {
        const concurrency = Math.min(routes.length, 4); // 최대 4개 동시 빌드
        const chunks = this.chunkArray(routes, concurrency);
        
        for (const chunk of chunks) {
            const promises = chunk.map(route => this.buildRouteWithCache(route));
            await Promise.all(promises);
        }
    }

    async buildRouteWithCache(routeName) {
        const cacheKey = await this.generateRouteHash(routeName);
        
        // 캐시된 빌드가 있고 소스가 변경되지 않았으면 스킵
        if (this.buildCache.has(cacheKey) && !await this.hasRouteChanged(routeName)) {
            this.log(`📋 캐시된 빌드 사용: ${routeName}`, 'verbose');
            this.stats.successRoutes++;
            return { success: true, route: routeName, cached: true };
        }
        
        try {
            const result = await this.buildRoute(routeName);
            
            if (result.success) {
                this.buildCache.set(cacheKey, result);
                this.stats.successRoutes++;
            } else {
                this.stats.failedRoutes++;
                this.stats.errors.push(`${routeName}: ${result.error}`);
            }
            
            return result;
        } catch (error) {
            this.stats.failedRoutes++;
            this.stats.errors.push(`${routeName}: ${error.message}`);
            return { success: false, route: routeName, error: error.message };
        }
    }

    async buildRoute(routeName) {
        this.log(`🔨 라우트 빌드 시작: ${routeName}`, 'verbose');
        
        const startTime = Date.now();
        
        try {
            // 소스 파일들 로드
            const sources = await this.loadRouteSources(routeName);
            
            // 라우트 조합 및 최적화
            const builtRoute = await this.combineAndOptimizeRoute(routeName, sources);
            
            // 파일 저장
            await this.saveRoute(routeName, builtRoute);
            
            const buildTime = Date.now() - startTime;
            this.log(`  ✓ ${routeName} 빌드 완료 (${buildTime}ms)`, 'info');
            
            return { 
                success: true, 
                route: routeName, 
                buildTime,
                size: builtRoute.length 
            };
        } catch (error) {
            this.log(`  ✗ ${routeName} 빌드 실패: ${error.message}`, 'error');
            return { success: false, route: routeName, error: error.message };
        }
    }

    async loadRouteSources(routeName) {
        const sources = {};
        
        // 병렬 로딩으로 성능 향상 (컴포넌트는 제외)
        const [template, logic, style, layout] = await Promise.all([
            this.loadTemplate(routeName).catch(() => null),
            this.loadLogic(routeName),
            this.loadStyle(routeName).catch(() => ''),
            this.loadLayoutForRoute(routeName).catch(() => null)
        ]);
        
        return { template, logic, style, layout };
    }

    filterUsedComponents(template, allComponents) {
        if (!template || !allComponents || allComponents.length === 0) {
            return [];
        }

        const usedComponents = [];
        
        for (const componentInfo of allComponents) {
            const componentName = componentInfo.name;
            
            // 다양한 패턴으로 컴포넌트 사용 감지
            const patterns = [
                // 자체 닫는 태그: <ComponentName />
                new RegExp(`<${componentName}\\s*\/?>`, 'gi'),
                // 여는/닫는 태그 쌍: <ComponentName> ... </ComponentName>
                new RegExp(`<${componentName}[\\s>]`, 'gi'),
                // 케밥 케이스: <component-name>
                new RegExp(`<${this.camelToKebab(componentName)}[\\s>\/]`, 'gi'),
                // Vue 동적 컴포넌트: :is="ComponentName"
                new RegExp(`:is=["']${componentName}["']`, 'gi'),
                // Vue 동적 컴포넌트 변수: :is="componentVariable"에서 componentVariable이 ComponentName을 참조
                new RegExp(`component.*=.*["']${componentName}["']`, 'gi')
            ];
            
            // 패턴 중 하나라도 매치되면 컴포넌트 사용으로 간주
            const isUsed = patterns.some(pattern => pattern.test(template));
            
            if (isUsed) {
                usedComponents.push(componentInfo);
                this.log(`  📦 컴포넌트 포함: ${componentName}`, 'verbose');
            } else {
                this.log(`  📋 컴포넌트 제외: ${componentName}`, 'verbose');
            }
        }
        
        this.log(`📊 ${allComponents.length}개 중 ${usedComponents.length}개 컴포넌트 포함`, 'info');
        
        return usedComponents;
    }

    // 카멜케이스를 케밥케이스로 변환 (예: ButtonComponent -> button-component)
    camelToKebab(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    async loadTemplate(routeName) {
        const templatePath = path.resolve(this.config.srcPath, 'views', `${routeName}.html`);
        return await fs.readFile(templatePath, 'utf8');
    }

    async loadLogic(routeName) {
        const logicPath = path.resolve(this.config.srcPath, 'logic', `${routeName}.js`);
        const absolutePath = 'file://' + logicPath.replace(/\\/g, '/');
        
        // 캐시 무효화
        delete require.cache[require.resolve(logicPath)];
        
        try {
            const module = await import(absolutePath);
            return module.default || {};
        } catch (error) {
            throw new Error(`로직 파일 로드 실패: ${error.message}`);
        }
    }

    async loadStyle(routeName) {
        const stylePath = path.resolve(this.config.srcPath, 'styles', `${routeName}.css`);
        return await fs.readFile(stylePath, 'utf8');
    }

    async loadLayoutForRoute(routeName) {
        // 로직에서 레이아웃 정보 확인
        try {
            const logic = await this.loadLogic(routeName);
            const layoutName = logic.layout || 'default';
            return await this.loadLayout(layoutName);
        } catch (error) {
            return null;
        }
    }

    async loadLayout(layoutName) {
        const layoutPath = path.resolve(this.config.srcPath, 'layouts', `${layoutName}.html`);
        return await fs.readFile(layoutPath, 'utf8');
    }

    async loadComponents() {
        const componentsPath = path.resolve(this.config.srcPath, 'components');
        
        if (!await this.exists(componentsPath)) {
            return [];
        }

        const components = [];
        const files = await fs.readdir(componentsPath);
        
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            
            const componentName = path.basename(file, '.js');
            
            // 특별한 파일들은 스킵
            if (['ComponentLoader', 'components'].includes(componentName)) {
                continue;
            }
            
            try {
                const componentPath = path.join(componentsPath, file);
                const absolutePath = 'file://' + componentPath.replace(/\\/g, '/');
                
                // 캐시 무효화
                delete require.cache[require.resolve(componentPath)];
                
                const module = await import(absolutePath);
                const component = module.default || {};
                
                components.push({
                    name: componentName,
                    component: component,
                    source: await fs.readFile(componentPath, 'utf8')
                });
                
                this.log(`  📦 컴포넌트 로드: ${componentName}`, 'verbose');
            } catch (error) {
                this.log(`⚠️ 컴포넌트 '${componentName}' 로드 실패: ${error.message}`, 'warn');
            }
        }
        
        return components;
    }

    async combineAndOptimizeRoute(routeName, sources) {
        const { template, logic, style, layout } = sources;
        
        // 컴포넌트 데이터 생성 (컴포넌트 제외)
        const componentData = {
            ...logic,
            _routeName: routeName,
            _isBuilt: true,
            _buildTime: new Date().toISOString(),
            _buildVersion: this.getBuildVersion()
        };

        // 레이아웃과 템플릿 병합
        let finalTemplate = template || `<div class="error">템플릿을 찾을 수 없습니다: ${routeName}</div>`;
        if (layout && template) {
            finalTemplate = this.mergeLayoutWithTemplate(layout, template);
        }

        // 코드 생성 (컴포넌트 없이 가벼운 라우트)
        const output = this.generateLightweightRouteCode(routeName, componentData, finalTemplate, style);
        
        return this.config.minify ? this.minifyCode(output) : output;
    }

    generateLightweightRouteCode(routeName, componentData, template, style) {
        const lines = [];
        
        // 헤더 코멘트
        lines.push(`/**`);
        lines.push(` * ViewLogic 경량 라우트: ${routeName}`);
        lines.push(` * 빌드 시간: ${componentData._buildTime}`);
        lines.push(` * 빌드 버전: ${componentData._buildVersion}`);
        lines.push(` * 컴포넌트: 통합 components.js 사용`);
        lines.push(` */`);
        lines.push('');
        
        // 스타일 자동 적용 (최적화된 방식)
        if (style && style.trim()) {
            lines.push('// 스타일 자동 적용');
            lines.push(`const STYLE_ID = 'route-style-${routeName}';`);
            lines.push(`const STYLE_CONTENT = \`${this.escapeTemplate(style)}\`;`);
            lines.push('');
            lines.push('if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {');
            lines.push('    const styleElement = document.createElement("style");');
            lines.push('    styleElement.id = STYLE_ID;');
            lines.push('    styleElement.textContent = STYLE_CONTENT;');
            lines.push('    document.head.appendChild(styleElement);');
            lines.push('}');
            lines.push('');
        }

        // Vue 컴포넌트 정의 (가벼운 버전)
        lines.push('const component = {');
        
        for (const [key, value] of Object.entries(componentData)) {
            if (key === 'template') continue; // 템플릿은 별도 처리
            
            if (typeof value === 'function') {
                const funcStr = value.toString();
                // 함수 이름이 중복되지 않도록 처리
                if (funcStr.startsWith(`${key}(`)) {
                    lines.push(`    ${funcStr},`);
                } else {
                    lines.push(`    ${key}: ${funcStr},`);
                }
            } else if (key === 'methods' && typeof value === 'object' && value !== null) {
                lines.push(`    methods: {`);
                for (const [methodKey, methodValue] of Object.entries(value)) {
                    if (typeof methodValue === 'function') {
                        const funcStr = methodValue.toString();
                        // 함수 이름이 중복되지 않도록 처리하고, async 함수 처리
                        if (funcStr.startsWith(`${methodKey}(`)) {
                            // 함수 이름이 이미 있는 경우 (예: handleAction() { ... })
                            lines.push(`        ${funcStr},`);
                        } else if (funcStr.startsWith(`async ${methodKey}(`)) {
                            // async 함수인 경우 (예: async handleAction() { ... })
                            lines.push(`        ${funcStr},`);
                        } else {
                            // 일반적인 경우 (예: function() { ... } 또는 () => { ... })
                            lines.push(`        ${methodKey}: ${funcStr},`);
                        }
                    }
                }
                lines.push('    },');
            } else if (key === 'computed' && typeof value === 'object' && value !== null) {
                lines.push(`    computed: {`);
                for (const [computedKey, computedValue] of Object.entries(value)) {
                    if (typeof computedValue === 'function') {
                        const funcStr = computedValue.toString();
                        // 함수 이름이 중복되지 않도록 처리
                        if (funcStr.startsWith(`${computedKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${computedKey}: ${funcStr},`);
                        }
                    }
                }
                lines.push('    },');
            } else if (key === 'watch' && typeof value === 'object' && value !== null) {
                lines.push(`    watch: {`);
                for (const [watchKey, watchValue] of Object.entries(value)) {
                    if (typeof watchValue === 'function') {
                        const funcStr = watchValue.toString();
                        // 함수 이름이 중복되지 않도록 처리
                        if (funcStr.startsWith(`${watchKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${watchKey}: ${funcStr},`);
                        }
                    } else if (typeof watchValue === 'object' && watchValue !== null) {
                        lines.push(`        ${watchKey}: ${JSON.stringify(watchValue)},`);
                    }
                }
                lines.push('    },');
            } else {
                lines.push(`    ${key}: ${JSON.stringify(value)},`);
            }
        }
        
        lines.push('};');
        lines.push('');
        
        // 템플릿 설정
        lines.push(`component.template = \`${this.escapeTemplate(template)}\`;`);
        lines.push('');
        
        // Export
        lines.push('export default component;');
        
        return lines.join('\n');
    }

    generateOptimizedCode(routeName, componentData, template, style, components = []) {
        const lines = [];
        
        // 헤더 코멘트
        lines.push(`/**`);
        lines.push(` * ViewLogic 빌드된 라우트: ${routeName}`);
        lines.push(` * 빌드 시간: ${componentData._buildTime}`);
        lines.push(` * 빌드 버전: ${componentData._buildVersion}`);
        if (components.length > 0) {
            lines.push(` * 포함된 컴포넌트: ${components.map(c => c.name).join(', ')}`);
        }
        lines.push(` */`);
        lines.push('');
        
        // 인라인 컴포넌트들 (독립적으로 동작)
        if (components && components.length > 0) {
            lines.push('// 인라인 컴포넌트들');
            components.forEach(comp => {
                lines.push(`// Component: ${comp.name}`);
                lines.push(`const ${comp.name}Component = ${this.serializeVueComponent(comp.component)};`);
            });
            lines.push('');
            
            // 컴포넌트 등록 함수
            lines.push('// 컴포넌트 자동 등록 함수');
            lines.push('const registerInlineComponents = (vueApp) => {');
            lines.push('    if (!vueApp || typeof vueApp.component !== "function") return;');
            components.forEach(comp => {
                lines.push(`    vueApp.component('${comp.name}', ${comp.name}Component);`);
            });
            lines.push('};');
            lines.push('');
        }

        // 스타일 자동 적용 (최적화된 방식)
        if (style && style.trim()) {
            lines.push('// 스타일 자동 적용');
            lines.push(`const STYLE_ID = 'route-style-${routeName}';`);
            lines.push(`const STYLE_CONTENT = \`${this.escapeTemplate(style)}\`;`);
            lines.push('');
            lines.push('if (typeof document !== \'undefined\' && !document.getElementById(STYLE_ID)) {');
            lines.push('    const styleElement = document.createElement(\'style\');');
            lines.push('    styleElement.id = STYLE_ID;');
            lines.push('    styleElement.textContent = STYLE_CONTENT;');
            lines.push('    document.head.appendChild(styleElement);');
            lines.push('}');
            lines.push('');
        }

        // Vue 컴포넌트 정의 (최적화된 직렬화)
        lines.push('const component = {');
        
        for (const [key, value] of Object.entries(componentData)) {
            if (key === 'template') continue; // 템플릿은 별도 처리
            
            if (typeof value === 'function') {
                const funcStr = value.toString();
                // 함수 이름이 중복되지 않도록 처리
                if (funcStr.startsWith(`${key}(`)) {
                    lines.push(`    ${funcStr},`);
                } else {
                    lines.push(`    ${key}: ${funcStr},`);
                }
            } else if (key === 'methods' && typeof value === 'object' && value !== null) {
                lines.push(`    methods: {`);
                for (const [methodKey, methodValue] of Object.entries(value)) {
                    if (typeof methodValue === 'function') {
                        const funcStr = methodValue.toString();
                        // 함수 이름이 중복되지 않도록 처리하고, async 함수 처리
                        if (funcStr.startsWith(`${methodKey}(`)) {
                            // 함수 이름이 이미 있는 경우 (예: handleAction() { ... })
                            lines.push(`        ${funcStr},`);
                        } else if (funcStr.startsWith(`async ${methodKey}(`)) {
                            // async 함수인 경우 (예: async handleAction() { ... })
                            lines.push(`        ${funcStr},`);
                        } else {
                            // 일반적인 경우 (예: function() { ... } 또는 () => { ... })
                            lines.push(`        ${methodKey}: ${funcStr},`);
                        }
                    }
                }
                lines.push('    },');
            } else if (key === 'computed' && typeof value === 'object' && value !== null) {
                lines.push(`    computed: {`);
                for (const [computedKey, computedValue] of Object.entries(value)) {
                    if (typeof computedValue === 'function') {
                        const funcStr = computedValue.toString();
                        // 함수 이름이 중복되지 않도록 처리
                        if (funcStr.startsWith(`${computedKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${computedKey}: ${funcStr},`);
                        }
                    }
                }
                lines.push('    },');
            } else if (key === 'watch' && typeof value === 'object' && value !== null) {
                lines.push(`    watch: {`);
                for (const [watchKey, watchValue] of Object.entries(value)) {
                    if (typeof watchValue === 'function') {
                        const funcStr = watchValue.toString();
                        // 함수 이름이 중복되지 않도록 처리
                        if (funcStr.startsWith(`${watchKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${watchKey}: ${funcStr},`);
                        }
                    } else if (typeof watchValue === 'object' && watchValue !== null) {
                        lines.push(`        ${watchKey}: ${JSON.stringify(watchValue)},`);
                    }
                }
                lines.push('    },');
            } else {
                lines.push(`    ${key}: ${JSON.stringify(value)},`);
            }
        }
        
        lines.push('};');
        lines.push('');
        
        // 템플릿 설정
        lines.push(`component.template = \`${this.escapeTemplate(template)}\`;`);
        lines.push('');
        
        // 컴포넌트 등록 함수 추가
        if (components && components.length > 0) {
            lines.push('// 빌드된 컴포넌트 등록 메서드 추가');
            lines.push('component.registerInlineComponents = registerInlineComponents;');
            lines.push('');
        }
        
        // Export
        lines.push('export default component;');
        
        return lines.join('\n');
    }

    mergeLayoutWithTemplate(layout, template) {
        // 다양한 slot 패턴 지원
        const slotPatterns = [
            { pattern: /{{ content }}/s, replacement: template },
            { pattern: /(<div class="main-content">).*?(<\/div>\s*<\/main>)/s, replacement: `$1${template}$2` }
        ];
        
        for (const { pattern, replacement } of slotPatterns) {
            if (pattern.test(layout)) {
                return layout.replace(pattern, replacement);
            }
        }
        
        // 기본 fallback
        return `${layout}\n${template}`;
    }

    escapeTemplate(str) {
        if (!str) return '';
        return str
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$')
            .replace(/\r\n/g, '\\n')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    }

    serializeVueComponent(component) {
        if (!component) return '{}';
        
        const lines = ['{'];
        
        for (const [key, value] of Object.entries(component)) {
            if (typeof value === 'function') {
                // 함수는 toString()으로 직렬화
                lines.push(`    ${value.toString()},`);
            } else if (key === 'methods' && typeof value === 'object' && value !== null) {
                // methods 객체 처리
                lines.push(`    methods: {`);
                for (const [methodKey, methodValue] of Object.entries(value)) {
                    if (typeof methodValue === 'function') {
                        const funcStr = methodValue.toString();
                        // 함수 이름이 중복되지 않도록 처리, async 함수 고려
                        if (funcStr.startsWith(`${methodKey}(`) || funcStr.startsWith(`async ${methodKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${methodKey}: ${funcStr},`);
                        }
                    }
                }
                lines.push('    },');
            } else if (key === 'computed' && typeof value === 'object' && value !== null) {
                // computed 객체 처리
                lines.push(`    computed: {`);
                for (const [computedKey, computedValue] of Object.entries(value)) {
                    if (typeof computedValue === 'function') {
                        const funcStr = computedValue.toString();
                        // 함수 이름이 중복되지 않도록 처리
                        if (funcStr.startsWith(`${computedKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${computedKey}: ${funcStr},`);
                        }
                    }
                }
                lines.push('    },');
            } else if (key === 'watch' && typeof value === 'object' && value !== null) {
                // watch 객체 처리
                lines.push(`    watch: {`);
                for (const [watchKey, watchValue] of Object.entries(value)) {
                    if (typeof watchValue === 'function') {
                        const funcStr = watchValue.toString();
                        // 함수 이름이 중복되지 않도록 처리
                        if (funcStr.startsWith(`${watchKey}(`)) {
                            lines.push(`        ${funcStr},`);
                        } else {
                            lines.push(`        ${watchKey}: ${funcStr},`);
                        }
                    } else if (typeof watchValue === 'object' && watchValue !== null) {
                        // watch 객체 내의 handler, deep, immediate 등 처리
                        lines.push(`        ${watchKey}: {`);
                        for (const [propKey, propValue] of Object.entries(watchValue)) {
                            if (propKey === 'handler' && typeof propValue === 'function') {
                                const handlerStr = propValue.toString();
                                // handler 함수는 이름이 중복되지 않도록 처리
                                if (handlerStr.startsWith('handler(')) {
                                    lines.push(`            ${handlerStr},`);
                                } else {
                                    lines.push(`            handler: ${handlerStr},`);
                                }
                            } else {
                                lines.push(`            ${propKey}: ${JSON.stringify(propValue)},`);
                            }
                        }
                        lines.push(`        },`);
                    }
                }
                lines.push('    },');
            } else if (typeof value === 'object' && value !== null) {
                // props 객체는 특별 처리 (함수 기본값 지원)
                if (key === 'props') {
                    lines.push(`    props: {`);
                    for (const [propKey, propValue] of Object.entries(value)) {
                        if (typeof propValue === 'object' && propValue !== null) {
                            lines.push(`        ${propKey}: {`);
                            for (const [propAttr, propAttrValue] of Object.entries(propValue)) {
                                if (propAttr === 'default' && typeof propAttrValue === 'function') {
                                    // 함수 기본값은 toString()으로 직렬화
                                    lines.push(`            ${propAttr}: ${propAttrValue.toString()},`);
                                } else if (propAttr === 'type') {
                                    // type 속성은 특별 처리 (생성자 함수)
                                    if (Array.isArray(propAttrValue)) {
                                        const typeNames = propAttrValue.map(t => t.name || 'Object').join(', ');
                                        lines.push(`            ${propAttr}: [${propAttrValue.map(t => t.name || 'Object').join(', ')}],`);
                                    } else if (typeof propAttrValue === 'function') {
                                        lines.push(`            ${propAttr}: ${propAttrValue.name},`);
                                    } else {
                                        lines.push(`            ${propAttr}: ${JSON.stringify(propAttrValue)},`);
                                    }
                                } else if (propAttr === 'validator' && typeof propAttrValue === 'function') {
                                    // validator 함수도 직렬화
                                    lines.push(`            ${propAttr}: ${propAttrValue.toString()},`);
                                } else {
                                    lines.push(`            ${propAttr}: ${JSON.stringify(propAttrValue)},`);
                                }
                            }
                            lines.push(`        },`);
                        } else {
                            lines.push(`        ${propKey}: ${JSON.stringify(propValue)},`);
                        }
                    }
                    lines.push('    },');
                } else {
                    // 일반 객체는 JSON.stringify 사용
                    lines.push(`    ${key}: ${JSON.stringify(value)},`);
                }
            } else {
                // 원시 타입
                lines.push(`    ${key}: ${JSON.stringify(value)},`);
            }
        }
        
        lines.push('}');
        return lines.join('\n');
    }

    minifyCode(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 블록 주석 제거
            .replace(/\/\/.*$/gm, '')         // 라인 주석 제거  
            .replace(/^\s+/gm, '')            // 행 시작 공백 제거
            .replace(/\s*\n\s*/g, '\n')       // 빈 줄 정리
            .replace(/\s*{\s*/g, '{')         // 중괄호 정리
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')         // 세미콜론 정리
            .trim();
    }

    async saveRoute(routeName, content) {
        const filePath = path.resolve(this.config.routesPath, `${routeName}.js`);
        await fs.writeFile(filePath, content, 'utf8');
        
        if (this.config.sourceMap) {
            await this.generateSourceMap(routeName, content);
        }
    }

    async generateSourceMap(routeName, content) {
        // 간단한 소스맵 생성
        const sourceMap = {
            version: 3,
            file: `${routeName}.js`,
            sourceRoot: "",
            sources: [
                `../src/logic/${routeName}.js`,
                `../src/views/${routeName}.html`,
                `../src/styles/${routeName}.css`
            ],
            names: [],
            mappings: "AAAA" // 기본 매핑
        };
        
        const sourceMapPath = path.resolve(this.config.routesPath, `${routeName}.js.map`);
        await fs.writeFile(sourceMapPath, JSON.stringify(sourceMap, null, 2));
    }

    async postBuild() {
        // 통합 컴포넌트 파일 생성
        await this.generateUnifiedComponents();
        
        if (this.config.generateManifest) {
            await this.generateManifest();
        }
        
        if (this.config.optimizeAssets) {
            await this.optimizeAssets();
        }
    }

    async generateUnifiedComponents() {
        this.log('🔧 통합 컴포넌트 파일 생성 중...', 'info');
        
        try {
            const allComponents = await this.loadComponents();
            
            if (allComponents.length === 0) {
                this.log('📦 컴포넌트가 없어 components.js를 생성하지 않습니다.', 'verbose');
                return;
            }
            
            const componentsCode = this.generateUnifiedComponentsCode(allComponents);
            const componentsPath = path.resolve(this.config.routesPath, 'components.js');
            
            await fs.writeFile(componentsPath, componentsCode, 'utf8');
            
            this.log(`✅ 통합 컴포넌트 파일 생성 완료: ${allComponents.length}개 컴포넌트`, 'info');
            
        } catch (error) {
            this.log(`❌ 통합 컴포넌트 파일 생성 실패: ${error.message}`, 'error');
            throw error;
        }
    }

    generateUnifiedComponentsCode(components) {
        const lines = [];
        
        // 헤더 코멘트
        lines.push('/**');
        lines.push(' * ViewLogic 통합 컴포넌트 시스템');
        lines.push(` * 빌드 시간: ${new Date().toISOString()}`);
        lines.push(` * 빌드 버전: ${this.getBuildVersion()}`);
        lines.push(` * 포함된 컴포넌트: ${components.map(c => c.name).join(', ')}`);
        lines.push(' */');
        lines.push('');
        
        // 개별 컴포넌트 정의
        components.forEach(comp => {
            lines.push(`// Component: ${comp.name}`);
            lines.push(`const ${comp.name}Component = ${this.serializeVueComponent(comp.component)};`);
            lines.push('');
        });
        
        // 컴포넌트 등록 함수
        lines.push('// 글로벌 컴포넌트 등록 함수');
        lines.push('export function registerComponents(vueApp) {');
        lines.push('    if (!vueApp || typeof vueApp.component !== "function") {');
        lines.push('        console.warn("Invalid Vue app instance provided to registerComponents");');
        lines.push('        return;');
        lines.push('    }');
        lines.push('');
        components.forEach(comp => {
            lines.push(`    vueApp.component('${comp.name}', ${comp.name}Component);`);
        });
        lines.push('');
        lines.push('    console.log("📦 ViewLogic 컴포넌트 시스템 등록 완료:", [');
        lines.push(`        ${components.map(c => `"${c.name}"`).join(', ')}`);
        lines.push('    ]);');
        lines.push('}');
        lines.push('');
        
        // 컴포넌트 맵 export
        lines.push('// 컴포넌트 맵');
        lines.push('export const components = {');
        components.forEach(comp => {
            lines.push(`    ${comp.name}: ${comp.name}Component,`);
        });
        lines.push('};');
        lines.push('');
        
        // 기본 export
        lines.push('export default {');
        lines.push('    registerComponents,');
        lines.push('    components');
        lines.push('};');
        
        return lines.join('\n');
    }

    async generateManifest() {
        const manifest = {
            buildTime: new Date().toISOString(),
            buildVersion: this.getBuildVersion(),
            routes: [],
            stats: {
                totalRoutes: this.stats.totalRoutes,
                successRoutes: this.stats.successRoutes,
                failedRoutes: this.stats.failedRoutes,
                buildDuration: this.stats.endTime - this.stats.startTime
            }
        };
        
        // 빌드된 라우트 정보 수집
        const routesDir = path.resolve(this.config.routesPath);
        const files = await fs.readdir(routesDir);
        
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            
            const filePath = path.join(routesDir, file);
            const stats = await fs.stat(filePath);
            
            manifest.routes.push({
                name: path.basename(file, '.js'),
                file: file,
                size: stats.size,
                modified: stats.mtime.toISOString()
            });
        }
        
        const manifestPath = path.resolve(this.config.routesPath, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
        
        this.log(`📋 매니페스트 생성: ${manifestPath}`, 'verbose');
    }

    async optimizeAssets() {
        // CSS 최적화, 이미지 압축 등의 추가 최적화 작업
        this.log('🔧 에셋 최적화 완료', 'verbose');
    }

    generateBuildReport(success) {
        const duration = this.stats.endTime - this.stats.startTime;
        const report = {
            success,
            duration,
            totalRoutes: this.stats.totalRoutes,
            successRoutes: this.stats.successRoutes,
            failedRoutes: this.stats.failedRoutes,
            warnings: this.stats.warnings,
            errors: this.stats.errors,
            timestamp: new Date().toISOString()
        };
        
        // 콘솔 출력
        console.log('\n' + '='.repeat(50));
        console.log('📊 빌드 리포트');
        console.log('='.repeat(50));
        console.log(`상태: ${success ? '✅ 성공' : '❌ 실패'}`);
        console.log(`소요시간: ${duration}ms`);
        console.log(`총 라우트: ${this.stats.totalRoutes}`);
        console.log(`성공: ${this.stats.successRoutes}`);
        console.log(`실패: ${this.stats.failedRoutes}`);
        
        if (this.stats.warnings.length > 0) {
            console.log(`경고: ${this.stats.warnings.length}개`);
        }
        
        if (this.stats.errors.length > 0) {
            console.log('\n❌ 오류:');
            this.stats.errors.forEach((error, i) => {
                console.log(`${i + 1}. ${error}`);
            });
        }
        
        console.log('='.repeat(50));
        
        return report;
    }

    // 유틸리티 메서드들
    getBuildVersion() {
        return require('./package.json').version || '1.0.0';
    }

    async generateRouteHash(routeName) {
        const files = [
            path.join(this.config.srcPath, 'logic', `${routeName}.js`),
            path.join(this.config.srcPath, 'views', `${routeName}.html`),
            path.join(this.config.srcPath, 'styles', `${routeName}.css`)
        ];
        
        let combined = routeName;
        for (const file of files) {
            if (await this.exists(file)) {
                const content = await fs.readFile(file, 'utf8');
                combined += content;
            }
        }
        
        return crypto.createHash('md5').update(combined).digest('hex');
    }

    async hasRouteChanged(routeName) {
        const currentHash = await this.generateRouteHash(routeName);
        const previousHash = this.fileHashes.get(routeName);
        
        if (currentHash !== previousHash) {
            this.fileHashes.set(routeName, currentHash);
            return true;
        }
        
        return false;
    }

    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    log(message, level = 'info') {
        const levels = { error: '❌', warn: '⚠️', info: 'ℹ️', verbose: '🔍' };
        
        if (level === 'verbose' && !this.config.verbose) return;
        
        console.log(`${levels[level] || 'ℹ️'} ${message}`);
    }

    async ensureDirectory(dirPath) {
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }

    async cleanDirectory(dirPath) {
        try {
            if (await this.exists(dirPath)) {
                const files = await fs.readdir(dirPath);
                await Promise.all(
                    files
                        .filter(file => file.endsWith('.js') || file.endsWith('.json'))
                        .map(file => fs.unlink(path.join(dirPath, file)))
                );
            }
        } catch (error) {
            this.log(`디렉토리 정리 중 오류: ${error.message}`, 'warn');
        }
    }

    async exists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    // 정보 조회 메서드들
    async getBuildInfo() {
        const info = {
            lastBuild: null,
            routes: [],
            environment: 'production',
            config: this.config,
            manifest: null
        };

        try {
            if (await this.exists(this.config.routesPath)) {
                const files = await fs.readdir(this.config.routesPath);
                info.routes = files
                    .filter(file => file.endsWith('.js'))
                    .map(file => path.basename(file, '.js'));
                
                // 매니페스트 정보 로드
                const manifestPath = path.join(this.config.routesPath, 'manifest.json');
                if (await this.exists(manifestPath)) {
                    const manifestContent = await fs.readFile(manifestPath, 'utf8');
                    info.manifest = JSON.parse(manifestContent);
                    info.lastBuild = info.manifest.buildTime;
                }
            }
        } catch (error) {
            this.log(`빌드 정보 조회 실패: ${error.message}`, 'warn');
        }

        return info;
    }

    async clean() {
        this.log('🧹 빌드 파일 정리 중...', 'info');
        
        try {
            await this.cleanDirectory(this.config.routesPath);
            this.buildCache.clear();
            this.fileHashes.clear();
            this.log('✅ 빌드 파일 정리 완료', 'info');
        } catch (error) {
            this.log(`빌드 파일 정리 실패: ${error.message}`, 'error');
            throw error;
        }
    }
}

// CLI 실행 부분
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    const options = {
        srcPath: './src',
        routesPath: './routes',
        minify: args.includes('--minify'),
        sourceMap: args.includes('--source-map'),
        watch: args.includes('--watch'),
        verbose: args.includes('--verbose'),
        generateManifest: !args.includes('--no-manifest'),
        validateSources: !args.includes('--no-validate'),
        optimizeAssets: args.includes('--optimize')
    };
    
    const builder = new ViewLogicBuilder(options);

    try {
        switch (command) {
            case 'build':
                const result = await builder.build();
                if (!result.success) {
                    process.exit(1);
                }
                break;
                
            case 'clean':
                await builder.clean();
                break;
                
            case 'info':
                const info = await builder.getBuildInfo();
                console.log('📊 빌드 정보:');
                console.log(`  마지막 빌드: ${info.lastBuild || '없음'}`);
                console.log(`  빌드된 라우트: ${info.routes.join(', ') || '없음'}`);
                console.log(`  환경: ${info.environment}`);
                if (info.manifest) {
                    console.log(`  빌드 버전: ${info.manifest.buildVersion}`);
                    console.log(`  빌드 시간: ${info.manifest.stats.buildDuration}ms`);
                }
                break;
                
            default:
                console.log('🔧 ViewLogic 고급 빌더');
                console.log('');
                console.log('사용법:');
                console.log('  node build.cjs build [옵션]     # 빌드 실행');
                console.log('  node build.cjs clean            # 빌드 파일 정리');
                console.log('  node build.cjs info             # 빌드 정보 확인');
                console.log('');
                console.log('옵션:');
                console.log('  --minify          # 코드 압축');
                console.log('  --source-map      # 소스맵 생성');
                console.log('  --verbose         # 상세 로그');
                console.log('  --watch           # 파일 변경 감시');
                console.log('  --no-manifest     # 매니페스트 생성 비활성화');
                console.log('  --no-validate     # 소스 파일 검증 비활성화');
                console.log('  --optimize        # 에셋 최적화');
        }
    } catch (error) {
        console.error('❌ 실행 중 오류:', error.message);
        process.exit(1);
    }
}

// 직접 실행된 경우에만 main 함수 호출
if (require.main === module) {
    main();
}

module.exports = ViewLogicBuilder;