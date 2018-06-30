import {ValueObject} from './valueobject.interface';

/**
 * Value object to represent the language of an artifact.
 *
 * The VO does not enforce any language code conventions and leaves it up to the
 * user to supply well-formed language codes (e.g. 'en' or 'en-US').
 */
export class Language implements ValueObject {

    constructor(private _language: string) {
    }

    public equals(other: ValueObject): boolean {
        return (other instanceof Language)
            && ((other as Language).language == this.language);
    }

    get language(): string {
        return this._language;
    }

    public toString(): string {
        return this.language;
    }

}
