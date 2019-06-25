const host = window.location.origin;

export const baseUrl = host.('localhost') ? 'http://gicdev.demogic.com' : host;
