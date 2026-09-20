---
layout: post
title: "TAR Vault Sync: From a Personal Need to a First Test Release in 24 Hours"
date: 2026-09-20 15:00:00 +0300
description: "How restoring my development workspaces led to TAR Vault Sync: technology choices, new ways of working with AI agents, and a first test release after 24 hours of work."
image: /assets/img/tar-vault-sync-24-hours-en.png
image_alt: "TAR Vault Sync: From Idea to First Test Release, 24 Hours. An encrypted vault connecting development folders and cloud sources."
tags:
  - software-development
  - ai-agents
  - rust
  - secret-management
  - devcontainer
lang: en-US
translation_key: "tar-vault-sync-fikirden-ilk-surume-24-saat"
permalink: /en/2026/09/20/tar-vault-sync-from-idea-to-first-release-in-24-hours.html
published: true
---

I work on several projects on the same computer. Each has its own folder, Docker configuration, environment variables, connection details, and supporting tools. Over time, each folder becomes a working environment built around the source code.

Cloning a project from Git is easy. Being able to pick up where I left off takes more than that.

The right `.env` file, an API key for a service, a private certificate, Git credentials… When one of these is missing, having the source code on my computer is not enough. I still have to spend time making the environment usable again.

That was the starting point for TAR Vault Sync: I wanted to restore my development workspaces more easily and securely. I also used that need to try new development methods with AI agents. **After 24 hours of work, the idea had become a working product, and its first test release was published.**

I admit there was a little laziness behind it, too. Once I have solved a setup problem, I do not want to solve it again every time I change computers or rebuild an environment. Those small tasks add up when I am working across several projects.

I already try to keep my development environment lightweight and portable. I described that approach in [an earlier post about my development environment](https://fmarslan.com/en/2025/12/01/my-development-environment-a-lightweight-portable-and-simple-approach.html). But portable tools do not automatically make all the information a project needs easy to move. Secrets are usually the most sensitive part.

At first, the answer seems straightforward: back up the workspace folders and restore them when needed.

But those folders can contain passwords, access tokens, private keys, and certificates. Copying everything to the cloud would also put information into the backup that I did not want there. The need to back up my working environment led me toward a solution built around secret management and synchronization.

My need went beyond keeping a password in a vault. I wanted that information to reach the right destination in the right project. One value might belong in an `.env` file, another in a specific JSON field, and another in a certificate file or Git Credential Manager.

Existing tools addressed different parts of the problem. When I could not find the combination that matched the way I work, I started defining the need more precisely and turning it into an application.

The idea was to make workspace setup and configuration without secrets portable, while keeping secret values in selected providers or encrypted vaults. The application would manage the mappings between those sources and local destinations.

For example, I should be able to define where a project's database password comes from and which field in which file receives it. When the password changes, I should not have to copy it manually to several places. When restoring an environment, I should not have to reconstruct those relationships from memory.

That approach shaped the architecture. Sources, targets, and the rules connecting them became separate responsibilities. Adding a secret source and supporting another file format became tasks that could be developed independently.

I did not want to operate a separate server or database for the application. A tool intended to simplify my working environment should not create another piece of infrastructure for me to maintain. I chose a local-first design that connects to selected cloud services when needed.

The first sources were a local vault, encrypted vaults stored in OneDrive and Google Drive, and Azure Key Vault. A file storage service such as Google Drive serves a different purpose from a secret service such as Azure Key Vault. With Drive, the application transfers a vault file encrypted on the device. With Key Vault, it retrieves secret values managed by the provider.

For the core, I chose to proceed with Rust. In an application dealing with files, sensitive data, and operating-system integrations, keeping the core and the native desktop interface around the same language fitted the structure I wanted. Tokio handles asynchronous work and scheduled operations.

The interface approach changed during development. Tauri appeared in the initial design; the implemented desktop interface uses `eframe/egui`. The management window runs directly in Rust without a browser-hosted interface or a local web server. The browser opened during cloud sign-in remains a separate authorization step.

These decisions followed the intended everyday experience: open the application, manage the vault, inspect the mappings, and see what happened.

I wanted the same simplicity in the development environment. I did not want to install another set of SDKs and toolchains on my computer for each project. I chose a workflow using a Dev Container for local development and core tests, with GitHub Actions for operating-system-specific builds.

Rust, Cargo, and development tools live inside the container. Windows, macOS, and Linux packages are prepared in their respective native CI environments. This makes the development setup easier to reproduce while keeping platform-specific verification on the appropriate platform. The current Azure connector's need for an Azure CLI session at runtime is a separate integration limitation of the first release.

Throughout development, I applied my usual verification discipline to this workflow. Compilation, automated tests, and real usage scenarios were separate checkpoints. I did not treat a passing test in a Linux container as proof that the Windows credential store or native macOS behavior had been verified.

Another important part of the project was having a concrete setting in which to test different ways of working with AI agents.

I already use agents in my daily development work. With this project, I tried new methodologies and tactics to test how well I could organize the work and how quickly I could move from an idea to a working product while retaining quality control.

I used different roles for preparing requirements, evaluating architectural decisions, planning development, implementing features, and conducting independent QA reviews. Defining the need, setting the scope, choosing priorities, and evaluating the result remained my responsibility. I directed the agents' work within those boundaries.

A substantial part of that work was defining when a feature could be considered complete, alongside specifying what to build. A secret must not appear in logs. A failed file update must preserve the existing file. An unavailable source must not damage a working target configuration. A claim that a phase was complete needed to be tied to the tests that verified it.

The first phase used fake source and target modules to verify the core behavior before introducing real cloud services. The encrypted local vault, file targets, Docker inputs, Git credentials, and cloud connections followed. Each step kept its scope and checkpoints explicit.

Making the details explicit mattered as much as speed. Updating an environment file for Docker does not mean a running container has started using the new value. The application needs to indicate that a restart is required. File updates and the container lifecycle were therefore kept separate in the initial implementation.

Similarly, being able to read and write a vault in the cloud is not enough. If another device has changed the vault, an older copy must not silently overwrite the newer data. Version checks and conflict handling were part of the cloud connectors for that reason.

For browser passwords, I limited the scope to behavior that could be supported. Instead of assuming continuous synchronization, I proceeded with CSV import requiring explicit user consent. I kept the distinction clear between wanting a feature on the roadmap and being able to provide it reliably in the current release.

On Windows, the OneDrive and Google Drive connections were verified with real accounts and test data. Alongside creating, reading, updating, locking, and reopening encrypted vaults, the checks covered rejecting attempts to overwrite data using an older revision. Azure scenarios included secret rotation and preserving an existing target when the source fails.

I handled distribution through GitHub. GitHub Actions prepared packages for Windows, macOS, and Linux on both AMD64 and ARM64. Native tests, builds, and basic execution checks preceded adding the packages to the release. SHA-256 checksums were also provided so downloaded files could be checked for integrity.

The first test release, [`v0.1.0-rc.1`](https://github.com/tarsolution/tarvaultsync/releases/tag/v0.1.0-rc.1), was published as a prerelease on September 20, 2026. Static documentation describing how to use the application and what it currently supports was also part of the delivery.

**Getting from the idea to that first release took 24 hours of work.** In that time, a personal need was defined, the architecture took shape, the core flows were developed and tested, and the result became packages that other people could try.

The first test release does not mean the entire roadmap is complete. Signed distribution, end-to-end acceptance on two physical devices, and real-account verification on macOS and Linux remain open. The desktop scheduler runs while the window is open; production-grade authentication for the independent agent mode is also a separate development task. I prefer to make those boundaries as visible as the working features.

For me, the value of this exercise is less about the amount of code produced in 24 hours and more about the usable flow established in that time. Testing new ways of organizing agent work against a real need, and taking the result to a downloadable first release, made the speed objective measurable.

My immediate goal is to restore my own development environments with less manual intervention. I want to organize secrets that become harder to manage as the number of projects grows, using explicitly defined sources and targets.

In the longer term, I want a tool that other developers can adapt to their own environments. Not everyone uses the same cloud provider, file formats, or development setup. Contributions drawn from those different needs can make the project more useful.

Contributing with AI agents is part of that approach. I want a project where people can define their own needs, develop with their agents, verify the results, and share their contributions. The source code and development roadmap are available in the [TAR Vault Sync repository](https://github.com/tarsolution/tarvaultsync).

The experience I want is simple: when I restore a workspace, I want to continue the work I left behind instead of starting a search for missing connection details.

---

**Explore TAR Vault Sync**

- [Project website and user guide](https://tarvault.tarsolution.com/)
- [GitHub — source code and development roadmap](https://github.com/tarsolution/tarvaultsync)
