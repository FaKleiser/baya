import {Page} from '../page';
import {MetaData} from './meta-data';
import {OpenGraphData} from './open-graph-data';
import {JsonLD} from './json-ld';
import {RelativePath} from '../../../url';
import {Language} from '../../../../platform/valueobject';
import * as React from 'react';


export class HtmlPage extends Page {

    private _title: string;
    private _titleSuffixed: string[] = [];
    private _meta: MetaData;
    private _openGraphData: OpenGraphData;
    private _jsonLD: JsonLD;
    private _content: React.ReactElement<any>[] = [];
    private _language: Language;
    private _alternates: Map<Language, RelativePath>;

    constructor(url: RelativePath) {
        super(url);
    }


    public withMetaData(meta: MetaData): this {
        this._meta = meta;
        return this;
    }

    public withOpenGraphData(openGraphData: OpenGraphData): this {
        this._openGraphData = openGraphData;
        return this;
    }

    public withJsonLD(jsonLD: JsonLD): this {
        this._jsonLD = jsonLD;
        return this;
    }

    public append(node: React.ReactElement<any>): this {
        if (!node) {
            throw new TypeError('The node that should be appended to the website is undefined!');
        }
        this._content.push(node);
        return this;
    }

    public get language(): Language {
        return this._language;
    }


    public set title(value: string) {
        this._title = value;
    }

    public get title(): string {
        return this._title;
    }

    public get titleSuffixed(): string {
        return [].concat(this.title, this._titleSuffixed).join(' | ');
    }

    public get meta(): MetaData {
        return this._meta;
    }

    public get openGraphData(): OpenGraphData {
        return this._openGraphData;
    }

    public get jsonLD(): JsonLD {
        return this._jsonLD;
    }

    public get content(): React.ReactElement<any>[] {
        return this._content;
    }

    public get alternates(): Map<Language, RelativePath> {
        return this._alternates;
    }

    public withTitleSuffixed(...suffixes: string[]): this {
        this._titleSuffixed.unshift(...suffixes);
        return this;
    }
}
