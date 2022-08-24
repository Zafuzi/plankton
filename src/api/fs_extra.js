const {promises: fs} = require("fs");
const path = require("path");

async function copyDir(src, dest)
{
	
	let entries = await fs.readdir(src, {withFileTypes: true});
	
	await fs.mkdir(dest, {recursive: true});

	for(let entry of entries)
	{
		let srcPath = path.join(src, entry.name);
		let destPath = path.join(dest, entry.name);

		entry.isDirectory() ?
			await copyDir(srcPath, destPath) :
			await fs.copyFile(srcPath, destPath);
	}
}

module.exports = {copyDir};