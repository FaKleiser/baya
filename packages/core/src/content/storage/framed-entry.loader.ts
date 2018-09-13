import {ContentLoader} from './content-loader.interface';
import {BaseEntry, EntryFrame, EntryFrameStore, EntryStore, FramedEntryFactory} from '../entry';
import {TransformationQueue} from '../transformation';
import {inject, injectable} from 'inversify';
import * as winston from 'winston';
import {Language} from '../../platform/valueobject';

@injectable()
export abstract class FramedEntryLoader implements ContentLoader {

    /**
     * Keeps track of all frames loaded by this loader.
     */
    private loadedFrames: EntryFrame<any>[] = [];

    constructor(@inject(EntryStore) protected readonly store: EntryStore,
                @inject(TransformationQueue) protected readonly queue: TransformationQueue,
                @inject(EntryFrameStore) private entryFrameStore: EntryFrameStore,
                @inject(FramedEntryFactory) private readonly entryFactory: FramedEntryFactory) {
    }

    abstract load(entryStore: EntryStore, queue: TransformationQueue): Promise<void>;

    /**
     * Enqueue an entry into the {@link TransformationQueue} and return it.
     *
     * This is useful in entry factories to enqueue entries before storing them
     * in the {@link EntryStore}.
     */
    protected enqueue(entry: BaseEntry): BaseEntry {
        this.queue.enqueue(entry);
        return entry;
    }

    /**
     * Phase 1: Creates an {@link EntryFrame}
     *
     * If the entry has references, it is stored for later resolution of references.
     */
    protected createEntry<T extends BaseEntry>(entryConstructor: typeof BaseEntry, id: string, language: Language, data: any): EntryFrame<any> {
        if (!this.entryFactory.canFactory(entryConstructor)) {
            winston.error(`Cannot factory entry of type ${entryConstructor.name}. Skipping for now. Maybe you forgot to define entry metadata?`);
            return;
        }

        const frame: EntryFrame<T> = this.entryFactory.factoryEntryFrame(entryConstructor, id, language, data);
        if (frame == undefined) {
            winston.debug(`Skipping entry of type "${entryConstructor.name}" as the EntryFactory returned undefined.`);
            return;
        }

        winston.debug(`Created entry of type "${entryConstructor.name}" with id "${frame.entry.id}" for language "${frame.entry.languageAsLocaleString}"`);
        this.entryFrameStore.store(frame);
        return frame;
    }

    /**
     * Phase 2: initializes the references on all entries that need it.
     *
     * The entry is automatically put into the {@link EntryStore}.
     */
    protected initReferences(): void {
        winston.info('Creating references');
        for (const frame of this.loadedFrames) {
            if (frame.metadata.hasReferences()) {
                winston.debug(`Creating references for entry type "${frame.metadata.entryName}" with id "${frame.entry.id}"`);
                // TODO: expose rawData to callback before passing it to reference creation
                this.entryFactory.factoryEntryReferences(frame, frame.rawData, this.entryFrameStore);
            }
            this.store.store(frame.entry);
        }
    }
}
