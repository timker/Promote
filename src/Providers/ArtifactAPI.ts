import {ClientBase} from "./ClientBase";
import {IHeaders, IRequestHandler, IRequestOptions} from "typed-rest-client/Interfaces";
import {RestClient} from "typed-rest-client/RestClient";
import {ArtifactResponse,JsonPatchOperation, Operation, RequestBody} from "../Interfaces/ArtifactInterfaces";
import {PackageDetails} from "../Interfaces/PackageDetails";
import {HttpClient} from "typed-rest-client/HttpClient";

export interface IArtifactAPI
{
    getPackages(
        feedId:string
    ) : Promise<ArtifactResponse>

    updatePackageVersion(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails,
        protocolType:string):Promise<void>;
}

export class ArtifactAPI extends ClientBase implements IArtifactAPI
{
    constructor()
    {
        super();
    }

    public getPackages(
        feedId: string) : Promise<ArtifactResponse>
    {
        return new Promise<ArtifactResponse> (async(resolve, reject) => {
            try
            {
                let apiVersion = "5.0-preview.1";

                let options:IRequestOptions = this.createRequestOptions(apiVersion);

                let handlers:IRequestHandler[] = this.createHandlers();

                let restClient = new RestClient(
                    "haplo-promote",
                    "https://pkgs.dev.azure.com",
                    handlers,
                    options);

                let pathAndQuery = `/${this.OrganizationName}/_apis/packaging/Feeds/${feedId}/packages?api-version=${apiVersion}`;

                let response = await restClient.get<ArtifactResponse>(pathAndQuery);

                resolve(response.result)
            }
            catch (error)
            {
                reject(error);
            }
        });
    }

    public async updatePackageVersion(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails,
        protocolType:string): Promise<void> {
        return new Promise<void> (async(resolve, reject) => {
            try
            {
                let apiVersion = "5.0-preview.1";

                let options: IHeaders = this.createRequestOptions(
                    apiVersion);

                let handlers: IRequestHandler[] = this.createHandlers();

                let httpClient = new  HttpClient(
                    "haplo-promote",
                    handlers,
                    options);

                let requestData = ArtifactAPI.createAddRequestBody(viewId);

                let headers = this.createRequestHeaders(apiVersion);

                let response = await httpClient.patch(
                    `https://pkgs.dev.azure.com/${this.OrganizationName}/_apis/packaging/feeds/${feedId}/${protocolType}/packages/${packageDetails.name}/versions/${packageDetails.version}?api-version=${apiVersion}`,
                    JSON.stringify(requestData),
                    headers);

                let packageResponse = await this.processResponse<void>(
                    response,
                    null);

                if(packageResponse.statusCode > 299)
                    new Error(`Unsuccessful request, status code:${packageResponse.statusCode}`);

                resolve(packageResponse.result);
            }
            catch (error)
            {
                reject(error);
            }
        });
    }

    static createAddRequestBody(
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