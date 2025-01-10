import { act } from "react"
import { render } from '@testing-library/react';
import { useTheme, ThemeProvider } from '../../src/theme/ThemeContext';

// More explicit localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Set up localStorage mock before tests
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
});

// Test component that uses the theme
const TestComponent = () => {
  try {
    const { mode, toggleTheme } = useTheme();
    return (
      <div data-testid="test-component">
        <span data-testid="theme-mode">{mode}</span>
        <button data-testid="toggle-button" onClick={toggleTheme}>
          Toggle Theme
        </button>
      </div>
    );
  } catch (error) {
    console.error('Error in TestComponent:', error);
    throw error;
  }
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should use light theme by default', () => {
    try {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(getByTestId('theme-mode').textContent).toBe('light');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  it('should use saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(getByTestId('theme-mode').textContent).toBe('dark');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('themeMode');
  });

  it('should toggle theme when triggered', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const toggleButton = getByTestId('toggle-button');
    
    expect(getByTestId('theme-mode').textContent).toBe('light');
    
    act(() => {
      toggleButton.click();
    });
    expect(getByTestId('theme-mode').textContent).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('themeMode', 'dark');
    
    act(() => {
      toggleButton.click();
    });
    expect(getByTestId('theme-mode').textContent).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('themeMode', 'light');
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleError.mockRestore();
  });
});
