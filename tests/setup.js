/**
 * Jest Setup File
 * Configures the testing environment before each test
 */

// Mock global objects and functions
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: process.env.NODE_ENV === 'test' && process.env.DEBUG ? console.log : jest.fn(),
  warn: console.warn,
  error: console.error,
  info: console.info
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '#home',
    reload: jest.fn(),
    assign: jest.fn(),
    replace: jest.fn()
  },
  writable: true
});

// Mock window.history
Object.defineProperty(window, 'history', {
  value: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    go: jest.fn(),
    length: 1
  },
  writable: true
});

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    headers: new Map()
  })
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};
global.sessionStorage = sessionStorageMock;

// Mock Vue 3 global
global.Vue = {
  createApp: jest.fn(() => ({
    component: jest.fn(),
    mount: jest.fn(),
    unmount: jest.fn(),
    config: {
      globalProperties: {}
    }
  })),
  ref: jest.fn(val => ({ value: val })),
  reactive: jest.fn(obj => obj),
  computed: jest.fn(fn => ({ value: fn() })),
  watch: jest.fn(),
  onMounted: jest.fn(),
  onUnmounted: jest.fn()
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Suppress specific warnings in tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError(...args);
};

// Add custom matchers if needed
expect.extend({
  toBeVisible(received) {
    const pass = received && received.style && received.style.display !== 'none';
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}be visible`,
      pass
    };
  }
});