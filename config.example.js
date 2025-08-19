// Vue Router 설정 예제

// 1. 기본 개발 모드 (기본값)
const devRouter = createVueRouter();

// 2. 프로덕션 모드
const prodRouter = createVueRouter({
    mode: 'production',
    logging: {
        enabled: false
    }
});

// 3. CDN 사용 설정
const cdnRouter = createVueRouter({
    mode: 'production',
    basePath: 'https://cdn.example.com/assets',
    sourcePaths: {
        view: 'templates',
        logic: 'components', 
        style: 'styles'
    },
    cache: {
        enabled: true,
        version: '1.0.0'
    }
});

// 4. 커스텀 경로 설정
const customRouter = createVueRouter({
    mode: 'development',
    sourcePaths: {
        view: 'views',
        logic: 'controllers',
        style: 'css'
    },
    defaultRoute: 'dashboard',
    fallback: {
        enabled: true,
        redirectTo: 'home'
    }
});

// 5. 로깅 레벨 설정
const debugRouter = createVueRouter({
    mode: 'development',
    logging: {
        enabled: true,
        level: 'debug' // 'debug' | 'info' | 'warn' | 'error'
    }
});

// 6. 캐시 비활성화
const noCacheRouter = createVueRouter({
    cache: {
        enabled: false
    }
});

// 7. 완전한 설정 예제
const fullConfigRouter = createVueRouter({
    mode: 'production',
    basePath: 'https://my-cdn.com/vue-components',
    sourcePaths: {
        view: 'templates/vue',
        logic: 'scripts/components',
        style: 'stylesheets/components'
    },
    defaultRoute: 'landing',
    logging: {
        enabled: true,
        level: 'warn'
    },
    cache: {
        enabled: true,
        version: '2.1.0'
    },
    fallback: {
        enabled: true,
        redirectTo: 'error'
    }
});

// 사용법
// HTML에서: <script src="config.example.js"></script> (router.js 다음에)
// window.router = fullConfigRouter;