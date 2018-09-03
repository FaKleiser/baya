import {EntryMetadata} from './entry-metadata';
import {Entry} from '../entry/entry';
import {injectable} from 'inversify';

@injectable()
export class MetadataStorage {

    private metadata: Map<typeof Entry, EntryMetadata> = new Map();

    /**
     * Returns the {@link EntryMetadata} for the given {@link Entry}.
     *
     * Will create initial metadata if there is no metadata yet.
     */
    public metadataFor(entry: typeof Entry): EntryMetadata {
        if (!this.hasMetadataFor(entry)) {
            this.metadata.set(entry, new EntryMetadata(entry));
        }
        return this.metadata.get(entry);
    }

    /**
     * Returns true if metadata is stored for the given entry.
     */
    public hasMetadataFor(entry: typeof Entry): boolean {
        return this.metadata.has(entry);
    }
}
