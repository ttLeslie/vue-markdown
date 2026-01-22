import type { Token } from 'markdown-it';
import type MarkdownIt from 'markdown-it';

export type TagAttribute = { [key: string]: string };

/**
 * 扩展的Token类型，增加组件类型标识
 */
export interface ExtendedToken extends Token {
  ComponentType?: string;
}

/**
 * 标签类型的Token，包含开闭标签和子节点
 */
export interface TagToken {
  tag: string;
  open: ExtendedToken;
  close?: ExtendedToken;
  children: RendererToken[];
  ComponentType: string;
  content?: string;
}

/**
 * 渲染器可用的Token类型（联合类型）
 */
export type RendererToken = ExtendedToken | TagToken;

/**
 * 代码块信息类型（供插槽使用）
 */
export interface FenceInfo {
  lang: string;
  rawCode: string;
}

/**
 * Markdown渲染器组件的属性类型
 */
export interface MarkdownRendererProps {
  content?: string;
  mdIt?: MarkdownIt;
  breaks?: boolean;
  html?: boolean;
  href?: boolean;
}

/**
 * Markdown渲染器的事件类型
 */
export interface MarkdownRendererEmits {
  (e: 'link-click', href: string | undefined, title: string | undefined): void;
}
// 支持的语言数组（基于highlight.js的SUPPORTED_LANGUAGES.md整理）
export const SUPPORTED_LANGUAGES = [
  // 基础语言及常用语言
  'plaintext',
  'txt',
  'text',
  'markdown',
  'md',
  'mkdown',
  'mkd',
  'xml',
  'html',
  'xhtml',
  'rss',
  'atom',
  'xjb',
  'xsd',
  'xsl',
  'plist',
  'svg',
  'css',
  'scss',
  'less',
  'javascript',
  'js',
  'jsx',
  'typescript',
  'ts',
  'tsx',
  'mts',
  'cts',
  'java',
  'python',
  'py',
  'gyp',
  'python-repl',
  'pycon',
  'ruby',
  'rb',
  'gemspec',
  'podspec',
  'thor',
  'irb',
  'php',
  'c',
  'cpp',
  'c++',
  'c#',
  'cs',
  'go',
  'golang',
  'rust',
  'rs',
  'swift',
  'kotlin',
  'scala',
  'perl',
  'pl',
  'pm',
  'perl6',
  'raku',
  'r',
  'matlab',
  'octave',

  // 标记语言及文档格式
  'markdown',
  'md',
  'mkdown',
  'mkd',
  'asciidoc',
  'adoc',
  'latex',
  'tex',
  'bibtex',
  'rst',
  'restructuredtext',

  // 脚本及配置文件
  'bash',
  'sh',
  'shell',
  'console',
  'batch',
  'bat',
  'powershell',
  'ps',
  'ps1',
  'json',
  'json5',
  'jsonc',
  'yaml',
  'yml',
  'toml',
  'ini',
  'properties',

  // 框架及库相关
  'react',
  'vue',
  'svelte',
  'angular',
  'ember',
  'hbs',
  'glimmer',
  'html.hbs',
  'html.handlebars',
  'htmlbars',

  // 数据库相关
  'sql',
  'mysql',
  'postgresql',
  'pgsql',
  'postgres',
  'sqlite',
  'tsql',
  'plsql',

  // 其他语言
  'clojure',
  'clj',
  'elixir',
  'elm',
  'erlang',
  'erl',
  'fsharp',
  'fs',
  'fsx',
  'fsi',
  'fsscript',
  'haskell',
  'hs',
  'lua',
  'pluto',
  'luau',
  'ocaml',
  'ml',
  'pascal',
  'pawn',
  'php',
  'prolog',
  'scala',
  'scheme',
  'smalltalk',
  'st',
  'solidity',
  'sol',
  'swift',
  'tcl',
  'tk',
  'vb',
  'visual-basic',
  'dart',
  'go',
  'groovy',
  'kotlin',
  'nim',
  'rust',
  'scala',
  'swift',
  'zig',
];
