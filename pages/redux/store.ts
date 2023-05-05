import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import { classSlice } from './classes';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

const reducer = {
  auth: authSlice.reducer,
  classes: classSlice.reducer,
};

const store = configureStore({
  reducer,
});
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
