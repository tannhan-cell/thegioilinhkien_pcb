// ==========================================
// THẾ GIỚI LINH KIỆN & PCB - INDEXEDDB FILE STORAGE
// Lưu trữ và tải trực tiếp file Gerber, BOM, CPL, ZIP dung lượng lớn
// ==========================================

const DB_NAME = 'TGLK_FILE_STORAGE_V1';
const STORE_NAME = 'pcb_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('Trình duyệt không hỗ trợ IndexedDB'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredFileRecord {
  key: string;
  name: string;
  size: number;
  type: string;
  blob: Blob;
  savedAt: number;
}

export const fileStorage = {
  /**
   * Lưu file Blob/File vào IndexedDB
   */
  async saveFile(key: string, file: File | Blob, originalName?: string): Promise<string> {
    try {
      const db = await openDB();
      const filename = originalName || (file instanceof File ? file.name : key);
      const cleanKey = key.toLowerCase().trim();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record: StoredFileRecord = {
          key: cleanKey,
          name: filename,
          size: file.size,
          type: file.type || 'application/octet-stream',
          blob: file,
          savedAt: Date.now(),
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(cleanKey);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Lỗi lưu file vào IndexedDB:', e);
      return key;
    }
  },

  /**
   * Lấy Blob từ IndexedDB bằng key hoặc filename
   */
  async getFile(keyOrFilename: string): Promise<Blob | null> {
    try {
      const db = await openDB();
      const cleanKey = keyOrFilename.toLowerCase().trim();

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cleanKey);

        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            resolve(req.result.blob);
          } else {
            // Thử tìm theo tên file nếu key khác
            const cursorReq = store.openCursor();
            cursorReq.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
              if (cursor) {
                if (cursor.value.name?.toLowerCase() === cleanKey || cursor.value.key?.includes(cleanKey)) {
                  resolve(cursor.value.blob);
                  return;
                }
                cursor.continue();
              } else {
                resolve(null);
              }
            };
            cursorReq.onerror = () => resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('Lỗi đọc file từ IndexedDB:', e);
      return null;
    }
  },

  /**
   * Kích hoạt tải file trực tiếp trên trình duyệt
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  },

  /**
   * Xóa file khỏi IndexedDB
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key.toLowerCase().trim());
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }
};
