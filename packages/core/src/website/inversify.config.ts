import {ContainerModule, interfaces} from 'inversify';
import {TYPES} from '../types';
import {RendererDispatcher} from './renderer/renderer-dispatcher.service';
import {PageRenderer} from './renderer/page/page-renderer.interface';
import {Page} from './model/page';
import {PathToUrlService} from './url';

export const WebsiteModule: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<RendererDispatcher<Page>>(TYPES.PageRendererDispatcher).toDynamicValue((ctx: interfaces.Context) => {
        const pageRenderers: PageRenderer<Page>[] = ctx.container.getAll(TYPES.PageRenderer);
        const dispatcher: RendererDispatcher<Page> = new RendererDispatcher();
        pageRenderers.forEach((renderer: PageRenderer<Page>) => dispatcher.register(renderer));
        return dispatcher;
    });
    bind<PathToUrlService>(PathToUrlService).toSelf();
});
