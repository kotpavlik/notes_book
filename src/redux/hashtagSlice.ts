import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Hashtag, addHashtag, getAllHashtags } from '../indexedDB/indexedDb';
import { setErrorApp, setStatusApp } from './appSlice';
import { AxiosError } from 'axios';


interface HashtagsState {
    hashtags: Hashtag[];
}

const initialState: HashtagsState = {
    hashtags: [],
};

export const fetchHashtags = createAsyncThunk('hashtags/fetchHashtags', async () => {
    try {
        const hashtags = await getAllHashtags();
        return hashtags;
    } catch (e) {
        const err = e as Error | AxiosError
        setErrorApp({ error: 'Failed to fetch hashtags: ' + err.message });
        throw e;
    }
});

export const addHashtags = createAsyncThunk('hashtags/addHashtags', async (hashtag: Hashtag) => {


    const idHashtag = await addHashtag(hashtag)
    return { ...hashtag, id: idHashtag }
})


const slice = createSlice({
    name: 'hashtags',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHashtags.pending, (state) => {
                setStatusApp({ status: 'loading' });
            })
            .addCase(fetchHashtags.fulfilled, (state, action) => {
                setStatusApp({ status: 'succeeded' });
                state.hashtags = action.payload;
            })
            .addCase(fetchHashtags.rejected, (state, action) => {
                setStatusApp({ status: 'failed' });
            })
            .addCase(addHashtags.fulfilled, (state, action) => {
                state.hashtags.push(action.payload)
            })
    },
});

export const hashtagsSlice = slice.reducer;


