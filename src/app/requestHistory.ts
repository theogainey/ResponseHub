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

  async getDeleteAllRequests():Promise<void> {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database connection not established");
        return;
      }
      const transaction = this.db.transaction(['requests'], 'readwrite');
      const objectStore = transaction.objectStore('requests');
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = (_event) => {
        resolve();
      };

      clearRequest.onerror = (_event) => {
        reject();
      };
    });
  }

  async deleteRequestById(id: number): Promise<void> {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database connection not established");
        return;
      }

      const transaction = this.db.transaction(['requests'], 'readwrite');
      const objectStore = transaction.objectStore('requests');
      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = (_event) => {
        resolve();
      };

      deleteRequest.onerror = (_event) => {
        reject();
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
  const historyContainer = document.querySelector('.cmp-history__entry-area');
  requests.forEach((request) => {
    historyContainer?.prepend(createHistoryEntryElement(request));
  });
};

const printNewHistoryEntry = (request:RequestHistoryEntry) => {
  const historyContainer = document.querySelector('.cmp-history__entry-area');
  historyContainer?.prepend(createHistoryEntryElement(request));
};

const requestHistoryDB = new RequestHistoryDB();

const initHistory = async () => {
  const requests = await requestHistoryDB.getRequests();
  printHistory(requests);
  const historyOptionsButton = document.querySelector('.cmp-history__options-button');
  historyOptionsButton?.addEventListener('click', historyOptionsHandler);
  const clearHistoryButton = document.querySelector('#clear-history-button');
  clearHistoryButton?.addEventListener('click', clearRequestHistory);
  const cancelClearHistoryButton = document.querySelector('#cancel-clear-history-button');
  cancelClearHistoryButton?.addEventListener('click', historyOptionsHandler);

};

const addRequestToHistory = async (request: RequestHistoryEntry) => {
  await requestHistoryDB.addRequest(request);
  printNewHistoryEntry(request);
};

// TODO: An are you sure workflow
const clearRequestHistory = async () => {
  await requestHistoryDB.getDeleteAllRequests();
  const historyContainer = document.querySelector('.cmp-history__entry-area') as HTMLElement;
  historyContainer.innerHTML = '';
  historyOptionsHandler();
}

// TODO make it so when the modal is open when you click off a modal it closes
const historyOptionsHandler = () => {
  const historyOptionsModal = document.querySelector('.cmp-history__options-modal');
  const historyOptionsButton = document.querySelector('.cmp-history__options-button') as Element;
  if(historyOptionsModal?.classList.contains('util-display-none')){
    historyOptionsButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 9L9 15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 9L15 15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `
    historyOptionsModal?.classList.toggle('util-display-none');
    return;
  }
  historyOptionsButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 6H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 11V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 11V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  historyOptionsModal?.classList.toggle('util-display-none');
}
export { initHistory, addRequestToHistory };
