/*global Editor*/
(function () {
    "use strict";
    var DefaultEditorTemplate = {
        init: function (data, container) {
            this._super(data, container);
        }
    };

    DefaultEditor = Editor.extend(DefaultEditorTemplate);
}());