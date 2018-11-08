import {Deployment} from './deployment.interface';
import {RenderedWebsite} from '../website/renderer/website/rendered-website.model';
import {Sitemap} from '../website/model/page/sitemap';
import {HtmlPage} from '../website/model/page/htmlpage';
import {Redirect} from '../website/model/page/redirect';
import {Asset} from '../website/model/page/asset';
import {RssFeed} from '../website/model/page/rss-feed';

export abstract class BaseDeployment implements Deployment {

    public async deploy(rendered: RenderedWebsite): Promise<void> {
        // 1. deploy redirects
        for (const redirect of rendered.website.redirects) {
            this.deployRedirect(redirect, rendered.getRenderedPage(redirect));
        }

        // 2. deploy pages
        for (const page of rendered.website.pages) {
            this.deployPage(page, rendered.getRenderedPage(page));
        }

        // 3. deploy sitemap
        const sitemap: Sitemap = rendered.website.sitemap;
        this.deploySitemap(sitemap, rendered.getRenderedPage(sitemap));

        // 4. deploy assets
        for (const asset of rendered.website.assets) {
            this.deployAsset(asset);
        }

        // 5. deploy rss
        for (const rss of rendered.website.rssFeeds) {
            this.deployRss(rss, rendered.getRenderedPage(rss));
        }

    }

    abstract deployPage(page: HtmlPage, html: string): void;

    abstract deploySitemap(sitemap: Sitemap, xml: string): void;

    abstract deployRedirect(redirect: Redirect, html?: string): void;

    abstract deployAsset(asset: Asset): void;

    abstract deployRss(rss: RssFeed, xml: string): void;
}
