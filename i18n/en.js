/**
 * English language messages
 */
export default {
    // Common
    common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close',
        search: 'Search',
        previous: 'Previous',
        next: 'Next',
        back: 'Back',
        home: 'Home',
        language: 'Language',
        korean: '한국어',
        english: 'English'
    },

    // Navigation
    nav: {
        home: 'Home',
        about: 'About',
        contact: 'Contact',
        components: 'Components'
    },

    // Home page
    home: {
        title: 'Welcome to ViewLogic',
        subtitle: 'Welcome to Vue SFC Compatible Router!',
        router_title: 'ViewLogic Router',
        router_subtitle: 'Vue 3 Compatible Router System',
        message: 'Running with Vue-style components!',
        features_title: 'Key Features',
        features: [
            'Hash-based routing system',
            'Vue 3 compatible components',
            'Dynamic component loading',
            'Caching and preloading',
            'Error handling and recovery',
            'Responsive design'
        ],
        about_page: 'About Page',
        contact_page: 'Contact Page',
        test_action: 'Test Action',
        notification_test: 'Notification Test',
        modal_test: 'Modal Test',
        component_demo: 'Component Demo',
        demo_description: 'This is the first panel of the tab component.',
        demo_input_label: 'Demo Input',
        demo_input_placeholder: 'Type something here',
        demo_input_help: 'The component system is working properly'
    },

    // About page
    about: {
        title: 'About',
        project_intro: 'Project Introduction',
        project_description: 'This project is a hash-based router compatible with both React and Vue.',
        core_features: 'Core Features',
        features: [
            {
                title: 'Fast Routing',
                description: 'Hash-based fast page transitions'
            },
            {
                title: 'Component System',
                description: 'Vue 3 compatible components'
            },
            {
                title: 'Caching',
                description: 'Intelligent caching system'
            }
        ]
    },

    // Contact page
    contact: {
        title: 'Contact',
        contact_info: 'Contact Information',
        send_message: 'Send Message',
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send'
    },

    // Error messages
    errors: {
        404: 'Page Not Found',
        500: 'Internal Server Error',
        403: 'Access Denied',
        401: 'Authentication Required',
        400: 'Bad Request',
        network_error: 'Network error occurred',
        try_again: 'Try Again',
        go_home: 'Go Home',
        report_error: 'Report Issue',
        technical_details: 'Technical Details',
        error_code: 'Error Code',
        time: 'Time',
        url: 'URL'
    },

    // Component messages
    components: {
        modal: {
            title: 'Component System Test',
            description: 'This is a modal component test.',
            system_working: 'ViewLogic\'s component system is working properly!',
            input_label: 'Input in Modal',
            input_placeholder: 'Components work in modals too'
        },
        toast: {
            test_message: 'This is a notification test!'
        },
        file_upload: {
            drop_files: 'Drag files here or',
            select_files: 'Select Files',
            upload: 'Upload',
            remove: 'Remove'
        }
    },

    // Form validation
    validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        min_length: 'Please enter at least {0} characters',
        max_length: 'Maximum {0} characters allowed'
    },

    // Date/time
    datetime: {
        now: 'Now',
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow'
    }
};