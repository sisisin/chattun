export const basePath = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

// create-react-appのproxyでリダイレクトが上手いこと動かないので直接サーバーにリンクさせるために用意
export const basePathForAuth = process.env.REACT_APP_BASE_URL || 'http://localhost:3100';
