class ViewLogicBuilder {
    constructor(options = {}) {
        this.config = {
            srcPath: options.srcPath || './src',
            routesPath: options.routesPath || './routes',
            minify: options.minify || false,
            sourceMap: options.sourceMap || false
        };
    }

    async build() {
        console.log('🚀 ViewLogic 빌드 시작...');
        
        try {
            // routes 디렉토리 정리 및 생성
            await this.ensureDirectory(this.config.routesPath);
            await this.cleanDirectory(this.config.routesPath);
            
            // 라우트 파일들 스캔
            const routes = await this.scanRoutes();
            
            if (routes.length === 0) {
                console.log('📭 빌드할 라우트가 없습니다.');
                return;
            }
            
            console.log(`📦 ${routes.length}개 라우트 발견: ${routes.join(', ')}`);
            
            // 각 라우트별로 빌드
            const buildResults = [];
            for (const route of routes) {
                const result = await this.buildRoute(route);
                buildResults.push(result);
            }
            
            // 빌드 성공한 라우트만 카운트
            const successCount = buildResults.filter(r => r.success).length;
            
            console.log(`✅ 빌드 완료! ${successCount}/${routes.length}개 라우트가 성공했습니다.`);
            console.log(`📁 빌드 결과: ${this.config.routesPath}`);
            
            return {
                success: true,
                totalRoutes: routes.length,
                successRoutes: successCount,
                results: buildResults
            };
        } catch (error) {
            console.error('❌ 빌드 중 오류 발생:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async scanRoutes() {
        const routes = [];
        const logicPath = `${this.config.srcPath}/logic`;
        
        try {
            // Node.js 환경에서 실행되는 경우
            if (typeof require !== 'undefined') {
                const fs = require('fs');
                const path = require('path');
                
                if (fs.existsSync(logicPath)) {
                    const files = fs.readdirSync(logicPath);
                    files.forEach(file => {
                        if (file.endsWith('.js')) {
                            routes.push(path.basename(file, '.js'));
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('⚠️ 라우트 스캔 중 오류:', error.message);
        }
        
        return routes;
    }

    async buildRoute(routeName) {
        console.log(`🔨 라우트 빌드 중: ${routeName}`);
        
        try {
            // 소스 파일들 로드
            const template = await this.loadTemplate(routeName);
            const logic = await this.loadLogic(routeName);
            const style = await this.loadStyle(routeName);
            const layout = await this.loadLayout(logic.layout || 'default');
            
            // 빌드된 라우트 생성
            const builtRoute = this.combineRoute(routeName, template, logic, style, layout);
            
            // 파일 저장
            await this.saveRoute(routeName, builtRoute);
            
            console.log(`  ✓ ${routeName} 빌드 완료`);
            return { success: true, route: routeName };
        } catch (error) {
            console.error(`  ✗ ${routeName} 빌드 실패:`, error.message);
            return { success: false, route: routeName, error: error.message };
        }
    }

    async loadTemplate(routeName) {
        const templatePath = `${this.config.srcPath}/views/${routeName}.html`;
        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.warn(`  ⚠️ 템플릿 로드 실패 (${routeName}):`, error.message);
            return `<div class="error">템플릿을 찾을 수 없습니다: ${routeName}</div>`;
        }
    }

    async loadLogic(routeName) {
        try {
            // 동적 import 사용
            const module = await import(`../${this.config.srcPath}/logic/${routeName}.js`);
            return module.default || {};
        } catch (error) {
            console.warn(`  ⚠️ 로직 파일 로드 실패 (${routeName}):`, error.message);
            return {
                name: routeName,
                data() {
                    return {
                        message: `컴포넌트를 찾을 수 없습니다: ${routeName}`
                    };
                }
            };
        }
    }

    async loadStyle(routeName) {
        const stylePath = `${this.config.srcPath}/styles/${routeName}.css`;
        try {
            const response = await fetch(stylePath);
            if (!response.ok) throw new Error(`Style not found: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.warn(`  ⚠️ 스타일 로드 실패 (${routeName}):`, error.message);
            return '';
        }
    }

    async loadLayout(layoutName) {
        const layoutPath = `${this.config.srcPath}/layouts/${layoutName}.html`;
        try {
            const response = await fetch(layoutPath);
            if (!response.ok) throw new Error(`Layout not found: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.warn(`  ⚠️ 레이아웃 로드 실패 (${layoutName}):`, error.message);
            return null;
        }
    }

    combineRoute(routeName, template, logic, style, layout) {
        // 컴포넌트 데이터 생성
        const componentData = {
            ...logic,
            _routeName: routeName,
            _isBuilt: true,
            _buildTime: new Date().toISOString()
        };

        // 레이아웃과 템플릿 병합
        let finalTemplate = template;
        if (layout) {
            finalTemplate = this.mergeLayoutWithTemplate(layout, template);
        }

        // ES 모듈 형태로 export
        let output = `// 빌드된 라우트: ${routeName}\n`;
        output += `// 빌드 시간: ${componentData._buildTime}\n\n`;
        
        // 스타일이 있는 경우 자동 적용 코드 추가
        if (style.trim()) {
            output += `// 스타일 자동 적용\n`;
            output += `const style = \`${this.escapeTemplate(style)}\`;\n`;
            output += `if (typeof document !== 'undefined') {\n`;
            output += `    const styleId = 'route-style-${routeName}';\n`;
            output += `    if (!document.getElementById(styleId)) {\n`;
            output += `        const styleElement = document.createElement('style');\n`;
            output += `        styleElement.id = styleId;\n`;
            output += `        styleElement.textContent = style;\n`;
            output += `        document.head.appendChild(styleElement);\n`;
            output += `    }\n`;
            output += `}\n\n`;
        }

        // Vue 컴포넌트 정의
        const componentWithoutTemplate = { ...componentData };
        delete componentWithoutTemplate.template;
        
        output += `const component = ${JSON.stringify(componentWithoutTemplate, null, 2)};\n\n`;
        
        // 템플릿 설정
        output += `component.template = \`${this.escapeTemplate(finalTemplate)}\`;\n\n`;
        
        // export
        output += `export default component;\n`;

        return this.config.minify ? this.minifyCode(output) : output;
    }

    mergeLayoutWithTemplate(layout, template) {
        // 레이아웃에서 <slot name="content"> 부분을 템플릿으로 교체
        if (layout.includes('<slot name="content">')) {
            return layout.replace(
                /<slot name="content">.*?<\/slot>/s,
                template
            );
        }
        // 기본 <slot> 태그로 교체
        else if (layout.includes('<slot>')) {
            return layout.replace(/<slot>.*?<\/slot>/s, template);
        }
        // slot이 없으면 main-content 클래스 내용 교체
        else if (layout.includes('class="main-content"')) {
            return layout.replace(
                /(<div class="container">).*?(<\/div>\s*<\/main>)/s,
                `$1${template}$2`
            );
        }
        // 마지막 대안: 전체 레이아웃에 템플릿 추가
        else {
            return `${layout}\n${template}`;
        }
    }

    escapeTemplate(str) {
        return str
            .replace(/\\/g, '\\\\')  // 백슬래시 이스케이프
            .replace(/`/g, '\\`')    // 백틱 이스케이프
            .replace(/\$/g, '\\$');  // 달러 기호 이스케이프
    }

    minifyCode(code) {
        // 간단한 minification
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // 블록 주석 제거
            .replace(/\/\/.*$/gm, '') // 라인 주석 제거
            .replace(/\s+/g, ' ') // 연속 공백 제거
            .replace(/;\s*}/g, ';}') // 세미콜론 뒤 공백 제거
            .trim();
    }

    async saveRoute(routeName, content) {
        const filePath = `${this.config.routesPath}/${routeName}.js`;
        
        // 브라우저 환경에서는 다운로드로 처리
        if (typeof document !== 'undefined') {
            this.downloadFile(`${routeName}.js`, content);
        } else {
            // Node.js 환경에서 실제 파일 저장은 build.cjs에서 처리
            throw new Error('File saving should be handled by Node.js build script');
        }
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async ensureDirectory(dirPath) {
        // 브라우저에서는 디렉토리 생성 불가
        if (typeof document !== 'undefined') {
            return;
        }
    }

    async cleanDirectory(dirPath) {
        // 브라우저에서는 파일 삭제 불가
        if (typeof document !== 'undefined') {
            return;
        }
    }

    // 빌드 상태 확인
    getBuildInfo() {
        return {
            lastBuild: new Date().toISOString(),
            environment: 'browser',
            config: this.config
        };
    }
}

// 브라우저 환경에서 사용 가능
if (typeof window !== 'undefined') {
    window.ViewLogicBuilder = ViewLogicBuilder;
}

// ES 모듈로 export
export default ViewLogicBuilder;