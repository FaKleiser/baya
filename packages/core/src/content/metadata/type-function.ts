export interface TypeOptions {
    newObject: any;
    object: Object;
    property: string;
}

export interface TypeFunction {
    (options?: TypeOptions): Function;
}
