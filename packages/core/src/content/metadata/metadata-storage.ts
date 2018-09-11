import {EntryMetadata} from './entry-metadata';
import {BaseEntry} from '../entry';
import {injectable} from 'inversify';

@injectable()
export class MetadataStorage {

    private metadata: Map<typeof BaseEntry, EntryMetadata> = new Map();

    /**
     * Returns the {@link EntryMetadata} for the given {@link BaseEntry}.
     *
     * Will create initial metadata if there is no metadata yet.
     */
    public metadataFor(entry: typeof BaseEntry): EntryMetadata {
        if (!this.hasMetadataFor(entry)) {
            this.metadata.set(entry, new EntryMetadata(entry));
        }
        return this.metadata.get(entry);
    }

    /**
     * Returns true if metadata is stored for the given entry.
     */
    public hasMetadataFor(entry: typeof BaseEntry): boolean {
        return this.metadata.has(entry);
    }
}
