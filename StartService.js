var Service = require("node-mac").Service;

// Create a new service object
var svc = new Service({
  name: "Gym Management App",
  description: "This is test gym management app",
  script:
    "/Users/shahbazshaikh/Documents/Personal/gym/api-gym-management-app/app.js",
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start();
});

svc.install();

// var svc = new Service({
//   name: "Gym Management App",
//   script: require("path").join(__dirname, "AppService.js"),
// });

// // Listen for the "uninstall" event so we know when it's done.
// svc.on("uninstall", function () {
//   console.log("Uninstall complete.");
//   console.log("The service exists: ", svc.exists);
// });

// // Uninstall the service.
// svc.uninstall();
