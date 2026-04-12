import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { getPreset, listPresets } from './presets.ts';

const PORT = process.env.PORT || 3100;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.IO: 認証なしで全接続を受け付ける
io.on('connection', socket => {
  console.log(`[mock] client connected: ${socket.id}`);
  socket.on('disconnect', reason => {
    console.log(`[mock] client disconnected: ${socket.id} (${reason})`);
  });
});

// --- API routes ---

// FE の session module が呼ぶ接続確認エンドポイント
app.get('/api/connection', (_req, res) => {
  res.json({ accessToken: 'mock-token', userId: 'UMOCKUSER' });
});

// モック用画像配信
const assetsDir = path.resolve(import.meta.dirname, '../mock-assets');
app.use('/api/mock/assets', express.static(assetsDir));

// モック用ブートストラップ: FE初期化に必要なデータ一式
app.get('/api/mock/bootstrap', (_req, res) => {
  res.json({
    emojis: {
      ok: true,
      emoji: {
        thumbsup: 'https://emoji.slack-edge.com/thumbsup.png',
        heart: 'https://emoji.slack-edge.com/heart.png',
        laughing: 'https://emoji.slack-edge.com/laughing.png',
      },
    },
    users: {
      ok: true,
      members: [
        {
          id: 'UMOCKUSER',
          name: 'mockuser',
          real_name: 'Mock User',
          profile: {
            display_name: 'mockuser',
            image_24: '/api/mock/assets/avatar.png',
            image_32: '/api/mock/assets/avatar.png',
            image_48: '/api/mock/assets/avatar.png',
          },
        },
      ],
    },
    channels: {
      ok: true,
      channels: [
        {
          id: 'CMOCKCH001',
          is_im: false,
          is_member: true,
          name: 'mock-general',
        },
        {
          id: 'CMOCKCH002',
          is_im: false,
          is_member: true,
          name: 'mock-random',
        },
      ],
    },
    teamInfo: {
      ok: true,
      team: {
        domain: 'mock-workspace',
      },
    },
  });
});

// Raw イベント送信: Slack イベント JSON をそのまま全クライアントに配信
app.post('/api/mock/event/raw', express.json(), (req, res) => {
  const event = req.body;
  if (!event || typeof event !== 'object' || !event.type) {
    res.status(400).json({ error: 'body must be a JSON object with a "type" field' });
    return;
  }
  io.emit('message', event);
  console.log(`[mock] raw event emitted: type=${event.type}`);
  res.json({ ok: true, event });
});

// プリセットイベント送信
app.post('/api/mock/event/preset/:name', express.json(), (req, res) => {
  const { name } = req.params;
  const overrides = req.body && Object.keys(req.body).length > 0 ? req.body : undefined;
  const event = getPreset(name, overrides);
  if (!event) {
    res.status(404).json({ error: 'preset not found', available: listPresets() });
    return;
  }
  io.emit('message', event);
  console.log(`[mock] preset event emitted: ${name}`);
  res.json({ ok: true, event });
});

// プリセット一覧
app.get('/api/mock/presets', (_req, res) => {
  res.json({ presets: listPresets() });
});

// その他の /api/* は 404
app.all('/api/*', (_req, res) => {
  res.status(404).end();
});

// SPA フォールバック (front のビルド済みファイルがある場合)
const publicDir = path.join(import.meta.dirname, '../public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'), err => {
    if (err) {
      res.status(404).send('Not found (run front build or use front dev server with proxy)');
    }
  });
});

server.listen(PORT, () => {
  console.log(`[mock] server running on http://localhost:${PORT}`);
  console.log(`[mock] available presets: ${listPresets().join(', ')}`);
});
