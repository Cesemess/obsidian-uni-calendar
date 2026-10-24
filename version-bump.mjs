import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;
if (!targetVersion) {
  console.error("npm_package_version environment variable not set");
  process.exit(1);
}

// Read minAppVersion from manifest.json and bump version to targetVersion
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t") + "\n");

// Update versions.json with targetVersion and minAppVersion
let versions = {};
try {
  versions = JSON.parse(readFileSync("versions.json", "utf8"));
} catch (e) {
  versions = {};
}
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t") + "\n");
