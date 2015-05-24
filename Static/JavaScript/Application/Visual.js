/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Visual(id, rawData) {
    this.id = id;
    this.element = $("#" + this.id);
    this.extractData(rawData);
    this.init();
};
Visual.prototype = {
    extractData: function (data) {
        var temp = {
            id: parseInt(data.id),
            parent: null,
            content: data.content
        };
        temp.children = {};

        function findParentOfChild(current, id) {
            var child, i;
            if (current.id === id) {
                return current;
            }
            for (i in current.children) {
                child = current.children[i];
                var found = findParentOfChild(child, id);
                if (found) {
                    return found;
                }
            }
            return null;
        }
        var currentParentArray = temp,
            i = 0,
            child = null;
        for (i = 0; i < data.children.length; i = i + 1) {
            c = data.children[i];
            var child = {
                id: parseInt(c.id),
                content: c.content,
                children: {}
            };
            parent = findParentOfChild(temp, parseInt(c.parent));
            parent.children[child.id] = child;
            child.parent = parent;
        }
        this.home = temp;
    },
    init: function () {
        this.element.html(this.showIdea(this.home));
        this.activateListeners();
        console.log(this.home)
    },
    showIdea: function (idea) {
        var toReturn = "",
            id = null,
            child = null;
        toReturn += "<div class='idea' ><span class='name' data-id='" + idea.id + "' >" + idea.content + "</span><ul>";
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