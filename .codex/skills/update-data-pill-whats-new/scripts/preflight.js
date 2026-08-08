#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fail(message) {
    console.error(`PREFLIGHT_FAILED: ${message}`);
    process.exitCode = 1;
}

function readVersion(value, label) {
    const match = String(value || "").match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/);
    if (!match) {
        throw new Error(`${label} is missing or invalid: ${value || "<empty>"}`);
    }
    return [Number(match[1]), Number(match[2] || 0), Number(match[3] || 0)];
}

function compareVersions(left, right) {
    for (let index = 0; index < 3; index += 1) {
        if (left[index] !== right[index]) return left[index] - right[index];
    }
    return 0;
}

function findMarketingVersions(projectText) {
    return [...projectText.matchAll(/MARKETING_VERSION\s*=\s*([^;]+);/g)]
        .map((match) => match[1].trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
}

function main() {
    const websiteRoot = path.resolve(process.argv[2] || process.cwd());
    const iosRoot = path.resolve(process.argv[3] || "/Users/windversi/Desktop/Data Pill App /Data-Pill-iOS");
    const requestedVersion = process.argv[4] || "";
    const allowExisting = process.argv.includes("--allow-existing");
    const xcodeProject = path.join(iosRoot, "Data Pill.xcodeproj");
    const projectFile = path.join(xcodeProject, "project.pbxproj");
    const whatsNewFile = path.join(websiteRoot, "whats-new.html");

    if (!fs.existsSync(iosRoot) || !fs.statSync(iosRoot).isDirectory()) {
        return fail(`iOS project path does not exist: ${iosRoot}. Provide the correct Data Pill iOS project directory.`);
    }
    if (!fs.existsSync(xcodeProject) || !fs.statSync(xcodeProject).isDirectory()) {
        return fail(`Data Pill.xcodeproj was not found inside ${iosRoot}. Provide the directory containing Data Pill.xcodeproj.`);
    }
    if (!fs.existsSync(projectFile)) {
        return fail(`Xcode project file is missing: ${projectFile}. Verify the project is complete.`);
    }
    if (!fs.existsSync(whatsNewFile)) {
        return fail(`Website What’s New page was not found: ${whatsNewFile}. Run this from the website project or provide its path.`);
    }

    let projectText;
    let whatsNewText;
    try {
        projectText = fs.readFileSync(projectFile, "utf8");
        whatsNewText = fs.readFileSync(whatsNewFile, "utf8");
    } catch (error) {
        return fail(`Could not read project files: ${error.message}`);
    }

    let marketingVersions;
    try {
        marketingVersions = findMarketingVersions(projectText).map((version) => readVersion(version, "MARKETING_VERSION"));
    } catch (error) {
        return fail(`${error.message}. Verify the main Data Pill app target version in Xcode.`);
    }
    if (marketingVersions.length === 0) {
        return fail(`No MARKETING_VERSION was found in ${projectFile}. Verify the main Data Pill app target version in Xcode.`);
    }

    const appVersion = marketingVersions.reduce((highest, version) => compareVersions(version, highest) > 0 ? version : highest);
    const releaseMatches = [...whatsNewText.matchAll(/(?:v|version\s*)(\d+(?:\.\d+){1,2})/gi)];
    if (releaseMatches.length === 0) {
        return fail(`No release version was found in ${whatsNewFile}. Add or repair the existing What’s New version footer before continuing.`);
    }

    const websiteVersions = releaseMatches.map((match) => readVersion(match[1], "website release version"));
    const latestWebsiteVersion = websiteVersions.reduce((highest, version) => compareVersions(version, highest) > 0 ? version : highest);
    const duplicate = websiteVersions.some((version) => compareVersions(version, appVersion) === 0);
    if (duplicate && !allowExisting) {
        return fail(`Version ${appVersion.join(".")} already exists in ${whatsNewFile}. Confirm whether the existing entry should be edited manually.`);
    }
    const isExistingReleaseSync = allowExisting && duplicate && compareVersions(appVersion, latestWebsiteVersion) === 0;
    if (compareVersions(appVersion, latestWebsiteVersion) <= 0 && !isExistingReleaseSync) {
        return fail(`iOS project version is ${appVersion.join(".")} and the latest website version is ${latestWebsiteVersion.join(".")}. The iOS version must be newer; no update is needed.`);
    }
    if (requestedVersion) {
        const requested = readVersion(requestedVersion, "requested version");
        if (compareVersions(requested, appVersion) !== 0) {
            return fail(`Requested version ${requestedVersion} does not match the iOS project marketing version ${appVersion.join(".")}. Update the Xcode version or run the skill with the matching version.`);
        }
    }

    console.log(JSON.stringify({
        ok: true,
        iosRoot,
        xcodeProject,
        appVersion: appVersion.join("."),
        latestWebsiteVersion: latestWebsiteVersion.join("."),
        requestedVersion: requestedVersion || appVersion.join("."),
        existingReleaseUpdate: duplicate
    }, null, 2));
}

main();
