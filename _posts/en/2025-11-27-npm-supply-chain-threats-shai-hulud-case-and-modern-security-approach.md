---
layout: post
title: "NPM Supply-Chain Threats: Shai-Hulud Case and Modern Security Approach"
date: 2025-11-27
description: "Notes summarizing the Shai-Hulud attack and practical protection approach against NPM supply-chain risks."
image: /assets/img/npm-supply-chain-shai-hulud-cover.png
tags:
  - security
  - npm
  - supply-chain
  - devops
lang: en-US
translation_key: "npm-supply-chain-tehditleri-shai-hulud-ornegi-ve-modern-guvenlik-yaklasimi-e23d9772"
permalink: /en/2025/11/27/npm-supply-chain-threats-shai-hulud-case-and-modern-security-approach.html
---

As software development processes grew, attackers' focus began to shift from applications to developers' computers, CI/CD pipelines, and dependency chains. One of the most striking examples of this new generation of threats is the **Shai-Hulud** class supply-chain attacks.

In this article, I explain the basic principles of the attack, why it is extremely dangerous, and a practical defense approach that modern software teams can apply against such risks. In addition, the scripts and security automation mechanisms used in this context are shared as examples at the end of the article.

# 🎯 What is the Shai-Hulud Attack?

Shai-Hulud is a supply-chain attack that infiltrates developers' local environments, access keys, and CI/CD processes using the dependency loading mechanism.

The attack typically proceeds as follows:

### **1) Release of malicious package version**

The attacker spoofs the name of a popular package using a hijacked NPM maintainer account or typo-squatting method.

### **2) Automatic execution of malicious script during `npm install`**

While installing NPM packages, lifecycle scripts such as `install`, `postinstall`, `prepare` are automatically triggered.
The attacker uses this natural behavior to inject code into the system.

### **3) Collection of critical information on the machine**

The malicious script can collect the following data:

* Environment variables (ENV)
* Git access tokens
* SSH private keys
* Cloud provider credentials
* CI/CD access tokens
* Local setting files

### **4) Transmission of collected information to the attacker**

In some variants, the attacker creates a seemingly ordinary repo in the victim's Git account and uploads data there.
For example, seemingly innocent files like `environment.json` may actually contain leaked credentials.

### **5) Chain effect**

With this information, the attacker:

* Can hijack CI/CD pipelines
* Docker can push/pull registries
* Can access Kubernetes cluster management
* May release malicious versions of other packages
* Can gain permanent access in production environments

Therefore, this attack is a major risk that can spread from a single developer to the entire organization.

# ⚠️ Critical Note: Local Risks of DevOps and System Administrators

In fact, one of the biggest risks is:

**DevOps or system administrators** on local machines because it is practical:

* SSH keys
* Deployment credentials
* Cloud provider certificates
* Kubernetes kubeconfig files
* Admin tokens

It can store **full authorized access information** such as.

If a lifecycle script captures this information, the attacker can directly:

* CI/CD management
* Cloud account management
* Production infrastructure
* Registry access
* Corporate management layer

is opened.

For this reason, precautions taken against supply-chain attacks should especially cover local environments of high-authorized users.

# 🛡 Modern Supply-Chain Security Approach

The following approach provides practical and sustainable protection against this type of attack.

## **1) Lifecycle Script Scan (install / postinstall analysis)**

I'm using a small script that scans all packages in the dependency chain:

* `preinstall`
* `install`
* `postinstall`
* `prepare`

It automatically detects hooks such as
It works with every change and before release.

### **Sample scanning script – `tools/check-scripts.js`**

```js
#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TARGET_SCRIPTS = new Set(['preinstall', 'install', 'postinstall', 'prepare']);
const root = path.resolve('node_modules');
const results = [];

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function inspectPackage(pkgDir) {
  const pkgPath = path.join(pkgDir, 'package.json');
  if (!(await fileExists(pkgPath))) return;

  const raw = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts || {};
  const relevant = {};

  for (const key of TARGET_SCRIPTS) {
    if (scripts[key]) {
      relevant[key] = scripts[key];
    }
  }

  if (Object.keys(relevant).length > 0) {
    const suspicious = Object.values(relevant).some(cmd =>
      /curl|wget|node\s+-e|powershell|Invoke-WebRequest/i.test(cmd)
    );

    results.push({
      name: pkg.name,
      version: pkg.version,
      path: pkgDir,
      scripts: relevant,
      suspicious
    });
  }

  const nested = path.join(pkgDir, 'node_modules');
  if (await fileExists(nested)) {
    await walk(nested);
  }
}

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('@')) {
      await walk(full);
      continue;
    }
    await inspectPackage(full);
  }
}

async function main() {
  if (!(await fileExists(root))) {
    console.error('node_modules not found. Run npm ci first.');
    process.exit(1);
  }
  await walk(root);
  console.log(JSON.stringify(results, null, 2));
}

main();
```

## **2) Disabling Lifecycle Scripts in CI**

Each build is run as follows:

```bash
npm ci --ignore-scripts
```

In this way, no lifecycle script runs automatically.
Confirm manually if necessary:

```bash
npm rebuild
```

command can be used.

## **3) Automated Security Pipeline (Audit + Secret Scan + Lifecycle Analysis)**

With every dependency update and every release:1. `npm run scan:lifecycle`
2. `npm audit --production --audit-level=high`
3. `npx gitleaks detect --redact`
4. Reports are written to the `reports/security-check.log` file
5. Prevents CI/CD release in critical situations

This mechanism provides constant control against supply-chain attacks.

## **4) Secure Development in DevContainer**

When DevContainer first opens:

```bash
pnpm install --ignore-scripts
npm install --ignore-scripts
npm run scan:lifecycle
```

A rule like this is enforced.
Automatic script execution is prevented in the local environment.

## **5) Deterministic Installation (lockfile discipline)**

* Always with `package-lock.json` commit
* CI only works with `npm ci`
* Version fluctuation is prevented

This approach closes the most common vector of supply-chain infections.

# 🎯 Result

Shai-Hulud and similar attacks are a critical warning for modern software suites:
**Not only the code we produce, but also the chain we use must be protected.**

The approach described in this article:

* Lifecycle script analysis scanning the dependency chain
* Secure installation that prevents script execution in CI
* Audit and secret scanning mechanisms
* DevContainer security, including the local environment
* Lockfile discipline

Thanks to this, it significantly reduces supply-chain risks.

Each team can add more advanced security policies according to their structure, but this is the basic architecture; It is a modern, practical and sustainable starting point.
