import {PackageDetails} from "../Interfaces/PackageDetails";
import {ClientBase} from "./ClientBase";
import {JsonPatchOperation, Operation, RequestBody} from "../Interfaces/NuGetArtifactInterfaces";
import {IHeaders, IRequestHandler} from "typed-rest-client/Interfaces";
import {HttpClient} from "typed-rest-client/HttpClient";

export interface INuGetArtifactAPI extends ClientBase
{
    updatePackageVersion(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails):Promise<void>;
}

export class NuGetArtifactAPI extends ClientBase implements INuGetArtifactAPI
{
    constructor()
    {
        super();
    }

    public async updatePackageVersion(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            try
            {
                let apiVersion = "5.0-preview.1";

                let options: IHeaders = this.createRequestOptions(
                    apiVersion);
                console.log(JSON.stringify(options));

                let handlers: IRequestHandler[] = this.createHandlers();

                let httpClient = new  HttpClient(
                    "haplo-promote",
                    handlers,
                    options);

                let requestData = NuGetArtifactAPI.createAddRequestBody(viewId);

                let headers = this.createRequestHeaders(apiVersion);

                let response = await httpClient.patch(
                    `https://pkgs.dev.azure.com/${this.OrganizationName}/_apis/packaging/feeds/${feedId}/nuget/packages/${packageDetails.name}/versions/${packageDetails.version}?api-version=${apiVersion}`,
                    JSON.stringify(requestData),
                    headers);

                let packageResponse = await this.processResponse<void>(
                    response,
                    null);

                console.log(`https://pkgs.dev.azure.com/${this.OrganizationName}/_apis/packaging/feeds/${feedId}/nuget/packages/${packageDetails.name}/versions/${packageDetails.version}?api-version=${apiVersion}`);
                console.log(JSON.stringify(packageResponse.statusCode));

                if(packageResponse.statusCode > 299)
                    reject(new Error(`Unsuccessful request, status code:${packageResponse.statusCode}`));

                resolve(packageResponse.result);
            }
            catch (error)
            {
                reject(error);
            }
        });
    }

    private static createAddRequestBody(
        viewId: string):RequestBody
    {
        let patchOperation: JsonPatchOperation = {} as JsonPatchOperation;
        patchOperation.op = Operation.add;
        patchOperation.path = "/views/-";
        patchOperation.value = viewId;

        let requestData: RequestBody = {} as RequestBody;
        requestData.listed = null;
        requestData.views = patchOperation;
        return requestData;
    }
}

