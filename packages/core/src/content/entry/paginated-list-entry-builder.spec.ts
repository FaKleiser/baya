import {BaseEntry} from './base-entry';
import {PaginatedListEntry} from './paginated-list.entry';
import {PaginatedListEntryBuilder} from './paginated-list-entry-builder';
import {lang} from '../../platform/valueobject/language';

describe('PaginatedListEntryBuilder', () => {

    class PostEntry extends BaseEntry {
        public title: string;

        protected simpleFields(): string[] {
            return ['title'];
        }

        public static create(total: number): PostEntry[] {
            const posts: PostEntry[] = [];
            for (let i: number = 0; i < total; i++) {
                posts.push(new PostEntry(`post:${i}`, lang('en')));
            }
            return posts;
        }
    }

    class PostListEntry extends PaginatedListEntry<PostEntry> {

    }

    test('create simple pagination', () => {
        const pages: PostListEntry[] = new PaginatedListEntryBuilder(PostEntry.create(5))
            .withItemsPerPage(2)
            .withPaginatedListEntryFactory((data: any) => new PostListEntry(`post-list:${data.page}`, lang('en')))
            .build();
        expect(pages).toHaveLength(3);
        expect(pages[0]).toBeInstanceOf(PostListEntry);

        // check numbers
        expect(pages[0].page).toBe(1);
        expect(pages[1].page).toBe(2);
        expect(pages[2].page).toBe(3);
        expect(pages[0].itemsPerPage).toBe(2);
        expect(pages[1].itemsPerPage).toBe(2);
        expect(pages[2].itemsPerPage).toBe(2);

        // check items
        expect(pages[0].items).toHaveLength(2);
        expect(pages[0].items[0].title).toBe('Title 0');
        expect(pages[0].items[1].title).toBe('Title 1');
        expect(pages[1].items).toHaveLength(2);
        expect(pages[1].items[0].title).toBe('Title 2');
        expect(pages[1].items[1].title).toBe('Title 3');
        expect(pages[2].items).toHaveLength(1);
        expect(pages[2].items[0].title).toBe('Title 4');
    });

    test('pagination has prev and next properly setup', () => {
        const pages: PostListEntry[] = new PaginatedListEntryBuilder(PostEntry.create(5))
            .withItemsPerPage(2)
            .withPaginatedListEntryFactory((data: any) => new PostListEntry(`post-list:${data.page}`, lang('en')))
            .build();
        expect(pages[0].prev).toBeUndefined();
        expect(pages[0].next).toBe(pages[1]);
        expect(pages[1].prev).toBe(pages[0]);
        expect(pages[1].next).toBe(pages[2]);
        expect(pages[2].prev).toBe(pages[1]);
        expect(pages[2].next).toBeUndefined();
    });

    test('pagination has first and lasst properly setup', () => {
        const pages: PostListEntry[] = new PaginatedListEntryBuilder(PostEntry.create(5))
            .withItemsPerPage(2)
            .withPaginatedListEntryFactory((data: any) => new PostListEntry(`post-list:${data.page}`, lang('en')))
            .build();
        expect(pages[0].first).toBe(pages[0]);
        expect(pages[1].first).toBe(pages[0]);
        expect(pages[2].first).toBe(pages[0]);
        expect(pages[0].last).toBe(pages[2]);
        expect(pages[1].last).toBe(pages[2]);
        expect(pages[2].last).toBe(pages[2]);

    });

});

