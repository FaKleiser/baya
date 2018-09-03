import {Website} from '../../model/website';
import {Page} from '../../model/page/page';

export class RenderedWebsite {

    private _website: Website;

    private _rendered: Map<Page, string> = new Map();

    constructor(website: Website) {
        this._website = website;
    }

    public setRenderedPage(page: Page, rendered: string): this {
        this._rendered.set(page, rendered);
        return this;
    }

    public get website(): Website {
        return this._website;
    }

    public get renderedPages(): Page[] {
        return Array.from(this._rendered.keys());
    }

    getRenderedPage(page: Page): string {
        if (!this._rendered.has(page)) {
            throw new Error(`Page ${page.url} has not been rendered!`);
        }
        return this._rendered.get(page);
    }
}
