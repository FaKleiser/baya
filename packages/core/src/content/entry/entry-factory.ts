import {inject, injectable} from 'inversify';
import {MetadataStorage} from '../metadata/metadata-storage';
import {Entry} from './entry';
import {Language} from '../../platform/valueobject/language';
import {EntryMetadata} from '../metadata/entry-metadata';
import {PropertyMetadata} from '../metadata/property-metadata';
import {entry} from '../metadata/decorators/entry.decorator';
import {EntryStore} from './entry-store.service';
import {EntryFrameStore} from './frame/entry-frame-store.service';
import {EntryFrame} from './frame/entry-frame';

@injectable()
export class EntryFactory {

    constructor(@inject(MetadataStorage) private metadataStorage: MetadataStorage,
                @inject(EntryFrameStore) private entryFrameStore: EntryFrameStore) {
    }

    /**
     * Creates an instance of the {@link Entry} and populates all property fields.
     */
    public factoryEntryFrame<T extends Entry>(entryConstructor: typeof Entry, id: string, language: Language, data: any): EntryFrame<T> {
        if (!this.metadataStorage.hasMetadataFor(entryConstructor)) {
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

        const frame: EntryFrame<T> = new EntryFrame<T>(plainEntry);
        this.entryFrameStore.store(frame);
        return frame;
    }

    /**
     * Takes an existing Entry frame and initializes all references.
     */
    public factoryEntryReferences<T extends Entry>(frame: EntryFrame<T>, data: any): T {
        const entryConstructor: typeof Entry = (<any> frame.entry).constructor;
        if (!this.metadataStorage.hasMetadataFor(entryConstructor)) {
            throw new Error(`Cannot factory entry references. There is no entry metadata stored for entry of type '${entryConstructor.name}'`);
        }
        const metadata: EntryMetadata = this.metadataStorage.metadataFor(entryConstructor);

        const entry: T = frame.entry;
        for (const reference of metadata.getReferences()) {
            // check if an entry is referenced
            const [refName, refMeta] = reference;
            const referencedEntryId: string = data[refName];
            if (!referencedEntryId) {
                continue;
            }

            // try to fetch the entry from the store and assign it
            const referencedEntry: Entry = this.entryFrameStore.getOrDefault(referencedEntryId, entry.language).entry;
            if (referencedEntry && !(referencedEntry.constructor == refMeta.referencedEntry.entryClass)) {
                throw new Error(`Type collision! Entry '${entry.id}' expects referenced entry to be of type '${refMeta.referencedEntry.entryClass}', but found entry '${referencedEntryId}' to be of type '${(<any>referencedEntry).constructor.name}'!`);
            }
            entry[refName] = referencedEntry;
        }

        return entry;
    }
}

