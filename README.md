# Prettier-pre-commit

This script is designed to be run as a pre-commit hook.

When run, this script goes over all staged files, and runs prettier on them.
Prettier configuration may be provided in the standard config files (e.g. `package.json`).

When a file is changed by prettier, and is fully staged, the file is changed on disk and in the index (cache).

When a file is changed by prettier, but was only partially staged (e.g. when committing only a specific line), the file is only changed in the index - the file on disk remains as is to avoid overriding changes.

### Supported file types

Only the following extensions are currently supported, and they use their matching prettier parser:

	*.js: babylon
	*.jsx: babylon
	*.ts: typescript
	*.json: json
	*.md: markdown

