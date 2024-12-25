import {createSlice} from "@reduxjs/toolkit"
const initialState = {
    user:null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginUser:(state,{payload})=>{
            state.user = payload;
            state.isAuthenticated = true;
            
        },
        logoutUser:(state)=>{
            state.user = null;
            state.isAuthenticated = false;
            
        }
    }
})

export const {loginUser,logoutUser} = authSlice.actions;
export default authSlice.reducer;