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
        start: function () {
            this.disableInteraction();
            this.gateway.start();
        },
        load: function (data) {
            this.data.homeIdeaId = parseInt(data.home, 10);
            this.data.counter = parseInt(data.counter, 10) + 1;
            this.allowInteraction();
            this.gui.start();
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
        }
    };
}($));