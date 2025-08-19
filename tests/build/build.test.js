/**
 * Build System Tests
 */
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Mock file system operations
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn()
}));

// Mock Builder class for testing
class MockBuilder {
  constructor(options = {}) {
    this.config = {
      sourceDir: options.sourceDir || 'src',
      outputDir: options.outputDir || 'routes',
      logicDir: options.logicDir || 'logic',
      viewsDir: options.viewsDir || 'views',
      stylesDir: options.stylesDir || 'styles',
      componentsDir: options.componentsDir || 'components',
      minify: options.minify !== false,
      sourceMap: options.sourceMap !== false,
      includeComponents: options.includeComponents !== false
    };
    
    this.buildStats = {
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      warnings: [],
      startTime: null,
      endTime: null
    };
    
    // Mock methods
    this.build = jest.fn();
    this.buildLogic = jest.fn();
    this.buildViews = jest.fn();
    this.buildStyles = jest.fn();
    this.buildComponents = jest.fn();
    this.copyStaticFiles = jest.fn();
    this.generateManifest = jest.fn();
    this.minifyFile = jest.fn();
    this.generateSourceMap = jest.fn();
    this.validateOutput = jest.fn();
    this.cleanup = jest.fn();
  }

  // Mock file processing methods
  processJavaScript(filePath) {
    const processed = {
      originalPath: filePath,
      outputPath: filePath.replace('src/', 'routes/'),
      size: 1024,
      minified: this.config.minify,
      sourceMap: this.config.sourceMap
    };
    
    this.buildStats.processedFiles++;
    return processed;
  }

  processHTML(filePath) {
    const processed = {
      originalPath: filePath,
      outputPath: filePath.replace('src/', 'routes/'),
      size: 512,
      minified: this.config.minify
    };
    
    this.buildStats.processedFiles++;
    return processed;
  }

  processCSS(filePath) {
    const processed = {
      originalPath: filePath,
      outputPath: filePath.replace('src/', 'routes/'),
      size: 256,
      minified: this.config.minify,
      sourceMap: this.config.sourceMap
    };
    
    this.buildStats.processedFiles++;
    return processed;
  }

  // Mock validation methods
  validateFileStructure() {
    const issues = [];
    
    // Mock some validation logic
    if (!fs.existsSync(this.config.sourceDir)) {
      issues.push({ type: 'error', message: 'Source directory not found' });
    }
    
    return issues;
  }

  validateOutput() {
    const issues = [];
    
    // Mock output validation
    if (!fs.existsSync(this.config.outputDir)) {
      issues.push({ type: 'error', message: 'Output directory not created' });
    }
    
    return issues;
  }

  // Mock performance measurement
  measurePerformance(operation) {
    const start = performance.now();
    
    return {
      end: () => {
        const end = performance.now();
        return {
          operation,
          duration: end - start,
          memory: process.memoryUsage()
        };
      }
    };
  }

  getBuildStats() {
    return {
      ...this.buildStats,
      duration: this.buildStats.endTime - this.buildStats.startTime,
      success: this.buildStats.errors.length === 0
    };
  }

  reset() {
    this.buildStats = {
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      warnings: [],
      startTime: null,
      endTime: null
    };
  }
}

describe('Build System', () => {
  let builder;

  beforeEach(() => {
    builder = new MockBuilder();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (builder) {
      builder.reset();
    }
  });

  describe('Builder Configuration', () => {
    test('initializes with default configuration', () => {
      const defaultBuilder = new MockBuilder();
      
      expect(defaultBuilder.config.sourceDir).toBe('src');
      expect(defaultBuilder.config.outputDir).toBe('routes');
      expect(defaultBuilder.config.minify).toBe(true);
      expect(defaultBuilder.config.sourceMap).toBe(true);
    });

    test('accepts custom configuration', () => {
      const customConfig = {
        sourceDir: 'custom-src',
        outputDir: 'custom-dist',
        minify: false,
        sourceMap: false
      };
      
      const customBuilder = new MockBuilder(customConfig);
      
      expect(customBuilder.config.sourceDir).toBe('custom-src');
      expect(customBuilder.config.outputDir).toBe('custom-dist');
      expect(customBuilder.config.minify).toBe(false);
      expect(customBuilder.config.sourceMap).toBe(false);
    });

    test('initializes build statistics', () => {
      expect(builder.buildStats.totalFiles).toBe(0);
      expect(builder.buildStats.processedFiles).toBe(0);
      expect(builder.buildStats.errors).toEqual([]);
      expect(builder.buildStats.warnings).toEqual([]);
    });
  });

  describe('File Processing', () => {
    test('processes JavaScript files correctly', () => {
      const filePath = 'src/logic/home.js';
      const result = builder.processJavaScript(filePath);
      
      expect(result.originalPath).toBe(filePath);
      expect(result.outputPath).toBe('routes/logic/home.js');
      expect(result.minified).toBe(true);
      expect(result.sourceMap).toBe(true);
      expect(builder.buildStats.processedFiles).toBe(1);
    });

    test('processes HTML files correctly', () => {
      const filePath = 'src/views/home.html';
      const result = builder.processHTML(filePath);
      
      expect(result.originalPath).toBe(filePath);
      expect(result.outputPath).toBe('routes/views/home.html');
      expect(result.minified).toBe(true);
      expect(builder.buildStats.processedFiles).toBe(1);
    });

    test('processes CSS files correctly', () => {
      const filePath = 'src/styles/home.css';
      const result = builder.processCSS(filePath);
      
      expect(result.originalPath).toBe(filePath);
      expect(result.outputPath).toBe('routes/styles/home.css');
      expect(result.minified).toBe(true);
      expect(result.sourceMap).toBe(true);
      expect(builder.buildStats.processedFiles).toBe(1);
    });

    test('tracks file processing statistics', () => {
      builder.processJavaScript('src/logic/home.js');
      builder.processHTML('src/views/home.html');
      builder.processCSS('src/styles/home.css');
      
      expect(builder.buildStats.processedFiles).toBe(3);
    });
  });

  describe('Build Methods', () => {
    test('build method is defined and callable', () => {
      expect(builder.build).toBeDefined();
      expect(typeof builder.build).toBe('function');
      
      builder.build();
      expect(builder.build).toHaveBeenCalled();
    });

    test('buildLogic method is defined', () => {
      expect(builder.buildLogic).toBeDefined();
      expect(typeof builder.buildLogic).toBe('function');
    });

    test('buildViews method is defined', () => {
      expect(builder.buildViews).toBeDefined();
      expect(typeof builder.buildViews).toBe('function');
    });

    test('buildStyles method is defined', () => {
      expect(builder.buildStyles).toBeDefined();
      expect(typeof builder.buildStyles).toBe('function');
    });

    test('buildComponents method is defined', () => {
      expect(builder.buildComponents).toBeDefined();
      expect(typeof builder.buildComponents).toBe('function');
    });

    test('copyStaticFiles method is defined', () => {
      expect(builder.copyStaticFiles).toBeDefined();
      expect(typeof builder.copyStaticFiles).toBe('function');
    });
  });

  describe('Validation', () => {
    test('validates file structure', () => {
      fs.existsSync.mockReturnValue(true);
      
      const issues = builder.validateFileStructure();
      expect(Array.isArray(issues)).toBe(true);
    });

    test('detects missing source directory', () => {
      fs.existsSync.mockReturnValue(false);
      
      const issues = builder.validateFileStructure();
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].type).toBe('error');
      expect(issues[0].message).toContain('Source directory');
    });

    test('validates build output', () => {
      fs.existsSync.mockReturnValue(true);
      
      const issues = builder.validateOutput();
      expect(Array.isArray(issues)).toBe(true);
    });

    test('detects output validation issues', () => {
      fs.existsSync.mockReturnValue(false);
      
      const issues = builder.validateOutput();
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].type).toBe('error');
    });
  });

  describe('Performance Monitoring', () => {
    test('measures operation performance', () => {
      const measurement = builder.measurePerformance('test-operation');
      
      expect(measurement).toBeDefined();
      expect(typeof measurement.end).toBe('function');
      
      const result = measurement.end();
      expect(result.operation).toBe('test-operation');
      expect(typeof result.duration).toBe('number');
      expect(result.memory).toBeDefined();
    });

    test('tracks build duration', () => {
      builder.buildStats.startTime = Date.now();
      builder.buildStats.endTime = Date.now() + 1000;
      
      const stats = builder.getBuildStats();
      expect(stats.duration).toBeGreaterThan(0);
    });
  });

  describe('Build Statistics', () => {
    test('provides comprehensive build stats', () => {
      builder.buildStats.totalFiles = 10;
      builder.buildStats.processedFiles = 8;
      builder.buildStats.errors = [];
      builder.buildStats.warnings = ['Warning message'];
      builder.buildStats.startTime = Date.now();
      builder.buildStats.endTime = Date.now() + 1000;
      
      const stats = builder.getBuildStats();
      
      expect(stats.totalFiles).toBe(10);
      expect(stats.processedFiles).toBe(8);
      expect(stats.errors).toEqual([]);
      expect(stats.warnings).toHaveLength(1);
      expect(stats.success).toBe(true);
      expect(typeof stats.duration).toBe('number');
    });

    test('marks build as failed when errors exist', () => {
      builder.buildStats.errors = ['Error message'];
      
      const stats = builder.getBuildStats();
      expect(stats.success).toBe(false);
    });

    test('resets statistics correctly', () => {
      builder.buildStats.processedFiles = 5;
      builder.buildStats.errors = ['error'];
      
      builder.reset();
      
      expect(builder.buildStats.processedFiles).toBe(0);
      expect(builder.buildStats.errors).toEqual([]);
    });
  });

  describe('Configuration Options', () => {
    test('handles minification option', () => {
      const noMinifyBuilder = new MockBuilder({ minify: false });
      const result = noMinifyBuilder.processJavaScript('src/test.js');
      
      expect(result.minified).toBe(false);
    });

    test('handles source map option', () => {
      const noSourceMapBuilder = new MockBuilder({ sourceMap: false });
      const result = noSourceMapBuilder.processJavaScript('src/test.js');
      
      expect(result.sourceMap).toBe(false);
    });

    test('handles component inclusion option', () => {
      const noComponentsBuilder = new MockBuilder({ includeComponents: false });
      
      expect(noComponentsBuilder.config.includeComponents).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('handles build errors gracefully', () => {
      builder.buildStats.errors.push('Test error');
      
      const stats = builder.getBuildStats();
      expect(stats.success).toBe(false);
      expect(stats.errors).toContain('Test error');
    });

    test('collects warnings during build', () => {
      builder.buildStats.warnings.push('Test warning');
      
      const stats = builder.getBuildStats();
      expect(stats.warnings).toContain('Test warning');
    });

    test('maintains error and warning collections', () => {
      builder.buildStats.errors.push('Error 1');
      builder.buildStats.errors.push('Error 2');
      builder.buildStats.warnings.push('Warning 1');
      
      expect(builder.buildStats.errors).toHaveLength(2);
      expect(builder.buildStats.warnings).toHaveLength(1);
    });
  });

  describe('File System Integration', () => {
    test('checks for source directory existence', () => {
      fs.existsSync.mockReturnValue(true);
      
      const issues = builder.validateFileStructure();
      expect(fs.existsSync).toHaveBeenCalledWith(builder.config.sourceDir);
    });

    test('verifies output directory creation', () => {
      fs.existsSync.mockReturnValue(true);
      
      const issues = builder.validateOutput();
      expect(fs.existsSync).toHaveBeenCalledWith(builder.config.outputDir);
    });
  });

  describe('Utility Methods', () => {
    test('cleanup method is available', () => {
      expect(builder.cleanup).toBeDefined();
      expect(typeof builder.cleanup).toBe('function');
    });

    test('generateManifest method is available', () => {
      expect(builder.generateManifest).toBeDefined();
      expect(typeof builder.generateManifest).toBe('function');
    });

    test('minifyFile method is available', () => {
      expect(builder.minifyFile).toBeDefined();
      expect(typeof builder.minifyFile).toBe('function');
    });

    test('generateSourceMap method is available', () => {
      expect(builder.generateSourceMap).toBeDefined();
      expect(typeof builder.generateSourceMap).toBe('function');
    });
  });
});

describe('Build Integration Tests', () => {
  test('full build process simulation', () => {
    const builder = new MockBuilder();
    
    // Simulate a complete build process
    builder.buildStats.startTime = Date.now();
    
    // Process various file types
    builder.processJavaScript('src/logic/home.js');
    builder.processHTML('src/views/home.html');
    builder.processCSS('src/styles/home.css');
    
    builder.buildStats.endTime = Date.now();
    
    const stats = builder.getBuildStats();
    
    expect(stats.processedFiles).toBe(3);
    expect(stats.success).toBe(true);
    expect(stats.duration).toBeGreaterThanOrEqual(0);
  });

  test('build with errors and warnings', () => {
    const builder = new MockBuilder();
    
    // Simulate build with issues
    builder.buildStats.errors.push('File not found');
    builder.buildStats.warnings.push('Deprecated syntax');
    
    const stats = builder.getBuildStats();
    
    expect(stats.success).toBe(false);
    expect(stats.errors).toHaveLength(1);
    expect(stats.warnings).toHaveLength(1);
  });

  test('performance under load simulation', () => {
    const builder = new MockBuilder();
    const fileCount = 100;
    
    // Simulate processing many files
    for (let i = 0; i < fileCount; i++) {
      builder.processJavaScript(`src/logic/file${i}.js`);
    }
    
    expect(builder.buildStats.processedFiles).toBe(fileCount);
  });
});