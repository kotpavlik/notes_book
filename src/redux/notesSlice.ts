import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Note, addNote, updateNote, deleteNote, getAllNotes } from '../indexedDB/indexedDb';
import { setErrorApp, setStatusApp } from './appSlice';
import { addHashtags } from './hashtagSlice';
import { AppRootStateType } from './store';

interface NotesState {
    notes: Note[];
}

const initialState: NotesState = {
    notes: []
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const notes = await getAllNotes();
    return notes;
});

export const addNewNote = createAsyncThunk(
    'notes/addNewNote',
    async (newNote: Note, { dispatch }) => {

        const noteId = await addNote(newNote);
        newNote.hashtags.map((hashtag) => dispatch(addHashtags({ name: hashtag, noteId: noteId })));
        return { ...newNote, id: noteId };
    }
);

export const updateExistingNote = createAsyncThunk(
    'notes/updateExistingNote',
    async (updatedNote: Note, { dispatch }) => {
        await updateNote(updatedNote);
        updatedNote.hashtags.map((hashtag) => dispatch(addHashtags({ name: hashtag, noteId: updatedNote.id! })));
        return updatedNote;
    }
);

export const deleteExistingNote = createAsyncThunk(
    'notes/deleteExistingNote',
    async (noteId: number) => {
        await deleteNote(noteId);
        return noteId;
    }
);

export const notesFilters = createAsyncThunk('hashtags/searchtagIDs',
    async (hashtag: string, thunkAPI) => {
        const { Hashtags, Notes } = thunkAPI.getState() as AppRootStateType;
        const searchHashtags = Hashtags.hashtags.filter(h => hashtag === h.name)
        const searchNotes: Note[] = Notes.notes.filter(note => searchHashtags.some(hash => note.id === hash.noteId))
        if (searchNotes.length === 0) thunkAPI.dispatch(fetchNotes())
        return searchNotes;

    })

export const getNoteWithHashtags = createAsyncThunk('notes/deleteExistingNote', async () => {

})

const slice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                setStatusApp({ status: 'loading' })
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                setStatusApp({ status: 'succeeded' })
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                setStatusApp({ status: 'failed' })
                setErrorApp({ error: action.error.message ? action.error.message : null })
            })
            .addCase(addNewNote.fulfilled, (state, action) => {
                state.notes.push(action.payload);
            })
            .addCase(updateExistingNote.fulfilled, (state, action) => {
                const updatedNote = action.payload;
                const existingNoteIndex = state.notes.findIndex(
                    (note) => note.id === updatedNote.id
                );
                if (existingNoteIndex !== -1) {
                    state.notes[existingNoteIndex] = updatedNote;
                }
            })
            .addCase(deleteExistingNote.fulfilled, (state, action) => {
                const noteId = action.payload;
                state.notes = state.notes.filter((note) => note.id !== noteId);
            })
            .addCase(notesFilters.fulfilled, (state, action) => {
                state.notes = action.payload
            })

    },
});

export const notesSlice = slice.reducer;