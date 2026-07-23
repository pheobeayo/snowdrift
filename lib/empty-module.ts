
const anyExport: any = new Proxy(function () {}, {
  get: () => anyExport,
  apply: () => anyExport,
  construct: () => ({}),
});
module.exports = anyExport;
