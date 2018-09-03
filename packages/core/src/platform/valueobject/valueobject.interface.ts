/**
 * Interface to be used by ValueObjects.
 *
 * @see https://martinfowler.com/bliki/ValueObject.html
 */
export interface ValueObject {

    /**
     * Returns true if:
     * - the other object is of the same type
     * - and represents the exact same value
     */
    equals(other: ValueObject): boolean;

    /**
     * Returns a string representation of the value object.
     */
    toString(): string;
}
