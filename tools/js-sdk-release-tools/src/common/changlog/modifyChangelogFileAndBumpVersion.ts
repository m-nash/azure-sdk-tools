import {Changelog} from "../../changelog/changelogGenerator.js";
import { updateUserAgent } from "../../xlc/codeUpdate/updateUserAgent.js";

import fs from 'fs';
import * as path from 'path';

const todayDate = new Date();
const dd = String(todayDate.getDate()).padStart(2, '0');
const mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = todayDate.getFullYear();

const date = yyyy + '-' + mm + '-' + dd;

export function makeChangesForFirstRelease(packageFolderPath: string, isStableRelease: boolean) {
    const packageJsonData: any = JSON.parse(fs.readFileSync(path.join(packageFolderPath, 'package.json'), 'utf8'));
    const newVersion = isStableRelease? '1.0.0' : '1.0.0-beta.1';
    const content = `# Release History
    
## ${newVersion} (${date})

### Features Added

The package of ${packageJsonData.name} is using our next generation design principles. To learn more, please refer to our documentation [Quick Start](https://aka.ms/azsdk/js/mgmt/quickstart).
`;
    fs.writeFileSync(path.join(packageFolderPath, 'CHANGELOG.md'), content, 'utf8');
    changePackageJSON(packageFolderPath, newVersion);
    updateUserAgent(packageFolderPath, newVersion);
}

export function makeChangesForMigrateTrack1ToTrack2(packageFolderPath: string, nextPackageVersion: string) {
    const packageJsonData: any = JSON.parse(fs.readFileSync(path.join(packageFolderPath, 'package.json'), 'utf8'));
    const content = `# Release History
    
## ${nextPackageVersion} (${date})

### Features Added

The package of ${packageJsonData.name} is using our next generation design principles since version ${nextPackageVersion}, which contains breaking changes.

To understand the detail of the change, please refer to [Changelog](https://aka.ms/js-track2-changelog).

To migrate the existing applications to the latest version, please refer to [Migration Guide](https://aka.ms/js-track2-migration-guide).

To learn more, please refer to our documentation [Quick Start](https://aka.ms/azsdk/js/mgmt/quickstart).
`;
    fs.writeFileSync(path.join(packageFolderPath, 'CHANGELOG.md'), content, 'utf8');
    changePackageJSON(packageFolderPath, nextPackageVersion);
    updateUserAgent(packageFolderPath, nextPackageVersion)
}

function changePackageJSON(packageFolderPath: string, packageVersion: string) {
    const data: string = fs.readFileSync(path.join(packageFolderPath, 'package.json'), 'utf8');
    const result = data.replace(/"version": "[0-9.a-z-]+"/g, '"version": "' + packageVersion + '"');
    fs.writeFileSync(path.join(packageFolderPath, 'package.json'), result, 'utf8');
}

export function makeChangesForReleasingTrack2(packageFolderPath: string, packageVersion: string, changeLog: Changelog, originalChangeLogContent: string, comparedVersion:string) {
    let pacakgeVersionDetail = `## ${packageVersion} (${date})`;
    if(packageVersion.includes("beta")){
        pacakgeVersionDetail +=`\nCompared with version ${comparedVersion}`
    }
    const modifiedChangelogContent = `# Release History
    
${pacakgeVersionDetail}
    
${changeLog.displayChangeLog()}
    
${originalChangeLogContent.replace(/.*Release History[\n\r]*/g, '')}`;

    fs.writeFileSync(path.join(packageFolderPath, 'CHANGELOG.md'), modifiedChangelogContent, {encoding: 'utf-8'});

    changePackageJSON(packageFolderPath, packageVersion);
    updateUserAgent(packageFolderPath, packageVersion);
}

export function makeChangesForPatchReleasingTrack2(packageFolderPath: string, packageVersion: string) {
    changePackageJSON(packageFolderPath, packageVersion);
    updateUserAgent(packageFolderPath, packageVersion);
}
