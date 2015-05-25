/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Visual(id, data) {
    this.id = id;
    this.element = $("#" + this.id);
    this.home = data;
    this.init();
};
Visual.prototype = {    
    init: function () {
        this.element.html(this.showIdea(this.home));
        this.activateListeners();
    },
    showIdea: function (idea) {
        var toReturn = "",
            id = null,
            child = null;
        toReturn += "<div class='idea' ><div class='name' data-id='" + idea.id + "' >" + idea.content + "</div><ul>";
        for (id in idea.children) {
            child = idea.children[id];
            toReturn += "<li>";
            toReturn += this.showIdea(child);
            toReturn += "</li>";
        }
        toReturn += "</ul></div>";
        return toReturn;
    },
    activateListeners: function () {
        var instance = this;
        var listener = (function () {
            var visual = instance;
            return function () {
                var id = $(this).data("id");
                visual.fired_ideaClicked(id);
            };
        })();
        this.element.find(".name").click(listener);
    },
    fired_ideaClicked: function (id) {
        app.selectContent("editor", id);
    }
};