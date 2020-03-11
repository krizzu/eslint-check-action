# Eslint check action

GitHub action running eslint check in your project, annotating errors/warnings in PR.


## Features

- Customizable
- Installs project dependencies if missing
- Annotates lines in PR with warnings and errors

## Usage

Add workflow to your project (ex. `.github/workflows/eslint.yml`):

```yaml
name: Lint
on: [push]
jobs:
  eslint_check:
    name: Prepare action
    runs-on: ubuntu-latest
    steps:
      # Checkout action must run prior to eslint check
    - name: Checkout 
      uses: actions/checkout@v1
    - name: Lint
      uses: Krizzu/eslint-check-action@v1.2.0
      with:
        ghToken: ${{ secrets.GITHUB_TOKEN }}
        eslintFiles: "lib, scripts"
        eslintConfig: "myConfigs/eslint.config.js",
        eslintExt: "ts, tsx"
```

### params

**eslintFiles**

Relative path to files/directories to run lint on.
Default: `.`


**eslintConfig**

Relative path to eslint config. Can either be `.js` config, `.eslintrc` or `package.json`.
Default: `.eslintrc`


**eslintExt**

File extension to run linting on.
Default: `js, ts, jsx, tsx`

## License

MIT.

