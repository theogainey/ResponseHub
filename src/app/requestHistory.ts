type RequestHistoryEntry = {
  method: string;
  url: string;
}

class RequestHistory {
  private db: IDBDatabase | null = null;
  readonly dbName = "ResponseHub";
  readonly version = 1;

  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initDatabase();
  }

  private initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (_event) => {
        reject(new Error("Database error"));
      };

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        this.db.createObjectStore("requests", { autoIncrement: true });
        resolve();
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        resolve();
      };
    });
  }

  async getRequestPreviews(): Promise<RequestHistoryEntry[] | void> {
    await this.initPromise;
    return await new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database connection not established");
        return;
      }

      const transaction = this.db.transaction(['requests'], 'readonly').objectStore('requests').getAll();

      transaction.onsuccess = (event) => {
        const allData = (event.target as IDBRequest).result;
        resolve(allData);
      };

      transaction.onerror = (_event) => {
        reject("Error retrieving data from object store");
      };
    });
  }

  async addRequest(requestHistoryEntry: RequestHistoryEntry): Promise<void> {
    await this.initPromise;
    return await new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database connection not established");
        return;
      }

      const transaction = this.db.transaction(['requests'], 'readwrite')
        .objectStore('requests')
        .add(requestHistoryEntry)

      transaction.onsuccess = (_event) => {
        resolve();
      };

      transaction.onerror = (_event) => {
        reject("Error add data to object store");
      };
    });
  }
}

export { RequestHistory };
