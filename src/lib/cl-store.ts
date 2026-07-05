import { CLRecord } from "./cl-types";
import { getDB } from "./db";

const STORE_NAME = "cl_records";

export async function saveCLRecord(record: CLRecord): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({
      ...record,
      updatedAt: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCLRecord(id: string): Promise<CLRecord | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function listCLRecords(): Promise<CLRecord[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const list = request.result || [];
      resolve(list.sort((a: CLRecord, b: CLRecord) => b.updatedAt - a.updatedAt));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCLRecord(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function duplicateCLRecord(id: string): Promise<CLRecord | null> {
  const original = await getCLRecord(id);
  if (!original) return null;

  const copy: CLRecord = {
    ...original,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11),
    name: `${original.name} (Copy)`,
    updatedAt: Date.now(),
  };

  await saveCLRecord(copy);
  return copy;
}
