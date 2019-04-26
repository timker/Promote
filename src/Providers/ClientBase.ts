import {IHeaders, IRequestHandler, IRequestOptions} from "typed-rest-client/Interfaces";
import {HttpClientResponse, HttpCodes} from "typed-rest-client/HttpClient";
import {IRequestOptions as RestClientIRequestOptions, IRestResponse} from "typed-rest-client/RestClient";
import {AzureService} from "../Services/AzureService";
import {getEndpointAuthorization}  from "azure-pipelines-task-lib/task";
import {getHandlerFromToken} from "azure-devops-node-api";

export interface IClientBase
{
    createAcceptHeader(
        type: string,
        apiVersion?: string): string;

    createRequestOptions(
        type: string,
        apiVersion?: string): IRequestOptions;

    createHandlers(): IRequestHandler[];

    createRequestHeaders(
        apiVersion?: string):IHeaders;

    processResponse<T>(
        res: HttpClientResponse,
        options: RestClientIRequestOptions): Promise<IRestResponse<T>>
}

export class ClientBase implements IClientBase
{
    public readonly OrganizationName:string;
    constructor() {
        this.OrganizationName = AzureService.getOrganizationName();
    }

    public createAcceptHeader(
        type: string,
        apiVersion?: string): string {
        return type + (apiVersion ? (';api-version=' + apiVersion) : '');
    }

    public createRequestOptions(
        apiVersion?: string):IRequestOptions {
        let options: IRequestOptions = {} as IRequestOptions;
        options.allowRedirects = true;
        options.headers = this.createRequestHeaders(apiVersion);
        return options;
    }

    public createRequestHeaders(
        apiVersion?: string):IHeaders
    {
        return {
            accept: this.createAcceptHeader('application/json', apiVersion),
            ["Content-Type"] : "application/json"
        };
    }

    public dateTimeDeserializer(
        key: any,
        value: any): any {
        if (typeof value === 'string'){
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }

        return value;
    }

    public async processResponse<T>(
        res: HttpClientResponse,
        options: RestClientIRequestOptions): Promise<IRestResponse<T>> {
        return new Promise<IRestResponse<T>>(async (resolve, reject) => {
            const statusCode: number = res.message.statusCode;

            const response: IRestResponse<T> = {
                statusCode: statusCode,
                result: null,
            };

            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }

            let obj: any;

            // get the result from the body
            try {
                let contents: string = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, this.dateTimeDeserializer);
                    } else {
                        obj = JSON.parse(contents);
                    }
                    if (options && options.responseProcessor) {
                        response.result = options.responseProcessor(obj);
                    }
                    else {
                        response.result = obj;
                    }
                }
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }

            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg: string;

                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                } else {
                    msg = "Failed request: (" + statusCode + ")";
                }

                let err: Error = new Error(msg);

                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }

                reject(err);
            } else {
                resolve(response);
            }
        });
    }


    public createHandlers = () => [getHandlerFromToken(this.getAuthToken())];

    private getAuthToken():string{
        let auth = getEndpointAuthorization('SYSTEMVSSCONNECTION', false);
        if (auth && auth.scheme === 'OAuth') {
            return auth.parameters['AccessToken'];
        }
        throw new Error("SYSTEMVSSCONNECTION is not valid");
    }
}