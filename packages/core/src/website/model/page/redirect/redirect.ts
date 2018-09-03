import {Page} from '../page';
import {Website} from '../../website';
import {RelativePath} from '../../../url/relative-path';

export class Redirect extends Page {

    private _to: string;

    constructor(from: RelativePath, to: string) {
        super(from);
        this._to = to;
    }

    public get to(): string {
        return this._to;
    }
}
