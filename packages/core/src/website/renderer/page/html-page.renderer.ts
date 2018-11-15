import {providePageRenderer} from '../../../inversify.container';
import {PageRenderer} from './page-renderer.interface';
import {HtmlPage} from '../../model/page/htmlpage';
import {renderToStaticMarkup} from 'react-dom/server';

@providePageRenderer()
export class HtmlPageRenderer implements PageRenderer<HtmlPage> {

    isAbleToRender(): string[] {
        return [HtmlPage.name];
    }

    render(page: HtmlPage): string {
        let body: string = '';

        for (const chunk of page.content) {
            body += renderToStaticMarkup(chunk);
        }

        // fixme: wrap in layout with header and footer
        return body;
    }
}
