/*global app*/

function Menu(gui) {
    this.element = $("#menu");
    this.gui = gui;
    this.currentContent = null;
    this.init();
    this.enable = true;
}
Menu.prototype = {
    init: function () {
        var instance = this;
        this.element.find("ul li").click(function () {
            var option = $(this).data("option");
            if (option !== 'editor') {
                instance.fired_changeContent(option);
            }
        });
        this.element.mouseenter(function () {
           $(this).find("ul li a img").animate({
               height: "48px",
               width: "48px"
           },  { duration: 200, queue: false });
           $("#main-section").animate({
               marginLeft: "97px"
           },  { duration: 200, queue: false });
        });
        this.element.mouseleave(function () {
           $(this).find("ul li a img").animate({
               height: "18px",
               width: "18px"
           }, { duration: 200, queue: false });
           $("#main-section").animate({
               marginLeft: "67px"
           },  { duration: 200, queue: false });
        });
    },
    fired_changeContent: function (option) {
        app.gui.section.select(option);
    },
    selectOption: function (option) {
        if (this.option) {
            this.element.find("#option-" + this.option).removeClass("selected");
        }
        this.option = option;
        this.element.find("#option-" + this.option).addClass("selected");
        if (option !== 'standard') {
            this.element.find("#option-standard").hide();
        } else {
            this.element.find("#option-standard").show();
        }
    },
    disable: function () {
        $(this.element).find(".selected").addClass("menu-disabled");
    },
    enable: function () {
        $(this.element).find("ul .menu-disabled").removeClass("menu-disabled");
    }
};