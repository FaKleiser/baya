import {TransformationQueue} from '../transformation';
import {EntryStore} from '../entry';

export interface ContentLoader {
    /**
     * Loads all models that will be turned into HTML pages and adds them into the queue for transformation.
     */
    load(entryStore: EntryStore, queue: TransformationQueue): Promise<void>;
}
