/*global Data, app*/
function Visual(id, html) {
    this.id = id;
    this.element = $("#" + html);
    this.getDataFromServer();
};
Visual.prototype = {
    getDataFromServer: function () {
        var visual = this;
        app.gateway.getEntireIdea(this.id, function (data) {
            data = Data.prepare(data);
            visual.loadData(data);
        });
    },
    loadData: function (data) {
        this.home = data;
        this.init();
    },
    init: function () {
        this.element.html(this.showIdea(this.home));
        this.activateListeners();
    },
    showIdea: function (idea) {
        var toReturn = "",
            iterator = null,
            child = null;
        toReturn += "<div class='idea' ><span class='name' data-id='" + idea.id + "' >" + idea.content + "</span><ul>";
        for (iterator = 0; iterator < idea.children.length; iterator = iterator + 1) {
            child = idea.children[iterator];
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
    },
    close: function () {
        this.element.html("Please wait...");
        this.element.off();
    }
};