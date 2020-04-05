import { {{pascalCase name}}Actions, {{pascalCase name}}State, handle } from './interface';

// --- Epic ---
export const epic = handle.epic();

// --- Reducer ---
const initialState: {{pascalCase name}}State = {
  foo: 'bar',
};

export const reducer = handle.reducer(initialState);

// --- Module ---
export const use{{pascalCase name}}Module = handle;
