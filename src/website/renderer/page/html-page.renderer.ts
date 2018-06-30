import {RendererDispatcher} from '../../renderer/renderer-dispatcher.service';
import {providePageRenderer} from '../../../inversify.container';
import {inject} from 'inversify';
import {TYPES} from '../../../types';
import {HtmlPageModule} from '../../model/page/htmlpage/modules/html-page-module';
import {PageRenderer} from './page-renderer.interface';
import {HtmlPage} from '../../model/page/htmlpage/html-page';

@providePageRenderer()
export class HtmlPageRenderer implements PageRenderer<HtmlPage> {

    constructor(@inject(TYPES.ModuleRendererDispatcher) private moduleRenderer: RendererDispatcher<HtmlPageModule>) {
    }

    isAbleToRender(): string[] {
        return [HtmlPage.name];
    }

    render(page: HtmlPage): string {
        let body: string = '';

        for (const module of page.modules) {
            body += this.moduleRenderer.render(module);
        }

        // fixme: wrap in layout with header and footer
        return body;
    }
}
