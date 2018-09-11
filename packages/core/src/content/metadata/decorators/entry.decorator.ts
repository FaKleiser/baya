import {MetadataStorage} from '../metadata-storage';
import {BaseEntry} from '../../entry';
import {container} from '../../../inversify.container';


export function Entry() {
    return function <T extends typeof BaseEntry>(constructor: T) {
        container.get(MetadataStorage).metadataFor(constructor);
    }
}
