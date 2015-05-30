/*global Editor*/
(function () {
    "use strict";
    var DefaultEditorTemplate = {
        init: function (id, container) {
            this._super(id, container, "Default");
        },
        loadData: function (data) {
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
        },
        getDataFromServer: function (id) {
            this.loadData({
                id: id,
                content: ""
            });
        }
    };
    DefaultEditor = Editor.extend(DefaultEditorTemplate);
}());