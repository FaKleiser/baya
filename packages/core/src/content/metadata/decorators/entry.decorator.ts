import {BaseEntry} from '../../entry';
import {defaultMetadataStorage} from '../default-metadata-storage';


export function Entry() {
    return function <T extends typeof BaseEntry>(constructor: T) {
        defaultMetadataStorage.metadataFor(constructor);
    }
}
