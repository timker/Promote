import * as path from 'path';
import {PackageDetails} from "../Interfaces/PackageDetails";
import {ArtifactAPI} from "../Providers/ArtifactAPI";
import {ArtifactResponse} from "../Interfaces/ArtifactInterfaces";
import {NPMArtifactAPI} from "../Providers/NPMArtifactAPI";

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
     * @param feedType
     */
    promote(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails,
        feedType:string) : Promise<any>;

    /**
     * Get the protocol type
     * @param feedId Id of the feed the package is under
     */
    getPackageProtocolType(
        feedId:string) : Promise<string>
}

export class PackageService implements IPackageService
{
    /**
     * Gets the details of the package artifact
     * @param packagePath Path to the package artifact
     */
    public getPackageDetailsFromPath(
        packagePath: string) : PackageDetails {

        let fullFileName = packagePath.replace(/^.*[\\\/]/, '');
        if(fullFileName == null)
            throw new Error("[!] Invalid filename: " + fullFileName);

        let fileName = path.parse(fullFileName).name;

        let regexGroup: RegExpMatchArray = fileName.match(/^([a-zA-Z09.]+)[.](\S*)/);

        if (regexGroup == null || regexGroup.length != 3)
            throw new Error("[!] Invalid filename " + regexGroup);

        let name: string = regexGroup[1];
        let version: string = regexGroup[2];

        return new PackageDetails(name, version);
    }

    /**
     * Promote the respective package.
     * @param feedId Id of the feed
     * @param viewId
     * @param viewId
     * @param packageDetails
     * @param feedType
     */
    public async promote(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails,
        feedType:string) : Promise<any> {
        return new Promise<any> (async(resolve, reject) => {
            try
            {
                if(feedType == "nuget" || feedType == "upack" || feedType == "pypi")
                {
                    let artifactAPI = new ArtifactAPI();
                    resolve((await artifactAPI.updatePackageVersion(
                        feedId,
                        viewId,
                        packageDetails,
                        feedType)));
                }
                else if(feedType == "npm")
                {
                    let npmArtifactAPI = new NPMArtifactAPI();
                    resolve((await npmArtifactAPI.updatePackageVersion(
                        feedId,
                        viewId,
                        packageDetails,
                        feedType)));
                }
                else
                    throw new Error("Feed type: " + feedType + " is not supported");
            }
            catch(error)
            {
                reject(error);
            }
        });
    }

    /**
     * Get the protocol type for the the specified feed
     * @param feedId Id of the feed
     */
    public getPackageProtocolType(
        feedId: string): Promise<string> {
        return new Promise<string> (async(resolve, reject) => {
            try
            {
                let artifactAPI = new ArtifactAPI();
                let packages:ArtifactResponse = await artifactAPI.getPackages(
                    feedId);

                if(packages.count <= 0)
                    throw new Error("Could not determine feedtype, please make sure the packages exists within the feed");

                resolve(packages.value[0].protocolType.toLowerCase());
            }
            catch(error)
            {
                reject(error);
            }
        });
    }

    static isFeedTypeSupported(
        feedType:string):boolean
    {
        return feedType == "nuget" || feedType == "upack" || feedType == "pypi" || feedType == "npm";
    }
}