const log = (...args: any[]) => {
  console.log(...args);
};
const logJ = (message: string, payload: Record<string, any> = {}) => {
  console.log(toJson(message, payload));
};
const warnJ = (message: string, payload: Record<string, any> = {}) => {
  console.warn(toJson(message, payload));
};
export const logger = { log, logJ, warnJ };

function toJson(message: string, payload: Record<string, any> = {}) {
  return JSON.stringify({
    message,
    data: payload,
  });
}
