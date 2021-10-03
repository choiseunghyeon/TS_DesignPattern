import { Server } from ".";

export interface ClientDataItem {
    id: string;
    value: string;
}

export interface ClientDataStore {
    timestamp: number;
    items: {
        [id: string]: ClientDataItem;
    }
    changed: {
        [id: string]: number;
    }
}

export interface SyncingRequest {
    timestamp: number;
    changes: {
        [id: string]: ClientChange
    }
}

export interface SyncingResponse {
    timestamp: number;
    changes: {
        [id: string]: string;
    }
}

export interface ClientChange {
    lastModifiedTime: number;
    value: string;
}

export class Client {
    store: ClientDataStore = {
        timestamp: 0,
        items: Object.create(null),
        changed: Object.create(null),
    };

    constructor(public server: Server) {}

    synchronize(): void {
        let store = this.store;
        let clientItems = store.items;
        let clientChanges: ClientChangeMap = Object.create(null);

        let changedTimes = store.changed;

        j
        let response = this.server.synchronize({
            timestamp: store.timestamp
        });
        let serverChanges = response.changes;
        for(let id of Object.keys(serverChanges)) {
            clientItems[id] = {
                id,
                value: serverChanges[id]
            }
        }
        store.timestamp = response.timestamp;
    }

    update(id: string, value: string): void {
        let store = this.store;
        store.items[id] = {
            id,
            value
        }
        store.changed[id] = Date.now();

    }
}

