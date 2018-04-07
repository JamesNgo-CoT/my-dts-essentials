/* global cot_app cot_login CotSession */

/* exported cot_login_ext */
class cot_login_ext extends cot_login {
  checkLogin(options = {}) {
    if (!options.serverSide) {
      return this.session.isLoggedIn() ? Promise.resolve() : Promise.reject();
    }

    return new Promise((resolve, reject) => {
      this.session.isLoggedIn((result) => {
        if (result === CotSession.LOGIN_CHECK_RESULT_TRUE) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  requireLogin(options) {
    return Promise.resolve().then(() => {
      return this.checkLogin(options);
    }).catch(() => {
      return this.showLogin(options);
    }).catch(() => {
      this.logout();
      return Promise.reject();
    });
  }

  showLogin(options = {}) {
    if (this.modal) {
      this.modal.modal('hide');
    }

    return new Promise((resolve, reject) => {
      this.modal = cot_app.showModal({
        title: 'User Login',
        body: `
          ${this.options.loginMessage}
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
        originatingElement: options.$originatingElement || $(this.options['welcomeSelector']).find('a.login'),
        className: 'cot-login-modal',
        onShown: () => {
          this.modal.find('.btn-cot-login').click(() => {
            this._login();
          });
          this.modal.find('.modal-body input').keydown((e) => {
            if ((e.charCode || e.keyCode || 0) === 13) {
              this._login();
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
  }
}
