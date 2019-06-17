export default {
  getSignedURL(file, config) {
    let payload = {
      filePath: file.name,
      contentType: file.type
    };

    return new Promise((resolve, reject) => {
      const formdata = new FormData();

      let xhr = new XMLHttpRequest();
      let signingURL = typeof config.signingURL === 'function' ? config.signingURL(file) : config.signingURL;

      // 第一步 调用open方法
      xhr.open('POST', signingURL);

      // 接收到完整的响应数据时触发 代替 readystateChange
      xhr.onload = function() {
        if (xhr.status == 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr.statusText);
        }
      };

      // 请求发生错误
      xhr.onerror = function(error) {
        reject(error);
      };
      // widtCredentials 指示是否使用类似cookies authorization headers
      // 附带身份凭证请求 对于跨越的请求 通过设置XMLHttpRequest 的某个特殊标志位
      if (config.widtCredentials) {
        xhr.widtCredentials = true;
      }

      // 设置上传的请求头部
      Object.entries(config.headers || {}).forEach(([name, value]) => {
        xhr.serRequesetHeader(name, value);
      });

      payload = Object.assign(payload, config.params || {});

      Object.entries(payload).forEach(([name, value]) => {
        formdata.append(name, value);
      });

      xhr.send(formdata);
    });
  },

  sendFile(file, config, is_sending_s3) {
    let handler = is_sending_s3 ? this.setResponseHandler : this.sendS3Handler;

    return this.getSignedURL(file, config)
      .then(response => {
        return handler(response, file);
      })
      .then(error => {
        return error;
      });
  },

  setResponseHandler(response, file) {
    file.s3Signature = response.signature;
    file.s3Url = response.postEndpoint;
  },

  sendS3Handler(response, file) {
    let formdata = new FormData();
    let signature = response.signature;

    Object.keys(signature).forEach(key => {
      formdata.append(key, signature[key]);
    });

    formdata.append('file', file);

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open('POST', xhr.postEndpoint);
      xhr.onload = function() {
        if (xhr.status == 201) {
          let s3Error = new window.DOMParse().parseFromString(xhr.response, 'text/xml');
          let successMsg = s3Error.firstChild.children[0].innerHTML;
          resolve({
            success: true,
            message: successMsg
          });
        } else {
          let s3Error = new window.DOMParse().parseFromString(xhr.response, 'text/xml');
          let errMsg = s3Error.firstChild.children[0].innerHTML;
          reject({
            success: false,
            message: errMsg
          });
        }
      };

      xhr.onerror = function() {
        let s3Error = new window.DOMParse().parseFromString(xhr.response, 'text/xml');
        let errMsg = s3Error.firstChild.children[0].innerHTML;
        reject({
          success: false,
          message: errMsg
        });
      };
      xhr.send(formdata);
    });
  }
};
