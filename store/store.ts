import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './marketSlice';
import userReducer from './userSlice';
import financeReducer from './financeSlice';

export const store = configureStore({
    reducer: {
        market: marketReducer,
        user: userReducer,
        finance: financeReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
