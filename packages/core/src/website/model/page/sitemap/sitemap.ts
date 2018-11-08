import {SitemapEntry} from './sitemap-entry';
import {Page} from '../page';
import {HtmlPage} from '../htmlpage';
import {ChangeFreq} from './change-freq.enum';
import {PathToUrlService, RelativePath} from '../../../url';

export class Sitemap extends Page {

    private _entries: Map<string, SitemapEntry> = new Map();
    private _pathToUrl: PathToUrlService;

    constructor(pathToUrlService: PathToUrlService) {
        super(RelativePath.fromString('/sitemap'));
        this._pathToUrl = pathToUrlService;
    }

    public get entries(): Map<string, SitemapEntry> {
        return this._entries;
    }

    public add(page: HtmlPage, lastmod: Date, changeFreq: ChangeFreq = ChangeFreq.MONTHLY, priority: number = 0.5): this {
        const pagePath: string = page.url.toString();
        this._entries.set(pagePath, new SitemapEntry(page.url, lastmod, changeFreq, priority));
        return this;
    }
}
