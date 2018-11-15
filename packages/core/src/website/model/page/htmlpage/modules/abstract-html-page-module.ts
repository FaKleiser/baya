import {HtmlPageModule} from './html-page-module';

/**
 * Provides a base class to implement {@link HtmlPageModule}s.
 * @deprecated
 */
export abstract class AbstractHtmlPageModule implements HtmlPageModule {
    public moduleName(): string {
        return this.constructor.name;
    }
}
