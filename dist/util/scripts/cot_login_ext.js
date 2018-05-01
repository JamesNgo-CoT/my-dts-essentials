'use strict';

/* global CotSession */

CotSession.prototype.isLoggedIn = function (serverCheckCallback) {
  var _this = this;

  if (!serverCheckCallback) {
    if (this._cookie('sid')) {
      return true;
    } else {
      this.logout();
      return false;
    }
  } else {
    var sid = this.sid || this._cookie('sid');
    if (!sid) {
      serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_FALSE);
    } else {
      var url = '' + this.options.ccApiOrigin + this.options.ccApiPath + this.options.ccApiEndpoint;
      if (url.indexOf('/cc_sr_admin_v1/session') !== -1) {
        url = url + '/' + sid;
      } else if (url.indexOf('/c3api_auth/auth') !== -1) {
        url = url + '/' + sid;
      } else if (url.indexOf('/c3api_auth/v2/AuthService.svc/AuthSet') !== -1) {
        url = url + '(\'' + sid + '\')';
      }

      $.get(url).done(function (data) {
        var app = data['app'] || '',
            rsid = data['sid'] || '',
            error = data['error'] || '';
        if (app === _this.options.appName && rsid === sid) {
          _this._storeLogin(data);
          serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_TRUE);
        } else if (error === 'no_such_session') {
          _this.logout();
          serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_FALSE);
        } else {
          serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_INDETERMINATE);
        }
      }).fail(function () {
        serverCheckCallback(CotSession.LOGIN_CHECK_RESULT_INDETERMINATE);
      });
    }
  }
};

CotSession.prototype.login = function (options) {
  var _this2 = this;

  options = $.extend({
    username: '',
    password: '',
    success: function success() {},
    error: function error(jqXHR, textStatus, _error) {},
    always: function always() {}
  }, options);

  var payload = {
    app: this.options.appName,
    user: options.username,
    pwd: options.password
  };

  var ajaxSettings = {
    method: 'POST',
    url: '' + this.options.ccApiOrigin + this.options.ccApiPath + this.options.ccApiEndpoint
  };

  if (ajaxSettings.url.indexOf('/cc_sr_admin_v1/session') !== -1) {
    ajaxSettings.url = ajaxSettings.url + '?app=' + payload.app;
    ajaxSettings.data = payload;
  } else if (ajaxSettings.url.indexOf('/c3api_auth/auth') !== -1) {
    ajaxSettings.url = ajaxSettings.url + '?app=' + payload.app;
    ajaxSettings.data = payload;
  } else if (ajaxSettings.url.indexOf('/c3api_auth/v2/AuthService.svc/AuthSet') !== -1) {
    ajaxSettings.contentType = 'application/json';
    ajaxSettings.data = JSON.stringify(payload);
  }

  $.ajax(ajaxSettings).done(function (data) {
    if (data['error']) {
      options.error(null, data.error === 'invalid_user_or_pwd' ? 'Invalid username or password' : 'Login failed', data.error);
    } else if (data['passwordIsExpired']) {
      options.error(null, 'Expired password', 'passwordIsExpired');
    } else {
      _this2._storeLogin(data);
      options.success();
    }
  }).fail(function (jqXHR, textStatus, error) {
    options.error(jqXHR, textStatus, error);
  }).always(function () {
    options.always();
  });
};