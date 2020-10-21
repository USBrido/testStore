

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: "login",
    path: "/login",
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};