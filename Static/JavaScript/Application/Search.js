/*global NProgress, app*/

function Search() {
    this.element = $("#search");
    this.init();
}
Search.prototype = {
    init: function () {
        this.activateListeners();
    },
    activateListeners: function () {
        this.element.autocomplete({
            source: function (req, res) {
                //           term: req.term
                
            },
            select: function (event, ui) {
                alert(ui.value);
            }
        });
    }
};