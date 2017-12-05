const path = require('path'),
	fs = require('fs'),
	process = require('process'),
	git = require('git-utils'),
	prettier = require('prettier'),
	statuses = require('./git-status'),
	fileTypes = require('./file-types');

// Stages a file given its contents
// Does this by temporarily renaming the file that exists in the given path, writing a file, adding it to git
// and renaming the temp file back
// If the originalContents are the same as the file currently on disk, that file is altered instead
function stageFile(repo, gitPath, fullPath, sourceContents, formattedContents) {
	const tempPath = fullPath + '.renamed-for-partial-staged';
	if (fs.existsSync(tempPath)) {
		console.error(
			'File ' +
				tempPath +
				' already exists! Make sure the changes are included in ' +
				fullPath +
				' and delete this file, then retry running prettier.'
		);
		process.exit(1);
	}

	const originalFileExists = fs.existsSync(fullPath);
	const originalFileContents = originalFileExists && fs.readFileSync(fullPath, 'utf-8');
	const hasUnstagedChanges = sourceContents !== originalFileContents;

	if (originalFileExists && hasUnstagedChanges) {
		fs.renameSync(fullPath, tempPath);
	}
	try {
		fs.writeFileSync(fullPath, formattedContents);
		repo.add(gitPath);
	} finally {
		if (hasUnstagedChanges) {
			fs.unlinkSync(fullPath);

			if (originalFileExists) {
				fs.renameSync(tempPath, fullPath);
			}
		}
	}
}

// Open repository in current working directory
const repo = git.open('.');
const root = path.dirname(repo.getPath());

// Loop over all cached files
const files = repo.getStatus();
for (const file in files) {
	if (files.hasOwnProperty(file)) {
		const status = files[file];

		if (
			status & statuses.GIT_STATUS_INDEX_NEW ||
			status & statuses.GIT_STATUS_INDEX_MODIFIED ||
			status & statuses.GIT_STATUS_INDEX_RENAMED ||
			status & statuses.GIT_STATUS_INDEX_TYPECHANGE
		) {
			const fileType = fileTypes[path.extname(file)];
			if (fileType) {
				const fullPath = path.join(root, file);
				const source = repo.getIndexBlob(file);

				prettier.resolveConfig(fullPath).then(options => {
					options = options || {};
					options.parser = fileType;
					const formatted = prettier.format(source, options);
					if (formatted !== source) {
						console.log(file + ' has changes, staging...');
						stageFile(repo, file, fullPath, source, formatted);
					}
				});
			}
		}
	}
}
