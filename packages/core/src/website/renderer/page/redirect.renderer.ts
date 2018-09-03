import {Redirect} from '../../model/page/redirect/redirect';
import {providePageRenderer} from '../../../inversify.container';
import {PageRenderer} from './page-renderer.interface';

@providePageRenderer()
export class RedirectRenderer implements PageRenderer<Redirect> {

    public isAbleToRender(): string[] {
        return [Redirect.name];
    }

    public render(redirect: Redirect): string {
        // redirects have empty bodies
        return '';
    }
}
