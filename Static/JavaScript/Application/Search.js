/*global NProgress, app*/

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
            function highlightSearchedTerm(text, word) {
                var rgxp = new RegExp(word, 'gi'),
                    repl = '<span class="highlightWord">' + word + '</span>';
                return text.replace(rgxp, repl);
            }

            function getParentText(parentIdea) {
                var parent = "Home";
                if (parentIdea) {
                    parent = parentIdea.content;
                }
                return "<div class='parent' >" + parent + "</div>" + "<div style='display:inline-block;width:20px;position:relative'><img style='positon:absolute;top:0px;' src='Static/Images/link.png' aling='absmiddle' /></div>" + " ";
            }
            return getParentText(item.parent) + highlightSearchedTerm(item.content, instance.getTerm());
        }

        function prepareResults(rezultate, termenCautat) {
            var iterator = null,
                result = null,
                toReturn = [];
            for (iterator in rezultate) {
                if (rezultate.hasOwnProperty(iterator)) {
                    result = rezultate[iterator];
                    result.content = highlightSearchedTerm(termenCautat, result.content);
                    toReturn.push("<div data-id='" + result.id + "' class='results'>" + result.content + "</div>");
                }
            }
            return toReturn;
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
                app.selectContent("editor", idea);
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
    },
    getTerm: function () {
        return this.term;
    },
    setTerm: function (term) {
        this.term = term;
    }
};