import {BaseEntry} from '../base-entry';
import {EntryMetadata} from '../../metadata';

/**
 * Holds a reference to a not fully initialized {@link BaseEntry}.
 * @private internal use only
 */
export class EntryFrame<T extends BaseEntry> {
    constructor(public readonly entry: T,
                public readonly metadata: EntryMetadata,
                public readonly rawData: any) {
    }
}
