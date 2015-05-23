/*global NProgress, app*/

function GUI() {
    this.search = new Search(this);
    this.menu = new Menu(this);
    this.currentContent = null;
}
GUI.prototype = {
    init: function () {
    },
    start: function () {
    },
    showLoading: function () {
        NProgress.start();
    },
    hideLoading: function () {
        NProgress.done();
    },
    selectContent: function (id) {
        if(this.currentContent) {
            this.currentContent.hide();
        }
        this.currentContent = $("#" + id);
        this.currentContent.show();
        this.menu.selectOption(id);
    }
};