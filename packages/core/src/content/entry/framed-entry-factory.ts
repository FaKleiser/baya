import {inject, injectable} from 'inversify';
import {EntryMetadata, MetadataStorage} from '../metadata';
import {BaseEntry} from './base-entry';
import {Language} from '../../platform/valueobject';
import {EntryFrame, EntryFrameStore} from './frame';

@injectable()
export class FramedEntryFactory {

    constructor(@inject(MetadataStorage) private metadataStorage: MetadataStorage) {
    }

    /**
     * Returns true if the given {@link Entry} constructor can be produced by this factory.
     */
    public canFactory(entryConstructor: typeof BaseEntry) {
        return this.metadataStorage.hasMetadataFor(entryConstructor);
    }

    /**
     * Creates an instance of the {@link BaseEntry} and populates all property fields.
     */
    public factoryEntryFrame<T extends BaseEntry>(entryConstructor: typeof BaseEntry, id: string, language: Language, data: any): EntryFrame<T> {
        if (!this.canFactory(entryConstructor)) {
            throw new Error(`Cannot factory entry frame. There is no entry metadata stored for entry of type '${entryConstructor.name}'`);
        }
        const metadata: EntryMetadata = this.metadataStorage.metadataFor(entryConstructor);
        let plainEntry: T = new entryConstructor(id, language) as T;


        for (const property of metadata.getProperties()) {
            const [propName, propMeta] = property;
            // if (!plainEntry.hasOwnProperty(propName)) {
            //     throw new Error(`Expected entry '${metadata.entryName}' to have property '${propName}', but no own property was found on actual entry instance`);
            // }
            if (!data[propName]) {
                continue;
            }
            // FIXME: add transformations defined in propMeta here
            plainEntry[propName] = data[propName];
        }

        return new EntryFrame<T>(plainEntry, metadata, data);
    }

    /**
     * Takes an existing Entry frame and initializes all references.
     *
     * References are looked up in the given {@link EntryFrameStore}.
     */
    public factoryEntryReferences<T extends BaseEntry>(frame: EntryFrame<T>, data: any, entryFrameStore: EntryFrameStore): T {
        // first check if there are references at all
        const entry: T = frame.entry;
        if (!frame.metadata.hasReferences()) {
            return entry;
        }

        for (const reference of frame.metadata.getReferences()) {
            // check if an entry is referenced
            const [refName, refMeta] = reference;
            const referencedEntryId: string = data[refName];
            if (!referencedEntryId) {
                continue;
            }

            // try to fetch the entry from the store and assign it
            const referencedFrame: EntryFrame<any> = entryFrameStore.getOrDefault(referencedEntryId, entry.language);
            const referencedEntry: BaseEntry = referencedFrame ? referencedFrame.entry : undefined;
            if (referencedEntry && !(referencedEntry.constructor == refMeta.referencedEntry.entryClass)) {
                throw new Error(`Type collision! Entry '${entry.id}' expects referenced entry to be of type '${refMeta.referencedEntry.entryClass}', but found entry '${referencedEntryId}' to be of type '${(<any>referencedEntry).constructor.name}'!`);
            }
            entry[refName] = referencedEntry;
        }

        return entry;
    }
}

