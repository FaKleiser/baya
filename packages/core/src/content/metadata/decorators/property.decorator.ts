import {TypeFunction} from '../type-function';
import {container} from '../../../inversify.container';
import {MetadataStorage} from '../metadata-storage';


export function Property(typeFunction?: TypeFunction) {
    return function (target: any, key: string) {
        const type = (Reflect as any).getMetadata('design:type', target, key);
        container.get(MetadataStorage).metadataFor(target.constructor)
            .addProperty(key, type, typeFunction);
    }
}
