export class Optional<T> {

    private _data: T;

    private constructor(data: T) {
        this._data = data;
    }

    public static of<T>(data: T): Optional<T> {
        if (undefined == data) {
            throw new Error('Cannot set undefined optional! Use `Optional.empty()` instead.');
        }
        return new Optional<T>(data);
    }

    public static empty(): Optional<any> {
        return new Optional(undefined);
    }

    get(): T {
        return this._data;
    }

    getOrThrow(throwMessage: string = 'Optional is undefined.'): T {
        if (!this.has()) {
            throw new Error(throwMessage);
        }
        return this._data;
    }

    has(): boolean {
        return undefined !== this._data;
    }
}
