export interface ArtifactResponse
{
    count: number

    value: Package[]
}

export interface Package
{
    protocolType:string
}

export interface RequestBody {
    /**
     * Indicates the listing state of a package
     */
    listed: boolean

    /**
     * The view to which the package version will be added
     */
    views: JsonPatchOperation
}

export interface JsonPatchOperation {
    /**
     * The path to copy from for the Move/Copy operation.
     */
    from: string

    /**
     * The patch operation
     */
    op: string

    /**
     * The path for the operation
     */
    path: string

    /**
     * The value for the operation. This is either a primitive or a JToken.
     */
    value: string
}

export const Operation = {
    add:  "add",
    copy:  "copy",
    move:  "move",
    remove:  "remove",
    replace:  "replace",
    test:  "test"
 } as const;

export interface RequestBody {
    /**
     * Indicates the listing state of a package
     */
    listed: boolean

    /**
     * The view to which the package version will be added
     */
    views: JsonPatchOperation
}