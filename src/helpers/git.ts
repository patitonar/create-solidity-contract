import { execSync } from "child_process";
import path from "path";
import rimraf from "rimraf";

function isInGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (_) {
    /* Ignore error */
  }
  return false;
}

function isInMercurialRepository() {
  try {
    execSync("hg --cwd . root", { stdio: "ignore" });
    return true;
  } catch (_) {
    /* Ignore error */
  }
  return false;
}

export function tryGitInit(root: string) {
  let didInit: boolean = false;
  try {
    execSync("git --version", { stdio: "ignore" });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync("git init", { stdio: "ignore" });
    didInit = true;

    execSync("git add -A", { stdio: "ignore" });
    execSync('git commit -m "Initial commit from Create Solidity Contract"', {
      stdio: "ignore",
    });
    return true;
  } catch (error) {
    if (didInit) {
      try {
        rimraf.sync(path.join(root, ".git"));
      } catch (_) {
        /* Ignore error */
      }
    }
    return false;
  }
}
