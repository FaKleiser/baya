export class OpenGraphData {
    private _title: string;
    private _type: OpenGraphData.OpenGraphType;
    private _image: string;
    private _url: string;
    private _description: string;

    public withTitle(title: string): this {
        this._title = title;
        return this;
    }

    public withType(type: OpenGraphData.OpenGraphType): this {
        this._type = type;
        return this;
    }

    public withImage(image: string): this {
        this._image = image;
        return this;
    }

    public withUrl(url: string): this {
        this._url = url;
        return this;
    }

    public withDescription(description: string): this {
        this._description = description;
        return this;
    }

    public get description(): string {
        return this._description;
    }

    public get title(): string {
        return this._title;
    }

    public get type(): string {
        return this._type;
    }

    public get image(): string {
        return this._image;
    }

    public get url(): string {
        return this._url;
    }
}

export namespace OpenGraphData {
    export enum OpenGraphType {
        WEBSITE = 'website',
        ARTICLE = 'article'
    }

    export enum OpenGraphProperty {
        DESCRIPTION = 'og:description',
        IMAGE = 'og:image',
        TITLE = 'og:title',
        TYPE = 'og:type',
        URL = 'og:url'
    }
}