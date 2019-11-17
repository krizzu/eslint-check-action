/* eslint-disable typescript/no-non-null-assertion */

import { getInput } from '@actions/core';
import EslintRunner from './eslintRunner';

const { GITHUB_REPOSITORY, GITHUB_WORKSPACE, GITHUB_SHA } = process.env;

function parseInputArray(input: string) {
  return input
    .split(',')
    .reduce((acc, current) => [...acc, current.trim()], [] as Array<string>);
}

const [repoOwner, repoName] = GITHUB_REPOSITORY!.split('/');

const ghToken = getInput('ghToken', {
  required: true,
});

const eslintFiles = getInput('eslintFiles') || '.'; // all files by default
const eslintConfig = getInput('eslintConfig') || '.eslintrc'; // .eslintrc by default
const eslintExtensions = getInput('eslintExt') || 'js, ts, jsx, tsx';

const options: ActionOptionsType = {
  repoName,
  repoOwner,
  repoPath: GITHUB_WORKSPACE!,
  prSha: GITHUB_SHA!,
  eslintFiles: parseInputArray(eslintFiles),
  eslintConfig,
  eslintExtensions: parseInputArray(eslintExtensions),
};

const action = new EslintRunner(ghToken, options);
action.run();
