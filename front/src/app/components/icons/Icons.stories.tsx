import React from 'react';

import { storiesOf } from '@storybook/react';
import {
  IconAddReaction,
  IconSetting,
  IconThread,
  IconOpenSlack,
  IconArrow,
  IconCheck,
} from './Icons';

storiesOf('Icons', module).add('all', () => {
  return (
    <ul className="storybook-icons">
      <li>
        <IconAddReaction />
        <div>IconAddReaction</div>
      </li>
      <li>
        <IconSetting />
        <div>IconSetting</div>
      </li>
      <li>
        <IconThread />
        <div>IconThread</div>
      </li>
      <li>
        <IconOpenSlack />
        <div>IconOpenSlack</div>
      </li>
      <li>
        <IconArrow />
        <div>IconArrow</div>
      </li>
      <li>
        <IconCheck />
        <div>IconCheck</div>
      </li>
    </ul>
  );
});
