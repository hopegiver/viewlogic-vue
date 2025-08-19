#!/usr/bin/env node

// ViewLogic Builder - Node.js 실행 스크립트
const fs = require('fs').promises;
const path = require('path');

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
            console.log(`📁 빌드 결과: ${path.resolve(this.config.routesPath)}`);
            
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
        const logicPath = path.resolve(this.config.srcPath, 'logic');
        
        try {
            if (await this.exists(logicPath)) {
                const files = await fs.readdir(logicPath);
                files.forEach(file => {
                    if (file.endsWith('.js')) {
                        routes.push(path.basename(file, '.js'));
                    }
                });
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
        const templatePath = path.resolve(this.config.srcPath, 'views', `${routeName}.html`);
        try {
            return await fs.readFile(templatePath, 'utf8');
        } catch (error) {
            console.warn(`  ⚠️ 템플릿 로드 실패 (${routeName}):`, error.message);
            return `<div class="error">템플릿을 찾을 수 없습니다: ${routeName}</div>`;
        }
    }

    async loadLogic(routeName) {
        const logicPath = path.resolve(this.config.srcPath, 'logic', `${routeName}.js`);
        try {
            // 동적 import를 위해 절대 경로 사용
            const absolutePath = 'file://' + logicPath.replace(/\\\\/g, '/');
            const module = await import(absolutePath);
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
        const stylePath = path.resolve(this.config.srcPath, 'styles', `${routeName}.css`);
        try {
            return await fs.readFile(stylePath, 'utf8');
        } catch (error) {
            console.warn(`  ⚠️ 스타일 로드 실패 (${routeName}):`, error.message);
            return '';
        }
    }

    async loadLayout(layoutName) {
        const layoutPath = path.resolve(this.config.srcPath, 'layouts', `${layoutName}.html`);
        try {
            return await fs.readFile(layoutPath, 'utf8');
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
        const lines = [];
        lines.push(`// 빌드된 라우트: ${routeName}`);
        lines.push(`// 빌드 시간: ${componentData._buildTime}`);
        lines.push('');
        
        // 스타일이 있는 경우 자동 적용 코드 추가
        if (style.trim()) {
            lines.push('// 스타일 자동 적용');
            lines.push(`const style = \`${this.escapeTemplate(style)}\`;`);
            lines.push('if (typeof document !== \'undefined\') {');
            lines.push(`    const styleId = 'route-style-${routeName}';`);
            lines.push('    if (!document.getElementById(styleId)) {');
            lines.push('        const styleElement = document.createElement(\'style\');');
            lines.push('        styleElement.id = styleId;');
            lines.push('        styleElement.textContent = style;');
            lines.push('        document.head.appendChild(styleElement);');
            lines.push('    }');
            lines.push('}');
            lines.push('');
        }

        // Vue 컴포넌트 정의 (템플릿 제외)
        const componentWithoutTemplate = { ...componentData };
        delete componentWithoutTemplate.template;
        
        // 함수들을 문자열로 변환하여 포함
        const componentString = this.serializeComponent(componentWithoutTemplate);
        lines.push(`const component = ${componentString};`);
        lines.push('');
        
        // 템플릿 설정
        lines.push(`component.template = \`${this.escapeTemplate(finalTemplate)}\`;`);
        lines.push('');
        
        // export
        lines.push('export default component;');
        
        const output = lines.join('\n');

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

    serializeComponent(obj) {
        const parts = [];
        parts.push('{');
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'function') {
                // 함수를 문자열로 변환
                parts.push(`  "${key}": ${value.toString()},`);
            } else if (typeof value === 'object' && value !== null) {
                // methods 객체의 경우 함수들을 개별적으로 처리
                if (key === 'methods') {
                    const methodParts = ['{'];
                    for (const [methodKey, methodValue] of Object.entries(value)) {
                        if (typeof methodValue === 'function') {
                            methodParts.push(`    "${methodKey}": ${methodValue.toString()},`);
                        }
                    }
                    // 마지막 쉼표 제거
                    if (methodParts.length > 1) {
                        methodParts[methodParts.length - 1] = methodParts[methodParts.length - 1].slice(0, -1);
                    }
                    methodParts.push('  }');
                    parts.push(`  "${key}": ${methodParts.join('\n  ')},`);
                } else {
                    // 일반 객체를 재귀적으로 처리
                    parts.push(`  "${key}": ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')},`);
                }
            } else {
                // 기본값들은 JSON.stringify 사용
                parts.push(`  "${key}": ${JSON.stringify(value)},`);
            }
        }
        
        // 마지막 쉼표 제거
        if (parts.length > 1) {
            parts[parts.length - 1] = parts[parts.length - 1].slice(0, -1);
        }
        
        parts.push('}');
        return parts.join('\n');
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
        const filePath = path.resolve(this.config.routesPath, `${routeName}.js`);
        await fs.writeFile(filePath, content, 'utf8');
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
                for (const file of files) {
                    if (file.endsWith('.js')) {
                        await fs.unlink(path.join(dirPath, file));
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ 디렉토리 정리 중 오류:', error.message);
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

    // 빌드 상태 확인
    async getBuildInfo() {
        const info = {
            lastBuild: null,
            routes: [],
            environment: 'production',
            config: this.config
        };

        try {
            if (await this.exists(this.config.routesPath)) {
                const files = await fs.readdir(this.config.routesPath);
                info.routes = files
                    .filter(file => file.endsWith('.js'))
                    .map(file => path.basename(file, '.js'));
                
                // 최신 파일의 수정 시간 확인
                let latestTime = 0;
                for (const file of files) {
                    const filePath = path.join(this.config.routesPath, file);
                    const stat = await fs.stat(filePath);
                    if (stat.mtime.getTime() > latestTime) {
                        latestTime = stat.mtime.getTime();
                        info.lastBuild = stat.mtime.toISOString();
                    }
                }
            }
        } catch (error) {
            console.warn('빌드 정보 조회 실패:', error.message);
        }

        return info;
    }

    // 빌드 파일 정리
    async clean() {
        console.log('🧹 빌드 파일 정리 중...');
        
        try {
            await this.cleanDirectory(this.config.routesPath);
            console.log('✅ 빌드 파일 정리 완료');
        } catch (error) {
            console.error('❌ 빌드 파일 정리 실패:', error.message);
            throw error;
        }
    }
}

// CLI 실행 부분
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    const builder = new ViewLogicBuilder({
        srcPath: './src',
        routesPath: './routes',
        minify: args.includes('--minify'),
        sourceMap: args.includes('--source-map')
    });

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
                break;
            default:
                console.log('🔧 ViewLogic Builder');
                console.log('');
                console.log('사용법:');
                console.log('  node build.cjs build [--minify] [--source-map]  # 빌드 실행');
                console.log('  node build.cjs clean                            # 빌드 파일 정리');
                console.log('  node build.cjs info                             # 빌드 정보 확인');
                console.log('');
                console.log('옵션:');
                console.log('  --minify      # 코드 압축');
                console.log('  --source-map  # 소스맵 생성 (예정)');
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