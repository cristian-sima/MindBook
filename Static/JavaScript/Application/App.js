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
            this.counter = parseInt(data.counter, 10) + 1;
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
            this.closeCurrentSection();
            switch (content) {
                case "default":
                    this.selectDefaultEditor();
                    break;
                case "visual":
                    this.selectDefaultVisual();
                    break;
                case "editor":
                    this.selectEditor(idea);
                    break;
            }
        },
        selectDefaultVisual: function () {
            app.gateway.getEntireIdea(this.home, function (data) {
                data = app.prepareData(data);
                app.visual = new Visual("visual", data);
            });
        },
        selectEditor: function (id) {
            if (!id) {
                id = this.home;
            }
            this.editor = this.createEditor(id, $("#app"));
        },
        selectDefaultEditor: function (id) {
            this.editor = this.createEditor(id, $("#app"), "default");
        },
        createEditor: function (id, elementHTML, type) {
            app.gateway.getEntireIdea(id, function (data) {
                data = app.prepareData(data);
                if (type === "default") {
                    app.editor = new StandardEditor(data, elementHTML);
                } else {
                    app.editor = new DefaultEditor(data, elementHTML);
                }
            });
        },
        closeCurrentSection: function () {
            if (this.editor) {
                this.editor.close();
                delete this.editor;
            }
        },
        prepareData: function (data) {
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
            return temp;
        }
    };
}($));