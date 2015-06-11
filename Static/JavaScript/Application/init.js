/* 
 * @author Cristian Sima
 */
var app = app | null,
    Idea = Idea | null;
$(document).ready(init);

function init() {
    $(window).on('hashchange', function () {
        app.fired_hashChanged();
    });
    app = new App();
    app.preload();
}