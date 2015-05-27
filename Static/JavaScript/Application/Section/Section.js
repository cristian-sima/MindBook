/*global app,Class,$,Section*/
(function () {
    "use strict";
    var Status = function Status(section) {
            this.section = section;
            section.element.prepend("<div id='status'>a</div>");
            this.element = section.element.find("#status");
            this.show();
        };
    Status.prototype = {
        post: function (message) {
            this.element.html(message);
        },
        hide: function () {
            this.element.html("");
        },
        show: function () {
            this.element.show();
        },
        clear: function () {
            this.element.html("");
        }
    };
    var SectionTemplate = {
        init: function () {
            this.currentSection = null;
            this.element = $("#main-section");
            this.status = new Status(this);
        },
        start: function () {
            this.select('default');
            this.status.clear();
        },
        select: function (content, ideaId) {
            if (app.isEnabled()) {
                if (!ideaId) {
                    ideaId = app.getHomeIdeaId();
                }
                try {
                    this.closeCurrentSection();
                    this.selectContent(content);
                    switch (content) {
                        case "visual":
                            this.selectVisual(ideaId);
                            break;
                        case "default":
                            this.selectDefaultEditor();
                            break;
                        case "standard":
                            this.selectStandardEditor(ideaId);
                            break;
                    }
                } catch (err) {
                    var section = this,
                        c = content,
                        i = ideaId,
                        current = this.currentSection;
                    app.disableInteraction();
                    this.status.post("The editor is saving your ideas...");
                    current.forceClose(function () {
                        app.allowInteraction();
                        section.select(c, i);
                        section.status.clear();
                    });
                }
            } else {
                this.status.post("Wait a bit...");
            }
        },
        closeCurrentSection: function () {
            if (this.currentSection) {
                this.currentSection.close();
            }
        },
        selectVisual: function (id) {
            this.currentSection = new Visual(id, "visual");
        },
        selectStandardEditor: function (id) {
            this.currentSection = new StandardEditor(id, "editor");
        },
        selectDefaultEditor: function () {
            this.currentSection = new DefaultEditor(this.home, "default");
        },
        getStatus: function () {
            return this.status;
        },
        selectContent: function (id) {
            if (this.currentContent) {
                this.currentContent.hide();
            }
            this.currentContent = $("#" + id);
            this.currentContent.show();
            app.gui.menu.selectOption(id);
        }
    };
    Section = Class.extend(SectionTemplate);
}($));