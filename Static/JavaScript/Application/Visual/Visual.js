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
    showLines: function (id) {
        var linesDiv = $("#lines"),
            textarea = linesDiv.find('#target');
        linesDiv.dialog({
            resizable: false,
            height: 500,
            width: 800,
            modal: true,
            title: "Please wait...",
            close: function (event, ui) {
                $('#wrap').show();
            },
            open: (function () {
                var dialog = linesDiv;
                return function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $(dialog).dialog('close');
                    });
                };
            }())
        });
        textarea.hide();
        app.gateway.getEntireIdea(id, function (data) {
            var idea = new VisualLine(Data.prepare(data));
            linesDiv.dialog('option', 'title', idea.data.content);
            textarea.val(idea.getLines().trim());
            textarea.show();
            textarea.focus();
        });
    },
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
        app.changePage("standard", id);
    },
    fired_expand: function (id) {
        var container = $("#viz-child-" + id),
            children = container.find(".children:first-child"),
            expand = container.find(".expand:first-child"),
            content = container.find(".ideaContentName");
        content.css({
            color:'#29d'
        });
        expand.hide();
        children.fadeIn();
        this.showIdea({
            id: id,
            level: 1
        }, container);
    },
    close: function () {
        this.container.html("");
        this.container.off();
    }
};