import type { Linter } from 'eslint';

export interface BaseOptions {
  tsconfigRootDir: string;
  aliasGroups?: string[][];
}

export declare const base: (options: BaseOptions) => Linter.Config[];
export declare const reactConfig: Linter.Config[];
