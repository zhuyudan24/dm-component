//eslint-disable-next-line
// const _isDev = process.env.NODE_ENV === 'development';   // 是否是开发环境
const domain = document.domain;
const isProd = domain === 'hope.demogic.com'; // 是否是生产环境

const dev = {
  code: '352ibfgi',
  link: 'https://demogic.udesk.cn/im_client/?web_plugin_id=67022'
};

const prod = {
  code: '352ibfgi',
  link: 'https://demogic.udesk.cn/im_client/?web_plugin_id=66934'
};

export const udParams = !isProd ? dev : prod;
export const im_user_key = '0f11a0dc5ce95e6b728e4a87374ecf18';
export const fdUrl = 'https://demogic.udesk.cn/im_client/feedback_tab/new_with_knowledge.html';
