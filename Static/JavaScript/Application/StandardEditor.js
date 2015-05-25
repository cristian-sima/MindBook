/*global Editor*/
(function () {
    "use strict";
    var StandardEditorTemplate = {
        init: function (data, container) {
            this._super(data, container);
        },
        initEditor: function (data) {
            var childId = null,
                child = null,
                firstIdea = null,
                firstChild = null;
            this.createHomeIdea({
                id: data.id,
                content: data.content,
                parent: data.parent
            });
            if (Object.size(data.children) !== 0) {
                // get the first one
                firstChild = data.children[Object.keys(data.children)[0]];
                firstIdea = this.loadFirstIdea(firstChild);
                delete(data.children[firstIdea.id]);
                // load children
                this.loadIdeas(this.home, data.children);
                // punem restul de copii 
            } else {
                firstIdea = this.createNewFirstChildIdea();                
            }
            this.setCurrentIdea(firstIdea);
        }
    };
    StandardEditor = Editor.extend(StandardEditorTemplate);
}());