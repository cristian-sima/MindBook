/*global NProgress, app*/
function GUI() {
    this.status = NProgress;
}

GUI.prototype = {
    init: function () {
        this.showLoading();
    },
    showLoading: function () {
        this.status.start();
    },
    hideLoading: function () {
        this.status.done();
    }
};