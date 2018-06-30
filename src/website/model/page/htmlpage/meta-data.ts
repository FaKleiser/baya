export class MetaData {
    private _description: string;
    private _keywords: string[] = [];
    private _title: string;
    private _author: string;

    public get description(): string {
        return this._description;
    }

    public get keywords(): string[] {
        return this._keywords;
    }

    public get keywordsAsString(): string {
        return this.keywords.join(' ');
    }

    public get title(): string {
        return this._title;
    }

    public get author(): string {
        return this._author;
    }

    public withDescription(description: string): this {
        this._description = description;
        return this;
    }

    public withKeywords(...keywords: string[]): this {
        this._keywords = keywords;
        return this;
    }

    public withTitle(title: string): this {
        this._title = title;
        return this;
    }

    public withAuthor(author: string): this {
        this._author = author;
        return this;
    }
}