import {ChangeFreq} from './change-freq.enum';
import {RelativePath} from '../../../url/relative-path';

export class SitemapEntry {

    private _url: RelativePath;
    private _lastmod: Date;
    private _changeFreq: ChangeFreq;
    private _priority: number;


    constructor(pageUrl: RelativePath, lastmod: Date, changeFreq: ChangeFreq = ChangeFreq.MONTHLY, priority: number = 0.5) {
        this._url = pageUrl;
        this._lastmod = lastmod;
        this._changeFreq = changeFreq;
        this._priority = priority;
    }

    public get url(): RelativePath {
        return this._url;
    }

    public get lastmod(): Date {
        return this._lastmod;
    }

    get lastmodUTC(): string {
        return this._lastmod.toUTCString();
    }

    get lastmodISO(): string {
        return this._lastmod.toISOString();
    }

    public get changeFreq(): ChangeFreq {
        return this._changeFreq;
    }

    public get changeFreqAsString(): string {
        return ChangeFreq[this._changeFreq].toLowerCase();
    }

    public get priority(): number {
        return this._priority;
    }
}
