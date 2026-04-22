import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch } from './store';
import { RootState } from './rootReducer';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
