import {Page} from '../page';
import {Observable} from 'rxjs';
import {RelativePath} from '../../../url/relative-path';

const mime: any = require('mime-types'); // No types available

export class Asset extends Page {

    private _title: string;
    private _content: Observable<string>;
    private _mimeType: string;
    private _md5Sum: string;
    private _fileSize: number;

    constructor(url: RelativePath, content: Observable<string>, title?: string) {
        super(url);
        this._mimeType = mime.lookup(url.toString(false)) || undefined;
        this._content = content;
        this._title = title;
    }

    get content(): Observable<string> {
        return this._content;
    }

    get mimeType(): string {
        return this._mimeType;
    }

    set mimeType(value: string) {
        this._mimeType = value;
    }

    get md5Sum(): string {
        return this._md5Sum;
    }

    set md5Sum(value: string) {
        this._md5Sum = value;
    }

    get fileSize(): number {
        return this._fileSize;
    }

    set fileSize(value: number) {
        this._fileSize = value;
    }


    get title(): string {
        return this._title;
    }
}
