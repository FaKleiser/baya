import {injectable} from 'inversify';
import {EntryFrame} from './entry-frame';
import {Language} from '../../../platform/valueobject/language';

/**
 * The entry store holds a reference to ALL {@link EntryFrame}.
 * @private
 */
@injectable()
export class EntryFrameStore {

    private _entries: Map<string, Map<string, EntryFrame<any>>> = new Map();

    public store(frame: EntryFrame<any>): this {
        if (!this._entries.has(frame.entry.id)) {
            this._entries.set(frame.entry.id, new Map());
        }
        this._entries.get(frame.entry.id).set(frame.entry.language.code, frame);
        return this;
    }

    public getOrFail(id: string, language: Language): EntryFrame<any> {
        if (!this._entries.has(id)) {
            throw new Error(`Unknown entry ${id}`);
        }
        if (!this._entries.get(id).has(language.code)) {
            throw new Error(`No entry for ${id} in language ${language}`);
        }
        return this._entries.get(id).get(language.code);
    }

    public getOrDefault(id: string, language: Language, defaultValue: undefined | EntryFrame<any> = undefined): EntryFrame<any> {
        if (!this._entries.has(id)) {
            // no entry for the specified id => return default
            return defaultValue;
        }
        if (!this._entries.get(id).has(language.code)) {
            // no entry for the specified id and language combination => return default
            return defaultValue;
        }
        return this._entries.get(id).get(language.code);
    }

    /**
     * Clear the entry frame store.
     */
    public clear(): this {
        this._entries = new Map();
        return this;
    }
}
