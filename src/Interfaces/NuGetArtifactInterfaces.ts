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

export class Operation {
    public static add: string = "add";
    public static copy: string = "copy";
    public static move: string = "move";
    public static remove: string = "remove";
    public static replace: string = "replace";
    public static test: string = "test";
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