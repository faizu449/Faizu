import {
  PublicContentResponse,
  AdminDataResponse,
  SurpriseSettings,
  Wish,
  Memory
} from '../types.js';

const TOKEN_KEY = 'birthday_admin_token';

export const api = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async fetchPublicContent(): Promise<PublicContentResponse> {
    const res = await fetch('/api/public-content');
    if (!res.ok) {
      throw new Error('Failed to load birthday surprise content');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<{ token: string; email: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    this.setToken(data.token);
    return data;
  },

  async refreshCredentials(): Promise<{ success: boolean; email: string; defaultPass: string }> {
    const res = await fetch('/api/auth/refresh-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to refresh credentials');
    }
    return data;
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // ignore logout network errors
      }
    }
    this.clearToken();
  },

  async checkAuth(): Promise<{ email: string } | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        this.clearToken();
        return null;
      }
      return res.json();
    } catch {
      return null;
    }
  },

  async fetchAdminData(): Promise<AdminDataResponse> {
    const token = this.getToken();
    const res = await fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      if (res.status === 401) {
        this.clearToken();
      }
      throw new Error('Failed to fetch admin data');
    }
    return res.json();
  },

  async updateSettings(settings: Partial<SurpriseSettings>): Promise<SurpriseSettings> {
    const token = this.getToken();
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async createWish(wish: Omit<Wish, 'id'>): Promise<Wish> {
    const token = this.getToken();
    const res = await fetch('/api/admin/wishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(wish)
    });
    if (!res.ok) throw new Error('Failed to create wish');
    return res.json();
  },

  async updateWish(id: string, wish: Partial<Wish>): Promise<Wish> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/wishes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(wish)
    });
    if (!res.ok) throw new Error('Failed to update wish');
    return res.json();
  },

  async deleteWish(id: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/wishes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete wish');
  },

  async createMemory(memory: Omit<Memory, 'id'>): Promise<Memory> {
    const token = this.getToken();
    const res = await fetch('/api/admin/memories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(memory)
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(id: string, memory: Partial<Memory>): Promise<Memory> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(memory)
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(id: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/memories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  async uploadPhoto(dataUrl: string, filename?: string): Promise<string> {
    const token = this.getToken();
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ dataUrl, filename })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload photo');
    }
    const data = await res.json();
    return data.url;
  },

  async resetDefaults(): Promise<AdminDataResponse> {
    const token = this.getToken();
    const res = await fetch('/api/admin/reset-defaults', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to reset content');
    return res.json();
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch('/api/admin/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
  }
};
