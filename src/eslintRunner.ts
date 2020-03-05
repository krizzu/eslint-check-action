import { GitHub } from '@actions/github';
import { error as logError } from '@actions/core';
import eslint from 'eslint';
import path from 'path';

class EslintRunner {
  private name = 'Eslint Run';

  private kit: GitHub;

  private opts: ActionOptionsType;

  checkRunID: number = -1;

  constructor(ghToken: string, options: ActionOptionsType) {
    this.kit = new GitHub(ghToken);
    this.opts = options;
  }

  run = async () => {
    this.checkRunID = await this.startGitHubCheck();
    const report = this.runEslintCheck()!;
    const { success, annotations, counts } = this.prepareAnnotation(report);

    // if annotations are too large, split them into check-updates
    let restOfAnnotation = await this.handleAnnotations(annotations, counts);

    this.finishGitHubCheck(success, restOfAnnotation, counts);
  };

  private handleAnnotations = async (
    annotations: Array<GitHubAnnotation>,
    counts: ReportCounts
  ) => {
    let leftAnnotations = [...annotations];
    if (leftAnnotations.length > 50) {
      while (leftAnnotations.length > 50) {
        let toProcess = leftAnnotations.splice(0, 50);
        try {
          await this.updateAnnotation(toProcess, counts);
        } catch (e) {
          exitWithError(`Fail processing annotations: ${e.message}`);
        }
      }
    }
    return leftAnnotations;
  };

  private updateAnnotation = async (
    annotations: Array<GitHubAnnotation>,
    counts: ReportCounts
  ) => {
    try {
      await this.kit.checks.update({
        owner: this.opts.repoOwner,
        repo: this.opts.repoName,
        check_run_id: this.checkRunID,
        status: 'in_progress',
        output: {
          title: this.name,
          summary: `Found ${counts.error} error(s), ${counts.warning} warning(s).`,
          annotations,
        },
      });
    } catch (e) {
      exitWithError(e.message);
    }
  };

  private startGitHubCheck = async () => {
    let runId = -1;
    try {
      const response = await this.kit.checks.create({
        name: this.name,
        head_sha: this.opts.prSha,
        repo: this.opts.repoName,
        owner: this.opts.repoOwner,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      });

      runId = response.data.id;
    } catch (e) {
      exitWithError(e.message);
    }

    return runId;
  };

  private finishGitHubCheck = async (
    success: boolean,
    annotations: Array<GitHubAnnotation>,
    counts: ReportCounts
  ) => {
    try {
      await this.kit.checks.update({
        owner: this.opts.repoOwner,
        repo: this.opts.repoName,
        check_run_id: this.checkRunID,
        status: 'completed',
        completed_at: new Date().toISOString(),
        conclusion: success ? 'success' : 'failure',
        output: {
          title: this.name,
          summary: `Found ${counts.error} error(s), ${counts.warning} warning(s).`,
          annotations,
        },
      });
    } catch (e) {
      exitWithError(e.message);
    }
  };

  private pathRelative = (location: string) => {
    return path.resolve(this.opts.repoPath, location);
  };

  private runEslintCheck = () => {
    const cliOptions = {
      useEslintrc: false,
      configFile: this.pathRelative(this.opts.eslintConfig),
      extensions: this.opts.eslintExtensions,
      cwd: this.opts.repoPath,
    };

    try {
      const cli = new eslint.CLIEngine(cliOptions);
      const lintFiles = this.opts.eslintFiles.map(this.pathRelative);

      return cli.executeOnFiles(lintFiles);
    } catch (e) {
      exitWithError(e.message);

      return null;
    }
  };

  private prepareAnnotation = (report: eslint.CLIEngine.LintReport) => {
    // 0 - no error, 1 - warning, 2 - error
    const reportLevel = ['', 'warning', 'failure'];

    const githubAnnotations: Array<GitHubAnnotation> = [];
    report.results.forEach(result => {
      const { filePath, messages } = result;
      const path = filePath.replace(`${this.opts.repoPath}/`, '');

      for (let msg of messages) {
        const { ruleId, message, severity, endLine, line } = msg;

        const annotation: GitHubAnnotation = {
          path,
          start_line: line,
          end_line: endLine || line,
          annotation_level: reportLevel[severity] as GitHubAnnotationLevel,
          message: `${ruleId}: ${message}`,
        };

        githubAnnotations.push(annotation);
      }
    });

    return {
      success: report.errorCount === 0,
      annotations: githubAnnotations,
      counts: {
        error: report.errorCount,
        warning: report.warningCount,
      },
    };
  };
}

function exitWithError(errorMessage: string) {
  logError(errorMessage);
  process.exit(1);
}

export default EslintRunner;
