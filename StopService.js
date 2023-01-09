var Service = require("node-mac").Service;

var svc = new Service({
  name: "Gym Management App",
  script: require("path").join(__dirname, "AppService.js"),
});

// Listen for the "uninstall" event so we know when it's done.
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
  console.log("The service exists: ", svc.exists);
});

// Uninstall the service.
svc.uninstall();
