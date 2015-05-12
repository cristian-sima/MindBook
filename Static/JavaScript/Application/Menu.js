/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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
        this.selectOption(option);
    },
    selectOption: function (option) {
        if(this.option) {
            this.element.find("#option-" + this.option).removeClass("selected");
        }
        this.option = option;
        this.element.find("#option-" + this.option).addClass("selected");
        this.gui.selectContent(option);
    }
};