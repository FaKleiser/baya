import {BaseEntry} from './';
import {Language} from '../../platform/valueobject';

/**
 * This class helps to build entries resembling a paginated collection.
 *
 * The entries are then used to build the respective list-overview HTML pages.
 */
export abstract class PaginatedListEntry<T extends BaseEntry> extends BaseEntry {

    /** All items on this paginated page */
    public items: T[];

    /** The current page number */
    public page: number;
    /** The number of items per page */
    public itemsPerPage: number;

    /** reference to the previous page */
    public prev: PaginatedListEntry<T>;
    /** reference to the next page */
    public next: PaginatedListEntry<T>;

    /** reference to the first page */
    public first: PaginatedListEntry<T>;
    /** reference to the last page */
    public last: PaginatedListEntry<T>;
    /** reference to all pages */
    public allPages: PaginatedListEntry<T>;

    constructor(id: string, language: Language) {
        super(id, language);
    }

    protected simpleFields(): string[] {
        return ['page', 'itemsPerPage'];
    }


    protected referenceFields(): string[] {
        return ['items', 'prev', 'next', 'first', 'last', 'allPages'];
    }

    public get totalItems(): number {
        return this.items.length;
    }

    public get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    public get hasNext(): boolean {
        return undefined !== this.next;
    }

    public get hasPrev(): boolean {
        return undefined !== this.prev;
    }

    public get isFirst(): boolean {
        return this === this.first;
    }

    public get isLast(): boolean {
        return this === this.last;
    }
}
