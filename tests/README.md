# ViewLogic Testing Documentation

This directory contains comprehensive tests for the ViewLogic Vue framework, ensuring code quality, reliability, and maintainability.

## Test Structure

```
tests/
├── __mocks__/           # Mock files for testing
│   └── fileMock.js      # Static file mocks
├── build/              # Build system tests
│   └── build.test.js   # Builder functionality tests
├── components/         # Component unit tests
│   ├── Button.test.js  # Button component tests
│   ├── Input.test.js   # Input component tests
│   └── Modal.test.js   # Modal component tests
├── router/            # Router system tests
│   └── router.test.js # Router functionality tests
├── setup.js           # Test environment setup
├── globalSetup.js     # Global test setup
├── globalTeardown.js  # Global test cleanup
└── README.md         # This documentation
```

## Testing Framework

- **Jest**: Primary testing framework with extensive mocking capabilities
- **Vue Test Utils**: Official testing utilities for Vue 3 components
- **JSDOM**: DOM environment simulation for headless testing

## Test Categories

### 1. Component Tests
Located in `tests/components/`, these tests verify:
- Component rendering and props
- Event emission and handling
- State management and reactivity
- User interaction simulation
- Edge cases and error handling

#### Button Component Tests
- Basic functionality (rendering, text, slots)
- Variants and styling (primary, secondary, sizes)
- States (disabled, loading, with icons)
- Event handling and click prevention

#### Modal Component Tests
- Visibility control and v-model binding
- Header, body, and footer rendering
- Close functionality (overlay, buttons)
- Button visibility and custom actions
- Slot content rendering

#### Input Component Tests
- Input types and validation
- State management (focus, blur, validation)
- Icons and clear functionality
- Help text and error display
- Event emission and value binding

### 2. Router System Tests
Located in `tests/router/`, these tests verify:
- Route navigation and hash handling
- Cache management (LRU, TTL)
- Loading state management
- Error handling and 404 detection
- Component integration
- Performance optimization

### 3. Build System Tests
Located in `tests/build/`, these tests verify:
- File processing (JS, HTML, CSS)
- Minification and source map generation
- Build statistics and performance monitoring
- Error and warning collection
- Configuration handling
- File system integration

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Files
```bash
# Run component tests only
npm test tests/components

# Run router tests only
npm test tests/router

# Run build tests only
npm test tests/build

# Run a specific test file
npm test Button.test.js
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- **Environment**: JSDOM for DOM simulation
- **Module Resolution**: ES6 modules and CSS/asset mocking
- **Coverage**: 80% threshold across all metrics
- **Transform**: ES6/Vue component transformation
- **Setup Files**: Custom test environment configuration

### Coverage Thresholds
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

## Writing Tests

### Component Test Example
```javascript
import { mount } from '@vue/test-utils';
import ComponentName from '../../src/components/ComponentName.js';

describe('ComponentName', () => {
  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('renders correctly', () => {
    wrapper = mount(ComponentName, {
      props: { /* props */ }
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});
```

### Router Test Example
```javascript
describe('Router Functionality', () => {
  let router;

  beforeEach(() => {
    router = new MockRouter();
  });

  test('handles navigation', () => {
    router.navigateTo('home');
    expect(router.getCurrentRoute()).toBe('home');
  });
});
```

## Best Practices

### Test Organization
1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Clean up** after each test to prevent interference
4. **Mock external dependencies** to isolate units under test

### Test Writing Guidelines
1. **Follow AAA pattern**: Arrange, Act, Assert
2. **Test one thing at a time** per test case
3. **Use meaningful assertions** that clearly express expectations
4. **Handle async operations** with proper await/async patterns

### Component Testing
1. **Test props and events** thoroughly
2. **Simulate user interactions** realistically
3. **Verify DOM structure** and content
4. **Test edge cases** and error conditions

### Mocking Strategy
1. **Mock external APIs** and services
2. **Mock file system operations** in build tests
3. **Mock complex dependencies** to focus on unit behavior
4. **Avoid over-mocking** - test real interactions when practical

## Continuous Integration

### GitHub Actions Integration
Add to `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Performance Testing

### Load Testing
- Component rendering with large datasets
- Router cache performance under load
- Build system performance with many files

### Memory Testing
- Memory leak detection in long-running tests
- Component cleanup verification
- Cache memory usage monitoring

## Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="specific test"
```

### Common Issues
1. **Async timing issues**: Use proper async/await patterns
2. **DOM cleanup**: Ensure components are unmounted
3. **Mock interference**: Clear mocks between tests
4. **Test isolation**: Avoid shared state between tests

## Contributing

### Adding New Tests
1. Create test files following the naming convention: `*.test.js`
2. Place tests in appropriate directories based on functionality
3. Follow existing patterns and best practices
4. Ensure all tests pass and maintain coverage thresholds

### Test Review Checklist
- [ ] Tests are well-organized and readable
- [ ] All edge cases are covered
- [ ] Mocks are appropriate and not over-used
- [ ] Tests are isolated and don't interfere with each other
- [ ] Coverage thresholds are maintained
- [ ] Documentation is updated if needed

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vue Test Utils Documentation](https://vue-test-utils.vuejs.org/)
- [Vue 3 Testing Guide](https://vuejs.org/guide/scaling-up/testing.html)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)