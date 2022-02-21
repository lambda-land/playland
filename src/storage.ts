import { createStorage } from 'typesafe-storage';


export type FilePersistance = {
    fileStorage: {
        fileName: string,
        content: string
    };
    'session-editor': {
        'source': string
    }
}

export const storage = createStorage<FilePersistance>(localStorage);

