const { execSync } = require("child_process");
const fs = require("fs");

const libDirectory = "libs";
const gitRepo = "git@github.com:amalpsojan/shared-monorepo.git";

try {
  // Check if the lib directory exists
  if (!fs.existsSync(libDirectory)) {
    // Clone the monorepo project
    execSync(
      `git clone ${gitRepo} ` + libDirectory
    );

    execSync(`cd ${libDirectory}/packages/mobile-theme && yarn link && cd ../../../ && yarn link @amalpsojan/mobile-theme`);

    console.log("Monorepo project cloned and linked successfully!");
  } else {
    // Check if the user has access to the monorepo
    // You can replace the URL with your actual monorepo URL

    try {
      execSync("git ls-remote --exit-code " + gitRepo);
      console.log(
        "User has access to the monorepo. No need to clone, directory already exists."
      );
    } catch (error) {
      console.error(
        "User does not have access to the monorepo. Please check your permissions."
      );
    }
  }
} catch (error) {
  console.error("Error during postinstall script execution:", error.message);
  process.exit(1);
}
