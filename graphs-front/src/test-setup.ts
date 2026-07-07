// Test setup for Vitest with Angular 21
// Using Zone.js for change detection
// See: https://analogjs.org/docs/test/vitest

import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import '@analogjs/vitest-angular/setup-snapshots';
import '@analogjs/vitest-angular/setup-serializers';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// Initialize Angular test environment
setupTestBed({
  zoneless: false,
});

// Clean up after each test
import { TestBed } from '@angular/core/testing';

afterEach(() => {
  TestBed.resetTestingModule();
});
