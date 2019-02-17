import {ClientBase} from "./ClientBase";
import {IHeaders, IRequestHandler} from "typed-rest-client/Interfaces";
import {PackageDetails} from "../Interfaces/PackageDetails";
import {HttpClient} from "typed-rest-client/HttpClient";
import {ArtifactAPI} from "./ArtifactAPI";

export interface INPMArtifactAPI
{
    updatePackageVersion(
        feedId:string,
        viewId:string,
        packageDetails:PackageDetails,
        protocolType:string):Promise<void>;
}

export class NPMArtifactAPI extends ClientBase implements INPMArtifactAPI
{
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
                    `https://pkgs.dev.azure.com/${this.OrganizationName}/_apis/packaging/feeds/${feedId}/${protocolType}/${packageDetails.name}/versions/${packageDetails.version}?api-version=${apiVersion}`,
                    JSON.stringify(requestData),
                    headers);

                let packageResponse = await this.processResponse<void>(
                    response,
                    null);

                if(packageResponse.statusCode > 299)
                    throw new Error(`Unsuccessful request, status code:${packageResponse.statusCode}`);

                resolve(packageResponse.result);
            }
            catch (error)
            {
                reject(error);
            }
        });
    }
}