import {BaseEntry} from '../entry';

export class ContentIntegrityError extends Error {
    constructor(entry: BaseEntry, message: string) {
        super(`Error while creating entry ${entry.constructor.name} with id (${entry.id}) for language ${entry.languageAsLocaleString}: ${message}`);
    }
}
