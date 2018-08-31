import {Language} from '../../platform/valueobject/language';

/**
 * An entry represents an atomic piece of content.
 */
export class Entry {

    /** A unique identifier of the entry */
    private _id: string;
    private _language: Language;

    [key: string]: any;

    constructor(id: string, language: Language) {
        if (!language) {
            throw new Error(`Cannot create entry with id '${id}' as the language is undefined. Please make sure the language is properly set.`);
        }
        this._id = id;
        this._language = language;
    }


    public get id(): string {
        return this._id;
    }

    public get language(): Language {
        return this._language;
    }
}
