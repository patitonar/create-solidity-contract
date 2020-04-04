import chalk from "chalk";
import fs from "fs";
import makeDir from "make-dir";
import path from "path";

import { downloadAndExtractTemplate, hasTemplate } from "./helpers/templates";
import { getOnline } from "./helpers/isOnline";
import { install } from "./helpers/install";
import { isFolderEmpty } from "./helpers/isFolderEmpty";
import { shouldUseYarn, shouldUseYarnWorkspaces } from "./helpers/yarn";
import { tryGitInit } from "./helpers/git";

export async function createSolidityContract({ appPath, template }: { appPath: string; template?: string }) {
  if (template) {
    const found = await hasTemplate(template);

    if (!found) {
      console.error(
        `Could not locate a template named ${chalk.red(`"${template}"`)}. Please check your spelling and try again.`,
      );
      process.exit(1);
    }
  }

  const root = path.resolve(appPath);
  const appName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  shouldUseYarn();
  shouldUseYarnWorkspaces();
  const isOnline = await getOnline();

  console.log(`Creating a new Ethereum-powered React app in ${chalk.green(root)}.`);
  console.log();

  await makeDir(root);
  process.chdir(root);

  if (template) {
    console.log(`Downloading files for template ${chalk.cyan(template)}. This might take a moment.`);
    console.log();
    await downloadAndExtractTemplate(root, template);

    /* Copy our default `.gitignore` if the application did not provide one */
    const ignorePath = path.join(root, ".gitignore");
    if (!fs.existsSync(ignorePath)) {
      fs.copyFileSync(path.join(__dirname, "gitignore"), ignorePath);
    }
  } else {
    const defaultTemplate = "truffle";
    console.log("Downloading template files. This might take a moment.");
    console.log();
    await downloadAndExtractTemplate(root, defaultTemplate);
  }

  console.log("Installing packages. This might take a couple of minutes.");
  console.log();

  await install(root, null, { isOnline });
  console.log();

  if (tryGitInit(root)) {
    console.log("Initialized a git repository.");
    console.log();
  }

  console.log(`${chalk.green("Success!")} Created ${appName} at ${appPath}`);
}
