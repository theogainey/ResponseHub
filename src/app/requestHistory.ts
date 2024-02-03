import { setMethod, setURL } from "./url";
import { setHeaders } from "./headers";
import { setURLSearchParams } from "./urlSearchParams";
import { printPreview } from "./preview";

type RequestHistoryEntry = {
  method: string;
  url: string;
  headers: [string, string][];
  urlSearchParams: [string, string][];
  timeStamp: number;
  id?: number; 
}

class RequestHistoryDB {
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
        const objectStore = this.db.createObjectStore("requests", { autoIncrement: true });
        objectStore.createIndex('id', 'id', { unique: true }); 
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        resolve();
      };
    });
  }

  async getRequests(): Promise<RequestHistoryEntry[]> {
    await this.initPromise;
    return await new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database connection not established");
        return;
      }

      const transaction = this.db.transaction(['requests'], 'readonly').objectStore('requests').getAll();

      transaction.onsuccess = (event) => {
        const allData = (event.target as IDBRequest).result;
        if(!Array.isArray(allData)){
          resolve([]);
          return;
        };
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
      const transaction = this.db.transaction(['requests'], 'readwrite').objectStore('requests');
  
      const getKeyRequest = transaction.getAllKeys();
      
      getKeyRequest.onsuccess = (event) => {
        const keys = (event.target as IDBRequest).result as number[];
        const maxId = keys.length > 0 ? Math.max(...keys) : 0;
        const newId = maxId + 1;
        requestHistoryEntry.id = newId;
        const addRequest = transaction.add(requestHistoryEntry);
  
        addRequest.onsuccess = () => {
          resolve();
        };
  
        addRequest.onerror = (_event) => {
          reject("Error adding data to object store");
        };
      };
  
      getKeyRequest.onerror = (_event) => {
        reject("Error retrieving keys from object store");
      };
    });
  }

  async getRequestById(id: number): Promise<RequestHistoryEntry | null> {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database connection not established");
        return;
      }

      const transaction = this.db.transaction(['requests'], 'readonly');
      const objectStore = transaction.objectStore('requests');
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result ? result : null);
      };

      getRequest.onerror = (_event) => {
        reject("Error retrieving data by ID from object store");
      };
    });
  }
};

const historyEntryClickHandler = (id: number) => async ()=> {
  const request = await requestHistoryDB.getRequestById(id);
  console.log(request);
  setURL(request?.url ?? '');
  setMethod(request?.method ?? 'GET');
  setHeaders(request?.headers ?? []);
  setURLSearchParams(request?.urlSearchParams ?? []);
  printPreview();
} 

const createHistoryEntryElement = (request: RequestHistoryEntry) => {
  const newHistoryEntryElement = document.createElement('div');
  newHistoryEntryElement.classList.add('cmp-history__list-item');
  newHistoryEntryElement.setAttribute('data-request-id', request.id?.toString() ?? '0');
  newHistoryEntryElement.innerHTML = `<span class="cmp-history__method cmp-history__method--${request.method}">${request.method}</span> <span>${request.url}</span>`;
  newHistoryEntryElement.addEventListener('click', historyEntryClickHandler(request.id ?? 0));
  return newHistoryEntryElement;
}

const printHistory = (requests: RequestHistoryEntry[]) => {
  const historyContainer = document.querySelector('.cmp-history');
  requests.forEach((request) => {
    historyContainer?.prepend(createHistoryEntryElement(request));
  });
};

const printNewHistoryEntry = (request:RequestHistoryEntry) => {
  const historyContainer = document.querySelector('.cmp-history');
  historyContainer?.prepend(createHistoryEntryElement(request));
};

const requestHistoryDB = new RequestHistoryDB();

const initHistory = async () => {
  const requests = await requestHistoryDB.getRequests();
  printHistory(requests);
};

const addRequestToHistory = async (request: RequestHistoryEntry) => {
  await requestHistoryDB.addRequest(request);
  printNewHistoryEntry(request);
};

export { initHistory, addRequestToHistory };
