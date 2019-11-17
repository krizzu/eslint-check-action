/* eslint-disable camelcase */

type ActionOptionsType = {
  repoName: string;
  repoOwner: string;
  repoPath: string;
  prSha: string;
  eslintFiles: Array<string>;
  eslintConfig: string;
  eslintExtensions: Array<string>;
};

type GitHubAnnotationLevel = 'notice' | 'warning' | 'failure';

type GitHubAnnotation = {
  annotation_level: GitHubAnnotationLevel;
  end_column?: number;
  end_line: number;
  message: string;
  path: string;
  raw_details?: string;
  start_column?: number;
  start_line: number;
  title?: string;
};

type ReportCounts = {
  error: number;
  warning: number;
};
