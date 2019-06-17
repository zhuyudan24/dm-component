const host = window.location.origin;

export const baseUrl = host.includes('localhost') ? 'http://gicdev.demogic.com' : host;
