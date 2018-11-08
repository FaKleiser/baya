import {Entry, BaseEntry, Property} from '@baya/core';

@Entry()
export class AuthorEntry extends BaseEntry {

    @Property()
    public slug: string;
    @Property()
    public firstname: string;
    @Property()
    public lastname: string;
    @Property()
    public gravatar?: string;
    @Property()
    public bio?: string;

    public get fullname() {
        return `${this.firstname} ${this.lastname}`;
    }
}
