import {BaseEntry, Entry, Property} from '@baya/core';

@Entry()
export class TagEntry extends BaseEntry {

    @Property()
    public slug: string;
    @Property()
    public title: string;

}
