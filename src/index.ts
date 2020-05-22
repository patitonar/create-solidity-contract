#!/usr/bin/env node
import chalk from "chalk";
import Commander from "commander";
import path from "path";
import prompts from "prompts";
import updateCheck from "update-check";

import packageJson from "../package.json";
import { createSolidityContract } from "./createSolidityContract";

let projectPath: string = "";

const program: Commander.Command = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("[project-directory]")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action(name => {
    projectPath = name || '';
  })
  .option(
    "-t, --template <name>",
    `
  A custom template to bootstrap the project with. You can use a template
  from the official repo.
`,
  )
  .allowUnknownOption()
  .parse(process.argv);

async function run() {
  projectPath = projectPath.trim();

  if (!projectPath) {
    const res: prompts.Answers<string> = await prompts({
      initial: "my-contract",
      message: "What is your project named?",
      name: "path",
      type: "text",
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log();
    console.log("Please specify the project directory:");
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`);
    console.log();
    console.log("For example:");
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green("my-contract")}`);
    console.log();
    console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);

  await createSolidityContract({
    appPath: resolvedProjectPath,
    template: (typeof program.template === "string" && program.template.trim()) || undefined,
  });
}

const update = updateCheck(packageJson).catch(() => null);

async function notifyUpdate() {
  try {
    const res: { latest: boolean } = await update;
    if (res?.latest) {
      console.log();
      console.log(chalk.yellow.bold("A new version of `create-solidity-contract` is available!"));
      console.log("You can update by running: yarn global add create-solidity-contract");
      console.log();
    }
  } catch {
    /* Ignore error */
  }
}

run()
  .then(notifyUpdate)
  .catch(async reason => {
    console.log();
    console.log("Aborting installation.");

    if (reason.command) {
      console.log(`  ${chalk.cyan(reason.command)} has failed.`);
    } else {
      console.log(chalk.red("Unexpected error. Please report it as a bug:"));
      console.log(reason);
    }
    console.log();

    await notifyUpdate();

    process.exit(1);
  });
