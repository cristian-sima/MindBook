/*global app,Class,Line,$,HomeLine*/
(function () {
    "use strict";
    var HomeLineTemplate = {
        // constructor
        init: function (idea, container) {
            this._super(idea, container);
        },
        insertElement: function (container) {
            var html = this.getHTML();
            $(container).html(html);
        },
        getHTML: function () {
            var id = this.idea.id,
                idea = this.getIdea(),
                content = idea.getContent(),
                showOptions = idea.isTheHomeRoot(),
                toReturn = '';

            function getOptions(id) {
                if (parent) {
                    return '<img class="option-editor" src="Static/Images/Menu/list.svg" "Visual" id="option-show-visual" data-id="' + id + '" >';
                }
                return "";
            }
            toReturn += "<div id='element-" + id + "' class='idea-div idea-home'>";
            toReturn += content;
            console.log(showOptions);
            console.log(idea.getParentId());
            //if (!showOptions) {
                toReturn += getOptions(id);
            //}
            toReturn += " </div>";
            return toReturn;
        },
        activateListeners: function () {
            this.element.find("#option-show-visual").click(function(){
               var id = $(this).data("id"); 
               app.selectContent("visual", id);
            });
        },
        getElements: function () {
            this._super();
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        },
        getPreviousLine: function () {
            // empty
        }
    };
    HomeLine = Line.extend(HomeLineTemplate);
}($));