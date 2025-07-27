// Script to reset classes based on configuration file
require("dotenv").config();
const { resetClasses } = require("./db");

resetClasses()
  .then(() => {
    console.log("Classes have been reset to the configuration file settings");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to reset classes:", err);
    process.exit(1);
  });
