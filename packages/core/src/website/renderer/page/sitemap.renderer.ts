import {Sitemap} from '../../model/page/sitemap/sitemap';
import {providePageRenderer} from '../../../inversify.container';
import {PageRenderer} from './page-renderer.interface';

@providePageRenderer()
export class SitemapRenderer implements PageRenderer<Sitemap> {

    public isAbleToRender(): string[] {
        return [Sitemap.name];
    }

    public render(sitemap: Sitemap): string {
        // FIXME: IMPLEMENT
        return 'NOT YET IMPLEMENTED';
    }
}
