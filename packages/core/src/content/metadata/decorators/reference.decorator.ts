import {EntryMetadata} from '../entry-metadata';
import {defaultMetadataStorage} from '../default-metadata-storage';


export function Reference() {
    return function (target: any, key: string) {
        const type = (Reflect as any).getMetadata('design:type', target, key);
        const referencedEntryMeta: EntryMetadata = defaultMetadataStorage.metadataFor(type);
        defaultMetadataStorage.metadataFor(target.constructor)
            .addReference(key, referencedEntryMeta);
    }
}
