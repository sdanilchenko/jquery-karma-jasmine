/**
 * Test suites for main application components: app.Grid and app.GridData
 */

describe('GridData', function () {
  var gd = new app.GridData();

  beforeEach(function() {
    jasmine.Ajax.install();

  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should request url with passed docId', function () {
    gd.fetch('23801');
    expect(jasmine.Ajax.requests.mostRecent().url).toMatch('//iac.tender.pro/demo/company_23801.json');
  });

  it('should return Promise', function () {
    var req = gd.fetch('23801');
    expect($.isFunction(req.then)).toBe(true);
  });

  it('should not request anything if no docId passed', function () {
    gd.fetch(null);
    expect(jasmine.Ajax.requests.count()).toBe(0);
  });

  it('returned Promise should be rejected if no docId passed', function () {
    var spy = jasmine.createSpy();
    var resp = gd.fetch(null);
    resp.fail(spy);
    expect(spy).toHaveBeenCalled();
  });

  it('should unwrap first element from returned array', function () {
    var response = [
      { id: '1234' }
    ],
      doneFn = jasmine.createSpy();

    var req = gd.fetch('23081');

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "responseText": JSON.stringify(response)
    });

    req.then(doneFn);
    expect(doneFn).toHaveBeenCalledWith(response[0]);
  });
});

describe('Grid component', function () {
  // component's markup
  var rootHtml = '<div id="grid-component"> \
      <div class="table-container" id="grid-container"> \
      </div> \
    </div>',
    rootElem,
    gridData = new app.GridData(),
    fetchDfd;

  beforeEach(function () {
    rootElem = $(rootHtml);
    fetchDfd = $.Deferred();
    // mock call for url parameter
    spyOn(app.utils, 'getUrlParam').and.returnValue('23801');

    // mock loading template, and serve it from html2js cache immediately
    spyOn(app.utils.tmpl, 'loadTemplate').and.callFake(function (url) {
      var dfd = $.Deferred();
      dfd.resolve($(window.__html__[url]));
      return dfd.promise();
    });

    // mock response from GridData.fetch
    spyOn(gridData, 'fetch').and.returnValue(fetchDfd.promise());
  });

  it('should instantiate', function () {
    var grid = new app.Grid(rootElem, gridData, app.utils);
  });

  it('should render "p.error" message and no table when there is no data', function () {
    fetchDfd.resolve(null);
    var grid = new app.Grid(rootElem, gridData, app.utils);
    expect(rootElem.find('p.error').length).toBe(1);
    expect(rootElem.find('table').length).toBe(0);
  });

  it('should render table with passed data', function () {
    fetchDfd.resolve({
      id: '1234',
      name: 'Some Name'
    });
    var grid = new app.Grid(rootElem, gridData, app.utils);

    expect(rootElem.find('table').length).toBe(1);
    expect(rootElem.find("th:contains('ID')").length).toBe(1);
    expect(rootElem.find("th:contains('NAME')").length).toBe(1);
    expect(rootElem.find("td:contains('1234')").length).toBe(1);
    expect(rootElem.find("td:contains('Some Name')").length).toBe(1);
  });

  it('should render array field as comma separated string', function () {
    fetchDfd.resolve({
      location: ["Россия","Приволжский","Казань"]
    });

    var grid = new app.Grid(rootElem, gridData, app.utils);

    expect(rootElem.find('td:contains("Россия, Приволжский, Казань")').length).toBe(1);
  });

});
