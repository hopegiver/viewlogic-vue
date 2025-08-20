# ViewLogic

**Vue 3 Compatible Router System with Zero-Build Development**

ViewLogic is a lightweight Vue 3-compatible router system that allows you to develop without any build process - an innovative frontend framework for rapid development.

## 🚀 Key Advantages

### ⚡ Zero-Build Development
- **No build required in development**: Start developing immediately without complex build tools like Webpack or Vite
- **Instant execution**: See changes instantly with just a browser refresh after saving files
- **Fast development cycle**: Real-time development without waiting for build times

### 🎯 Dynamic Routing System
- **File-based routing**: File structure in `routes/` folder becomes routing paths automatically
- **Nested routing support**: Automatic handling of nested paths like `/#/folder/page`
- **Dynamic imports**: Load only necessary pages at runtime for improved initial loading speed
- **Component caching**: Once loaded components are cached in memory for instant re-visits

### 🔐 Powerful Authentication System
- **JWT token support**: Automatic token management and validation
- **Cookie-based authentication**: Support for various cookie storage options
- **Route protection**: Access control based on specific routes or prefixes
- **Automatic redirects**: Automatic login page redirection for unauthenticated users

### 🌐 Complete Internationalization (i18n) Support
- **Automatic language detection**: Automatically applies browser language settings
- **Dynamic language loading**: Dynamically loads only required language files
- **URL parameter support**: Language switching via `?lang=ko` format
- **Component-level support**: Use `$t()` function in all components

### 🎨 Rich UI Components
15+ ready-to-use Vue 3 compatible components:
- Button, Card, Modal, Toast, Tabs
- Input, Select, Checkbox, Radio, DatePicker
- Table, Pagination, Badge, Alert, Tooltip, etc.

### 📊 Automatic Data Fetching
- **dataURL property**: Automatic data loading by just specifying `dataURL` in components
- **Query parameter support**: Automatic URL query string forwarding
- **Render-time execution**: Automatic data fetching on component mount

## ✨ 추가 기능

### 🎯 Core System
- **Vue 3 Integration**: Modern Vue 3 runtime with full composition API support
- **Advanced Router**: Hash-based routing with intelligent caching, preloading, and smooth transitions
- **Modular Architecture**: Complete separation of views, logic, styles, and components
- **Dynamic Loading**: Smart component loading with caching and error recovery
- **Production Builder**: Advanced build system for optimized production deployment

### 🧩 Component System
- **Reusable UI Components**: 6 comprehensive components (Button, Modal, Card, Toast, Input, Tabs)
- **Dynamic Component Loading**: Automatic component registration and lazy loading
- **Component Loader**: Sophisticated caching and dependency management
- **Theme System**: Consistent design language with CSS variables

### 🚀 Loading & Performance
- **Loading State Management**: Progress bars, spinners, and skeleton UI
- **Smart Caching**: LRU and memory-based caching with TTL support
- **Route Preloading**: Background preloading of frequently accessed routes
- **Minimum Loading Duration**: UX-optimized loading times

### ⚠️ Error Handling
- **Comprehensive Error System**: 404, 500, 503, 403 error pages
- **Smart Error Detection**: Automatic error classification and routing
- **User-Friendly Error Pages**: Search functionality and suggested actions
- **Error Reporting**: Built-in error tracking and reporting system
- **Fallback Systems**: Multiple layers of error recovery

## 🏗️ Project Structure

```
viewlogic/
├── routes/           # Page components (automatic routing)
│   ├── home.js      # /#/ route
│   ├── about.js     # /#/about route
│   └── user/
│       └── profile.js # /#/user/profile route
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── Button.js        # Button component
│   │   ├── Modal.js         # Modal dialog
│   │   ├── Card.js          # Card component
│   │   ├── Toast.js         # Toast notification
│   │   ├── Input.js         # Input field
│   │   ├── Tabs.js          # Tab navigation
│   │   ├── Select.js        # Select box
│   │   ├── Table.js         # Table component
│   │   ├── Pagination.js    # Pagination
│   │   ├── DatePicker.js    # Date picker
│   │   ├── FileUpload.js    # File upload
│   │   ├── Accordion.js     # Accordion
│   │   ├── Alert.js         # Alert message
│   │   ├── Badge.js         # Badge
│   │   ├── Breadcrumb.js    # Breadcrumb
│   │   ├── LanguageSwitcher.js # Language switcher
│   │   └── Tooltip.js       # Tooltip
│   ├── logic/       # Component logic files
│   │   ├── home.js        # Home page logic
│   │   ├── about.js       # About page logic
│   │   ├── contact.js     # Contact page logic
│   │   ├── error.js       # Error page logic
│   │   └── 404.js         # 404 page logic
│   └── views/       # HTML template files
│       ├── home.html      # Home page template
│       ├── about.html     # About page template
│       ├── contact.html   # Contact page template
│       ├── error.html     # Error page template
│       └── 404.html       # 404 page template
├── i18n/            # Internationalization files
│   ├── ko.js        # Korean
│   └── en.js        # English
├── js/
│   ├── router.js    # Core router system
│   └── i18n.js      # Internationalization system
├── css/             # Stylesheets
│   ├── base.css     # Base styles
│   └── language-switcher.css # Language switcher styles
├── index.html       # Main entry point
├── build.cjs        # Build system (optional)
└── tests/           # Test files
    └── setup.js     # Jest test setup
```

## 🚀 Quick Start

### 1. Start Development Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Live Server (VSCode Extension) recommended
```

### 2. Create Basic Page
```javascript
// routes/hello.js
export default {
    name: 'Hello',
    template: `<h1>{{ message }}</h1>`,
    data() {
        return {
            message: 'Hello ViewLogic!'
        }
    }
}
```

### 3. Check in Browser
Visit `http://localhost:8000/#/hello` to see your page

## 📖 Usage

### Component Creation
```javascript
// routes/example.js
export default {
    name: 'Example',
    // Automatic data loading
    dataURL: '/api/data',
    
    // Authentication required pages set in router options
    data() {
        return {
            message: 'Developing with ViewLogic'
        }
    },
    
    methods: {
        // Authentication methods automatically provided
        handleLogin() {
            this.$setToken('your-jwt-token');
            this.$loginSuccess();
        },
        
        handleLogout() {
            this.$logout();
        }
    }
}
```

### Router Configuration
```javascript
// Initialize router in index.html
const router = new ViewLogicRouter({
    // i18n settings
    useI18n: true,
    i18nDefaultLanguage: 'ko',
    
    // Authentication settings
    auth: {
        enabled: true,
        protectedRoutes: ['profile', 'settings'],
        protectedPrefixes: ['admin/', 'user/'],
        cookieName: 'authToken'
    }
});
```

### Internationalization Support
```javascript
// i18n/ko.js
export default {
    common: {
        hello: '안녕하세요',
        welcome: '환영합니다'
    },
    home: {
        title: 'Welcome to ViewLogic'
    }
};

// Usage in components
template: `<h1>{{ $t('home.title') }}</h1>`
```

## 🌟 Feature Comparison

| Feature | ViewLogic | Traditional Frameworks |
|---------|-----------|----------------------|
| **Build Time** | ⚡ 0 seconds (Zero-Build) | 🐌 Tens of seconds ~ minutes |
| **Development Start** | 📁 Just open files | 🔧 Complex setup required |
| **Routing** | 📂 File-based automatic routing | ⚙️ Manual route configuration |
| **Components** | 🎨 15+ built-in components | 📦 Separate library installation |
| **Authentication** | 🔐 Built-in auth system | 🔌 Third-party plugins |
| **i18n** | 🌐 Automatic multilingual support | 📚 Complex configuration needed |
| **Data Fetching** | 🔄 dataURL automatic loading | 💻 Manual API calls |

## 📱 Responsive Design

All ViewLogic components support responsive design by default:

- Mobile-first design
- Flexbox-based layouts  
- Touch-friendly interfaces
- Support for various screen sizes

### Prerequisites

- **Modern web browser** with ES6 module support
- **Local web server** (Python, Node.js, or any HTTP server)
- **Node.js 14+** (optional for build system)

## 🤝 Perfect Team Collaboration

### 👥 Developer-Publisher-Designer Workflow
ViewLogic provides the **ultimate collaboration system** for modern development teams:

#### **For Developers** 🧑‍💻
- **Zero-build development**: Start coding immediately without build setup
- **Component-based architecture**: Reusable logic and clean separation
- **Built-in authentication & i18n**: Focus on business logic, not boilerplate
- **Automatic data fetching**: Simple `dataURL` property handles all API calls

#### **For Publishers** 🎨
- **Template-logic separation**: Pure HTML templates in `src/views/` folder
- **No build knowledge required**: Work directly with HTML files
- **Live preview**: See changes instantly without complex tooling
- **Component integration**: Use UI components like regular HTML elements

#### **For Designers** 🖌️
- **CSS-only styling**: Style components without touching JavaScript
- **Component library**: 15+ pre-built components to customize
- **Responsive by default**: Mobile-first design system
- **No technical barriers**: Design directly in the browser

#### **Collaboration Benefits**
- **Parallel development**: Teams can work simultaneously without conflicts
- **Instant integration**: Changes from any team member are immediately visible
- **Version control friendly**: Clean file structure, easy to track changes
- **No build pipeline dependency**: No waiting for builds to see design changes

## 🛠️ Advanced Features

### Authentication System Setup
```javascript
// Custom authentication function
const checkAuth = async () => {
    const token = localStorage.getItem('token');
    return token && await validateToken(token);
};

const router = new ViewLogicRouter({
    auth: {
        enabled: true,
        checkAuthFunction: checkAuth,
        loginRoute: 'login',
        protectedPrefixes: ['admin/']
    }
});
```

### Component Usage Examples
```html
<!-- Various button styles -->
<Button variant="primary" :loading="isLoading" @click="handleClick">
    Click Me
</Button>

<!-- Modal dialog -->
<Modal v-model="showModal" title="Confirm" @confirm="handleConfirm">
    Are you sure you want to delete?
</Modal>

<!-- Data card -->
<Card title="User Info" :hoverable="true" shadow="medium">
    <p>{{ userInfo }}</p>
    <template #footer>
        <span class="card-tag">Active</span>
    </template>
</Card>

<!-- Toast notifications -->
<Toast ref="toast" position="top-right" />

<!-- Input field -->
<Input 
    v-model="email" 
    label="Email" 
    type="email" 
    :required="true"
    error-message="Please enter a valid email"
/>

<!-- Tab navigation -->
<Tabs v-model="activeTab" :tabs="tabsData">
    <template #tab1>First tab content</template>
    <template #tab2>Second tab content</template>
</Tabs>
```

### Adding New Pages
```javascript
// routes/newpage.js - Minimal setup for complete page
export default {
    dataURL: "/api/products"  // This alone creates a complete page!
}

// Or more detailed configuration
export default {
    name: 'NewPage',
    template: `
        <div>
            <h1>{{ title }}</h1>
            <Button @click="handleAction">Action</Button>
        </div>
    `,
    data() {
        return {
            title: 'New Page'
        }
    },
    methods: {
        handleAction() {
            this.$setToken('token');
            this.$navigateTo('home');
        }
    }
}
```

### Layout System
```javascript
export default {
    name: 'MyPage',
    layout: 'admin',  // Uses layouts/admin.js
    data() {
        return {
            content: 'Admin page content'
        }
    }
}
```

## 🧪 Testing

```bash
# Unit testing with Jest
npm test

# Test coverage
npm run test:coverage
```

### 🛠️ Development Scripts

```bash
npm run build           # Standard build
npm run build:prod      # Production build with optimizations  
npm run build:dev       # Development build with verbose logging
npm run build:watch     # Watch mode for development
npm run build:clean     # Clean build artifacts
npm run build:info      # Show build information
```

## 🔧 Development

### Architecture Principles

- **Separation of Concerns**: Views, logic, styles, and components are completely separated
- **Component Reusability**: Build once, use everywhere philosophy
- **Performance First**: Intelligent caching, lazy loading, and optimization
- **Error Resilience**: Multiple fallback systems and graceful degradation
- **Developer Experience**: Hot reloading, detailed logging, and debugging tools

### 🛠️ Advanced Build System

The build system (`build.cjs`) provides:
- **Source Optimization**: Minification and tree-shaking
- **Smart Caching**: File-based caching with change detection
- **Asset Optimization**: CSS and image optimization
- **Source Maps**: Development debugging support
- **Watch Mode**: Real-time rebuilding during development
- **Manifest Generation**: Build metadata and versioning

### 📊 Performance Features

- **Route Preloading**: Background loading of likely-to-visit pages
- **Component Lazy Loading**: Load components only when needed
- **Smart Caching**: LRU cache with TTL and size limits
- **Bundle Optimization**: Production builds with dead code elimination
- **Progressive Loading**: Skeleton UI and loading states

### 🎯 Error Handling Strategy

1. **Prevention**: Input validation and type checking
2. **Detection**: Automatic error classification and routing
3. **Recovery**: Multiple fallback systems and retry mechanisms  
4. **Reporting**: Comprehensive error logging and user feedback
5. **User Experience**: Friendly error pages with actionable solutions

### 🧪 Testing & Debugging

```bash
# Development with detailed logging
npm run build:dev

# Watch mode for continuous development
npm run build:watch

# Production testing
npm run build:prod && npm run serve

# Clean build artifacts
npm run build:clean

# Build information and diagnostics
npm run build:info
```

### Browser Compatibility

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **ES6 Modules**: Native ES module support required
- **Vue 3**: Full Vue 3 compatibility including Composition API
- **Fetch API**: Required for dynamic loading
- **CSS Grid/Flexbox**: Required for component layouts

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork and Clone**: Fork the repository and clone your fork
2. **Feature Branch**: Create a feature branch from `master`
3. **Development**: Use the development environment and build tools
4. **Testing**: Test thoroughly in both development and production modes
5. **Documentation**: Update README if you add new features
6. **Pull Request**: Submit a PR with clear description and examples

### Contribution Areas

- 🧩 **Components**: Add new reusable UI components
- 🎨 **Themes**: Enhance the design system and theming
- 🚀 **Performance**: Optimize loading and rendering
- 🛡️ **Security**: Improve security and error handling
- 📚 **Documentation**: Improve guides and examples
- 🧪 **Testing**: Add automated tests and quality checks

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- 🐛 Bug Reports: [Issues](https://github.com/hopegiver/viewlogic-vue/issues)
- 💡 Feature Requests: [Discussions](https://github.com/hopegiver/viewlogic-vue/discussions)
- 📧 Email: support@viewlogic.dev

---

**Experience faster and simpler Vue development with ViewLogic!** 🚀