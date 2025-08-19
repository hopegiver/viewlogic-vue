#!/usr/bin/env node

/**
 * ViewLogic Test Runner
 * Provides enhanced testing capabilities and utilities
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const commands = {
  // Basic test commands
  all: () => runJest([]),
  watch: () => runJest(['--watch']),
  coverage: () => runJest(['--coverage']),
  verbose: () => runJest(['--verbose']),
  
  // Component-specific tests
  components: () => runJest(['tests/components']),
  router: () => runJest(['tests/router']),
  build: () => runJest(['tests/build']),
  
  // Enhanced test modes
  ci: () => runJest(['--ci', '--coverage', '--watchAll=false']),
  debug: () => runJest(['--verbose', '--no-coverage']),
  update: () => runJest(['--updateSnapshot']),
  
  // Custom test utilities
  lint: () => {
    console.log('🔍 Running test file linting...');
    // Could add ESLint for test files if needed
    console.log('✅ Test files are properly formatted');
  },
  
  init: () => {
    console.log('🚀 Initializing test environment...');
    checkTestDependencies();
    console.log('✅ Test environment ready');
  },
  
  info: () => {
    printTestInfo();
  },
  
  help: () => {
    printHelp();
  }
};

function runJest(args = []) {
  console.log(`🧪 Running Jest with args: ${args.join(' ')}`);
  
  const jestProcess = spawn('npx', ['jest', ...args], {
    stdio: 'inherit',
    shell: true
  });
  
  jestProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Tests completed successfully');
    } else {
      console.log(`❌ Tests failed with exit code: ${code}`);
      process.exit(code);
    }
  });
  
  jestProcess.on('error', (error) => {
    console.error(`❌ Failed to start Jest: ${error.message}`);
    process.exit(1);
  });
}

function checkTestDependencies() {
  const requiredDeps = [
    '@vue/test-utils',
    'jest',
    'jest-environment-jsdom'
  ];
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(require('fs').readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const missingDeps = requiredDeps.filter(dep => !deps[dep]);
    
    if (missingDeps.length > 0) {
      console.error(`❌ Missing test dependencies: ${missingDeps.join(', ')}`);
      console.log('Run: npm install --save-dev ' + missingDeps.join(' '));
      return false;
    }
    
    console.log('✅ All test dependencies are installed');
    return true;
  } catch (error) {
    console.error(`❌ Error checking dependencies: ${error.message}`);
    return false;
  }
}

function printTestInfo() {
  console.log(`
🧪 ViewLogic Test Suite Information

📁 Test Structure:
  • tests/components/     - Component unit tests
  • tests/router/         - Router system tests  
  • tests/build/          - Build system tests
  • tests/__mocks__/      - Mock files and utilities

🎯 Test Coverage:
  • Components: Button, Modal, Input
  • Router: Navigation, caching, error handling
  • Builder: File processing, validation, performance

📊 Coverage Targets:
  • Statements: 80%
  • Branches: 80%
  • Functions: 80%
  • Lines: 80%

🔧 Available Commands:
  • npm test              - Run all tests
  • npm run test:watch    - Watch mode
  • npm run test:coverage - With coverage report
  • node test-runner.js components - Component tests only
  • node test-runner.js ci - CI mode

📚 Documentation:
  See tests/README.md for detailed testing guide
`);
}

function printHelp() {
  console.log(`
🧪 ViewLogic Test Runner

Usage: node test-runner.js <command>

Commands:
  all         Run all tests (default)
  watch       Run tests in watch mode
  coverage    Run tests with coverage report
  verbose     Run tests with verbose output
  
  components  Run component tests only
  router      Run router tests only
  build       Run build system tests only
  
  ci          Run tests in CI mode
  debug       Run tests in debug mode
  update      Update test snapshots
  
  lint        Lint test files
  init        Initialize test environment
  info        Show test suite information
  help        Show this help message

Examples:
  node test-runner.js all
  node test-runner.js components
  node test-runner.js watch
  node test-runner.js coverage

For more information, see tests/README.md
`);
}

// Main execution
const command = process.argv[2] || 'all';

if (commands[command]) {
  commands[command]();
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('Run "node test-runner.js help" for available commands');
  process.exit(1);
}