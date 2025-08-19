# ViewLogic Vue Web Application

A modular Vue 3 web application with a custom router system that dynamically loads components.

## Features

- **Vue 3 Integration**: Uses Vue 3 runtime with global script inclusion
- **Custom Router**: Hash-based routing system compatible with Vue
- **Modular Architecture**: Separated view templates, logic, and styles
- **Dynamic Loading**: Components are loaded dynamically based on routes
- **Korean Language Support**: Default interface in Korean

## Project Structure

```
viewlogic/
├── index.html              # Main entry point
├── css/
│   └── main.css           # Global styles
├── js/
│   ├── router.js          # Custom Vue-compatible router
│   └── lib/
│       └── vue.global.js  # Vue 3 library
├── src/
│   ├── views/             # HTML templates
│   │   ├── home.html
│   │   ├── about.html
│   │   └── contact.html
│   ├── logic/             # JavaScript components
│   │   ├── home.js
│   │   ├── about.js
│   │   └── contact.js
│   └── styles/            # Component-specific CSS
│       ├── home.css
│       ├── about.css
│       └── contact.css
├── start-server.bat       # Windows server start script
├── start-server.sh        # Unix server start script
└── config.example.js      # Configuration example
```

## Getting Started

### Prerequisites

- A local web server (Python, Node.js, or any HTTP server)
- Modern web browser with ES6 module support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hopegiver/viewlogic-vue.git
cd viewlogic-vue
```

2. Start a local server:

**Windows:**
```bash
start-server.bat
```

**Unix/Linux/macOS:**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Manual server start:**
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# PHP
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

## How It Works

### Router System

The custom router (`js/router.js`) provides:
- Hash-based navigation (`#home`, `#about`, `#contact`)
- Dynamic component loading
- Vue 3 integration with global properties
- Error handling for missing routes

### Component Structure

Each route consists of three files:
- **View**: HTML template (`src/views/{route}.html`)
- **Logic**: Vue component definition (`src/logic/{route}.js`)
- **Style**: Component-specific CSS (`src/styles/{route}.css`)

### Adding New Routes

1. Create the HTML template:
```html
<!-- src/views/newpage.html -->
<div class="newpage">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
</div>
```

2. Create the Vue component:
```javascript
// src/logic/newpage.js
export default {
    data() {
        return {
            title: 'New Page',
            message: 'Welcome to the new page!'
        }
    },
    methods: {
        // Component methods here
    }
}
```

3. Create the styles:
```css
/* src/styles/newpage.css */
.newpage {
    padding: 20px;
}
```

4. Add navigation link:
```html
<li><a href="#newpage">New Page</a></li>
```

## Development

### File Structure Guidelines

- Keep templates semantic and clean
- Use Vue 3 Composition API when needed
- Follow consistent naming conventions
- Separate concerns (view, logic, style)

### Browser Compatibility

- Modern browsers with ES6 module support
- Vue 3 compatible browsers
- Fetch API support required

## Testing

- `test.html`: Basic functionality test
- `simple-test.html`: Simplified test page
- `debug.html`: Debug mode for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).