# 📂 Run dev CLI 📂

## Description

This is a CLI tool for running `npm run dev` on a selected project folder. It will prompt the user to select a project folder from a list of folders located in the `~/git` directory. Once a folder is selected, it will open the folder in your default IDE (e.g. VS Code) and launch the `npm run dev` command on the folder using the default shell. It also pipes the output of the command to the parent process.

## Installation

You can install this tool via npm:

`npm i -g @andrerodrigo/run-dev`

## Usage

To run the CLI tool, simply type `dev` in your terminal. The tool will prompt you to select a project folder from a list of folders, located in the `~/git` directory, with a `package.json` file and the `npm run dev` script. Once you select a folder, it will open the folder in your IDE and launch the `npm run dev` command on the folder using the default shell.

To stop the `npm run dev` command, press `CTRL+C` in the terminal.

## Dependencies

This tool depends on the following npm packages:

- `child_process`: Used to spawn a child process for running the `npm run dev` command.
- `graceful-fs`: Used to read the list of project folders from the `~/git` directory.
- `inquirer`: Used to prompt the user to select a project folder from a list of folders.
- `open`: Used to open the selected project folder in Visual Studio Code.
- `os`: Used to get the user's home directory path.
- `path`: Used to join directory paths and get the full path to the selected project folder.

## License

This project is licensed under the MIT License.
