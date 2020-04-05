import { storiesOf } from '@storybook/react';
import { handle as slackHandle, Message } from 'app/features/slack/interface';
import { basicSlackState } from 'app/utility/storybook/basicSlackState';
import { AppProvider } from 'app/utility/storybook/helpers';
import { rowChannels } from 'app/utility/storybook/mock_data/rowChannels';
import { message, message2, message3_edited } from 'app/utility/storybook/mock_data/rowMessages';
import { rowUsers } from 'app/utility/storybook/mock_data/rowUsers';
import React from 'react';
import { handle } from './interface';
import { TimelineModule } from './module';

handle.reset();

storiesOf('Timeline', module)
  .add('basic', () => {
    handle.reducer({ messages: [], error: null });
    slackHandle.reset();
    slackHandle.reducer({
      ...basicSlackState,
      messagesByChannel: {
        [message.channel]: {
          [message.ts]: { ...message, updatedAt: 0 },
          [message2.ts]: { ...message2, updatedAt: 0 },
          [message3_edited.ts]: { ...message3_edited, updatedAt: 0 },
        },
      },
    });

    return (
      <AppProvider>
        <TimelineModule />
      </AppProvider>
    );
  })
  .add('superlongmessage', () => {
    const plain: Message = {
      suppress_notification: false,
      type: 'message',
      text:
        'superlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessage',
      user: rowUsers.members[1].id,
      user_team: 'some_team',
      channel: rowChannels.channels[0].id,
      ts: '1564416517.003400',
      event_ts: '1564416517.003400',
      updatedAt: 0,
    };
    const singlelinecode: Message = {
      ...plain,
      text:
        '`superlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessage`',
      ts: '1564416517.003300',
    };
    const multilinecode: Message = {
      ...plain,
      text:
        '```superlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessagesuperlongmessage```',
      ts: '1564416517.003200',
    };
    handle.reducer({ messages: [], error: null });
    slackHandle.reset();
    slackHandle.reducer({
      ...basicSlackState,
      messagesByChannel: {
        [plain.channel]: {
          [plain.ts]: plain,
          [singlelinecode.ts]: singlelinecode,
          [multilinecode.ts]: multilinecode,
        },
      },
    });

    return (
      <AppProvider>
        <TimelineModule />
      </AppProvider>
    );
  });
