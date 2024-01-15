const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectDirectory = path.resolve(__dirname);
const _projectParentDirectory = "..";
const projectParentDirectory = path.resolve(__dirname, _projectParentDirectory);
const sharedLibDirectoryName = "libs";
const sharedLibDirectory = path.join(
  projectParentDirectory,
  sharedLibDirectoryName
);
const gitRepo = "git@github.com:amalpsojan/shared-monorepo.git";

const metroConfigFilePath = path.join(projectDirectory, "metro.config.js");
const metroConfigContent = `
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectParentDirectory = path.resolve(__dirname, "${_projectParentDirectory}");
const sharedLibDirectory = path.join(projectParentDirectory, "${sharedLibDirectoryName}" + "/packages");

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.watchFolders = [sharedLibDirectory];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(sharedLibDirectory, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;`;

//key = directory name; value = package name
const linkPackages = { "mobile-theme": "@amalpsojan/mobile-theme" };

function cloneMonorepo() {
  execSync(`git clone ${gitRepo} ` + sharedLibDirectory);
}

function linkPackage(packagePath, value) {
  execSync(`cd ${packagePath} && yarn link`);
  execSync(`cd ${projectDirectory} && yarn link ${value}`);
  console.log(`${value} successfully linked`);
}

function createFile(filePath, fileContent) {
  fs.writeFileSync(filePath, fileContent);
  console.log(`${path.basename(filePath)} file created successfully!`);
}

function checkDirectoryExists(directory) {
  return fs.existsSync(directory);
}

function checkMonorepoAccess() {
  try {
    execSync("git ls-remote --exit-code " + gitRepo);
    console.log("User has access to the monorepo. No need to clone, directory already exists.");

    for (const id in linkPackages) {
      const key = id;
      const value = linkPackages[id];
      const packagePath = `${sharedLibDirectory}/packages/${key}`;

      if (checkDirectoryExists(packagePath)) {
        linkPackage(packagePath, value);
      }
    }

    console.log("Packages linked successfully!");
    createFile(metroConfigFilePath, metroConfigContent);
  } catch (error) {
    console.error("User does not have access to the monorepo. Please check your permissions.");
  }
}

try {
  // Check if the lib directory exists
  if (!checkDirectoryExists(sharedLibDirectory)) {
    // Clone the monorepo project
    cloneMonorepo();
    checkMonorepoAccess();
  } else {
    // Check if the user has access to the monorepo
    // You can replace the URL with your actual monorepo URL
    checkMonorepoAccess();
  }
} catch (error) {
  console.error("Error during postinstall script execution:", error.message);
  process.exit(1);
}
