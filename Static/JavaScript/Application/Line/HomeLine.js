/*global app,Class,Line,$,HomeLine,Data*/
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
                editor = idea.getEditor(),
                content = idea.getContent(),
                toReturn = '';


            function getParent() {
                if(!idea.isTheHomeRoot()) {
                    return '<span class="parent editor-parent" id="option-parent" data-id="' + idea.getParentId() + '">Parent</span><br /><div style="display:inline-block;width:20px;position:relative"><img style="positon:absolute;top:0px;" src="Static/Images/link.png" aling="absmiddle"></div>';
                }
                return '';
            }
            
            function getContent () {
                return Data.htmlView(content);
            }
          
            function getOptions() {
                var toReturn = "";
                
                toReturn += "<div class='options'>";
                toReturn += getVisual();
                toReturn += "</div>";
                
                return toReturn;
            }            
            
            function getVisual() {
                if (editor.isStandard()) {
                    return '<img class="option-editor" src="Static/Images/Menu/list.svg" "Visual" id="option-show-visual" data-id="' + id + '" >';
                }
                return "";
            }
            
            toReturn += "<div id='element-" + id + "' class='idea-div idea-home'>";
            toReturn += getParent();
            toReturn += getContent();
            toReturn += getOptions();
            toReturn += " </div>";
            return toReturn;
        },
        activateListeners: function () {
            this.element.find("#option-show-visual").click(function () {
                var id = $(this).data("id");
                app.changePage("visual", id);
            });
            this.element.find("#option-parent").click(function () {
                var id = $(this).data("id");
                app.changePage("standard", id);
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