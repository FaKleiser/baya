import {BaseEntry} from '../../../../content/entry';
import {HtmlPage} from './html-page';
import {RelativePath} from '../../../url/relative-path';
import {MetaData} from './meta-data';
import * as React from 'react';

export class HtmlPageBuilder {

    private page: HtmlPage;
    private entry: BaseEntry;


    constructor(entry: BaseEntry, url: RelativePath) {
        this.entry = entry;
        this.page = new HtmlPage(url);
    }

    public title(title: string): this {
        this.page.title = title;
        this.metaData().withTitle(title);
        return this;
    }

    public description(description: string): this {
        this.metaData().withDescription(description);
        return this;
    }

    public append(node: React.ReactElement<any>): this {
        this.page.append(node);
        return this;
    }

    public build(): HtmlPage {
        return this.page;
    }

    private metaData(): MetaData {
        if (!this.page.meta) {
            this.page.withMetaData(new MetaData());
        }
        return this.page.meta;
    }
}
