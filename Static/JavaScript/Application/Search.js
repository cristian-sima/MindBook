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
            function highlightSearchedTerm(data, search) {
                function preg_quote(str) {
                    // http://kevin.vanzonneveld.net
                    // +   original by: booeyOH
                    // +   improved by: Ates Goral (http://magnetiq.com)
                    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    // +   bugfixed by: Onno Marsman
                    // *     example 1: preg_quote("$40");
                    // *     returns 1: '\$40'
                    // *     example 2: preg_quote("*RRRING* Hello?");
                    // *     returns 2: '\*RRRING\* Hello\?'
                    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
                    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
                    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
                }
                return data.replace(new RegExp("(" + preg_quote(search) + ")", 'gi'), "<span class='highlightWord'>$1</span>");
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
                app.gui.section.select("editor", idea);
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