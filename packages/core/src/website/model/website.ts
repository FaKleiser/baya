import {HtmlPage} from './page/htmlpage/html-page';
import {Redirect} from './page/redirect/redirect';
import {Sitemap} from './page/sitemap/sitemap';
import {ChangeFreq} from './page/sitemap/change-freq.enum';
import {Asset} from './page/asset/asset';
import {Page} from './page/page';
import {RssFeed} from './page/rss-feed/rss-feed';
import {RelativePath} from '../url/relative-path';
import {PathToUrlService} from '../url/path-to-url.service';
import winston = require('winston');

export class Website {
    private _pages: Map<string, HtmlPage> = new Map();
    private _rssFeeds: Map<string, RssFeed> = new Map();
    private _redirects: Map<string, Redirect> = new Map();
    private _sitemap: Sitemap;
    private _assets: Map<string, Asset> = new Map();
    private _baseUrl: string;
    private _hostName: string;

    constructor({baseUrl, hostName}: any, public pathToUrlService: PathToUrlService) {
        this._baseUrl = baseUrl.replace(/([\/]+)$/, ''); // replace trailing /
        this._sitemap = new Sitemap(pathToUrlService);
        this._hostName = hostName;
    }

    public addPage(page: HtmlPage, lastmod: Date, changeFreq: ChangeFreq = ChangeFreq.MONTHLY, priority: number = 0.5): this {
        this.storePage(page);
        this._sitemap.add(page, lastmod, changeFreq, priority);
        return this;
    }


    public addRss(page: RssFeed): this {
        this.storeRss(page);
        return this;
    }

    public addPageAndDontAddToSitemap(page: HtmlPage): this {
        this.storePage(page);
        return this;
    }

    public addRedirect(from: RelativePath, to: string): this {
        if (!to) {
            throw new Error(`Redirect from '${from}' should be non-empty!`);
        }
        const redirect: Redirect = new Redirect(from, to);
        this.throwIfExist(redirect);
        this._redirects.set(from.toString(), redirect);
        return this;
    }

    public addAsset(asset: Asset): this {
        winston.debug(`Added asset ${asset.url} to website`);
        this.throwIfExist(asset);
        this._assets.set(asset.url.toString(), asset);
        return this;
    }

    public get pages(): IterableIterator<HtmlPage> {
        return this._pages.values();
    }

    public get rssFeeds(): IterableIterator<RssFeed> {
        return this._rssFeeds.values();
    }

    public get redirects(): IterableIterator<Redirect> {
        return this._redirects.values();
    }

    public get sitemap(): Sitemap {
        return this._sitemap;
    }

    public get assets(): IterableIterator<Asset> {
        return this._assets.values();
    }

    public get baseUrl(): string {
        return this._baseUrl;
    }

    public get hostName(): string {
        return this._hostName;
    }

    private storePage(page: HtmlPage) {
        winston.debug(`Added page ${page.url} to website`);
        this.throwIfExist(page);
        this._pages.set(page.url.toString(), page);
    }

    private storeRss(page: RssFeed) {
        winston.debug(`Added RSS feed ${page.url} to website`);
        this.throwIfExist(page);
        this._rssFeeds.set(page.url.toString(), page);
    }

    private throwIfExist(page: Page): void {
        const pageUrl: string = page.url.toString();
        if (this._pages.has(pageUrl)) {
            throw new Error(`Cannot add page, as there is already a html-page for ${pageUrl}`);
        }
        if (this._redirects.has(pageUrl)) {
            throw new Error(`Cannot add page, as there is already a redirect for ${pageUrl}`);
        }
        if (this._assets.has(pageUrl)) {
            throw new Error(`Cannot add page, as there is already an asset for ${pageUrl}`);
        }
    }

    public hasAsset(assetUrl: RelativePath): boolean {
        return this._assets.has(assetUrl.toString());
    }

    public getAsset(assetUrl: RelativePath): Asset {
        return this._assets.get(assetUrl.toString());
    }
}
