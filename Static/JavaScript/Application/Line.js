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
            this.element = $("#element-" + this.id);
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        }
    };
    Line = Class.extend(LineTemplate);
}($));