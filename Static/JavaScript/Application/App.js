/*global app,$,HomeIdea,ChildIdea,Data,App,GUI,Gateway,Editor,Visual*/
(function () {
    'use strict';
    App = function App() {
        this.gui = new GUI();
        this.gateway = new Gateway();
        this.home = null;
        this.startingContent = "default";
        this.counter = null;
        this.init();
    };
    App.prototype = {
        init: function () {
            this.data = new Data();
            this.gui.init();
            this.gateway.init();
        },
        load: function (data) {
            this.home = parseInt(data.home, 10);
            this.counter = parseInt(data.counter, 10) + 1;
            this.selectContent(this.startingContent);
        },
        fired_applicationIsConnected: function () {
            this.start();
        },
        start: function () {
            this.gateway.start();
        },
        selectContent: function (content, idea) {
            this.gui.selectContent(content);
            this.closeCurrentSection();
            switch (content) {
                case "visual":
                    this.selectDefaultVisual(idea);
                    break;
                case "default":
                    this.selectDefaultEditor();
                    break;
                case "editor":
                    this.selectEditor(idea);
                    break;
            }
        },
        selectDefaultVisual: function (id) {
            if (!id) {
                id = this.home;
            }
            this.visual = new Visual(id, "visual");
        },
        selectEditor: function (id) {
            if (!id) {
                id = this.home;
            }
            app.editor = new StandardEditor(id, "editor");
        },
        selectDefaultEditor: function () {
            app.editor = new DefaultEditor(this.home, "default");
        },
        closeCurrentSection: function () {
            if (this.editor) {
                this.editor.close();
                delete this.editor;
            }
            if (this.visual) {
                this.visual.close();
            }
        },
        getCounter: function () {
            return this.counter;
        },
        incrementCounter: function () {
            this.counter = this.counter + 1;
        }
    };
}($));