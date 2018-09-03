import {Entry} from '../entry';

/**
 * Holds a reference to a not fully initialized {@link Entry}.
 * @private internal use only
 */
export class EntryFrame<T extends Entry> {
    constructor(public readonly entry: T) {
    }
}
