/**
 * Bootstrap our app
 */
$(function () {
  var grid = new app.Grid('#grid-component',
    new app.GridData($),
    app.utils);
});
