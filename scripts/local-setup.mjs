#!/usr/bin/env zx
//import 'zx/globals'

info("Setting up repo...");
if (await hasGitLfs()) {
  info("GitLFS is installed");
} else {
  let installedViaBrew = false;
  if (process.platform === "darwin") {
    installedViaBrew = await installViaBrewIfAvailable()
  }

  if (!installedViaBrew) {
    const url = getPlatformSpecificGitLfsUrl();
    await downloadAndInstallGitLfs(url);
  }
  await setupGitLFS()
}

await $`yarn`;

info("Finished.");

async function installViaBrewIfAvailable() {
  try {
    trace("Checking if Homebrew is installed");
    await $`brew --version`;
    trace("Installing git-lfs via Homebrew");
    await $`brew update`;
    await $`brew install git-lfs`;
    return true;
  } catch (err) {
    warn("Homebrew is unavailable, performing manual install");
    return false;
  }
}

function getPlatformSpecificGitLfsUrl() {
  switch (process.platform) {
    case "darwin":
      if (process.arch === "x64") {
        trace("Detected Mac on x64");
        return "https://github.com/git-lfs/git-lfs/releases/download/v3.0.2/git-lfs-darwin-amd64-v3.0.2.zip";
      } else if (process.arch === "arm64") {
        trace("Detected Mac on arm64 (M1)");
        return "https://github.com/git-lfs/git-lfs/releases/download/v3.0.2/git-lfs-darwin-arm64-v3.0.2.zip";
      } else {
        err("Unexpected Mac architecture - please install git lfs manually");
        throw new Error("Unexpected Mac architecture");
      }

    case "linux":
      trace("Detected Linux, assuming x64");
      return "https://github.com/git-lfs/git-lfs/releases/download/v3.0.2/git-lfs-linux-amd64-v3.0.2.tar.gz";

    case "win32":
      err(
        "Detected Windows. Git LFS already comes with Git for Windows. Please ensure Git is installed."
      );
      throw new Error("Windows detected");

    default:
      err("Unknown platform");
      throw new Error("Unknown platform");
  }
}

async function downloadAndInstallGitLfs(url) {
  const extension = url.includes("zip") ? "zip" : "tar.gz";
  const filename = `gitlfs.${extension}`;

  trace("Creating temp dir");
  await $`mkdir -p temp`;
  cd("temp");

  info("Downloading GitLFS");
  await $`curl -L -o ${filename} ${url}`;

  info("Unpacking");
  if (extension === "zip") {
    await $`unzip ${filename}`;
  } else {
    await $`tar -xzf ${filename}`;
  }

  info("Installing GitLFS");
  await $`./install.sh`;
  cd("..");
  info("GitLFS Installed successfully");

  info("Cleanup temp files");
  await $`rm -rf temp`;
}

async function setupGitLFS() {
  trace("Setting up git lfs")
  await $`git lfs install`;
  await $`sudo git lfs install --system`;
}

function hasGitLfs() {
  return $`git lfs --version`
    .then((res) => {
      trace("Git LFS is present");
      return true;
    })
    .catch((res) => {
      warn("Git LFS is not present");
      return false;
    });
}

function err(msg) {
  console.log(chalk.red(msg));
}

function info(msg) {
  console.log(chalk.cyan(msg));
}

function trace(msg) {
  console.log(chalk.blue(msg));
}

function warn(msg) {
  console.log(chalk.yellow(msg));
}
