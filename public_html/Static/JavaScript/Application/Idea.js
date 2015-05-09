var app = app | null;


Idea = Class.extend({
  // constructor
  init: function (id) {
    this.id = id;
    this.level = 0;
    this.children = [];
    this.parent = null;
    this.content = "";
  },
  insert: function (previousIdea) {
    var HTML = this.getHTML();
    if (!previousIdea) {
      $("#app").append(HTML);
    } else {
      $(HTML).insertAfter(previousIdea.element);
    }
    this.getJQueryElements();
    this.activateListeners();

  },
  addChild: function (child, previousItem) {
    var position = null;

    if (previousItem) {
      position = previousItem.getParent().getChildIndex(previousItem) + 1;
      if (position === 0) {
        position = previousItem.getParent().getNumberOfChildren();
      }
    } else {
      position = 0;
    }

    this.children.insert(position, child);

  },
  removeChild: function (child) {
    var index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
    this.updateLevel();
    this.updateHTML();
  },
  getChildById: function (id) {
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      if (child.id === id) {
        return child;
      } else {
        var c = child.getChildById(id);
        if (c) {
          return c;
        }
      }
    }
    return null;
  },
  getChildIndex: function (currentIdea) {
    for (var j = 0; j < this.children.length; j++) {
      var idea = this.children[j];
      if (idea.id === currentIdea.id) {
        return j;
      }
    }
    return -1;
  },
  getPositionOfLastIdeaFromChildren: function () {
    if (this.isParent()) {
      var lastChild = this.getLastChild();
      return lastChild.getPositionOfLastIdeaFromChildren();
    } else {
      return this;
    }
  },
  getPreviousChild: function (currentIdea) {
    for (var i = this.children.length - 1; i > 0; i--) {
      var idea = this.children[i];
      if (idea.id === currentIdea.id) {
        return this.children[i - 1];
      }
    }
    return null;
  },
  getNextChild: function (currentIdea) {

    for (var j = 0; j < this.children.length - 1; j++) {
      var idea = this.children[j];
      if (idea.id === currentIdea.id) {
        return this.children[j + 1];
      }
    }
    return null;
  },
  getFirstChild: function () {
    return this.children[0];
  },
  getLastChild: function () {
    return this.children[this.children.length - 1];
  },
  isParent: function () {
    return (this.getNumberOfChildren() !== 0);
  },
  printChildren: function () {
    for (var j = 0; j < this.children.length; j++) {
      var idea = this.children[j];
    }
  },
  getParent: function () {
    return this.parent;
  },
  getContent: function () {
    return this.content;
  },
  setContent: function (content) {
    this.content = content;
  },
  hasParent: function () {
    return (!this.getParent);
  },
  getChildPosition: function (child) {
    return this.children.indexOf(child);
  },
  getNumberOfChildren: function () {
    return this.children.length;
  },
  updateHTML: function () {
    // empty
  },
  updateLevel: function () {
    // empty
  },
  getHTML: function () {
    // empty
  },
  getJQueryElements: function () {
    // empty
  },
  activateListeners: function () {
    // empty
  },
  select: function () {
    // empty
  },
  deselect: function () {
    // empty
  }
});


/*
 * ------------------------------------------------------------
 */

var ChildIdea = Idea.extend({
  init: function (id) {
    this._super(id);
  },
  getHTML: function () {

    function getTextarea(id, content) {
      return "<textarea spellcheck='false' class='idea-textarea' id='textarea' data-id='" + id + "' >" + content + "</textarea>";
    }

    function getID(id) {
      return "<div class='idea-id' style='display:none' id='id'>" + id + " </div>";
    }

    function getNumberOfChildren(nrOfChildren) {
      return "<div class='numberOfChildren' id='childrennr'>" + nrOfChildren + "&nbsp;</div>";
    }

    var toReturn = "";
    toReturn += "<div id='element-" + this.id + "' class='idea-div'> ";
    toReturn += "<div class='warning' id='warning'>" + '<img src="Static/Images/warning.png" alt="Atentie" title="">' + "</div>";
    toReturn += "<div class='content' id='content'>";
    toReturn += getID(this.id);
    toReturn += getNumberOfChildren(this.getNumberOfChildren());
    toReturn += getTextarea(this.id, this.getContent());
    toReturn += "</div>";
    toReturn += "</div>";
    return toReturn;
  },
  getJQueryElements: function () {
    this.element = $("#element-" + this.id);
    this.textarea = this.element.children("#content").children("#textarea");
  },
  activateListeners: function () {
    this.activateKeyListenes();
    this.activateMouseListeners();
  },
  activateKeyListenes: function () {
    var idea = this;
    this.textarea.on("keydown", function (event) {
      var keyCode = event.keyCode || event.which;

      if (app.data.isSpecialKey(keyCode)) {
        event.preventDefault();
      }

      switch (keyCode) {

        case app.data.keys["ENTER"].code:
          app.createIdea(idea.getParent());
          break;

        case app.data.keys["TAB"].code:
          if (event.shiftKey) {
            // <-----
            idea.reduceLevel();
          } else {
            // -----> (TAB)
            var previousIdea = idea.getParent().getPreviousChild(idea);
            if (previousIdea) {
              idea.setParent(previousIdea, idea);
            }
          }
          break;

        case app.data.keys["ARROW-UP"].code:
          app.moveUp();
          break;
        case app.data.keys["ARROW-DOWN"].code:
          app.moveDown();
          break;
      }
    });

    this.textarea.on("keyup", function (event) {
      idea.setContent(idea.textarea.val());
      idea.updateHTML();
    });

    this.textarea.on("blur", function () {
      var id = $(this).data("id");
      app.firedCurrentIdeaDeselected(id);
    });
  },
  activateMouseListeners: function () {
    var idea = this;
    this.textarea.on("click", function () {
      var id = $(this).data("id");
      app.firedCurrentIdeaSelected(id);
    });
    this.element.on("click", function () {
      app.changeCurrentIdea(idea);
    });
  },
  select: function () {

    this.textarea.focusToEnd();
    if (this.parent.parent) {
      this.parent.activateParent();
    }
  },
  deselect: function () {
    if (this.parent.parent) {
      this.parent.disableParent();
    }
  },
  activateParent: function () {
    this.textarea.addClass("parent-focused");
  },
  disableParent: function () {
    this.textarea.removeClass("parent-focused");
  },
  updateLevel: function () {
    this.level = this.getParent().level + 1;
    var margin = this.level * 30;


    this.element.children("#content").css({
      marginLeft: margin + "px"
    });

    if (this.getParent().hasParent()) {
      this.getParent().updateHTML();
    }

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child.updateLevel();
      child.getParent().updateHTML();
    }

    this.updateHTML();
  },
  updateHTML: function () {
    var nr = this.children.length;
    //  if (nr === 0) {
    nr = "";
    // }
    this.element.children("#content").children("#childrennr").html(nr);

    if (this.isParent() && this.getContent().length === 0) {
      this.showWarning("Randul este parinte si nu contine nimic");
    } else {
      this.hideWarning();
    }


  },
  showWarning: function (message) {
    var atentie = this.element.children("#warning");
    atentie.html('<img src="Static/Images/warning.png" alt="Atentie" title="' + message + '">');
  },
  hideWarning: function () {
    var atentie = this.element.children("#warning");
    atentie.html('');
  },
  setParent: function (parent, previousItem) {

    if (this.getParent()) {

      this.getParent().removeChild(this);


      if (this.getParent().getParent()) {
        this.getParent().disableParent();
      }

      this.getParent().updateHTML();
    }
    this.parent = parent;
    this.parent.addChild(this, previousItem);
    this.parent.updateHTML();
    this.updateLevel();
    if (this.getParent().getParent()) {
      this.getParent().activateParent();
    }
  },
  deleteHTML: function () {
    this.element.remove();
    this.textarea.off();
  },
  highLight: function () {
    clearTimeout(this.highlightTimeout);

    var element = this.textarea,
      oldColor = element.css("background"),
      x = 400;
    element.css({
      "background": "rgb(255, 253, 70)"
    });
    this.highlightTimeout = setTimeout(function () {
      element.css({
        "background": oldColor
      });
    }, x);
  },
  updateChildrenPosition: function () {

    var itemBefore = this;

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];


      itemBefore = child.getParent().getPreviousChild(child);

      if (!itemBefore) {
        itemBefore = child.getParent();
      } else {
        itemBefore = itemBefore.getPositionOfLastIdeaFromChildren();
      }

      child.deleteHTML();
      child.insert(itemBefore);

      console.log('Muta ' + child.id + "  (after " + itemBefore.id + ")")


      itemBefore = child;

      child.updateChildrenPosition();
    }
    this.highLight();
  },
  reduceLevel: function () {


    var nextIdea = this.getParent().getNextChild(this),
      idea = this,
      newParent = this.getParent().getParent(),
      oldParent = this.getParent();

    if (newParent) {
      if (nextIdea) {
        // daca mai sunt idei dupa asta ca si copii ai parintelui
        if (oldParent) {
          oldParent.removeChild(this);
        }

        this.deleteHTML();

        // create the HTML
        console.log('-------------------------------')
        this.insert(oldParent.getPositionOfLastIdeaFromChildren());
        console.log('-------------------------------')

        // link idea to parent
        this.setParent(newParent, oldParent);

        app.currentIdea = null;
        app.changeCurrentIdea(this);


        this.updateChildrenPosition();

      }
      this.setParent(newParent, oldParent);
    }
  }
});

/*
 * ------------------------------------------------------------
 */

var HomeIdea = Idea.extend({
  init: function (id) {
    this._super(id);
  },
  getHTML: function () {
    return "<div  id='element-" + this.id + "' class='idea-div'></div>";
  },
  getJQueryElements: function () {
    this.element = $("#element-" + this.id);
  },
  updateLevel: function () {
    this.level = 0;
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child.updateLevel();
    }
  }
});