import * as tl from 'azure-pipelines-task-lib/task';
import {PackageService} from "./Services/PackageService";
import {AzureService} from "./Services/AzureService";
async function run() {
    try {
        let feedId: string = tl.getInput(
            "feed",
            true);

        let viewId: string = tl.getInput(
            "view",
            true);

        let packagePath: string = tl.getPathInput(
            "package",
            true,
            false);

        let foundPackagePath: string = AzureService.expandPackageWildcardPatterns(packagePath);

        let packageService = new PackageService();
        let packageDetails = packageService.getPackageDetailsFromPath(foundPackagePath);

        await packageService.promote(
            feedId,
            viewId,
            packageDetails);

        console.log("Successfully promoted packaged");
    }
    catch (error)
    {
        tl.setResult(
            tl.TaskResult.Failed,
            error.message);
    }
}

run();