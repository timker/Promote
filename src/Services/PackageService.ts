import {PackageDetails} from "../Interfaces/PackageDetails";
import {ArtifactApi} from "../Providers/ArtifactApi";
import {ArtifactResponse} from "../Interfaces/ArtifactInterfaces";
import {NpmArtifactApi} from "../Providers/NpmArtifactApi";

export interface IPackageService
{
    /**
     * Get details from the package
     * @param packagePath Path to the package
     * @param feedType
     */
    getPackageDetailsFromPath(
        packagePath: string,
        feedType: string) : PackageDetails;

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
     * @param feedType
     */
    public getPackageDetailsFromPath(
        packagePath: string,
        feedType: string) : PackageDetails {

        let fileName = packagePath.replace(/^.*[\\\/]/, '');
        if(fileName == null)
            throw new Error("[!] Invalid full filename: " + fileName);

        let regexGroup: RegExpMatchArray;

        switch (feedType) {
            case "nuget" :
                regexGroup = fileName.match(/^(.*?)\.((?:\.?[0-9]+){3,}(?:[-a-z]+)?)\.nupkg$/);
                break;

            case "npm" :
                regexGroup = fileName.match(/^(.*?)-((?:\.?[0-9]+){3,}(?:[-a-z]+)?)\.tgz$/);
                break;

            case "pypi" :
                regexGroup = fileName.match(/^(.*?)-([._0-9a-zA-Z]+)(?:-(.*))\.whl$/);
                break;

            default :
                throw new Error("Package not supported");
        }

        if (regexGroup == null || regexGroup.length < 3)
            throw new Error("[!] Invalid filename " + regexGroup);

        let name: string = regexGroup[1];
        let version: string = regexGroup[2];

        console.log(`Package name: ${name}`);
        console.log(`Package version: ${version}`);

        return new PackageDetails(name, version);
    }

    /**
     * Promote the respective package.
     * @param feedId Id of the feed
     * @param viewId Id of the view
     * @param packageDetails Details of the package
     * @param feedType Type of the feed
     */
    public async promote(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails,
        feedType:string) : Promise<any> {

        if(feedType == "nuget" || feedType == "pypi") {
            let artifactAPI = new ArtifactApi();
            return await artifactAPI.updatePackageVersion(
                feedId,
                viewId,
                packageDetails,
                feedType);
        
        } else if(feedType == "npm") {

            let npmArtifactAPI = new NpmArtifactApi();
            return await npmArtifactAPI.updatePackageVersion(
                feedId,
                viewId,
                packageDetails,
                feedType);
        
        } else
            throw new Error("Feed type: " + feedType + " is not supported");
    }

    /**
     * Get the protocol type for the the specified feed
     * @param feedId Id of the feed
     */
    public async getPackageProtocolType(
        feedId: string): Promise<string> {

        let artifactAPI = new ArtifactApi();
        let packages:ArtifactResponse = await artifactAPI.getPackages(feedId);

        if(packages.count <= 0)
            throw new Error("Could not determine feedtype, please make sure the packages exists within the feed.");

        return packages.value[0].protocolType.toLowerCase();
    }

    static isFeedTypeSupported(feedType:string):boolean
    {
        return feedType == "nuget" || feedType == "pypi" || feedType == "npm";
    }
}