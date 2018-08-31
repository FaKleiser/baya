import {Entry} from './entry';
import {Observable} from 'rxjs';
import {Language} from '../../platform/valueobject/language';

/**
 * Represents any file relevant for the content model.
 */
export class AssetEntry extends Entry {

    public content: Observable<string>;
    public mimeType: string;
    public size: number;
    public filename: string;
    public directory: string;
    public title: string;

    constructor(id: string, language: Language, data: any) {
        super(id, language, data);
    }

    protected simpleFields(): string[] {
        return [
            'content',
            'mimeType',
            'size',
            'filename',
            'directory',
            'title'
        ];
    }
}
