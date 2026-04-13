import React from 'react';
import { basePath } from 'app/config';
import styles from './Login.module.css';

export const LoginView = () => {
  const authEndpoint = `${basePath}/api/auth/slack`;
  return (
    <div className={styles.login}>
      <div className={styles.loginVisual}>
        <img src="/assets/logo_chattun.svg" alt="chattun" className={styles.loginVisualLogo} />
        <div className={styles.loginVisualText}>
          <div className={styles.loginVisualTextName}>Chattun</div>
          Slackのコミュニケーションをもっと円滑にして仕事の効率をあげるアプリ
        </div>
      </div>
      <div className={styles.loginInput}>
        <div className={styles.loginInputMessage}>Slackを使ってログインする</div>
        <a className={styles.loginInputLink} href={authEndpoint}>
          <img
            alt="Sign in with Slack"
            height="40"
            width="172"
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
          />
        </a>
      </div>
    </div>
  );
};
