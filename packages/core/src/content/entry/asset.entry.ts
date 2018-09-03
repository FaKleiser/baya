import {Entry} from './entry';
import {Observable} from 'rxjs';
import {Language} from '../../platform/valueobject/language';
import {entry} from '../metadata/decorators/entry.decorator';
import {property} from '../metadata/decorators/property.decorator';

/**
 * Represents any file relevant for the content model.
 */
@entry()
export class AssetEntry extends Entry {

    @property()
    public content: Observable<string>;
    @property()
    public mimeType: string;
    @property()
    public size: number;
    @property()
    public filename: string;
    @property()
    public directory: string;
    @property()
    public title: string;

    constructor(id: string, language: Language) {
        super(id, language);
    }
}
