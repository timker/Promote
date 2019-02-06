import * as tl from 'azure-pipelines-task-lib/task';
import {PackageService} from "./Services/PackageService";
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
            true);

        let packageService = new PackageService();
        let packageDetails = packageService.getPackageDetailsFromPath(packagePath);

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