/*global Data, app*/

function Visual(id, html) {
    this.id = id;
    this.container = $("#" + html);
    this.showRootIdea({
        id: id,
        level: 1
    }, this.container);
};
Visual.prototype = {
    showRootIdea: function (idea, container) {
        this.loadData(idea, {
            isRoot: true,
            container: container
        });
    },
    showIdea: function (idea, container) {
        this.loadData(idea, {
            isRoot: false,
            container: container
        });
    },
    loadData: function (idea, info) {
        var visual = this,
            container = info.container,
            info = info;
            container.find(".wait").first().html("Please wait...");
        app.gateway.getIdea(idea, function (data) {
            var idea = new VisualIdea(Data.prepare(data), visual),
                html = "";
            if (info.isRoot) {
                html = idea.getRootHTML();
            } else {
                html = idea.getHTML();
            }
            container.find(".wait").first().html("");
            container.html(html);
            idea.activateListeners();
        }, function () {
            container.find(".wait").first().html("<span style='color:red'> There was a problem! Please try again.</span>");
            container.find(".expand").first().show();
        });
    },
    fired_ideaClicked: function (id) {
        app.gui.section.select("standard", id);
    },
    close: function () {
        this.container.html("");
        this.container.off();
    }
};