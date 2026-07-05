const DB_NAME = "cv_maker_guide_db";
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot access IndexedDB on server side"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      // Idempotent: create each store only if it doesn't exist.
      // Never delete existing stores — preserves user data across upgrades.
      if (!db.objectStoreNames.contains("cv_records")) {
        db.createObjectStore("cv_records", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("cl_records")) {
        db.createObjectStore("cl_records", { keyPath: "id" });
      }
    };
  });

  return dbPromise;
}
