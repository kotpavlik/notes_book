import { openDB, DBSchema } from 'idb';

export interface Note {
    id?: number;
    title: string;
    content: string;
    hashtags: string[];
}

export interface Hashtag {
    id?: number;
    noteId: number;
    name: string;
}

export interface NotesDB extends DBSchema {
    notes: {
        key: number;
        value: Note;
        indexes: { 'by-hashtag': string[] };
    };
    hashtags: {
        key: number;
        value: Hashtag;
        indexes: { 'by-name': string };
    };
}

const dbPromise = openDB<NotesDB>('notes-database', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
            const notesStore = db.createObjectStore('notes', {
                keyPath: 'id',
                autoIncrement: true,
            });
            notesStore.createIndex('by-hashtag', 'hashtags', { multiEntry: true });

            const hashtagsStore = db.createObjectStore('hashtags', {
                keyPath: 'tagId',
                autoIncrement: true,
            });
            hashtagsStore.createIndex('by-name', 'name');
        }
    },
});

// Заметки
export const addNote = async (note: Note): Promise<number> => {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    const noteId = await store.add(note);
    await tx.done;
    return noteId;
};

export const updateNote = async (note: Note): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    await store.put(note);
    await tx.done;
};

export const deleteNote = async (noteId: number): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    await store.delete(noteId);
    await tx.done;
};

export const getAllNotes = async (): Promise<Note[]> => {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    return store.getAll();
};


export const addHashtag = async (hashtag: Hashtag): Promise<number> => {
    const db = await dbPromise;
    const tx = db.transaction('hashtags', 'readwrite');
    const store = tx.objectStore('hashtags');
    const hashtagId = await store.add(hashtag);
    await tx.done;
    return hashtagId;
};

export const getAllHashtags = async (): Promise<Hashtag[]> => {
    const db = await dbPromise;
    const tx = db.transaction('hashtags', 'readonly');
    const store = tx.objectStore('hashtags');
    return store.getAll();
};