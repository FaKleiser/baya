import {filter} from 'lodash';
import {ValueObject} from '../../platform/valueobject/valueobject.interface';

/**
 * Represents the URL path after the domain name.
 *
 * For the following URL:
 *      http://example.com/this/is/a/relative/path.html#with-anchor
 * A {@link RelativePath} object would represent the following part:
 *      this/is/a/relative/path.html#with-anchor
 */
export class RelativePath implements ValueObject {

    private parts: string[] = [];
    private _anchor: string;

    private constructor(parts: string[], anchor: string) {
        for (const part of filter(parts)) {
            if (part.match(/[^.a-z0-9_-]+/gi)) {
                throw new Error(`Invalid part in URL: ${part} (all parts: [${parts.join(', ')}]). All parts must match pattern: /[.a-z0-9_-]+/i`);
            }
        }
        this.parts = parts;
        this._anchor = anchor;
    }

    public static fromString(path: string): RelativePath {
        // check if there is an anchor and extract it
        let anchor: string;
        const hashIndex: number = path.indexOf('#');
        if (-1 !== hashIndex) {
            anchor = path.substr(hashIndex + 1);
            path = path.substr(0, hashIndex);
        }

        // split to parts
        const parts: string[] = filter(path.split('/'));
        return new RelativePath(parts, anchor);
    }

    public static fromParts(parts: string[], anchor?: string): RelativePath {
        return parts.map((part) => RelativePath.fromString(part))
            .reduce((prev: RelativePath, cur: RelativePath) => prev.concat(cur))
            .anchor(anchor);
    }

    /**
     * Concatenates the given child path to this path.
     *
     * Takes the anchor of the child path.
     */
    public concat(child: RelativePath): RelativePath {
        return new RelativePath(this.parts.concat(child.parts), child._anchor);
    }

    /**
     * Returns a new {@link RelativePath} with the given anchor.
     */
    public anchor(anchor: string): RelativePath {
        return new RelativePath(this.parts, anchor);
    }

    public equals(other: ValueObject): boolean {
        if (!(other instanceof RelativePath)) {
            return false;
        }

        // check if parts are equal
        if (this.parts.length != other.parts.length) {
            return false;
        }
        for (let idx: number = 0; idx < this.parts.length; idx++) {
            if (this.parts[idx] != other.parts[idx]) {
                return false;
            }
        }

        // check if anchor is equal
        return this._anchor == other._anchor;
    }

    /**
     * Returns a full string representation of the relative path without leading slash.
     *
     * Examples:
     * - foo
     * - foo/bar
     * - foo/bar/zap/zupa#anchor
     *
     * Pass true to trailingSlash to add a trailing slash to the URL if the last part is not a file extension:
     * - foo/
     * - foo/bar/
     * - foo/bar/zap/zupa/#anchor
     * But if there is a file extension, will not add a trailing slash:
     * - foo.html
     * - foo/bar.jpg
     * - foo/bar/zap/zupa.html#anchor
     */
    public toString(trailingSlash: boolean = true): string {
        const lastPart: string = this.parts[this.parts.length - 1] || '';
        const hasFileExtension: boolean = lastPart.indexOf('.') !== -1;
        const url: string = this.parts.join('/')
            + ((!hasFileExtension && trailingSlash) ? '/' : '')
            + ((this._anchor) ? `#${this._anchor}` : '');
        // remove leading slahes - these are added if the parts are empty.
        return url.replace(/^\/+/i, '');
    }
}
