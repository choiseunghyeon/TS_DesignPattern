import { SyncingRequest, SyncingResponse } from ".";

export interface ServerDataItem {
    id: string;
    timestamp: number;
    value: string;
}

export interface ServerDataStore {
    items: {
        [id: string]: ServerDataItem
    }
}


export class Server {
    store: ServerDataStore

    synchronize(request: SyncingRequest): SyncingResponse {
        let lastTimestamp = request.timestamp;
        let now = Date.now();
        let serverChanges: ServerChangeMap = Object.create(null);
        let items = this.store.items;
        for(let id of Object.keys(items)) {
            let item = items[id];
            if (item.timestamp > lastTimestamp) {
                serverChanges[id] = item.value;
            }
        }
        return {
            timestamp: now,
            changes: serverChanges,
        }
    }
}
