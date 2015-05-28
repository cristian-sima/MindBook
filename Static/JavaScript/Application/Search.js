/*global NProgress, app,Data*/

function Search() {
    this.element = $("#search");
    this.cache = {};
    this.cacheActivated = false;
    this.term = "";
    this.init();
}
Search.prototype = {
    init: function () {
        this.activateListeners();
    },
    activateListeners: function () {
        var instance = this;

        function getHTMLForItem(item) {
            var highlighted = replaceSearchedTerm(item.content, instance.getTerm(), "<span class='highlightWord'>$1</span>"),
                content = Data.htmlView(highlighted);

            function getParentText(parentIdea) {
                var parent = "Home";
                if (parentIdea) {
                    parent = parentIdea.content;
                }
                return "<div class='parent' >" + parent + "</div>" + "<div style='display:inline-block;width:20px;position:relative'><img style='positon:absolute;top:0px;' src='Static/Images/link.png' aling='absmiddle' /></div>" + " ";
            }
            return getParentText(item.parent) + content;
        }
        this.element.autocomplete({
            minLength: 2,
            autoFocus: true,
            source: function (request, response) {
                var term = request.term;
                instance.setTerm(term);
                if (instance.cacheActivated && term in instance.cache) {
                    response(instance.cache[term]);
                    return;
                }
                app.gateway.findIdeasByContent(term, function (data) {
                    if (instance.cacheActivated) {
                        instance.cache[term] = data;
                    }
                    response(data);
                });
            },
            select: function (event, ui) {
                var idea = ui.item.id;
                app.gui.section.select("standard", idea);
                $(this).val(instance.getTerm());
                return false;
            }
        });
        this.element.autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li data-idea='" + item.id + "' >").append(getHTMLForItem(item)).appendTo(ul);
        };
        this.element.focus(function () {
            $(this).val(instance.getTerm());
            $(this).autocomplete("search");
        });
        this.element.on("keydown", function (event) {
            var keyCode = event.keyCode || event.which;
            if(keyCode === app.data.getKey("ESC").code) {
                app.gui.search.clear();
            }
        });
    },
    clear: function () {
       this.element.val("");
    },
    getTerm: function () {
        return this.term;
    },
    setTerm: function (term) {
        this.term = term;
    }
};