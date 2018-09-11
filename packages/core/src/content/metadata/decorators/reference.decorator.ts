import {container} from '../../../inversify.container';
import {MetadataStorage} from '../metadata-storage';
import {EntryMetadata} from '../entry-metadata';


export function Reference() {
    return function (target: any, key: string) {
        const type = (Reflect as any).getMetadata('design:type', target, key);
        const referencedEntryMeta: EntryMetadata = container.get(MetadataStorage).metadataFor(type);
        container.get(MetadataStorage).metadataFor(target.constructor)
            .addReference(key, referencedEntryMeta);
    }
}
