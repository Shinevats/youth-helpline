// ─── localStorage helpers ───────────────────────────────────────────────────

export const storage = {
  get(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },

  remove(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  append(key, item) {
    const existing = this.get(key, []);
    this.set(key, [item, ...existing]);
    return [item, ...existing];
  },

  update(key, id, updates) {
    const items = this.get(key, []);
    const updated = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    this.set(key, updated);
    return updated;
  },

  delete(key, id) {
    const items = this.get(key, []);
    const filtered = items.filter((item) => item.id !== id);
    this.set(key, filtered);
    return filtered;
  },
};

// ─── Keys ──────────────────────────────────────────────────────────────────
export const KEYS = {
  JOURNAL:    'safespace-journal',
  COMMUNITY:  'safespace-community',
  USER:       'safespace-user',
  THEME:      'safespace-theme',
  CHAT_HIST:  'safespace-chat-history',
  SESSION:    'safespace-sessions',
};
