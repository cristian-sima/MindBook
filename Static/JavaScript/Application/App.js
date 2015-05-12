/*global app,$,HomeIdea,ChildIdea,Data,App*/
(function () {
    'use strict';
    App = function App() {
        this.gui = new GUI();
        this.gateway = new Gateway();
        this.homeID = 1;
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
            this.gui.start();
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
        selectContent: function (id) {
            switch (id) {
                case "list":
                    this.selectList();
                    break;
                case "editor":
                    this.selectEditor();
                    break;
            }
        },
        selectList: function () {
            if (this.editor) {
                this.editor.close();
                delete this.editor;
            }
        },
        selectEditor: function (id) {
            if (!id) {
                id = this.startingContent;
            }
            this.gateway.getContentOfIdea(id);
            this.editor = new Editor(id);
        }
    };
}($));