import {ContentLoader} from './content-loader.interface';
import {BaseEntry, EntryFrame, EntryFrameStore, FramedEntryFactory} from '../entry';
import {inject, injectable} from 'inversify';
import * as winston from 'winston';
import {Language} from '../../platform/valueobject';
import {Observable} from 'rxjs';
import {FinalizeEntry} from './finalize-entry';

@injectable()
export abstract class FramedEntryLoader implements ContentLoader {

    constructor(@inject(EntryFrameStore) private entryFrameStore: EntryFrameStore,
                @inject(FramedEntryFactory) private readonly entryFactory: FramedEntryFactory) {
    }

    abstract loadFrames(): Observable<EntryFrame<any>>;

    /**
     * Default implementation of the finalization step that:
     * - uses the {@link FramedEntryFactory} to create references
     * - enqueues data based on the {@link EntryMetadata}
     */
    public finalizeFrame(frame: EntryFrame<any>,
                         entryFrameStore: EntryFrameStore,
                         finalize: FinalizeEntry): void {
        winston.info(`Finalizing ${frame.entry.id}`);
        if (frame.metadata.hasReferences()) {
            winston.debug(`Creating references for entry type "${frame.metadata.entryName}" with id "${frame.entry.id}"`);
            // TODO: expose rawData to callback before passing it to reference creation
            this.entryFactory.factoryEntryReferences(frame, frame.rawData, this.entryFrameStore);
        }
        if (frame.metadata.transform) {
            finalize.enqueue(frame.entry);
        } else {
            finalize.justStore(frame.entry);
        }
    }

    /**
     * Ease creating an {@link EntryFrame}.
     */
    protected createEntry<T extends BaseEntry>(entryConstructor: typeof BaseEntry, id: string, language: Language, data: any): EntryFrame<any> {
        if (!entryConstructor) {
            throw new Error(`Empty entry constructor passed to FramedEntryLoader.createEntry() for entry with id '${id}'`);
        }
        if (!this.entryFactory.canFactory(entryConstructor)) {
            winston.error(`Cannot factory entry of type ${entryConstructor.name}. Skipping for now. Maybe you forgot to define entry metadata?`);
            return;
        }

        const frame: EntryFrame<T> = this.entryFactory.factoryEntryFrame(entryConstructor, id, language, data);
        if (frame == undefined) {
            winston.debug(`Skipping entry of type "${entryConstructor.name}" as the EntryFactory returned undefined.`);
            return;
        }

        winston.debug(`Created entry of type "${entryConstructor.name}" with id "${frame.entry.id}" for language "${frame.entry.language}"`);
        this.entryFrameStore.store(frame);
        return frame;
    }

}
