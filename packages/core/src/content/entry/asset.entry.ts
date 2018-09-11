import {BaseEntry} from './base-entry';
import {Observable} from 'rxjs';
import {Language} from '../../platform/valueobject';
import {Entry, Property} from '../metadata/decorators';

/**
 * Represents any file relevant for the content model.
 */
@Entry()
export class AssetEntry extends BaseEntry {

    @Property()
    public content: Observable<string>;
    @Property()
    public mimeType: string;
    @Property()
    public size: number;
    @Property()
    public filename: string;
    @Property()
    public directory: string;
    @Property()
    public title: string;

    constructor(id: string, language: Language) {
        super(id, language);
    }
}
