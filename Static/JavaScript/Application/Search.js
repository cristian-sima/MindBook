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
                    return "<div class='parent' >" + parent.content + "</div>" + "<div style='display:inline-block;width:20px;position:relative'><img style='positon:absolute;top:0px;' src='Static/Images/link.png' aling='absmiddle' /></div>" + " ";
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
                app.gateway.findIdeasByContent(term, function (data) {
                    instance.cache[term] = data;
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
            console.log('focus')
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