import {Website} from '../website';
import {RelativePath} from '../../url/relative-path';

/**
 * A page represents anything that is later accessible through a dedicated URL.
 */
export abstract class Page {

    constructor(private _url: RelativePath) {
        if (!this._url) {
            throw new Error('A page must have a URL!');
        }
    }

    public get url(): RelativePath {
        return this._url;
    }

}
