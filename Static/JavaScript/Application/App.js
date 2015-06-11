/*global app,$,HomeIdea,ChildIdea,Data,App,GUI,Gateway,Editor,Visual*/
(function () {
    'use strict';
    App = function App() {
        this.gui = new GUI();
        this.gateway = new Gateway();
        this.data = new Data();
        this.enable = true;
    };
    App.prototype = {
        preload: function () {
            this.disableInteraction();
            this.gateway.start();
        },
        load: function (data) {
            this.data.homeIdeaId = parseInt(data.home, 10);
            this.data.counter = parseInt(data.counter, 10) + 1;
            this.allowInteraction();
            this.start();
        },
        start: function () {
            this.fired_hashChanged();
        },
        getCounter: function () {
            return this.data.getCounter();
        },
        getHomeIdeaId: function () {
            return this.data.getHomeIdeaId();
        },
        incrementCounter: function () {
            this.data.incrementCounter();
        },
        disableInteraction: function () {
            this.gui.disable();
            this.enable = false;
        },
        allowInteraction: function () {
            this.gui.enable;
            this.enable = true;
        },
        isEnabled: function () {
            return this.enable;
        },
        fired_hashChanged: function () {
            var hash = window.location.hash.substring(1),
                array = null,
                type = null,
                id = null;
            if (!hash || hash.trim() === "") {
                this.gui.section.select('default');
            } else {
                array = hash.split("/");
                type = (array[0] === "" || !array[0]) ? "default" : array[0];
                if(type !== "standard" && type !== "visual" && type !== "default") {
                    type = "default";
                }
                id = array[1];
                this.gui.section.select(type, id);
            }
        },
        changePage: function (content, id) {
            if (id) {
                id = "/" + id;
            } else {
                id = "";
            }
            window.location.hash = content + id;
        }
    };
}($));