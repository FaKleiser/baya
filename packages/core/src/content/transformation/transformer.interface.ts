import {BaseEntry} from '../entry';
import {Website} from '../../website/model';

/**
 * Transforms content {@link BaseEntry} objects to their respective {@link Page}s
 * and adds them to the {@link Website}.
 */
export interface Transformer<T extends BaseEntry> {

    /**
     * A list of entries the transformer is able to transform.
     *
     * Hint: You may use e.g. `NewsEntry.name` to reference the class name.
     */
    canTransform(): string[];

    /**
     * Adds the model as HtmlPage to the website.
     */
    transform(website: Website, entry: T): void;
}
