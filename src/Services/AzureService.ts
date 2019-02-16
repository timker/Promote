import * as tl from 'azure-pipelines-task-lib/task';

export class AzureService
{
    /**
     * Retrieve the organisation name.
     */
    static getOrganizationName() : string {
        let teamFoundationServerUri:string = tl.getVariable("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI");

        if(teamFoundationServerUri == null || teamFoundationServerUri.trim() == "")
            throw new Error ("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI is not set");

        let regexGroup: RegExpMatchArray = teamFoundationServerUri.match(/(?:http[s]*:\/\/)(?:.*)(?:\/)(.*)(?:\/)/);

        if (regexGroup == null || regexGroup.length != 2)
        {
            regexGroup = teamFoundationServerUri.match(/(?:http[s]*:\/\/)(.[^.]*)(?:.*)/);

            if(regexGroup == null || regexGroup.length != 2)
                throw new Error("Organization name could not be found.");
        }

        console.log(`Organisation name: ${regexGroup[1]}`);

        return regexGroup[1];
    }

    static expandPackageWildcardPatterns(packagePattern: string): string {
        const matchedSolutionFiles = tl.findMatch(
            null,
            packagePattern,
            {
                followSymbolicLinks: false,
                followSpecifiedSymbolicLink: false,
                allowBrokenSymbolicLinks : true
            });

        tl.debug(`Found ${matchedSolutionFiles.length} solution files matching the pattern.`);

        if (matchedSolutionFiles.length > 0) {
            const result = matchedSolutionFiles[0];
            if (matchedSolutionFiles.length > 1)
                tl.warning(tl.loc('MultiplePackagesFound', result));

            return result;
        } else {
            throw tl.loc('PackageDoesNotExist', packagePattern);
        }
    }
}