/**
 * ViewLogic 빌드 시스템 v1.0
 * 가장 기본적인 기능부터 차근차근 구현
 */

const fs = require('fs').promises;
const path = require('path');
const esbuild = require('esbuild');

class ViewLogicBuilder {
    constructor(options = {}) {
        this.config = {
            srcPath: path.join(__dirname, 'src'),
            routesPath: path.join(__dirname, 'routes'),
            version: '1.0.0',
            minify: options.minify !== undefined ? options.minify : true  // 기본값: true
        };
        
        this.stats = {
            startTime: Date.now(),
            routesBuilt: 0,
            routesFailed: 0,
            errors: []
        };
    }
    
    log(message, type = 'info') {
        const icons = { error: '❌', warn: '⚠️', success: '✅', info: 'ℹ️' };
        console.log(`${icons[type] || icons.info} ${message}`);
        
        if (type === 'error') {
            this.stats.errors.push(message);
        }
    }
    
    // CSS 압축 유틸리티
    minifyCSS(css) {
        return css
            .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '')  // 주석 제거
            .replace(/\s+/g, ' ')                              // 연속 공백을 하나로
            .replace(/\s*([{}:;,])\s*/g, '$1')                 // 구분자 주변 공백 제거
            .trim();
    }
    
    // HTML 압축 유틸리티 (Vue 템플릿 보호)
    minifyHTML(html) {
        return html
            .replace(/<!--[\s\S]*?-->/g, '')                   // HTML 주석 제거
            .replace(/>\s+</g, '><')                           // 태그 사이 공백 제거
            .replace(/\s+/g, ' ')                              // 연속 공백을 하나로
            .trim();
    }
    
    async build() {
        this.log('ViewLogic 빌드 시작...', 'info');
        
        try {
            // 1단계: 디렉토리 준비
            await this.ensureDirectory(this.config.routesPath);
            await this.cleanDirectory(this.config.routesPath);
            
            // 2단계: 라우트 발견
            const routes = await this.discoverRoutes();
            if (routes.length === 0) {
                this.log('빌드할 라우트가 없습니다.', 'warn');
                return false;
            }
            
            this.log(`${routes.length}개 라우트 발견: ${routes.join(', ')}`, 'info');

            // 3단계: 컴포넌트 시스템 파일 생성
            await this.generateComponentsFile();
            
            // 4단계: 각 라우트 빌드
            for (const route of routes) {
                await this.buildRoute(route);
            }
            
            // 5단계: 매니페스트 생성
            await this.generateManifest(routes);
            
            // 6단계: 결과 보고
            this.printReport();
            
            return this.stats.routesFailed === 0;
            
        } catch (error) {
            this.log(`빌드 실패: ${error.message}`, 'error');
            return false;
        }
    }
    
    async minifyJavaScript(code) {
        try {
            const result = await esbuild.transform(code, {
                minify: true,
                target: 'es2015',
                format: 'esm',
                // Vue 호환성을 위한 설정
                keepNames: true,  // 함수명 유지
                treeShaking: false,  // Vue 메소드 보호
                minifyWhitespace: true,
                minifyIdentifiers: false,  // 변수명 유지 (Vue data 보호)
                minifySyntax: true
            });
            return result.code;
        } catch (error) {
            this.log(`JavaScript 압축 실패, 원본 사용: ${error.message}`, 'warn');
            return code;  // 실패 시 원본 반환
        }
    }
    
    async buildRoute(routeName) {
        try {
            this.log(`${routeName} 빌드 중...`, 'info');
            
            // 파일 경로 검증
            const paths = {
                logic: path.join(this.config.srcPath, 'logic', `${routeName}.js`),
                view: path.join(this.config.srcPath, 'views', `${routeName}.html`),
                style: path.join(this.config.srcPath, 'styles', `${routeName}.css`)
            };
            
            // 단계별 오류 처리
            let logicContent, viewContent, styleContent;
            
            try {
                logicContent = await this.readFile(paths.logic);
            } catch (error) {
                this.log(`${routeName} 로직 파일 읽기 실패: ${error.message}`, 'warn');
                throw new Error(`로직 파일 필수: ${paths.logic}`);
            }
            
            try {
                viewContent = await this.readFile(paths.view, '<div>기본 뷰</div>');
            } catch (error) {
                this.log(`${routeName} 뷰 파일 읽기 실패, 기본값 사용: ${error.message}`, 'warn');
                viewContent = '<div>기본 뷰</div>';
            }
            
            try {
                styleContent = await this.readFile(paths.style, '');
            } catch (error) {
                this.log(`${routeName} 스타일 파일 읽기 실패, 기본값 사용: ${error.message}`, 'warn');
                styleContent = '';
            }
            
            // logicContent에서 직접 layout 속성 체크
            let layoutName = 'default'; // 기본값
            
            // layout 속성 추출 (문자열 패턴 매칭)
            const layoutMatch = logicContent.match(/layout:\s*['"`]([^'"`]*)['"`]/);
            const layoutNullMatch = logicContent.match(/layout:\s*null/);
            
            if (layoutNullMatch) {
                layoutName = null;
                this.log(`${routeName} 레이아웃 사용 안함 (layout: null)`, 'info');
            } else if (layoutMatch) {
                layoutName = layoutMatch[1];
            }
                
            if (layoutName) {
                try {
                    const layoutPath = path.join(this.config.srcPath, 'layouts', `${layoutName}.html`);
                    const layoutContent = await this.readFile(layoutPath);
                    // 레이아웃의 {{ content }} 부분을 실제 뷰 콘텐츠로 대체
                    viewContent = layoutContent.replace(/\{\{\s*content\s*\}\}/g, viewContent);
                    this.log(`${routeName} 레이아웃 '${layoutName}' 적용 완료`, 'info');
                } catch (error) {
                    this.log(`${routeName} 레이아웃 '${layoutName}' 로드 실패, 뷰만 사용: ${error.message}`, 'warn');
                }
            }
            
            // 최종 파일 생성
            try {
                const finalContent = await this.generateRouteFile(routeName, logicContent, viewContent, styleContent);
                
                // 파일 쓰기
                const outputPath = path.join(this.config.routesPath, `${routeName}.js`);
                await fs.writeFile(outputPath, finalContent);
                
                // 생성된 파일 검증
                const writtenContent = await fs.readFile(outputPath, 'utf8');
                if (writtenContent.length < 100) {
                    throw new Error('생성된 파일이 너무 작음 (손상된 것으로 추정)');
                }
                
            } catch (error) {
                this.log(`${routeName} 파일 생성 실패: ${error.message}`, 'error');
                throw error;
            }
            
            this.stats.routesBuilt++;
            this.log(`${routeName} 빌드 완료 ✓`, 'success');
            
        } catch (error) {
            this.stats.routesFailed++;
            this.log(`${routeName} 빌드 실패: ${error.message}`, 'error');
            this.log(`${routeName} 상세 오류: ${error.stack}`, 'error');
            
            // 폴백 생성
            await this.createFallback(routeName, error.message);
        }
    }
    
    async readFile(filePath, defaultContent = null) {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            if (defaultContent !== null) {
                return defaultContent;
            }
            throw error;
        }
    }
    
    async generateRouteFile(routeName, logicContent, viewContent, styleContent) {
        const lines = [];
        
        // 스타일 추가 (압축 후 JSON.stringify로 자동 이스케이핑)
        if (styleContent.trim()) {
            const minifiedStyle = this.minifyCSS(styleContent);
            lines.push(`const STYLE_ID = 'route-style-${routeName}';`);
            lines.push(`const STYLE_CONTENT = ${JSON.stringify(minifiedStyle)};`);
            lines.push(`if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {`);
            lines.push(`  const styleEl = document.createElement("style");`);
            lines.push(`  styleEl.id = STYLE_ID;`);
            lines.push(`  styleEl.textContent = STYLE_CONTENT;`);
            lines.push(`  document.head.appendChild(styleEl);`);
            lines.push(`}`);
            lines.push('');
        }
        
        // src 로직 파일을 그대로 사용 (파싱하지 않음)
        // export default를 제거하고 const component =로 변경
        let componentCode = logicContent
            .replace(/export\s+default\s+/, 'const component = ')
            .trim();
            
        // 빌드 메타데이터 추가
        componentCode = componentCode.replace(
            /};?\s*$/, 
            `,
  _routeName: "${routeName}",
  _isBuilt: true,
  _buildTime: "${new Date().toISOString()}",
  _buildVersion: "${this.config.version}"
};`
        );
        
        lines.push(componentCode);
        lines.push('');
        
        // 템플릿 추가 (압축 후 JSON.stringify로 자동 이스케이핑)
        const minifiedTemplate = this.minifyHTML(viewContent);
        lines.push(`component.template = ${JSON.stringify(minifiedTemplate)};`);
        lines.push('');
        lines.push('export default component;');
        
        const fullCode = lines.join('\n');
        
        // JavaScript 코드 압축 (프로덕션 모드에서만)
        if (process.env.NODE_ENV === 'production' || this.config.minify) {
            return await this.minifyJavaScript(fullCode);
        }
        
        return fullCode;
    }
    
    async createFallback(routeName, originalError = '알 수 없는 오류') {
        const fallbackContent = `const component = {
  data() { 
    return {
      errorMessage: '${originalError.replace(/'/g, "\\'")}',
      routeName: '${routeName}',
      buildTime: '${new Date().toISOString()}'
    }; 
  },
  mounted() { 
    console.warn(\`\${this.routeName} 라우트가 폴백 모드로 실행 중입니다.\`);
    console.error('원인:', this.errorMessage);
    
    // 5초 후 자동으로 홈으로 리다이렉트 (선택사항)
    if (this.routeName !== 'home' && this.routeName !== '404') {
      setTimeout(() => {
        if (window.router && window.router.navigateTo) {
          console.log('폴백 페이지에서 홈으로 리다이렉트...');
          window.router.navigateTo('home');
        }
      }, 5000);
    }
  },
  methods: {
    goHome() {
      if (window.router && window.router.navigateTo) {
        window.router.navigateTo('home');
      }
    },
    retry() {
      window.location.reload();
    }
  },
  _routeName: "${routeName}",
  _isBuilt: true,
  _isFallback: true,
  _buildTime: "${new Date().toISOString()}",
  _buildVersion: "${this.config.version}",
  _originalError: "${originalError.replace(/"/g, '\\"')}"
};

component.template = \`<div style="padding: 2rem; text-align: center; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; margin: 2rem;">
  <h2 style="color: #856404; margin-bottom: 1rem;">⚠️ \${routeName} 페이지 로드 오류</h2>
  <p style="color: #856404; margin-bottom: 1rem;">이 페이지는 빌드 중 오류가 발생하여 폴백 모드로 로드되었습니다.</p>
  <details style="text-align: left; margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px;">
    <summary style="cursor: pointer; font-weight: bold;">오류 세부사항</summary>
    <pre style="margin-top: 0.5rem; font-size: 0.85rem; color: #e74c3c;">{{ errorMessage }}</pre>
  </details>
  <div style="margin-top: 1.5rem;">
    <button @click="goHome" style="margin-right: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">홈으로 이동</button>
    <button @click="retry" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">페이지 새로고침</button>
  </div>
  <p style="font-size: 0.8rem; color: #6c757d; margin-top: 1rem;">빌드 시간: {{ buildTime }}</p>
</div>\`;

export default component;`;

        try {
            const outputPath = path.join(this.config.routesPath, `${routeName}.js`);
            await fs.writeFile(outputPath, fallbackContent);
            this.log(`${routeName} 향상된 폴백 페이지 생성 완료`, 'warn');
        } catch (error) {
            this.log(`${routeName} 폴백 생성도 실패: ${error.message}`, 'error');
            
            // 최소한의 응급 폴백
            const emergencyContent = `export default { 
  template: '<div>Emergency Fallback: ${routeName}</div>',
  _routeName: "${routeName}", _isFallback: true 
};`;
            
            try {
                await fs.writeFile(outputPath, emergencyContent);
                this.log(`${routeName} 응급 폴백 생성됨`, 'warn');
            } catch (emergencyError) {
                this.log(`${routeName} 응급 폴백도 실패: ${emergencyError.message}`, 'error');
            }
        }
    }
    
    async ensureDirectory(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    
    async cleanDirectory(dirPath) {
        try {
            const files = await fs.readdir(dirPath);
            await Promise.all(
                files
                    .filter(file => file.endsWith('.js'))
                    .map(file => fs.unlink(path.join(dirPath, file)).catch(() => {}))
            );
        } catch (error) {
            // 정리 실패는 무시
        }
    }
    
    async discoverRoutes() {
        try {
            const logicDir = path.join(this.config.srcPath, 'logic');
            const files = await fs.readdir(logicDir);
            
            return files
                .filter(file => file.endsWith('.js'))
                .map(file => path.basename(file, '.js'))
                .sort();
                
        } catch (error) {
            this.log(`라우트 검색 실패: ${error.message}`, 'error');
            return [];
        }
    }
    
    async generateComponentsFile() {
        try {
            this.log('통합 컴포넌트 시스템 파일 생성 중...', 'info');
            
            // src/components 디렉토리의 모든 컴포넌트 파일 읽기
            const componentsDir = path.join(this.config.srcPath, 'components');
            const componentFiles = await fs.readdir(componentsDir);
            const componentImports = [];
            const componentRegistrations = [];
            
            // 각 컴포넌트 파일 처리
            for (const file of componentFiles) {
                if (file.endsWith('.js') && file !== 'ComponentLoader.js') {
                    const componentName = path.basename(file, '.js');
                    const componentPath = path.join(componentsDir, file);
                    
                    try {
                        // 컴포넌트 파일 읽기
                        const componentContent = await fs.readFile(componentPath, 'utf8');
                        
                        // export default를 찾아서 컴포넌트 객체 추출
                        const componentCode = componentContent
                            .replace(/export\s+default\s+/, '')
                            .replace(/;\s*$/, '');
                        
                        // 컴포넌트를 components 객체에 추가
                        componentImports.push(`
// ${componentName} 컴포넌트
const ${componentName} = ${componentCode};
`);
                        
                        componentRegistrations.push(`        '${componentName}': ${componentName}`);
                        
                        this.log(`  - ${componentName} 컴포넌트 로드됨`, 'info');
                        
                    } catch (err) {
                        this.log(`  - ${componentName} 컴포넌트 로드 실패: ${err.message}`, 'warn');
                    }
                }
            }
            
            const componentsContent = `/**
 * ViewLogic 컴포넌트 레지스트리
 * 자동 생성됨 - 수정하지 마세요
 * 빌드 시간: ${new Date().toISOString()}
 */

// ============================================
// 컴포넌트 정의 
// ============================================
${componentImports.join('\n')}

// ============================================
// 모든 컴포넌트 매핑
// ============================================
const components = {
${componentRegistrations.join(',\n')}
};

// ============================================
// 컴포넌트 자동 등록 시스템
// ============================================
function registerComponents(app) {
    console.log('✅ ViewLogic 컴포넌트 등록 중...');
    
    let registeredCount = 0;
    
    // 모든 컴포넌트를 Vue 앱에 등록
    for (const [name, component] of Object.entries(components)) {
        if (component && component.name) {
            if (app && app.component) {
                app.component(name, component);
                registeredCount++;
            }
        }
    }
    
    console.log(\`✅ \${registeredCount}개 컴포넌트 등록 완료\`);
    
    return {
        success: true,
        componentsRegistered: registeredCount
    };
}

// ============================================
// 익스포트
// ============================================

// ES6 모듈 익스포트
export { registerComponents, components };

// 기본 export
export default {
    registerComponents,
    components
};

// 글로벌 노출 (브라우저 직접 로드용)
if (typeof window !== 'undefined') {
    window.registerComponents = registerComponents;
    window.ViewLogicComponents = components;
    
    console.log('🚀 ViewLogic 컴포넌트 레지스트리 로드됨');
    console.log(\`   컴포넌트 수: \${Object.keys(components).length}개\`);
}
`;
            
            // _components.js 파일 생성 (압축 옵션 적용)
            let finalComponentsContent = componentsContent;
            
            if (process.env.NODE_ENV === 'production' || this.config.minify) {
                try {
                    finalComponentsContent = await this.minifyJavaScript(componentsContent);
                    this.log('_components.js 파일 압축 완료', 'info');
                } catch (error) {
                    this.log(`_components.js 압축 실패, 원본 사용: ${error.message}`, 'warn');
                }
            }
            
            await fs.writeFile(
                path.join(this.config.routesPath, '_components.js'),
                finalComponentsContent
            );
            
            this.log('통합 컴포넌트 시스템 파일 생성 완료', 'success');
            
        } catch (error) {
            this.log(`컴포넌트 시스템 파일 생성 실패: ${error.message}`, 'warn');
        }
    }
    
    async generateManifest(routes) {
        const manifest = {
            buildTime: new Date().toISOString(),
            buildVersion: this.config.version,
            routes: routes,
            hasComponentsFile: true,
            stats: {
                routesBuilt: this.stats.routesBuilt,
                routesFailed: this.stats.routesFailed,
                buildDuration: Date.now() - this.stats.startTime
            }
        };
        
        try {
            await fs.writeFile(
                path.join(this.config.routesPath, 'manifest.json'),
                JSON.stringify(manifest, null, 2)
            );
        } catch (error) {
            this.log(`매니페스트 생성 실패: ${error.message}`, 'warn');
        }
    }
    
    printReport() {
        const duration = Date.now() - this.stats.startTime;
        const totalRoutes = this.stats.routesBuilt + this.stats.routesFailed;
        
        console.log('\n' + '='.repeat(50));
        console.log('🏗️ ViewLogic 빌드 시스템 v1.0 리포트');
        console.log('='.repeat(50));
        console.log(`⏱️ 소요시간: ${duration}ms`);
        console.log(`📊 총 라우트: ${totalRoutes}`);
        console.log(`✅ 성공: ${this.stats.routesBuilt}`);
        console.log(`❌ 실패: ${this.stats.routesFailed}`);
        
        if (this.stats.errors.length > 0) {
            console.log(`💥 오류: ${this.stats.errors.length}개`);
        }
        
        console.log('='.repeat(50));
    }
}

// CLI 처리
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    const noDev = args.includes('--no-dev') || args.includes('-n');
    
    // 기본적으로 압축 활성화, --no-dev 플래그로 비활성화 가능
    const builder = new ViewLogicBuilder({ minify: !noDev });
    
    switch (command) {
        case 'build':
            const success = await builder.build();
            process.exit(success ? 0 : 1);
            break;
            
        case 'clean':
            await builder.cleanDirectory(builder.config.routesPath);
            console.log('✅ 정리 완료');
            break;
            
        case 'help':
        default:
            console.log('🏗️ ViewLogic 빌드 시스템 v1.0\n');
            console.log('사용법:');
            console.log('  node build.cjs build              # 빌드 (기본: 압축 활성화)');
            console.log('  node build.cjs build --no-dev     # 개발 빌드 (압축 비활성화)');
            console.log('  node build.cjs clean              # 빌드 파일 정리');
            break;
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ 빌드 시스템 오류:', error.message);
        process.exit(1);
    });
}

module.exports = ViewLogicBuilder;