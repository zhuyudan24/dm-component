const host = window.location.origin;
// eslint-disable-next-line
export const baseUrl = process.env.NODE_ENV === 'development' ? '/dmApi' : host.indexOf('localhost') > -1 ? 'http://gicdev.demogic.com' : host;

export const ERR_OK = 0;
