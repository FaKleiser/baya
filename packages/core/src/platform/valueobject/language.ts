import {ValueObject} from './valueobject.interface';

/**
 * Value object to represent the language of an artifact.
 *
 * The VO does not enforce any language code conventions and leaves it up to the
 * user to supply well-formed language codes (e.g. 'en' or 'en-US').
 */
export class Language implements ValueObject {

    constructor(private _code: string) {
    }

    public equals(other: ValueObject): boolean {
        return (other instanceof Language)
            && ((other as Language).code == this.code);
    }

    get code(): string {
        return this._code;
    }

    public toString(): string {
        return this.code;
    }

}

/**
 * Shorthand method to create a language.
 */
export function lang(language: string): Language {
    return new Language(language);
}
