const { LOGOUT_LINKS } = require("../constants/navigation");
const logger = require("../utils/logger");

exports.getLogoutView = (request, response) => {
  response.render("logout.ejs", {
    headTitle: "Logout",
    path: "/logout",
    activeLinkPath: "/logout",
    menuLinks: LOGOUT_LINKS,
  });
};

exports.killApplication = (request, response) => {
  logger.getProcessLog();
  process.exit();
};
