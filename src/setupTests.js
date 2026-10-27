import '@testing-library/jest-dom';

// Ensure fetch is defined in jsdom environment for Jest
if (!globalThis.fetch) {
  globalThis.fetch = jest.fn();
}
window.fetch = globalThis.fetch;
