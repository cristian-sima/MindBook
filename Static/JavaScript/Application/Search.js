/*global NProgress, app*/

function Search() {
    this.element = $("#search");
    this.cache = {};
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
                var rgxp = new RegExp(word, 'gi');
                var repl = '<span class="highlightWord">' + word + '</span>';
                return text.replace(rgxp, repl);
            }

            function getParentText(parent) {
                if (parent) {
                    return parent.content + "-->";
                }
                return "";
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
            source: function (request, response) {
                var term = request.term;
                instance.setTerm(term);
                if (term in instance.cache) {
                    response(instance.cache[term]);
                    return;
                }
                $.getJSON("api/?action=findIdeas", request, function (data, status, xhr) {
                    instance.cache[term] = data;
                    response(data);
                });
            },
            select: function (event, ui) {
                var idea = ui.item.id;
                app.selectContent("editor", idea);
                return false;
            },
            focus: function (event, ui) {
                $(this).val(instance.getTerm());
                return false;
            },
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li data-idea='" + item.id + "' >").append(getHTMLForItem(item)).appendTo(ul);
        };
    },
    getTerm: function () {
        return this.term;
    },
    setTerm: function (term) {
        this.term = term;
    }
};