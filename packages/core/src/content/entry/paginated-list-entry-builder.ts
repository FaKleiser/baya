import {BaseEntry} from './base-entry';
import {PaginatedListEntry} from './paginated-list.entry';

export class PaginatedListEntryBuilder<T extends BaseEntry> {

    private _itemsPerPage: number;
    private _paginatedListEntryFactory: (data: any) => PaginatedListEntry<T>;

    constructor(private items: T[]) {
    }

    public withItemsPerPage(itemsPerPage: number): this {
        this._itemsPerPage = itemsPerPage;
        return this;
    }

    public withPaginatedListEntryFactory(factory: (data: any) => PaginatedListEntry<T>): this {
        this._paginatedListEntryFactory = factory;
        return this;
    }

    public build(): PaginatedListEntry<T>[] {
        // split items to pages
        const pages: T[][] = [];
        const workingCopy: T[] = [].concat(this.items);
        while (workingCopy.length > this._itemsPerPage) {
            pages.push(workingCopy.splice(0, this._itemsPerPage));
        }
        if (workingCopy.length > 0) {
            pages.push(workingCopy);
        }

        // factory each page
        const pageEntries: PaginatedListEntry<T>[] = [];
        let pageNumber: number = 1;
        for (const page of pages) {
            pageEntries.push(this._paginatedListEntryFactory({
                page: pageNumber,
                itemsPerPage: this._itemsPerPage,
            }));
            pageNumber++;
        }

        // init cross-references
        for (let idx: number = 0; idx < pageEntries.length; idx++) {
            pageEntries[idx].initReferenceFields({
                items: pages[idx],
                next: (idx >= pageEntries.length) ? undefined : pageEntries[idx + 1],
                prev: (idx <= 0) ? undefined : pageEntries[idx - 1],
                first: pageEntries[0],
                last: pageEntries[pageEntries.length - 1],
                allPages: pageEntries
            });
        }

        return pageEntries;
    }
}
