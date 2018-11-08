import {BaseEntry} from '../../entry';
import {defaultMetadataStorage} from '../default-metadata-storage';
import {EntryOptions} from '../entry-options';


export function Entry(options?: EntryOptions) {
    return function <T extends typeof BaseEntry>(constructor: T) {
        defaultMetadataStorage.metadataFor(constructor)
            .fromEntryOptions(options);
    }
}
