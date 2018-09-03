import {EntryMetadata} from './entry-metadata';

export class ReferenceMetadata {

    constructor(public readonly target: EntryMetadata,
                public readonly propertyName: string,
                public readonly referencedEntry: EntryMetadata) {
    }
}
