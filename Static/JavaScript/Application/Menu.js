/*global app*/
function Menu(gui) {
    this.element = $("#menu");
    this.gui = gui;
    this.currentContent = null;
    this.init();
}

Menu.prototype = {
    init: function () {
        var instance = this;
        this.element.find("ul li").click(function (element){
            var option = $(this).data("option");
            instance.fired_changeContent(option);
        });
    },
    fired_changeContent: function (option) {
        app.selectContent(option);
    },
    selectOption: function (option) {
        if(this.option) {
            this.element.find("#option-" + this.option).removeClass("selected");
        }
        this.option = option;
        this.element.find("#option-" + this.option).addClass("selected");
    }
};