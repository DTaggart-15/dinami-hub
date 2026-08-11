import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const BINARY_EXTENSIONS = new Set([
  '.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp3', '.mp4', '.pdf', '.png',
  '.webm', '.webp', '.woff', '.woff2', '.zip',
]);

const SECRET_RULES = Object.freeze([
  ['secret.github-token', /gh[pousr]_[A-Za-z0-9_]{20,}/g],
  ['secret.vercel-token', /vercel_[A-Za-z0-9]{20,}/g],
  ['secret.openai-key', /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/g],
  ['secret.google-key', /AIza[0-9A-Za-z_-]{20,}/g],
  ['secret.generic-assignment', /\b[A-Z][A-Z0-9_]*(?:API_KEY|ACCESS_TOKEN|AUTH_TOKEN|CLIENT_SECRET)\s*=\s*[^\s"']{8,}/g],
  ['secret.private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
]);

const SOURCE_RULES = Object.freeze([
  ['source.html-insertion', /\.innerHTML\s*=/g],
  ['source.eval', /\beval\s*\(/g],
  ['source.function-constructor', /\bnew\s+Function\b/g],
  ['source.inline-handler', /\son[a-z]+\s*=/gi],
]);

const CSP_RULES = Object.freeze([
  ['csp.unsafe-inline', /unsafe-inline/gi],
  ['csp.unsafe-eval', /unsafe-eval/gi],
]);

function normalizePath(filename) {
  return filename.replaceAll('\\', '/');
}

function filenameFindings(filename) {
  const normalized = normalizePath(filename);
  const name = basename(normalized).toLowerCase();
  const findings = [];

  if (name === '.env' || (name.startsWith('.env.') && name !== '.env.example')) {
    findings.push('filename.environment');
  }
  if (name === '.npmrc') findings.push('filename.npm-credentials');
  if (
    ['.key', '.pem', '.p12', '.pfx'].includes(extname(name)) ||
    /^(?:id_rsa|id_ed25519|credentials|service-account)(?:\.|$)/.test(name)
  ) {
    findings.push('filename.private-key');
  }

  return findings;
}

function matchesRule(text, pattern) {
  pattern.lastIndex = 0;
  return pattern.test(text);
}

export function scanText(filename, text) {
  const normalized = normalizePath(filename);
  const findings = new Set(filenameFindings(normalized));

  for (const [rule, pattern] of SECRET_RULES) {
    if (matchesRule(text, pattern)) findings.add(rule);
  }

  if (normalized === 'index.html' || /^src\/.*\.js$/.test(normalized)) {
    for (const [rule, pattern] of SOURCE_RULES) {
      if (matchesRule(text, pattern)) findings.add(rule);
    }
  }

  if (normalized === 'vercel.json') {
    for (const [rule, pattern] of CSP_RULES) {
      if (matchesRule(text, pattern)) findings.add(rule);
    }
  }

  return [...findings].sort();
}

function isBinaryPath(filename) {
  return BINARY_EXTENSIONS.has(extname(filename).toLowerCase());
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
}

async function scanWorkingTree() {
  const filenames = git(['ls-files', '-z']).split('\0').filter(Boolean);
  const findings = [];

  for (const filename of filenames) {
    const nameRules = filenameFindings(filename);
    if (nameRules.length) findings.push(...nameRules.map((rule) => ({ filename, rule })));
    if (isBinaryPath(filename)) continue;

    const text = await readFile(filename, 'utf8');
    if (text.includes('\0')) continue;
    for (const rule of scanText(filename, text).filter((rule) => !nameRules.includes(rule))) {
      findings.push({ filename, rule });
    }
  }

  return findings;
}

function scanHistory() {
  const commits = git(['rev-list', '--all']).split(/\r?\n/).filter(Boolean);
  const findings = [];

  for (const commit of commits) {
    const entries = git(['ls-tree', '-r', '-z', commit]).split('\0').filter(Boolean);
    for (const entry of entries) {
      const [metadata, filename] = entry.split('\t');
      const blob = metadata?.split(' ')[2];
      if (!filename || !blob) continue;

      const nameRules = filenameFindings(filename);
      for (const rule of nameRules) findings.push({ commit, filename, rule });
      if (isBinaryPath(filename)) continue;

      const text = git(['cat-file', 'blob', blob]);
      if (text.includes('\0')) continue;
      for (const rule of scanText(filename, text).filter((rule) => !nameRules.includes(rule))) {
        findings.push({ commit, filename, rule });
      }
    }
  }

  return findings;
}

async function main() {
  const history = process.argv.includes('--history');
  const findings = history ? scanHistory() : await scanWorkingTree();

  for (const finding of findings) {
    const prefix = finding.commit ? `${finding.commit.slice(0, 8)} ` : '';
    console.error(`${prefix}${finding.filename} ${finding.rule}`);
  }

  if (findings.length) {
    console.error(`Security scan failed with ${findings.length} finding(s).`);
    process.exitCode = 1;
  } else {
    console.log(history ? 'Git history security scan passed.' : 'Tracked source security scan passed.');
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) await main();
