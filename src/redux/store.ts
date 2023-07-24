import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appSlice } from "./appSlice";
import { notesSlice } from "./notesSlice";
import { hashtagsSlice } from "./hashtagSlice";



const rootReducer = combineReducers({
    App: appSlice,
    Notes: notesSlice,
    Hashtags: hashtagsSlice
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .prepend(thunk)
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch() as AppDispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store