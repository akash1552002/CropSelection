import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    name: string;
    language: string;
}

const initialState: UserState = {
    name: "Farmer",
    language: "en",
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        // Initialize state from AsyncStorage (usually handled via a thunk or separate init action)
        setUserState: (state, action: PayloadAction<UserState>) => {
            state.name = action.payload.name;
            state.language = action.payload.language;
        }
    },
});

export const { setUserName, setLanguage, setUserState } = userSlice.actions;
export default userSlice.reducer;
