import { addDecorator, configure } from '@storybook/react';
import 'app/imports';
import { withScreenshot } from 'storycap';


const req = require.context('../src', true, /.stories.tsx?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withScreenshot());
configure(loadStories, module);
