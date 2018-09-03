import {MetadataStorage} from '../metadata-storage';
import {Entry} from '../../entry/entry';
import {container} from '../../../inversify.container';


export function entry() {
    return function <T extends typeof Entry>(constructor: T) {
        container.get(MetadataStorage).metadataFor(constructor);
    }
}
