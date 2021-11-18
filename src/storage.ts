import { createStorage } from 'typesafe-storage';


export type FilePersistance = {
    fileName: string,
    content: string
}

export const storage = createStorage<FilePersistance>(localStorage);

