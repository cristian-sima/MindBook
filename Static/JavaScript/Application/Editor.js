/*global app*/
var Editor = function Editor(data, container) {
        this.container = container;
        this.counter = this.app;
        this.currentIdea;
        this.init(data);
    };
Editor.prototype = {
    init: function (data) {
        this.createHomeLine({
            id: data.id,
            content: data.content
        });
        /*var child, index;
            for(index in this.data.children ) {
            child = this.data.children[index];
            this.createChildIdea(child.id, child.content, this.home, this.home);
        }*/
    },
    createHomeLine: function (idea) {
        var homeIdea = new HomeIdea(idea.id, idea.content),
            line = new HomeLine(homeIdea, this.container);
        this.home = line;
    },
    crateLine: function (idea, parent) {
        var line = new Line(idea, parent);
        return line;
    },
    createChildIdea: function (id, content, parent, previousIdea) {
        var newIdea = new ChildIdea(id, content);
        newIdea.insert(previousIdea);
        newIdea.setParent(parent, previousIdea);
        return newIdea;
    },
    createNewChildIdea: function (parent) {
        var idea = this.currentIdea,
            previousIdea = idea,
            newIdea = null;
        if (idea && idea.isParent()) {
            previousIdea = idea.getIndexOfLastIdeaFromChildren();
        }
        var newIdea = this.createChildIdea(this.counter, "", parent, previousIdea);
        this.setCurrentIdea(newIdea);
        this.incrementCounter();
    },
    incrementCounter: function () {
        this.counter = this.counter + 1;
    },
    setCurrentIdea: function (idea) {
        var oldIdea = this.currentIdea;
        if (!idea.id) {
            return;
        }
        if (oldIdea) {
            oldIdea.deselect();
        }
        this.currentIdea = idea;
        this.currentIdea.select();
    },
    getIdeaByIndex: function (id) {
        return this.home.getChildByIndex(id);
    },
    moveUp: function () {
        var idea = this.currentIdea,
            previous = null;
        previous = idea.getParent().getPreviousChild(idea);
        if (previous) {
            if (previous.isParent()) {
                previous = previous.getIndexOfLastIdeaFromChildren();
            } else {
                previous = idea.getParent().getPreviousChild(idea);
            }
        } else {
            // nu a mai gasit
            previous = idea.getParent();
        }
        if (previous) {
            this.setCurrentIdea(previous);
        }
    },
    moveDown: function () {
        var idea = this.currentIdea,
            parent = idea.getParent(),
            nextIdea = null;
        if (idea.isParent()) {
            nextIdea = idea.getFirstChild();
        } else {
            do {
                nextIdea = idea.getParent().getNextChild(idea);
                idea = parent;
                parent = parent.getParent();
            } while (!nextIdea && parent);
        }
        if (nextIdea) {
            this.setCurrentIdea(nextIdea);
        }
    },
    removeIdea: function (idea, event) {
        if (this.canIdeaBeRemoved(idea)) {
            event.preventDefault();
            idea.removeIdeaAndSaveChildren();
            idea = null;
        }
    },
    canIdeaBeRemoved: function (idea) {
        if (idea.getContent().length === 0) {
            if (idea.getParent().id === this.home.id) {
                if (this.home.getNumberOfChildren() !== 1) {
                    return true;
                }
                return false;
            }
            return true;
        }
        return false;
    },
    getData: function () {
        return JSON.stringify(this.home.getJSON());
    },
    close: function () {
        this.home.remove();
        this.home = null;
    }
};