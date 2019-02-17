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

        let packageService = new PackageService();
        let feedType = await packageService.getPackageProtocolType(feedId);

        if(!PackageService.isFeedTypeSupported(feedType))
            throw new Error("Feed type:" +feedType+" is not supported");

        let foundPackagePath: string = AzureService.expandPackageWildcardPatterns(packagePath);

        let packageDetails = packageService.getPackageDetailsFromPath(foundPackagePath);

        await packageService.promote(
            feedId,
            viewId,
            packageDetails,
            feedType);

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