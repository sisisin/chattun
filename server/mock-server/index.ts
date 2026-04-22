import { Hono } from 'hono';
import { createAdaptorServer } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import fs from 'node:fs';
import { Server } from 'socket.io';
import { getPreset, listPresets } from './presets.ts';

const PORT = process.env.PORT || 3100;

const app = new Hono();

// --- API routes ---

// FE の session module が呼ぶ接続確認エンドポイント
app.get('/api/connection', c => {
  return c.json({ accessToken: 'mock-token', userId: 'UMOCKUSER' });
});

// モック用画像配信
const assetsDir = path.relative(process.cwd(), path.resolve(import.meta.dirname, '../mock-assets'));
app.use(
  '/api/mock/assets/*',
  serveStatic({ root: assetsDir, rewriteRequestPath: p => p.replace('/api/mock/assets', '') }),
);

// モック用ブートストラップ: FE初期化に必要なデータ一式
app.get('/api/mock/bootstrap', c => {
  return c.json({
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
        id: 'TMOCKTEAM01',
        domain: 'mock-workspace',
      },
    },
  });
});

// Raw イベント送信: Slack イベント JSON をそのまま全クライアントに配信
app.post('/api/mock/event/raw', async c => {
  const event = await c.req.json().catch(() => null);
  if (!event || typeof event !== 'object' || !event.type) {
    return c.json({ error: 'body must be a JSON object with a "type" field' }, 400);
  }
  io.emit('message', event);
  console.log(`[mock] raw event emitted: type=${event.type}`);
  return c.json({ ok: true, event });
});

// プリセットイベント送信
app.post('/api/mock/event/preset/:name', async c => {
  const name = c.req.param('name');
  const body = await c.req.json().catch(() => ({}));
  const overrides = body && Object.keys(body).length > 0 ? body : undefined;
  const event = getPreset(name, overrides);
  if (!event) {
    return c.json({ error: 'preset not found', available: listPresets() }, 404);
  }
  io.emit('message', event);
  console.log(`[mock] preset event emitted: ${name}`);
  return c.json({ ok: true, event });
});

// プリセット一覧
app.get('/api/mock/presets', c => {
  return c.json({ presets: listPresets() });
});

// ファイルプロキシ (本番 /api/file の簡易版: target_url がモックアセットパスならそのファイルを返す)
app.get('/api/file', async c => {
  const targetUrl = c.req.query('target_url');
  if (!targetUrl) return c.body(null, 400);

  // モックアセットパス (/api/mock/assets/...) の場合、該当ファイルを直接返す
  const mockPrefix = '/api/mock/assets/';
  if (targetUrl.startsWith(mockPrefix)) {
    const fileName = targetUrl.slice(mockPrefix.length);
    const filePath = path.resolve(import.meta.dirname, '../mock-assets', fileName);
    try {
      const data = fs.readFileSync(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };
      return new Response(data, {
        headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' },
      });
    } catch {
      return c.body(null, 404);
    }
  }

  return c.body(null, 400);
});

// その他の /api/* は 404
app.all('/api/*', c => c.body(null, 404));

// SPA フォールバック (front のビルド済みファイルがある場合)
const publicDir = path.join(import.meta.dirname, '../public');
const publicRoot = path.relative(process.cwd(), publicDir);
app.use('/*', serveStatic({ root: publicRoot }));
app.get('*', c => {
  const filePath = path.join(publicDir, 'index.html');
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    return c.html(html);
  } catch {
    return c.text('Not found (run front build or use front dev server with proxy)', 404);
  }
});

const server = createAdaptorServer({ fetch: app.fetch });
const io = new Server(server);

// Socket.IO: 認証なしで全接続を受け付ける
io.on('connection', socket => {
  console.log(`[mock] client connected: ${socket.id}`);
  socket.on('disconnect', reason => {
    console.log(`[mock] client disconnected: ${socket.id} (${reason})`);
  });
});

server.listen(Number(PORT), () => {
  console.log(`[mock] server running on http://localhost:${PORT}`);
  console.log(`[mock] available presets: ${listPresets().join(', ')}`);
});
