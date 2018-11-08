import {AssetEntry, BaseEntry, Entry, Property, Reference} from '@baya/core';
import {TagEntry} from '../tag/tag.entry';

@Entry({transform: true})
export class BlogPostEntry extends BaseEntry {

    @Property()
    public title: string;
    @Reference()
    public titleImage: AssetEntry;
    @Property()
    public content: string;
    @Property()
    public published: Date;
    @Reference()
    public tags: TagEntry[];

}
