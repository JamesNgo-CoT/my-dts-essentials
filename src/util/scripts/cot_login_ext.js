/* global CotSession */

CotSession.prototype.isLoggedIn = function(serverCheckCallback) {
  if (!serverCheckCallback) {
    if (this._cookie('sid')) {
      return true;
    } else {
      this.logout();
      return false;
    }
  } else {
    const sid = this.sid || this._cookie('sid');
    if (!sid) {
      serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_FALSE);
    } else {
      let url = `${this.options.ccApiOrigin}${this.options.ccApiPath}${this.options.ccApiEndpoint}`;
      if (url.indexOf('/cc_sr_admin_v1/session') !== -1) {
        url = `${url}/${sid}`;
      } else if (url.indexOf('/c3api_auth/auth') !== -1) {
        url = `${url}('${sid}')`;
      } else if (url.indexOf('/c3api_auth/v2/AuthService.svc/AuthSet') !== -1) {
        url = `${url}('${sid}')`;
      }

      $.get(url)
        .done((data) => {
          const app = data['app'] || '', rsid = data['sid'] || '', error = data['error'] || '';
          if (app === this.options.appName && rsid === sid) {
            this._storeLogin(data);
            serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_TRUE);
          } else if (error === 'no_such_session') {
            this.logout();
            serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_FALSE);
          } else {
            serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_INDETERMINATE);
          }
        })
        .fail(() => {
          serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_INDETERMINATE);
        });
    }
  }
};

CotSession.prototype.login = function(options) {
  options = $.extend({
    username: '',
    password: '',
    success: function() {},
    error: function(jqXHR, textStatus, error) {},
    always: function() {}
  }, options);

  const payload = {
    app: this.options.appName,
    user: options.username,
    pwd: options.password
  };

  const ajaxSettings = {
    method: 'POST',
    url: `${this.options.ccApiOrigin}${this.options.ccApiPath}${this.options.ccApiEndpoint}`
  };

  if (ajaxSettings.url.indexOf('/cc_sr_admin_v1/session') !== -1) {
    ajaxSettings.url = `${ajaxSettings.url}?app=${payload.app}`;
    ajaxSettings.data = payload;
  } else if (ajaxSettings.url.indexOf('/c3api_auth/auth') !== -1) {
    ajaxSettings.contentType = 'application/json';
    ajaxSettings.data = JSON.stringify(payload);
  } else if (ajaxSettings.url.indexOf('/c3api_auth/v2/AuthService.svc/AuthSet') !== -1) {
    ajaxSettings.contentType = 'application/json';
    ajaxSettings.data = JSON.stringify(payload);
  }

  $.ajax(ajaxSettings)
    .done((data) => {
      if (data['error']) {
        options.error(null, data.error === 'invalid_user_or_pwd' ? 'Invalid username or password' : 'Login failed', data.error);
      } else if (data['passwordIsExpired']) {
        options.error(null, 'Expired password', 'passwordIsExpired');
      } else {
        this._storeLogin(data);
        options.success();
      }
    })
    .fail((jqXHR, textStatus, error) => { options.error(jqXHR, textStatus, error); })
    .always(() => { options.always(); });
};
