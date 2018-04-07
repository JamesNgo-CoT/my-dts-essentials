'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global cot_app cot_login CotSession */

/* exported cot_login_ext */
var cot_login_ext = function (_cot_login) {
  _inherits(cot_login_ext, _cot_login);

  function cot_login_ext() {
    _classCallCheck(this, cot_login_ext);

    return _possibleConstructorReturn(this, (cot_login_ext.__proto__ || Object.getPrototypeOf(cot_login_ext)).apply(this, arguments));
  }

  _createClass(cot_login_ext, [{
    key: 'checkLogin',
    value: function checkLogin() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!options.serverSide) {
        return this.session.isLoggedIn() ? Promise.resolve() : Promise.reject();
      }

      return new Promise(function (resolve, reject) {
        _this2.session.isLoggedIn(function (result) {
          if (result === CotSession.LOGIN_CHECK_RESULT_TRUE) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  }, {
    key: 'requireLogin',
    value: function requireLogin(options) {
      var _this3 = this;

      return Promise.resolve().then(function () {
        return _this3.checkLogin(options);
      }).catch(function () {
        return _this3.showLogin(options);
      }).catch(function () {
        _this3.logout();
        return Promise.reject();
      });
    }
  }, {
    key: 'showLogin',
    value: function showLogin() {
      var _this4 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.modal) {
        this.modal.modal('hide');
      }

      return new Promise(function (resolve, reject) {
        _this4.modal = cot_app.showModal({
          title: 'User Login',
          body: '\n          ' + _this4.options.loginMessage + '\n          <form>\n            <div class="form-group">\n              <label for="cot_login_username">Username</label>:\n              <input class="form-control" id="cot_login_username">\n            </div>\n            <div class="form-group">\n              <label for="cot_login_password">Password</label>:\n              <input class="form-control" type="password" id="cot_login_password">\n            </div>\n          </form>\n        ',
          footerButtonsHtml: '\n          <button class="btn btn-success" type="button" data-dismiss="modal">Cancel</button>\n          <button class="btn btn-success btn-cot-login" type="button">Login</button>\n        ',
          originatingElement: options.$originatingElement || $(_this4.options['welcomeSelector']).find('a.login'),
          className: 'cot-login-modal',
          onShown: function onShown() {
            _this4.modal.find('.btn-cot-login').click(function () {
              _this4._login();
            });
            _this4.modal.find('.modal-body input').keydown(function (e) {
              if ((e.charCode || e.keyCode || 0) === 13) {
                _this4._login();
              }
            });
          },
          onHidden: function onHidden() {
            _this4.checkLogin(options).then(function () {
              resolve();
            }, function () {
              reject();
            });
          }
        });
      });
    }
  }]);

  return cot_login_ext;
}(cot_login);