import sha1 from './assets/sha1.min';
import qs from 'qs';
import { udParams, im_user_key, fdUrl } from './conf';

// 初始化即时通讯
export const udCallback = function(userInfo) {
  // eslint-disable-next-line
  if ('undefined' !== typeof ud) {
    const timestamp = new Date().getTime();
    // 计算signature：sign_str = nonce=value&timestamp=value&web_token=value&im_user_key
    let sign_str = `nonce=${userInfo.userId}&timestamp=${timestamp}&web_token=${userInfo.userId}&${im_user_key}`;
    sign_str = sha1(sign_str);
    sign_str = sign_str.toUpperCase();

    const customer = {
      customer: {
        nonce: userInfo.userId,
        timestamp,
        web_token: userInfo.userId,
        c_name: userInfo.realName,
        c_org: userInfo.brandName,
        // c_phone: userInfo.conactsPhone,
        signature: sign_str
      },
      css: {
        'z-index': 1000,
        bottom: '50px',
        // bottom: '60px',
        width: '70px',
        right: '5px'
      }
    };

    // eslint-disable-next-line
    ud({
      ...udParams,
      ...customer
    });
  }
};

// 初始化反馈
// export const fdCallback = function(userInfo) {
//   const timestamp = new Date().getTime();
//   // 计算signature：sign_str = nonce=value&timestamp=value&web_token=value&im_user_key
//   let sign_str = `u_nonce=${userInfo.userId}&u_timestamp=${timestamp}&u_cellphone=${userInfo.conactsPhone}&${im_user_key}`;
//   sign_str = sha1(sign_str);
//   sign_str = sign_str.toUpperCase();
//   // eslint-disable-next-line
//   if ('undefined' !== typeof UdeskFeedback) {
//     // eslint-disable-next-line
//     UdeskFeedback.init({
//       url: 'https://demogic.udesk.cn',
//       mode: 'knowledge_search',
//       title: '玩转达摩',
//       position: 'right',
//       color: '#1890FF',
//       u_nonce: userInfo.userId,
//       u_signature: sign_str,
//       u_timestamp: timestamp,
//       u_owner_id: userInfo.userId,
//       u_cellphone: userInfo.conactsPhone,
//       u_organization: userInfo.brandName
//     });
//   }
// };

export const getFeedbackUrl = function(userInfo) {
  const timestamp = new Date().getTime();
  // 计算signature：sign_str = u_nonce=value&u_timestamp=value&u_cellphone=value&im_user_key
  let sign_str = `u_nonce=${userInfo.userId}&u_timestamp=${timestamp}&u_cellphone=${userInfo.userId}&${im_user_key}`;
  sign_str = sha1(sign_str);
  sign_str = sign_str.toUpperCase();
  let params = {
    u_nonce: userInfo.userId,
    u_signature: sign_str,
    u_timestamp: timestamp,
    u_owner_id: userInfo.userId,
    u_cellphone: userInfo.conactsPhone,
    u_organization: userInfo.brandName,
    u_description: userInfo.realName
  };
  let userMess = qs.stringify(params);
  return fdUrl + '?' + userMess;
};

// 判断网页是否存在该js
function isJsExists(src) {
  const arg = document.getElementsByTagName('script');
  const scriptAll = Array.prototype.slice.call(arg, 0);

  return scriptAll.some(v => {
    return v.src === src;
  });
}

// 向网页中插入js
export const createJs = function(b, f, callback, g) {
  const a = window;
  const h = document;
  let c = 'script';
  // 检查页面是否存在该js
  if (!isJsExists(b)) {
    if (f === 'ud') {
      a['UdeskApiObject'] = f;
      a[f] =
        a[f] ||
        function() {
          (a[f].d = a[f].d || []).push(arguments);
        };
    }
    g = h.createElement(c);
    g.async = 1;
    g.charset = 'utf-8';
    g.src = b;
    c = h.getElementsByTagName(c)[0];
    c.parentNode.insertBefore(g, c);
    if (f === 'ud') {
      callback(); // 需要立即执行
    } else {
      g.onload = function() {
        callback();
      };
    }
  }
};

export const udesk = function(data) {
  let resData = data;
  if (resData.errorCode == 0) {
    let userInfo = {};
    const {
      userId,
      realName,
      enterpriseDTO: { conactsPhone, brandName }
    } = resData.result;
    userInfo.userId = userId || '';
    userInfo.realName = realName + brandName || ''; // 会话用户名为 商户用户名-品牌名
    userInfo.brandName = brandName || '';
    userInfo.conactsPhone = conactsPhone || '';
    // 反馈
    // createJs('https://demogic.udesk.cn/im_client/js/udesk_feedback.js', 'UdeskFeedback', fdCallback.bind(this, userInfo));
    // 反馈2
    const feedbackUrl = getFeedbackUrl(userInfo);
    // 即时通讯
    createJs('https://assets-cli.udesk.cn/im_client/js/udeskApi.js', 'ud', udCallback.bind(this, userInfo));
    return feedbackUrl;
  }
};
