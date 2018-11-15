import {BaseEntry} from '../entry/base-entry';
import {injectable} from 'inversify';

/**
 * The transformation queue holds all entries that still need to be transformed.
 *
 * This queue is filled by {@link ContentLoader}s.
 */
@injectable()
export class TransformationQueue {

    private _toBeTransformed: BaseEntry[] = [];

    /**
     * Enqueue an entry that needs to be transformed.
     */
    public enqueue(model: BaseEntry): this {
        this._toBeTransformed.push(model);
        return this;
    }

    /**
     * Returns all enqueued entries.
     */
    public get toBeTransformed(): BaseEntry[] {
        return this._toBeTransformed;
    }
}
