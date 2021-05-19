const express = require('express');
const logger = require('morgan');
const request = require('request');
const path = require('path');

const middleware = require('./src/middleware');
const { serverBaseUrl, frontBaseUrl } = require('./src/config');

const app = express();
app.use(middleware.applyHelmet());
app.set('trust proxy', 1);
app.use(middleware.applySession());

const passport = middleware.createPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.static('public'));

app.get('/auth/slack', passport.authorize('slack-identity'));

app.get('/auth/slack/client', passport.authorize('slack-client'));

app.get(
  '/auth/slack/callbackTmp',
  passport.authenticate('slack-identity', { failureRedirect: frontBaseUrl }),
  (req, res) => res.redirect(`${serverBaseUrl}/auth/slack/client`),
);

app.get('/auth/slack/callback', passport.authenticate('slack-client', { failureRedirect: frontBaseUrl }), (req, res) =>
  res.redirect(frontBaseUrl),
);

app.get('/file', checkAuthentication, (req, res) => {
  const { accessToken } = getSessionProfileFromRequest(req);
  const isValidTargetUrl = req.query.target_url.startsWith('https://files.slack.com');
  if (isValidTargetUrl) {
    request({
      url: req.query.target_url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).pipe(res);
  } else {
    res.status(400).end();
  }
});

app.get('/connection', checkAuthentication, (req, res) => {
  const { userId, accessToken } = getSessionProfileFromRequest(req);
  return res.json({ userId, accessToken });
});

// app.use((_, __, next) => next(createError(404)));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(function (err, req, res) {
  const error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ message: err.message, ...error });
});

app.listen(process.env.PORT || 3100, () => {
  console.log(`server running at ${serverBaseUrl}`);
});

function getSessionProfileFromRequest(req) {
  const { userId, accessToken } = req.session.passport.user;
  return { userId, accessToken };
}

function checkAuthentication(req, res, next) {
  if (!(req.session && req.session.passport && req.session.passport.user)) {
    return res.status(401).end();
  }
  const { userId, accessToken } = getSessionProfileFromRequest(req);
  if (!(userId && accessToken)) {
    return res.status(401).end();
  }
  next();
}
