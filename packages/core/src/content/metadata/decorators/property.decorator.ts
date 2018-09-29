import {TypeFunction} from '../type-function';
import {defaultMetadataStorage} from '../default-metadata-storage';


export function Property(typeFunction?: TypeFunction) {
    return function (target: any, key: string) {
        const type = (Reflect as any).getMetadata('design:type', target, key);
        defaultMetadataStorage.metadataFor(target.constructor)
            .addProperty(key, type, typeFunction);
    }
}
