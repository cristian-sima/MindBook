/*global Editor*/
(function () {
    "use strict";
    var DefaultEditorTemplate = {
        init: function (data, container) {
            this._super(data, container);
        },
        initEditor: function (data) {
            var firstIdea = null;
            
            data.content = "";
            data.children = {};
                        
            
            this.createHomeIdea({
                id: data.id,
                content: data.content
            });
            firstIdea = this.createFirstChildIdea({
                id: this.counter,
                content: ""
            });
            this.setCurrentIdea(firstIdea);
            
            this.incrementCounter();
        }
    };
    DefaultEditor = Editor.extend(DefaultEditorTemplate);
}());