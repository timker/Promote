import * as tl from 'azure-pipelines-task-lib/task';

export interface IAzureService
{
    /**
     * Retrieve the organisation name.
     */
    getOrganizationName() : string;
}

export class AzureService implements IAzureService
{
    /**
     * Retrieve the organisation name.
     */
    public getOrganizationName() : string {
        let teamFoundationServerUri:string = tl.getVariable("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI");

        if(teamFoundationServerUri == null || teamFoundationServerUri.trim() == "")
            throw new Error ("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI is not set");

        let regexGroup: RegExpMatchArray = teamFoundationServerUri.match(/(?:http[s]*:\/\/)(?:.*)(?:\/)(.*)(?:\/)/);

        if (regexGroup == null || regexGroup.length != 2)
            throw new Error("Organization name could not be found.");

        let organisationName = regexGroup[1];

        console.log(`Organisation name: ${organisationName}`);

        return organisationName;
    }
}