/*global NProgress, app*/

function GUI() {
    this.search = new Search(this);
    this.menu = new Menu(this);
    this.section = new Section();
}
GUI.prototype = {
    showLoading: function () {
        NProgress.start();
    },
    hideLoading: function () {
        NProgress.done();
    },
    enable: function () {
        this.section.getStatus().clear();
        this.menu.enable();
    },
    disable: function () {
        this.section.getStatus().post("Please wait...");
        this.menu.disable();
    }
};