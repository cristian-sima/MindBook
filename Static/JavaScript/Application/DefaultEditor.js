/*global Editor*/
(function () {
    "use strict";
    var DefaultEditorTemplate = {
        init: function (data, container) {
            this._super(data, container, "Default");
        },
        initEditor: function (data) {
            var firstIdea = null;
            data.content = "";
            data.children = {};
            this.createHomeIdea({
                id: data.id,
                content: data.content,
                parent: null
            });
            firstIdea = this.createNewFirstChildIdea();
            this.setCurrentIdea(firstIdea);
        }
    };
    DefaultEditor = Editor.extend(DefaultEditorTemplate);
}());