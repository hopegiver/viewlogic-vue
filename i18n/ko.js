/**
 * 한국어 다국어 메시지
 */
export default {
    // 공통
    common: {
        loading: '로딩 중...',
        error: '오류',
        success: '성공',
        cancel: '취소',
        confirm: '확인',
        save: '저장',
        edit: '편집',
        delete: '삭제',
        close: '닫기',
        search: '검색',
        previous: '이전',
        next: '다음',
        back: '뒤로',
        home: '홈',
        language: '언어',
        korean: '한국어',
        english: 'English'
    },

    // 네비게이션
    nav: {
        home: 'Home',
        about: 'About',
        contact: 'Contact',
        components: '컴포넌트'
    },

    // 홈페이지
    home: {
        title: 'ViewLogic에 오신 것을 환영합니다',
        subtitle: 'Vue SFC 호환 라우터에 오신 것을 환영합니다!',
        router_title: 'ViewLogic Router',
        router_subtitle: 'Vue 3 호환 라우터 시스템',
        message: 'Vue 스타일 컴포넌트로 동작중입니다!',
        features_title: '주요 기능',
        features: [
            '해시 기반 라우팅 시스템',
            'Vue 3 호환 컴포넌트',
            '동적 컴포넌트 로딩',
            '캐싱 및 프리로딩',
            '오류 처리 및 복구',
            '반응형 디자인'
        ],
        about_page: 'About 페이지',
        contact_page: 'Contact 페이지',
        test_action: '테스트 액션',
        notification_test: '알림 테스트',
        modal_test: '모달 테스트',
        component_demo: '컴포넌트 데모',
        demo_description: '이것은 탭 컴포넌트의 첫 번째 패널입니다.',
        demo_input_label: '데모 입력',
        demo_input_placeholder: '여기에 입력해보세요',
        demo_input_help: '컴포넌트 시스템이 정상적으로 작동하고 있습니다'
    },

    // About 페이지
    about: {
        title: 'About',
        project_intro: '프로젝트 소개',
        project_description: '이 프로젝트는 React와 Vue 모두 호환 가능한 해시 기반 라우터입니다.',
        core_features: '핵심 기능',
        features: [
            {
                title: '빠른 라우팅',
                description: '해시 기반 빠른 페이지 전환'
            },
            {
                title: '컴포넌트 시스템',
                description: 'Vue 3 호환 컴포넌트'
            },
            {
                title: '캐싱',
                description: '지능적인 캐싱 시스템'
            }
        ]
    },

    // Contact 페이지
    contact: {
        title: 'Contact',
        contact_info: '연락처 정보',
        send_message: '메시지 보내기',
        name: '이름',
        email: '이메일',
        subject: '제목',
        message: '메시지',
        send: '전송'
    },

    // 오류 메시지
    errors: {
        404: '페이지를 찾을 수 없습니다',
        500: '서버 오류가 발생했습니다',
        403: '접근이 거부되었습니다',
        401: '인증이 필요합니다',
        400: '잘못된 요청입니다',
        network_error: '네트워크 오류가 발생했습니다',
        try_again: '다시 시도',
        go_home: '홈으로 가기',
        report_error: '문제 신고하기',
        technical_details: '기술적 세부사항',
        error_code: '오류 코드',
        time: '시간',
        url: 'URL'
    },

    // 컴포넌트 메시지
    components: {
        modal: {
            title: '컴포넌트 시스템 테스트',
            description: '이것은 모달 컴포넌트 테스트입니다.',
            system_working: 'ViewLogic의 컴포넌트 시스템이 정상적으로 작동하고 있습니다!',
            input_label: '모달 내 입력',
            input_placeholder: '모달에서도 컴포넌트가 작동합니다'
        },
        toast: {
            test_message: '알림 테스트입니다!'
        },
        file_upload: {
            drop_files: '파일을 여기에 드래그하거나',
            select_files: '파일 선택',
            upload: '업로드',
            remove: '제거'
        }
    },

    // 폼 검증
    validation: {
        required: '필수 입력 항목입니다',
        email: '올바른 이메일 주소를 입력해주세요',
        min_length: '최소 {0}자 이상 입력해주세요',
        max_length: '최대 {0}자까지 입력 가능합니다'
    },

    // 날짜/시간
    datetime: {
        now: '지금',
        today: '오늘',
        yesterday: '어제',
        tomorrow: '내일'
    }
};