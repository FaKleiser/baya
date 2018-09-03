import {RelativePath} from '../../../url/relative-path';

export class RssFeedItem {

    public title: string;
    public publishingDate: Date;
    public url: RelativePath;
    public excerpt: string;

    constructor(title: string, publishingDate: Date, url: RelativePath, excerpt: string) {
        this.title = title;
        this.publishingDate = publishingDate;
        this.url = url;
        this.excerpt = excerpt;
    }
}
