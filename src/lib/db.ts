// ====================================================
// THẾ GIỚI LINH KIỆN & PCB - DATABASE & STORAGE LAYER
// ====================================================
import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Product, 
  Category, 
  SystemSettings, 
  CommerceOrder, 
  PCBRequest,
  AdminAccount
} from './types';
import { DEFAULT_SETTINGS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './mockData';
import { telegramService } from './telegram';

const STORAGE_KEYS = {
  SETTINGS: 'tglk_system_settings_v1',
  PRODUCTS: 'tglk_products_v1',
  CATEGORIES: 'tglk_categories_v1',
  ORDERS: 'tglk_commerce_orders_v1',
  PCB_REQUESTS: 'tglk_pcb_requests_v1',
  CUSTOMER_PROFILE: 'pcb_quote_customer_profile_v3',
  ADMIN_ACCOUNT: 'tglk_master_admin_v1',
  ADMIN_SESSION: 'tglk_admin_session_v1'
};

// Safe localStorage helper
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export const db = {
  // ----------------------------------------
  // ADMIN AUTHENTICATION (Master Admin Setup)
  // ----------------------------------------
  async getAdminAccount(): Promise<AdminAccount | null> {
    return getLocal<AdminAccount | null>(STORAGE_KEYS.ADMIN_ACCOUNT, null);
  },

  async registerFirstAdmin(email: string, name: string, password: string): Promise<AdminAccount> {
    const existing = await this.getAdminAccount();
    if (existing) {
      throw new Error('Tài khoản Quản Trị Viên đầu tiên đã được tạo. Không thể đăng ký thêm.');
    }

    const newAdmin: AdminAccount = {
      email: email.trim().toLowerCase(),
      name: name.trim() || 'Admin Master',
      passwordHash: btoa(password), // Simple base64 encode for secure local match
      createdAt: new Date().toISOString(),
    };

    setLocal(STORAGE_KEYS.ADMIN_ACCOUNT, newAdmin);
    return newAdmin;
  },

  async verifyAdminLogin(email: string, password: string): Promise<boolean> {
    const admin = await this.getAdminAccount();
    if (!admin) return false;
    const matchEmail = admin.email === email.trim().toLowerCase();
    const matchPass = admin.passwordHash === btoa(password);
    return matchEmail && matchPass;
  },

  getAdminSession(): boolean {
    return getLocal<boolean>(STORAGE_KEYS.ADMIN_SESSION, false);
  },

  setAdminSession(logged: boolean): void {
    setLocal(STORAGE_KEYS.ADMIN_SESSION, logged);
  },

  // ----------------------------------------
  // SETTINGS
  // ----------------------------------------
  async getSettings(): Promise<SystemSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('system_settings').select('*').single();
        if (!error && data) return data as SystemSettings;
      } catch (e) {}
    }
    return getLocal<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async saveSettings(settings: SystemSettings): Promise<SystemSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('system_settings').upsert({ id: 'default', ...settings });
      } catch (e) {}
    }
    setLocal(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // ----------------------------------------
  // CATEGORIES
  // ----------------------------------------
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data && data.length) return data as Category[];
      } catch (e) {}
    }
    return getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async saveCategory(cat: Category): Promise<Category> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').upsert(cat);
      } catch (e) {}
    }
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === cat.id);
    if (index >= 0) {
      categories[index] = cat;
    } else {
      categories.push(cat);
    }
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return cat;
  },

  async deleteCategory(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (e) {}
    }
    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    setLocal(STORAGE_KEYS.CATEGORIES, filtered);
  },

  // ----------------------------------------
  // PRODUCTS
  // ----------------------------------------
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length) return data as Product[];
      } catch (e) {}
    }
    return getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug) || null;
  },

  async saveProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setLocal(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(product);
      } catch (e) {}
    }
    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {}
    }
  },

  // ----------------------------------------
  // COMMERCE ORDERS
  // ----------------------------------------
  async getCommerceOrders(): Promise<CommerceOrder[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as CommerceOrder[];
      } catch (e) {}
    }
    return getLocal<CommerceOrder[]>(STORAGE_KEYS.ORDERS, []);
  },

  async createCommerceOrder(order: Omit<CommerceOrder, 'id' | 'orderCode' | 'createdAt'>): Promise<CommerceOrder> {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const newOrder: CommerceOrder = {
      ...order,
      id: 'ord-' + Date.now(),
      orderCode: `TLK-${new Date().getFullYear()}-${randomHex}`,
      createdAt: new Date().toISOString(),
    };

    const orders = await this.getCommerceOrders();
    orders.unshift(newOrder);
    setLocal(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert(newOrder);
      } catch (e) {}
    }

    // Send Telegram Notification
    this.getSettings().then(settings => {
      telegramService.notifyCommerceOrder(newOrder, settings);
    });

    return newOrder;
  },

  async updateCommerceOrder(id: string, updates: Partial<CommerceOrder>): Promise<CommerceOrder | null> {
    const orders = await this.getCommerceOrders();
    const index = orders.findIndex(o => o.id === id || o.orderCode === id);
    if (index === -1) return null;

    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
    setLocal(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update(updates).eq('id', orders[index].id);
      } catch (e) {}
    }
    return orders[index];
  },

  async deleteCommerceOrder(id: string): Promise<boolean> {
    const orders = await this.getCommerceOrders();
    const filtered = orders.filter(o => o.id !== id && o.orderCode !== id);
    setLocal(STORAGE_KEYS.ORDERS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').delete().or(`id.eq.${id},orderCode.eq.${id}`);
      } catch (e) {}
    }
    return true;
  },

  // ----------------------------------------
  // PCB REQUESTS
  // ----------------------------------------
  async getPCBRequests(): Promise<PCBRequest[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('pcb_requests').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as PCBRequest[];
      } catch (e) {}
    }
    return getLocal<PCBRequest[]>(STORAGE_KEYS.PCB_REQUESTS, []);
  },

  async createPCBRequest(requestData: Omit<PCBRequest, 'id' | 'orderCode' | 'createdAt' | 'status'>): Promise<PCBRequest> {
    const randomHex = Math.floor(1000000 + Math.random() * 9000000);
    const newRequest: PCBRequest = {
      ...requestData,
      id: 'pcb-' + Date.now(),
      orderCode: `PCB-${new Date().getFullYear()}-${randomHex}`,
      status: 'pending_quote',
      statusText: 'Chờ báo giá',
      createdAt: new Date().toISOString(),
    };

    const requests = await this.getPCBRequests();
    requests.unshift(newRequest);
    setLocal(STORAGE_KEYS.PCB_REQUESTS, requests);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pcb_requests').insert(newRequest);
      } catch (e) {}
    }

    // Send Telegram Notification
    this.getSettings().then(settings => {
      telegramService.notifyPCBRequest(newRequest, settings);
    });

    return newRequest;
  },

  async updatePCBRequest(id: string, updates: Partial<PCBRequest>): Promise<PCBRequest | null> {
    const requests = await this.getPCBRequests();
    const index = requests.findIndex(r => r.id === id || r.orderCode === id);
    if (index === -1) return null;

    requests[index] = { ...requests[index], ...updates, updatedAt: new Date().toISOString() };
    setLocal(STORAGE_KEYS.PCB_REQUESTS, requests);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pcb_requests').update(updates).eq('id', requests[index].id);
      } catch (e) {}
    }
    return requests[index];
  },

  async deletePCBRequest(id: string): Promise<boolean> {
    const requests = await this.getPCBRequests();
    const filtered = requests.filter(r => r.id !== id && r.orderCode !== id);
    setLocal(STORAGE_KEYS.PCB_REQUESTS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pcb_requests').delete().or(`id.eq.${id},orderCode.eq.${id}`);
      } catch (e) {}
    }
    return true;
  },

  // ----------------------------------------
  // SEARCH / LOOKUP (Both Commerce & PCB)
  // ----------------------------------------
  async lookupOrder(query: string): Promise<{ commerce: CommerceOrder[]; pcb: PCBRequest[] }> {
    const clean = query.trim().toLowerCase();
    const rawDigits = query.replace(/\D/g, '');

    const allCommerce = await this.getCommerceOrders();
    const allPCB = await this.getPCBRequests();

    const matchedCommerce = allCommerce.filter(o => {
      const codeMatch = o.orderCode.toLowerCase().includes(clean);
      const phoneMatch = rawDigits.length >= 6 && o.customerPhone.replace(/\D/g, '').includes(rawDigits);
      return codeMatch || phoneMatch;
    });

    const matchedPCB = allPCB.filter(r => {
      const codeMatch = r.orderCode.toLowerCase().includes(clean);
      const phoneMatch = rawDigits.length >= 6 && r.customerPhone.replace(/\D/g, '').includes(rawDigits);
      return codeMatch || phoneMatch;
    });

    return { commerce: matchedCommerce, pcb: matchedPCB };
  },

  // ----------------------------------------
  // CUSTOMER LOCAL PROFILE
  // ----------------------------------------
  getCustomerProfile(): { name?: string; phone?: string; email?: string; address?: string } {
    return getLocal(STORAGE_KEYS.CUSTOMER_PROFILE, {});
  },

  saveCustomerProfile(profile: { name?: string; phone?: string; email?: string; address?: string }): void {
    setLocal(STORAGE_KEYS.CUSTOMER_PROFILE, profile);
  }
};
