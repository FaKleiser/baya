import {Page} from '../page';
import {MetaData} from './meta-data';
import {OpenGraphData} from './open-graph-data';
import {JsonLD} from './json-ld';
import {HtmlPageOptions} from './html-options.interface';
import {RelativePath} from '../../../url/relative-path';
import {Language} from '../../../../platform/valueobject/language';
import {HtmlPageModule} from './modules/html-page-module';


export class HtmlPage extends Page {

    private _title: string;
    private _titleSuffixed: string[] = [];
    private _meta: MetaData;
    private _openGraphData: OpenGraphData;
    private _jsonLD: JsonLD;
    private _modules: HtmlPageModule[] = [];
    private _language: Language;
    private _alternates: Map<Language, RelativePath>;

    constructor(options: HtmlPageOptions) {
        super(options.url);
        this._language = options.language;
        this._title = options.title;
        this._alternates = options.alternates;
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

    public appendModule(module: HtmlPageModule): this {
        if (!module) {
            throw new TypeError('The module that should be appended to the website is undefined!');
        }
        if (module.moduleName()) {
            throw new Error('Module name is empty. Are you sure the given module implements the interface "WebsiteModule"?');
        }
        this._modules.push(module);
        return this;
    }

    public get language(): Language {
        return this._language;
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

    public get modules(): HtmlPageModule[] {
        return this._modules;
    }

    public get alternates(): Map<Language, RelativePath> {
        return this._alternates;
    }

    public withTitleSuffixed(...suffixes: string[]): this {
        this._titleSuffixed.unshift(...suffixes);
        return this;
    }
}
