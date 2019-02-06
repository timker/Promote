export class PackageDetails
{
    constructor(
        name:string,
        version:string,
        extension:string,
    ){
        this.name = name;
        this.version = version;
        this.extension = extension;
    }
    name:string;
    version:string;
    extension:string;
}