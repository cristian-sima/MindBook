/*global app,Class,$*/
(function () {
    "use strict";
    var LineTemplate = {
        // constructor
        init: function (idea, element) {
            this.idea = idea;
            this.element = null;
            this.insert(element);
        },
        insert: function (element) {
            this.insertElement(element);
            this.getElements();
            this.activateListeners();
            this.update();
        },
        getHTML: function () {
            // overwriteen             
        },
        insertElement: function () {
            // overwriteen 
        },
        activateListeners: function () {
            // overwriteen             
        },
        getElements: function () {
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        },        
        updateLevel: function () {
            var i, child;
            this.level = 0;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                child.updateLevel();
            }
        },
        getElement: function () {
            return this.element;
        },
        getIdea: function () {
            return this.idea;
        },
        update: function () {
            
        },
        remove: function () {
            this.element.off();
            this.element.remove();       
        }
    };
    Line = Class.extend(LineTemplate);
}($));