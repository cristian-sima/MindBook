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
            var result = "";

            function processContent(occurences) {
                function getOccurenceText(number) {
                    return (number === 1) ? '' : "<div class='numberOfOccurences '> " + occurences.number + " " + "occurences" + ":</div>";
                }
                var content = "",
                    occurenceContent = "",
                    iterator = 0,
                    beforeOccurenceText = "<span class='beforeDots'>... </span>",
                    afterOccurenceText = "<span class='afterDots'>... </span>",
                    htmlData = "",
                    oc_html = "";
                if (occurences.number === 0) {
                    content = occurences.content;
                    content = replaceSearchedTerm(content, instance.getTerm(), "<span class='highlightWord'>$1</span>");
                } else {
                    content += getOccurenceText(occurences.number);
                    for (iterator = 0; iterator < occurences.content.length; iterator = iterator + 1) {
                        oc_html = "";
                        occurenceContent = occurences.content[iterator];
                        occurenceContent.content = replaceSearchedTerm(occurenceContent.content, instance.getTerm(), "<span class='highlightWord'>$1</span>");
                        htmlData = Data.htmlView(occurenceContent.content);
                        if (occurenceContent.before === true) {
                            oc_html += beforeOccurenceText;
                        }
                        oc_html += htmlData;
                        if (occurenceContent.after === true) {
                            oc_html += afterOccurenceText;
                        }
                        oc_html += "<div class='endOfOccurence'></div>";
                        content += oc_html;
                    }
                }
                return content;
            }

            function getParentText(parentIdea) {
                var parent = "Home";
                if (parentIdea) {
                    parent = processContent(parentIdea.content);
                }
                return "<div class='search-result-parent' >" + parent + "</div>";
            }

            function getLinkImage() {
                return "<img class='search-result-link' src='Static/Images/link.png' aling='absmiddle' />";
            }
            result += getParentText(item.parent);
            result += getLinkImage();
            result += "<div class='search-result-content'>" + processContent(item.content) + "</div>";
            return "<div class='search-result'>" + result + "</div>";
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
                    data.sort(function (a, b) {
                        return -b.content.number + a.content.number; // ASC -> a - b; DESC -> b - a
                    });
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
            if (keyCode === app.data.getKey("ESC").code) {
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