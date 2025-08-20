import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type ThunkApi = Parameters<Parameters<typeof createAsyncThunk>[1]>[1];

const catchError = <T, K>(callback: (data: T, thunkApi: ThunkApi) => Promise<K>) => {
  return (data: T, thunkApi: ThunkApi) =>
    callback(data, thunkApi).catch(err =>
      thunkApi.rejectWithValue(err?.response?.data || err)
    );
};

export const createAsyncActions = (name: string, callbacks: Record<string, any>) =>
  Object.entries(callbacks).reduce<any>((acc, [nameAction, callback]) => {
    acc[nameAction] = createAsyncThunk(`${name}/${nameAction}`, catchError(callback));
    return acc;
  }, {});

export const createActions = (name: string, callbacks: Record<string, any>) => {
  return Object.entries(callbacks).reduce<any>((acc, [nameAction, callback]) => {
    acc[nameAction] = callback(`${name}/${nameAction}`);
    return acc;
  }, {});
};

export type WritableStore<T> = {
  -readonly [K in keyof T]: T[K];
};

type LinksDTO = {
  first: string;
  last: string;
  prev: string;
  next: string;
}

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}


export type ProtoDTO<T> = {
  data: T;
  links: LinksDTO;
  meta: Meta;
}