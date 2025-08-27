import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "..";

export const selectHasToken = createSelector(
    (state: AppState) => state.auth.token,
    (token) => !!token
); 