import {RenderedWebsite} from './rendered-website.model';
import winston = require('winston');
import {Website} from '../../model/website';
import {RendererDispatcher} from '../renderer-dispatcher.service';
import {Page} from '../../model/page/page';

/**
 * Renders a whole website by dispatching to individual page renderers.
 *
 * By default, the following renderers are registered:
 * - {@link HtmlPageRenderer}
 * - {@link RssFeedRenderer}
 * - {@link SitemapRenderer}
 * - {@link RedirectRenderer}
 */
export class WebsiteRenderer {

    public render(website: Website, dispatcher: RendererDispatcher<Page>): RenderedWebsite {
        const rendered: RenderedWebsite = new RenderedWebsite(website);

        // 1. render regular pages
        for (const page of website.pages) {
            rendered.setRenderedPage(page, dispatcher.render(page));
            winston.debug(`Rendered page ${page.url}`);
        }

        // 2. render sitemap
        rendered.setRenderedPage(website.sitemap, dispatcher.render(website.sitemap));
        winston.debug('Rendered sitemap');

        // 3. render redirects
        for (const redirect of website.redirects) {
            rendered.setRenderedPage(redirect, dispatcher.render(redirect));
            winston.debug(`Rendered redirect for ${redirect.url}`);
        }

        // 4. render RSS feeds
        for (const rssFeed of website.rssFeeds) {
            rendered.setRenderedPage(rssFeed, dispatcher.render(rssFeed));
            winston.debug(`Rendered RSS feed ${rssFeed.url}`);
        }

        return rendered;
    }
}
