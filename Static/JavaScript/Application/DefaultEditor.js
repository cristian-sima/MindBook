/*global Editor*/
(function () {
    "use strict";
    var DefaultEditorTemplate = {
        init: function (data, container) {
            this._super(data, container);
        },
        initEditor: function (data) {
            var firstIdea = null;
            
            data.content = "Live your beliefs and you can turn the world around";
            data.children = {};
                        
            
            this.createHomeIdea({
                id: data.id,
                content: data.content
            });
            firstIdea = this.createNewFirstChildIdea();
            
            this.setCurrentIdea(firstIdea);
        }
    };
    DefaultEditor = Editor.extend(DefaultEditorTemplate);
}());