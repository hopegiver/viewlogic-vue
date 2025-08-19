# ViewLogic Vue Web Application

A comprehensive Vue 3 web application featuring an advanced router system, reusable component library, and robust error handling with loading state management.

## ✨ Features

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

## 📁 Project Structure

```
viewlogic/
├── index.html              # Main entry point (development)
├── production.html         # Production entry point
├── build.cjs              # Advanced build system
├── package.json           # Project configuration
├── css/
│   └── main.css           # Enhanced global styles with component support
├── js/
│   └── router.js          # Advanced Vue-compatible router with error handling
├── src/                   # Source files (development)
│   ├── components/        # 🆕 Reusable UI component library
│   │   ├── Button.js      # Button component with variants and loading states
│   │   ├── Modal.js       # Modal dialog component
│   │   ├── Card.js        # Card component with headers and footers  
│   │   ├── Toast.js       # Notification toast component
│   │   ├── Input.js       # Input field component with validation
│   │   ├── Tabs.js        # Tab navigation component
│   │   ├── ComponentLoader.js  # Dynamic component loading system
│   │   └── components.css # Component-specific styles
│   ├── views/             # HTML templates
│   │   ├── home.html      # Enhanced with component demonstrations
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── 404.html       # 🆕 User-friendly 404 error page
│   │   ├── error.html     # 🆕 Generic error page
│   │   └── loading.html   # 🆕 Loading component template
│   ├── logic/             # JavaScript component logic
│   │   ├── home.js        # Enhanced with component interactions
│   │   ├── about.js
│   │   ├── contact.js
│   │   ├── 404.js         # 🆕 404 page logic with search functionality
│   │   ├── error.js       # 🆕 Error handling logic
│   │   └── loading.js     # 🆕 Loading component logic
│   ├── styles/            # Component-specific CSS
│   │   ├── home.css
│   │   ├── about.css
│   │   ├── contact.css
│   │   ├── 404.css        # 🆕 404 page styling with animations
│   │   ├── error.css      # 🆕 Error page styling
│   │   └── loading.css    # 🆕 Loading animations and spinners
│   └── layouts/           # Layout templates
│       └── default.html   # Enhanced default layout
└── routes/                # 🆕 Production-built components
    ├── home.js            # Built and optimized route files
    ├── about.js
    ├── contact.js
    ├── 404.js
    ├── error.js
    ├── loading.js
    └── manifest.json      # Build manifest with metadata
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 14+** (for build system)
- **Modern web browser** with ES6 module support
- **Local web server** (Python, Node.js, or any HTTP server)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/hopegiver/viewlogic-vue.git
cd viewlogic-vue
```

2. **Install dependencies (optional for build system):**
```bash
npm install
```

3. **Development mode:**
```bash
# Start development server
npm run dev
# or
python -m http.server 8000
```

4. **Production build:**
```bash
# Build optimized production files
npm run build

# Build with all optimizations
npm run build:prod

# Serve production build
npm run serve
```

5. **Open your browser:**
   - Development: `http://localhost:8000` (uses `index.html`)
   - Production: `http://localhost:8000/production.html`

### 🛠️ Development Scripts

```bash
npm run build           # Standard build
npm run build:prod      # Production build with optimizations  
npm run build:dev       # Development build with verbose logging
npm run build:watch     # Watch mode for development
npm run build:clean     # Clean build artifacts
npm run build:info      # Show build information
```

## 🔧 How It Works

### Advanced Router System

The enhanced router (`js/router.js`) provides:
- **Smart Navigation**: Hash-based routing with smooth transitions
- **Dynamic Loading**: Intelligent component loading with caching
- **Error Recovery**: Comprehensive error handling and 404 detection
- **Loading States**: Progress indicators and loading management
- **Component Integration**: Automatic component registration and lifecycle management
- **Performance**: LRU caching, route preloading, and optimization

### Component Architecture

Each route follows a modular structure:
- **View**: HTML template (`src/views/{route}.html`)
- **Logic**: Vue component definition (`src/logic/{route}.js`)
- **Style**: Component-specific CSS (`src/styles/{route}.css`)
- **Build**: Optimized production file (`routes/{route}.js`)

### 🧩 Using Components

#### Available Components:
```html
<!-- Button with variants and loading states -->
<Button variant="primary" :loading="isLoading" @click="handleClick">
    Click Me
</Button>

<!-- Modal dialog -->
<Modal v-model="showModal" title="Modal Title" @confirm="handleConfirm">
    Modal content here
</Modal>

<!-- Card with header and footer -->
<Card title="Card Title" :hoverable="true" shadow="medium">
    <p>Card content</p>
    <template #footer>
        <span class="card-tag">Tag</span>
    </template>
</Card>

<!-- Toast notifications -->
<Toast ref="toast" position="top-right" />

<!-- Input with validation -->
<Input 
    v-model="inputValue" 
    label="Email" 
    type="email" 
    :required="true"
    error-message="Invalid email"
/>

<!-- Tabs with dynamic content -->
<Tabs v-model="activeTab" :tabs="tabsData">
    <template #tab1>Tab 1 Content</template>
    <template #tab2>Tab 2 Content</template>
</Tabs>
```

### 🆕 Adding New Routes

1. **Create the route files:**
```bash
# Create all necessary files
touch src/views/newpage.html
touch src/logic/newpage.js  
touch src/styles/newpage.css
```

2. **HTML Template with Components:**
```html
<!-- src/views/newpage.html -->
<div class="newpage">
    <Card title="{{ title }}" hoverable>
        <p>{{ message }}</p>
        
        <template #footer>
            <Button @click="handleAction" variant="primary">
                Action Button
            </Button>
        </template>
    </Card>
    
    <Toast ref="toast" />
</div>
```

3. **Vue Component Logic:**
```javascript
// src/logic/newpage.js
export default {
    name: 'NewPage',
    layout: 'default',
    pageTitle: 'New Page - ViewLogic',
    showHeader: true,
    data() {
        return {
            title: 'New Page',
            message: 'Welcome to the new page!'
        }
    },
    methods: {
        handleAction() {
            this.$refs.toast.success('Action completed!');
        }
    }
}
```

4. **Component Styles:**
```css
/* src/styles/newpage.css */
.newpage {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}
```

5. **Build and Test:**
```bash
# Build the new route
npm run build

# Test in development
npm run dev
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

This project is open source and available under the [MIT License](LICENSE).

---

## 🌟 What's New

### Recent Updates (v1.0.0)
- ✅ **Complete Component System**: 6 production-ready UI components
- ✅ **Advanced Error Handling**: Smart error detection and user-friendly pages
- ✅ **Loading State Management**: Progress indicators and skeleton UI
- ✅ **Production Build System**: Optimized builds with caching and minification
- ✅ **Enhanced Router**: Preloading, error recovery, and smooth transitions
- ✅ **Developer Experience**: Better debugging, logging, and development tools

ViewLogic is now a comprehensive, production-ready Vue 3 application framework! 🚀