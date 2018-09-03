import {Renderer} from '../renderer.interface';
import {Page} from '../../model/page/page';

/**
 * Used to render {@link Page}s.
 */
export interface PageRenderer<T extends Page> extends Renderer<T> {

}
