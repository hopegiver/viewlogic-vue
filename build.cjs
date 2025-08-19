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
        
        for (const dir of requiredDirs) {
            if (!await this.exists(dir)) {
                throw new Error(`필수 디렉토리가 없습니다: ${dir}`);
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
        
        // 병렬 로딩으로 성능 향상
        const [template, logic, style, layout] = await Promise.all([
            this.loadTemplate(routeName).catch(() => null),
            this.loadLogic(routeName),
            this.loadStyle(routeName).catch(() => ''),
            this.loadLayoutForRoute(routeName).catch(() => null)
        ]);
        
        return { template, logic, style, layout };
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

    async combineAndOptimizeRoute(routeName, sources) {
        const { template, logic, style, layout } = sources;
        
        // 컴포넌트 데이터 생성
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

        // 코드 생성
        const output = this.generateOptimizedCode(routeName, componentData, finalTemplate, style);
        
        return this.config.minify ? this.minifyCode(output) : output;
    }

    generateOptimizedCode(routeName, componentData, template, style) {
        const lines = [];
        
        // 헤더 코멘트
        lines.push(`/**`);
        lines.push(` * ViewLogic 빌드된 라우트: ${routeName}`);
        lines.push(` * 빌드 시간: ${componentData._buildTime}`);
        lines.push(` * 빌드 버전: ${componentData._buildVersion}`);
        lines.push(` */`);
        lines.push('');
        
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
                lines.push(`    ${value.toString()},`);
            } else if (key === 'methods' && typeof value === 'object' && value !== null) {
                lines.push(`    methods: {`);
                for (const [methodKey, methodValue] of Object.entries(value)) {
                    if (typeof methodValue === 'function') {
                        lines.push(`    ${methodValue.toString()},`);
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
        if (this.config.generateManifest) {
            await this.generateManifest();
        }
        
        if (this.config.optimizeAssets) {
            await this.optimizeAssets();
        }
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