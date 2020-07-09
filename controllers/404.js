exports.pagenotfoundController = (req, res, next) => {
  res.status(404).render('pagenotfound', {pageTitle: 'Page not Found', path: 'error'});
};