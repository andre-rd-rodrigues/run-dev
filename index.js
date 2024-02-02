#!/usr/bin/env node

import fs from "graceful-fs";
import inquirer from "inquirer";
import { spawn, exec } from "child_process";
import os from "os";
import path from "path";
import getPort from "get-port";
import inquirerPrompt from "inquirer-autocomplete-prompt";

const gitFolder = path.join(os.homedir(), "git");

inquirer.registerPrompt("autocomplete", inquirerPrompt);

// Get all folder names in git folder
const folderNames = fs
  .readdirSync(gitFolder, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

let devProcess = null;

const startDevProcess = (selectedFolder) => {
  devProcess = spawn("npm", ["run", "dev"], {
    cwd: path.join(gitFolder, selectedFolder),
    stdio: ["inherit", "inherit", "pipe"] // Pipe stdout to parent process
  });

  // Log errors to console
  devProcess.on("error", (error) => {
    console.error(`Failed to start npm run dev: ${error}`);
  });

  // Log exit status to console
  devProcess.on("exit", (code, signal) => {
    if (signal) {
      console.log(`npm run dev was terminated by signal ${signal}`);
    } else if (code !== 0) {
      console.error(`npm run dev exited with code ${code}`);
    } else {
      console.log(`npm run dev exited normally`);
    }
  });

  // Pipe output from child process to parent process
  if (devProcess.stdout !== null) {
    devProcess.stdout.pipe(process.stdout);
  }
};

const stopDevProcess = () => {
  if (devProcess) {
    devProcess.kill();
  }
};

const validateFolder = (folderName) => {
  const packageJsonPath = path.join(gitFolder, folderName, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

    if (packageJson && packageJson.scripts && packageJson.scripts["dev"]) {
      return true;
    }
  }

  return false;
};

// Prompt user to select a folder
inquirer
  .prompt([
    {
      type: "autocomplete",
      name: "folderName",
      message: "💻 Select a project to run:",
      source: async (answers, input) => {
        const searchTerm = input || "";
        const filteredFolders = folderNames
          .filter(validateFolder)
          .filter((folder) =>
            folder.toLowerCase().includes(searchTerm.toLowerCase())
          );

        return filteredFolders.length === 0
          ? ["No matching projects"]
          : filteredFolders;
      }
    }
  ])
  .then(async (answers) => {
    const selectedFolder = answers.folderName;
    const selectedFolderFullPath = path.join(gitFolder, selectedFolder);

    const availablePort = await getPort({
      port: [3000, 3001, 3002, 3003, 3004]
    });

    exec(
      `cd ${selectedFolderFullPath} && code . && open http://localhost:${availablePort}`,
      (error) => {
        if (error) {
          console.error(`Failed to run commands: ${error}`);
          return;
        }
      }
    );

    startDevProcess(selectedFolder);

    // Handle CTRL+C event
    process.on("SIGINT", () => {
      console.log("Stopping dev process...");
      stopDevProcess();
      process.exit();
    });
  })
  .catch((error) => {
    console.error(error);
  });
