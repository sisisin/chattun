import { IconOpenSlack } from 'app/components/icons/Icons';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';
import * as React from 'react';

type DeepLinkingUrls = {
  web: string;
  slack: string;
};

export const DeepLinkingButton = ({ urls }: { urls: DeepLinkingUrls }) => {
  const globalSettingState = getGlobalSettingState.useState();
  const deepLinkingType = globalSettingState.deepLinking;
  const props: React.AnchorHTMLAttributes<HTMLAnchorElement> = (() => {
    if (deepLinkingType === 'directly') {
      return { href: urls.slack, className: 'tweet-actions-list-openslack' };
    } else if (deepLinkingType === 'viaBrowser') {
      return {
        href: urls.web,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'tweet-actions-list-openslack',
      };
    } else {
      const exhaustiveCheck: never = deepLinkingType;
      return exhaustiveCheck;
    }
  })();
  return (
    <a {...props}>
      <IconOpenSlack className="tweet-actions-list-openslack-icon" />
    </a>
  );
};
