import {Entry} from './entry';
import {filter, flatMap} from 'lodash';
import {injectable} from 'inversify';
import {Language} from '../../platform/valueobject/language';

/**
 * The entry store holds a reference to ALL existing entries.
 *
 * The store may be used to setup references between entries as it contains all existing references to entries.
 * Entries are identified by the ID of their source. Each loader populating the store should prefix its entry ids
 * to prevent namespace collisions.
 */
@injectable()
export class EntryStore {

    private _entries: Map<string, Map<string, Entry>> = new Map();

    public store(entry: Entry): this {
        if (!this._entries.has(entry.id)) {
            this._entries.set(entry.id, new Map());
        }
        this._entries.get(entry.id).set(entry.language.code, entry);
        return this;
    }

    public getOrFail(id: string, language: Language): Entry {
        if (!this._entries.has(id)) {
            throw new Error(`Unknown entry ${id}`);
        }
        if (!this._entries.get(id).has(language.code)) {
            throw new Error(`No entry for ${id} in language ${language}`);
        }
        return this._entries.get(id).get(language.code);
    }

    public getOrDefault(id: string, language: Language, defaultValue: undefined | Entry = undefined): Entry {
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

    public getAlternates(entry: Entry): Entry[] {
        if (this._entries.has(entry.id)) {
            return Array.from(this._entries.get(entry.id).values()).filter((e: Entry) => e !== entry);
        }
        return [];
    }

    /**
     * Filters the entry list according to _predicate_
     *
     * @return Entry[] The filtered list of entries
     */
    public filter(predicate: (entry: Entry) => boolean, language?: Language): Entry[] {
        const allEntries: Entry[] = flatMap(Array.from(this._entries.values()), (e: Map<string, Entry>) => {
            if (language) {
                return [e.get(language.code)];
            }
            return Array.from(e.values());
        });
        return filter(allEntries, predicate);
    }

}
