/* global Backbone cot_app cot_login CotSession */

/* exported LoginModel */
const LoginModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  cotLogin: null,

  // METHOD DEFINITION

  checkLogin: function(options = {}) {
    if (!options.serverSide) {
      return this.cotLogin.isLoggedIn() ? Promise.resolve() : Promise.reject();
    }

    return new Promise((resolve, reject) => {
      this.cotLogin.session.isLoggedIn((result) => {
        if (result === CotSession.LOGIN_CHECK_RESULT_TRUE) {
          resolve();
        } else {
          reject();
        }
      });
    });
  },

  requireLogin(options) {
    return Promise.resolve().then(() => {
      return this.checkLogin(options);
    }).catch(() => {
      return this.showLogin(options);
    }).catch(() => {
      this.cotLogin.logout();
      return Promise.reject();
    });
  },

  showLogin(options = {}) {
    if (this.cotLogin.modal) {
      this.cotLogin.modal.modal('hide');
    }

    return new Promise((resolve, reject) => {
      this.cotLogin.modal = cot_app.showModal({
        title: 'User Login',
        body: `
          ${this.cotLogin.options.loginMessage}
          <form>
            <div class="form-group">
              <label for="cot_login_username">Username</label>:
              <input class="form-control" id="cot_login_username">
            </div>
            <div class="form-group">
              <label for="cot_login_password">Password</label>:
              <input class="form-control" type="password" id="cot_login_password">
            </div>
          </form>
        `,
        footerButtonsHtml: `
          <button class="btn btn-success" type="button" data-dismiss="modal">Cancel</button>
          <button class="btn btn-success btn-cot-login" type="button">Login</button>
        `,
        originatingElement: options.$originatingElement || $(this.cotLogin.options['welcomeSelector']).find('a.login'),
        className: 'cot-login-modal',
        onShown: () => {
          this.cotLogin.modal.find('.btn-cot-login').click(() => {
            this.cotLogin._login();
          });
          this.cotLogin.modal.find('.modal-body input').keydown((e) => {
            if ((e.charCode || e.keyCode || 0) === 13) {
              this.cotLogin._login();
            }
          });
        },
        onHidden: () => {
          this.checkLogin(options).then(() => {
            resolve();
          }, () => {
            reject();
          });
        }
      });
    });
  },

  // CONSTRUCTOR DEFINITION

  initialize: function(attributes, options) {
    this.cotLogin = new cot_login($.extend(options, {
      onLogin: (cotLogin) => {
        this.set(cotLogin);
      }
    }));
  }
});
