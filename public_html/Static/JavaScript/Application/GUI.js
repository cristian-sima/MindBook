/*global NProgress, app*/

function GUI() {
    this.search = new Search();
}
GUI.prototype = {
    init: function () {
        this.showLoading();
    },
    start: function () {
        this.hideLoading();
    },
    showLoading: function () {
        NProgress.start();
    },
    hideLoading: function () {
        NProgress.done();
    }
};