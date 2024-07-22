import '@testing-library/jest-dom';
import React from 'react';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test-id' });

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Disable console errors and warnings
console.error = jest.fn();
console.warn = jest.fn();
