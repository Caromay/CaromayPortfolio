const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const localCacheRoot = path.join(
  os.tmpdir(),
  `caromay-portfolio-next-${crypto
    .createHash("sha1")
    .update(__dirname)
    .digest("hex")
    .slice(0, 10)}`
);
const localDevDistDir = path.join(localCacheRoot, ".next");
const localNodeModules = path.join(localCacheRoot, "node_modules");

if (process.env.NODE_ENV === "development") {
  fs.mkdirSync(localCacheRoot, { recursive: true });

  try {
    const nodeModulesInfo = fs.lstatSync(localNodeModules);
    const nodeModulesTarget = path.resolve(fs.realpathSync(localNodeModules));
    const projectNodeModules = path.resolve(__dirname, "node_modules");

    if (
      !nodeModulesInfo.isSymbolicLink() ||
      nodeModulesTarget !== projectNodeModules
    ) {
      throw new Error(
        `Expected ${localNodeModules} to link to the project node_modules.`
      );
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    fs.symlinkSync(
      path.join(__dirname, "node_modules"),
      localNodeModules,
      process.platform === "win32" ? "junction" : "dir"
    );
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir:
    process.env.NODE_ENV === "development"
      ? path.relative(__dirname, localDevDistDir)
      : ".next",
};

module.exports = nextConfig;
