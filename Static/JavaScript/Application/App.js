/*global app,$,HomeIdea,ChildIdea,Data,App,GUI,Gateway,Editor*/
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
            //  this.start();
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
                    this.selectEditor(app.home);
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
                id = this.home;
            }
            this.editor = this.createEditor(id, $("#app"));
        },
        createEditor: function (id, elementHTML) {
            app.gateway.getIdea(id, function (data) {
                app.editor = new Editor(data, elementHTML);
            });
        }
    };
}($));