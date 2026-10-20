import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SurpriseSettings, Wish, Memory, AdminStats } from '../src/types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'content.json');

interface DatabaseSchema {
  settings: SurpriseSettings;
  wishes: Wish[];
  memories: Memory[];
  admin: {
    email: string;
    salt: string;
    passwordHash: string;
  };
}

const DEFAULT_SETTINGS: SurpriseSettings = {
  title: 'Birthday & Memories',
  subtitle: 'A little world of wishes, memories, and love.',
  recipientName: 'Special Someone',
  cakeHeading: 'Happy Birthday! 🎂',
  cakeSubtitle: 'Make your sweetest wish before blowing out each candle...',
  questionText: 'Are you ready to see your special surprise? 💗',
  memoriesIntroHeading: 'Our Beautiful Memories 📸',
  memoriesIntroText: "Every picture holds a moment, every moment tells a story, and every memory is a little treasure. Now let's revisit the beautiful moments we've shared.",
  finalWishesHeading: 'Wishes Just for You 💖',
  finalWishesMessage: 'May your life always be filled with happiness, beautiful memories, and endless reasons to smile. 💗',
  footerTagline: 'Made with Love ♡'
};

const DEFAULT_WISHES: Wish[] = [
  {
    id: 'wish-1',
    type: 'gift',
    title: 'To My Favorite Person ✨',
    message: 'On this special day, I hope you are reminded of how deeply cherished and adored you are. Thank you for bringing so much warmth, laughter, and light into every single day.',
    sender: 'Forever with love',
    emoji: '🌸',
    order: 1,
    isPublished: true
  },
  {
    id: 'wish-2',
    type: 'gift',
    title: 'A Year of Wonder & Dreams 🌟',
    message: 'May this new year around the sun bring exciting adventures, quiet moments of peace, and all the happiness your kind heart deserves. Keep shining brightly!',
    sender: 'With warmest hugs',
    emoji: '🎁',
    order: 2,
    isPublished: true
  },
  {
    id: 'wish-3',
    type: 'final',
    title: 'Unconditional Joy',
    message: 'May you always have reasons to dance, laugh until your tummy hurts, and feel surrounded by genuine warmth.',
    sender: 'Your Biggest Fan',
    date: 'Forever',
    accentColor: '#F47BA7',
    order: 1,
    isPublished: true
  },
  {
    id: 'wish-4',
    type: 'final',
    title: 'Countless New Adventures',
    message: 'Here is to more road trips, late-night talks, spontaneous ice cream runs, and memories we will treasure forever.',
    sender: 'Always Here For You',
    date: 'Always',
    accentColor: '#DCCBFF',
    order: 2,
    isPublished: true
  },
  {
    id: 'wish-5',
    type: 'final',
    title: 'Peace, Health & Sunshine',
    message: 'May every morning greet you with clarity and every evening bring you restful peace and gratitude.',
    sender: 'With Deep Affection',
    date: 'Every Day',
    accentColor: '#F7C96B',
    order: 3,
    isPublished: true
  }
];

const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'Under the Fairy Lights',
    caption: 'That unforgettable cozy evening with warm cocoa, acoustic tunes, and laughter under the stars.',
    date: 'October 14',
    category: 'Celebration',
    imageUrl: '/src/assets/images/memory_stargazing_picnic_1792484692955.jpg',
    order: 1,
    isPublished: true
  },
  {
    id: 'mem-2',
    title: 'Golden Sunset Stroll',
    caption: 'Walking barefoot by the shore as the pastel sky reflected all our favorite conversations.',
    date: 'August 22',
    category: 'Travel',
    imageUrl: '/src/assets/images/memory_sunset_beach_walk_1792484692216.jpg',
    order: 2,
    isPublished: true
  },
  {
    id: 'mem-3',
    title: 'Cozy Morning Cafe',
    caption: 'Sneaking away for strawberry shortcake and latte art before the world woke up.',
    date: 'June 08',
    category: 'Little Things',
    imageUrl: '/src/assets/images/memory_cozy_cafe_birthday_1792484693270.jpg',
    order: 3,
    isPublished: true
  },
  {
    id: 'mem-4',
    title: 'Peonies & Soft Ribbons',
    caption: 'A fresh pastel bouquet to remind you how much color you bring into life every day.',
    date: 'May 03',
    category: 'Surprise',
    imageUrl: '/src/assets/images/memory_flower_bouquet_gift_1792484692842.jpg',
    order: 4,
    isPublished: true
  }
];

// Helper to hash passwords securely
export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// In-memory active tokens store
const activeTokens = new Map<string, { email: string; expiresAt: number }>();

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, resetting to defaults', err);
      }
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const initialPassword = process.env.ADMIN_PASSWORD || 'birthday2026!';
    const initialEmail = process.env.ADMIN_EMAIL || 'admin@birthday.com';
    const passwordHash = hashPassword(initialPassword, salt);

    const initialData: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      wishes: DEFAULT_WISHES,
      memories: DEFAULT_MEMORIES,
      admin: {
        email: initialEmail,
        salt,
        passwordHash
      }
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  private save() {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database file', err);
    }
  }

  // Auth methods
  public verifyLogin(email: string, password: string): { success: boolean; token?: string; error?: string } {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (email.trim().toLowerCase() !== this.data.admin.email.toLowerCase()) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const calculatedHash = hashPassword(password, this.data.admin.salt);
    if (calculatedHash !== this.data.admin.passwordHash) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    // Session valid for 7 days
    activeTokens.set(token, {
      email: this.data.admin.email,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    return { success: true, token };
  }

  public validateToken(token: string): boolean {
    if (!token) return false;
    const session = activeTokens.get(token);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      activeTokens.delete(token);
      return false;
    }
    return true;
  }

  public invalidateToken(token: string): void {
    activeTokens.delete(token);
  }

  public updatePassword(oldPass: string, newPass: string): { success: boolean; error?: string } {
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }
    const currentHash = hashPassword(oldPass, this.data.admin.salt);
    if (currentHash !== this.data.admin.passwordHash) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    const newSalt = crypto.randomBytes(16).toString('hex');
    this.data.admin.salt = newSalt;
    this.data.admin.passwordHash = hashPassword(newPass, newSalt);
    this.save();
    return { success: true };
  }

  // Public client data
  public getPublicContent() {
    return {
      settings: this.data.settings,
      giftWishes: this.data.wishes
        .filter((w) => w.type === 'gift' && w.isPublished)
        .sort((a, b) => a.order - b.order),
      finalWishes: this.data.wishes
        .filter((w) => w.type === 'final' && w.isPublished)
        .sort((a, b) => a.order - b.order),
      memories: this.data.memories
        .filter((m) => m.isPublished)
        .sort((a, b) => a.order - b.order)
    };
  }

  // Admin data
  public getAdminData() {
    const publishedWishes = this.data.wishes.filter((w) => w.isPublished).length;
    const publishedMemories = this.data.memories.filter((m) => m.isPublished).length;
    const totalGiftWishes = this.data.wishes.filter((w) => w.type === 'gift').length;
    const totalFinalWishes = this.data.wishes.filter((w) => w.type === 'final').length;

    const stats: AdminStats = {
      totalWishes: this.data.wishes.length,
      publishedWishes,
      totalMemories: this.data.memories.length,
      publishedMemories,
      totalGiftWishes,
      totalFinalWishes
    };

    return {
      settings: this.data.settings,
      wishes: [...this.data.wishes].sort((a, b) => a.order - b.order),
      memories: [...this.data.memories].sort((a, b) => a.order - b.order),
      stats,
      adminEmail: this.data.admin.email
    };
  }

  public updateSettings(newSettings: Partial<SurpriseSettings>) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // Wishes CRUD
  public createWish(wish: Omit<Wish, 'id'>): Wish {
    const newWish: Wish = {
      ...wish,
      id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    this.data.wishes.push(newWish);
    this.save();
    return newWish;
  }

  public updateWish(id: string, updates: Partial<Wish>): Wish | null {
    const index = this.data.wishes.findIndex((w) => w.id === id);
    if (index === -1) return null;
    this.data.wishes[index] = { ...this.data.wishes[index], ...updates };
    this.save();
    return this.data.wishes[index];
  }

  public deleteWish(id: string): boolean {
    const initialLen = this.data.wishes.length;
    this.data.wishes = this.data.wishes.filter((w) => w.id !== id);
    if (this.data.wishes.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Memories CRUD
  public createMemory(memory: Omit<Memory, 'id'>): Memory {
    const newMemory: Memory = {
      ...memory,
      id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    this.data.memories.push(newMemory);
    this.save();
    return newMemory;
  }

  public updateMemory(id: string, updates: Partial<Memory>): Memory | null {
    const index = this.data.memories.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.data.memories[index] = { ...this.data.memories[index], ...updates };
    this.save();
    return this.data.memories[index];
  }

  public deleteMemory(id: string): boolean {
    const initialLen = this.data.memories.length;
    this.data.memories = this.data.memories.filter((m) => m.id !== id);
    if (this.data.memories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public resetToDefaults() {
    this.data.settings = DEFAULT_SETTINGS;
    this.data.wishes = DEFAULT_WISHES;
    this.data.memories = DEFAULT_MEMORIES;
    this.save();
    return this.getAdminData();
  }
}

export const db = new Database();
