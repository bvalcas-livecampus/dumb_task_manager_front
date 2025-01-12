import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { AuthProvider, useAuth } from '../../src/auth/AuthContext';
import { fetcher } from '../../src/api';

// Mock the fetcher module
jest.mock('../../src/api');

describe('AuthContext', () => {
  // Clear localStorage and reset mocks before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with null user and false authentication when localStorage is empty', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
  });

  it('should initialize with stored user and authentication state', () => {
    const testUser = { id: 1, username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('isAuthenticated', 'true');

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(testUser);
    expect(result.current.isAuthenticated).toBeTruthy();
  });

  it('should successfully login user', async () => {
    const testUser = { id: 1, username: 'testuser' };
    fetcher.mockResolvedValueOnce({}).mockResolvedValueOnce({ data: testUser });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login('testuser', 'password');
      expect(success).toBeTruthy();
    });

    expect(result.current.user).toEqual(testUser);
    expect(result.current.isAuthenticated).toBeTruthy();
    expect(localStorage.getItem('user')).toBe(JSON.stringify(testUser));
    expect(localStorage.getItem('isAuthenticated')).toBe('true');
  });

  it('should handle failed login', async () => {
    fetcher.mockRejectedValueOnce(new Error('Login failed'));

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login('testuser', 'wrongpassword');
      expect(success.success).toBeFalsy();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
  });

  it('should successfully logout user', async () => {
    const testUser = { id: 1, username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('isAuthenticated', 'true');
    fetcher.mockResolvedValueOnce({});

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
  });

  it('should handle failed logout gracefully', async () => {
    const testUser = { id: 1, username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('isAuthenticated', 'true');
    fetcher.mockRejectedValueOnce(new Error('Logout failed'));

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    // Should still clear user state even if API call fails
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
  });
});
