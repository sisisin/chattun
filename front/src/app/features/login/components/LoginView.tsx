import React from 'react';
import { basePathForAuth } from 'app/config';
import { httpClient } from 'app/services/http/HttpClient';

export const LoginView = () => {
  const authEndpoint = `${basePathForAuth}/auth/slack`;
  React.useEffect(() => {
    httpClient
      .get('/foo')
      .toPromise()
      .then(res => {
        console.log(res);
      });
  }, []);
  return (
    <div className="login">
      <div className="login-visual">
        <img src="/assets/logo_chattun.svg" alt="chattun" className="login-visual-logo" />
        <div className="login-visual-text">
          <div className="login-visual-text-name">Chattun</div>
          Slackのコミュニケーションをもっと円滑にして仕事の効率をあげるアプリ
        </div>
      </div>
      <div className="login-input">
        <div className="login-input-message">Slackを使ってログインする</div>
        <a className="login-input-link" href={authEndpoint}>
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
