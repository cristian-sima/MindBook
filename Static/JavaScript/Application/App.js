/*global app,$,HomeIdea,ChildIdea,Data,App,GUI,Gateway,Editor,Visual*/
(function () {
    'use strict';
    App = function App() {
        this.gui = new GUI();
        this.gateway = new Gateway();
        this.home = null;
        this.startingContent = "editor";
        this.init();
    };
    App.prototype = {
        init: function () {
            this.loadData();
            this.gui.init();
            this.gateway.init();
        },
        start: function () {
            this.gateway.start();
        },
        load: function (data) {
            this.home = parseInt(data.home, 10);
            this.counter = parseInt(data.counter, 10);
            this.selectContent(this.startingContent);
        },
        loadData: function () {
            this.data = new Data();
        },
        fired_applicationIsDisconnected: function () {
            // TODO
        },
        fired_applicationIsConnected: function () {
            this.start();
        },
        selectContent: function (content, idea) {
            this.gui.selectContent(content);
            switch (content) {
                case "visual":
                    this.selectDefaultVisual();
                    break;
                case "editor":
                    this.selectEditor(idea);
                    break;
            }
        },
        selectDefaultVisual: function () {
            if (this.editor) {
                this.editor.close();
                delete this.editor;
            }
            app.gateway.getEntireIdea(this.home, function (data) {
                app.visual = new Visual("visual", data);
            });
        },
        selectEditor: function (id) {
            if (!id) {
                id = this.home;
            }
            this.editor = this.createEditor(id, $("#app"));
        },
        extractData: function (data) {
            var temp = {
                id: parseInt(data.id, 10),
                parent: null,
                content: data.content
            },
                i = 0,
                child = null,
                c = null,
                parent = null;
            temp.children = {};

            function findParentOfChild(current, id) {
                var current_child = null,
                    iterator = null,
                    found = null;
                if (current.id === id) {
                    return current;
                }
                for (iterator in current.children) {
                    if (current.children.hasOwnProperty(iterator)) {
                        current_child = current.children[iterator];
                        found = findParentOfChild(current_child, id);
                        if (found) {
                            return found;
                        }
                    }
                }
                return null;
            }
            for (i = 0; i < data.children.length; i = i + 1) {
                c = data.children[i];
                child = {
                    id: parseInt(c.id, 10),
                    content: c.content,
                    children: {}
                };
                parent = findParentOfChild(temp, parseInt(c.parent, 10));
                parent.children[child.id] = child;
                child.parent = parent;
            }
            this.home = temp;
        },
        createEditor: function (id, elementHTML) {
            app.gateway.getIdea(id, function (data) {
                app.editor = new Editor(data, elementHTML);
            });
        }
    };
}($));