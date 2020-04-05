import { createModule } from 'typeless';
import { {{pascalCase name}}Symbol } from './symbol';

// --- Actions ---
export const [handle, {{pascalCase name}}Actions, get{{pascalCase name}}State] = createModule({{pascalCase name}}Symbol)
  .withActions({})
  .withState<{{pascalCase name}}State>();

// --- Types ---
export interface {{pascalCase name}}State {
  foo: string;
}
