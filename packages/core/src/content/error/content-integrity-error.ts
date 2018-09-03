import {Entry} from '../entry/entry';

export class ContentIntegrityError extends Error {
    constructor(entry: Entry, message: string) {
        super(`Error while creating entry ${entry.constructor.name} with id (${entry.id}) for language ${entry.languageAsLocaleString}: ${message}`);
    }
}
