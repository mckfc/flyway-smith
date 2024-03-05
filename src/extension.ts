import * as vscode from 'vscode';
import * as path from 'path';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flyway-smith" is now active!');

	let disposable_V = vscode.commands.registerCommand('flyway-migration-helper.createVersionedMigration', async (folder: vscode.Uri) => {
		const name = await vscode.window.showInputBox({ prompt: 'Enter the name of the versioned migration' });
		if (name) {
			const sanitized_name = getSanitizedName(name);
			const fileName = `V${formatDate(new Date())}__${sanitized_name}.sql`;
			await crateFile(folder.fsPath, fileName);
		}
	});
	context.subscriptions.push(disposable_V);

	let disposable_R = vscode.commands.registerCommand('flyway-migration-helper.createRepeatedMigration', async (folder: vscode.Uri) => {
		const name = await vscode.window.showInputBox({ prompt: 'Enter the name of the repeated migration' });
		if (name) {
			const sanitized_name = getSanitizedName(name);
			const fileName = `R__${sanitized_name}.sql`;
			await crateFile(folder.fsPath, fileName);
		}
	});

	context.subscriptions.push(disposable_R);
}

async function crateFile(dest: string, fileName: string) {
	const uri = vscode.Uri.file(path.join(dest, fileName));
	await vscode.workspace.fs.writeFile(uri, new Uint8Array());

	vscode.window.showInformationMessage(`File ${fileName} created.`);
}

function getSanitizedName(name: string): string {
	return name.replace(/\s+/g, ' ').trim().replace(/ /g, '_').toLowerCase();
}

function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = date.getUTCDate().toString().padStart(2, '0');
	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');
	const seconds = date.getUTCSeconds().toString().padStart(2, '0');

	return `${year}.${month}.${day}.${hours}.${minutes}.${seconds}`;
}

// This method is called when your extension is deactivated
export function deactivate() { }
