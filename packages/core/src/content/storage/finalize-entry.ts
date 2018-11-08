import {inject, injectable} from 'inversify';
import {BaseEntry, EntryStore} from '../entry';
import {TransformationQueue} from '../transformation';

@injectable()
export class FinalizeEntry {

    constructor(@inject(EntryStore) private entryStore: EntryStore,
                @inject(TransformationQueue) private queue: TransformationQueue) {
    }

    public justStore(entry: BaseEntry): this {
        this.entryStore.store(entry);
        return this;
    }

    /**
     * Enqueue an entry into the {@link TransformationQueue} so that it is later
     * transformed to a {@link Page}.
     */
    public enqueue(entry: BaseEntry): this {
        this.justStore(entry);
        this.queue.enqueue(entry);
        return this;
    }
}
