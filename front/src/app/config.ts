const isProduction = process.env.NODE_ENV === 'production';

// export const basePath = 'process.env.REACT_APP_BASE_URL';
export const basePath = isProduction ? process.env.REACT_APP_BASE_URL : 'http://localhost:3000';
export const basePathForAuth = isProduction
  ? process.env.REACT_APP_BASE_URL
  : 'http://localhost:3100';
