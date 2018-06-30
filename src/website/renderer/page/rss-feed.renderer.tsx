import {RssFeed} from '../../model/page/rss-feed/rss-feed';
import {providePageRenderer} from '../../../inversify.container';
import {inject} from 'inversify';
import {PageRenderer} from './page-renderer.interface';

@providePageRenderer()
export class RssFeedRenderer implements PageRenderer<RssFeed> {

    constructor() {
    }

    isAbleToRender(): string[] {
        return [RssFeed.name];
    }

    render(page: RssFeed): string {
        // FIXME: IMPLEMENT
        return 'NOT YET IMPLEMENTED';
    }
}
