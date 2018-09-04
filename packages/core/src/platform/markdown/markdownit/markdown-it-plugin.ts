import {injectable, unmanaged} from 'inversify';

@injectable()
export abstract class MarkdownItPlugin {

    private _ruleName: string;
    private _tokenType: string;

    constructor(@unmanaged() ruleName: string, @unmanaged() tokenType: string) {
        this._ruleName = ruleName;
        this._tokenType = tokenType;
    }

    get ruleName(): string {
        return this._ruleName;
    }

    get tokenType(): string {
        return this._tokenType;
    }

    abstract pluginCallback(tokens: any, idx: any): void;
}
