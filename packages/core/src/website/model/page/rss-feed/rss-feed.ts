import {Page} from '../page';
import {RssFeedOptions} from './rss-feed-options.interface';
import {Language} from '../../../../platform/valueobject/language';
import {RssFeedItem} from './rss-feed-item';

export class RssFeed extends Page {

    private _title: string;
    private _items: RssFeedItem[] = [];
    private _language: Language;

    constructor(options: RssFeedOptions) {
        super(options.url);
        this._language = options.language;
        this._title = options.title;
    }

    public appendItem(item: RssFeedItem): this {
        if (!item) {
            throw new TypeError('The given RssFeedItem is empty!');
        }
        this._items.push(item);
        return this;
    }

    public get language(): Language {
        return this._language;
    }

    public get title(): string {
        return this._title;
    }

    public get items(): RssFeedItem[] {
        return this._items;
    }
}
