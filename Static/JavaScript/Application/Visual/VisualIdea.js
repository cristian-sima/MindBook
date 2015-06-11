/* global Visual,app,$,VisualIdea,Data*/
'use strict';
VisualIdea = function VisualIdea(data, visual) {
    this.visual = visual;
    this.data = data;
};
VisualIdea.prototype = {
    getRootHTML: function () {
        var toReturn = "",
            iterator = null,
            child = null,
            data = this.data;
        toReturn += "<div class='idea' >";
        toReturn += this.getParent(data);
        toReturn += this.getContent(data);
        if (data.parent !== null) {
            toReturn += this.getEditButton(data);
        }
        toReturn += this.getListButton(data);
        toReturn += this.getWait();
        toReturn += this.getChildren(data);
        toReturn += "</div>";
        return toReturn;
    },
    getChildren: function (data) {
        var toReturn = "",
            children = data.children,
            iterator = 0,
            child = null;
        toReturn += "<ul class='children'>";
        if (children.length !== 0) {
            for (iterator = 0; iterator < children.length; iterator = iterator + 1) {
                child = children[iterator];
                toReturn += this.getChildContent(child);
            }
        }
        toReturn += "</ul>";
        return toReturn;
    },
    getChildContent: function (child) {
        var toReturn = "";
        toReturn += "<li><div class='idea' id='viz-child-" + child.id + "'>";
        if (this.hasChildren(child)) {
            toReturn += this.getExpand(child);
        }
        toReturn += this.getContent(child);
        toReturn += this.getEditButton(child);
        toReturn += this.getListButton(child);
        toReturn += this.getWait();
        toReturn += "</div></li>";
        return toReturn;
    },
    hasChildren: function (child) {
        return (child.children.length !== 0);
    },
    getHTML: function () {
        var toReturn = "",
            iterator = null,
            child = null,
            data = this.data;
        toReturn += this.getContent(data, true);
        toReturn += this.getEditButton(data);
        toReturn += this.getListButton(data);
        toReturn += this.getChildren(data);
        return toReturn;
    },
    getContent: function (idea, noHover) {
        var content = Data.htmlView(idea.content),
            classes = (noHover ? "" :(this.hasChildren(idea) ? "ideaContentName hover" : "")),
            html = "";
        content = (content.length === 0) ? "<span style='font-style:italic'>Empty</span>" : content;
        html = "<span class='"+ classes + "' data-id='" + idea.id + "' >" + content + "</span>";
        return html;
    },
    getParent: function (idea) {
        if (idea.parent) {
            return '<span class="parent editor-parent" id="option-parent" data-id="' + idea.parent + '">Parent</span><br /><div style="display:inline-block;width:20px;position:relative"><img style="positon:absolute;top:0px;" src="Static/Images/link.png" aling="absmiddle"></div>';
        }
        return '';
    },
    getWait: function () {
        return "<span class='wait'></span>";
    },
    getExpand: function (idea) {
        return "<img src='Static/Images/expand.png' class='expand button' id='expand-" + idea.id + "' data-id='" + idea.id + "' />";
        return "";
    },
    getEditButton: function (idea) {
        return '<img data-id="' + idea.id + '" class="edit button option" src="Static/Images/Menu/default.svg" alt="Default" />';
    },
    getListButton: function (idea) {
        return '<img data-id="' + idea.id + '" class="list button option" src="Static/Images/Menu/list.png" alt="List" />';
    },
    getChildrenIdeaHTML: function (idea) {
        function getChildrenProperty(idea) {
            return "visible";
        }
        var iterator = 0,
            toReturn = "",
            children = idea.children,
            child = null;
        if (children.length !== 0) {
            toReturn += "<ul id='children-" + idea.id + "' class='children " + getChildrenProperty(idea) + "' >";
            for (iterator = 0; iterator < children.length; iterator = iterator + 1) {
                child = children[iterator];
                toReturn += "<li>";
                toReturn += this.getIdeaHTML(child, false);
                toReturn += "</li>";
            }
            toReturn += "</ul>";
        }
        return toReturn;
    },
    activateListeners: function () {
        var instance = this.visual,
            parentButton = (function () {
                var visual = instance;
                return function () {
                    var id = $(this).data("id");
                    app.gui.section.select("visual", id);
                };
            })(),
            listListener = (function () {
                var visual = instance;
                return function () {
                    var id = $(this).data("id");
                    visual.showLines(id);
                };
            })(),
            editButton = (function () {
                var visual = instance;
                return function () {
                    var id = $(this).data("id");
                    visual.fired_ideaClicked(id);
                };
            })(),
            expandButton = (function () {
                var visual = instance;
                return function () {
                    var id = $(this).data("id");
                    visual.fired_expand(id);
                };
            })();
        this.visual.container.off();
        this.visual.container.find(".parent").click(parentButton);
        this.visual.container.find(".edit").click(editButton);
        this.visual.container.find('.expand').click(expandButton);
        this.visual.container.find('.list').click(listListener);
        this.visual.container.find('.ideaContentName').click(expandButton);
    }
};