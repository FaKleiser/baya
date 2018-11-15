/**
 * Classes implementing this interface can be used as building blocks for a
 * {@link HtmlPage}.
 * @deprecated
 */
export interface HtmlPageModule {
    /**
     * The name of the module.
     */
    moduleName(): string;
}
