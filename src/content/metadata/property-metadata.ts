import {TypeFunction} from './type-function';
import {EntryMetadata} from './entry-metadata';

export class PropertyMetadata {

    constructor(public readonly target: EntryMetadata,
                public readonly propertyName: string,
                public readonly reflectedType: any,
                public typeFunction: TypeFunction) {
    }
}
