import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type requestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type appInitialStateType = {
    status: requestStatusType
    error: string | null
    initialized: boolean
}

const initialState: appInitialStateType = {
    status: 'idle',
    error: null,
    initialized: true
}

// We dont need async in this function but if we will use REST API and waiting for response then we wiil need async function.
// We will use thunk creator when we will set node.js endpoints in axios.And if we have login and registration we need thunk 
// export const initializedApp = createAsyncThunk('notes/fetchNotes', async () => {
//     const promise = await dispatch(getAuthTC())
//     await Promise.all([promise])
//     return promise;
// });


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setErrorApp(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setStatusApp(state, action: PayloadAction<{ status: requestStatusType }>) {
            state.status = action.payload.status
        },
        initializedAppAC(status) {
            status.initialized = false
        }
    }
})
export const appSlice = slice.reducer
export const { setErrorApp, setStatusApp, initializedAppAC } = slice.actions

