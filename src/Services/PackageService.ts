import * as path from 'path';
import {PackageDetails} from "../Interfaces/PackageDetails";
import {NuGetArtifactAPI} from "../Providers/NuGetArtifactAPI";

export interface IPackageService
{
    /**
     * Get details from the package
     * @param packagePath Path to the package
     */
    getPackageDetailsFromPath(
        packagePath: string) : PackageDetails;

    /**
     * Promote the respective package.
     * @param feedId Id of the feed
     * @param viewId
     * @param packageDetails
     */
    promote(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails) : Promise<any>;
}

export class PackageService implements IPackageService
{
    /**
     * Gets the details of the package artifact
     * @param packagePath Path to the package artifact
     */
    public getPackageDetailsFromPath(
        packagePath: string) : PackageDetails {
        if (!this.pathContainsValidPackage(packagePath))
            throw new Error("[!] A valid path has not been specified.");

        let fullFileName = packagePath.replace(/^.*[\\\/]/, '');
        if(fullFileName == null)
            throw new Error("[!] Invalid filename: " + fullFileName);

        let fileName = path.parse(fullFileName).name;
        let extension = path.parse(fullFileName).ext;

        let regexGroup: RegExpMatchArray = fileName.match(/^([a-zA-Z09.]+)[.](\S*)/);

        if (regexGroup == null || regexGroup.length != 3)
            throw new Error("[!] Invalid filename " + regexGroup);

        let name: string = regexGroup[1];
        let version: string = regexGroup[2];

        return new PackageDetails(name, version, extension);
    }

    /**
     * Promote the respective package.
     * @param feedId Id of the feed
     * @param viewId
     * @param viewId
     * @param packageDetails
     */
    public async promote(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails) : Promise<any> {
        return new Promise<any> (async(resolve, reject) => {
            try
            {
                switch(packageDetails.extension)
                {
                    case ".nupkg":
                        let nuGetArtifactAPI = new NuGetArtifactAPI();
                        resolve((await nuGetArtifactAPI.updatePackageVersion(
                            feedId,
                            viewId,
                            packageDetails)));
                        break;

                    default:
                        reject(new Error("Package not supported: "+packageDetails.extension));
                        break;
                }
            }
            catch(error)
            {
                reject(error);
            }
        });
    }

    private pathContainsValidPackage(
        packagePath: string) : boolean {
        if (!packagePath || !packagePath.trim())
            return false;

        return packagePath.endsWith(".nupkg");
    }
}