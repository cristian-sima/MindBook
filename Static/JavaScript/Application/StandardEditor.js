/*global Editor*/
(function () {
    "use strict";
    var StandardEditorTemplate = {
        init: function (data, container) {
            this._super(data, container);
        }
    };

    StandardEditor = Editor.extend(StandardEditorTemplate);
}());