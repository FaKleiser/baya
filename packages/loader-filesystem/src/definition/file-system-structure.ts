import {injectable} from 'inversify';
import {FileSystemLoader} from '@baya/loader-filesystem';
import {EntryStructure} from './entry-structure';

@injectable()
export class FileSystemStructure {

    private _entryStructures: EntryStructure[] = [];

    constructor() {
    }

    public match(glob: string): EntryStructure {
        const entryStructure: EntryStructure = new EntryStructure(this, glob);
        this._entryStructures.push(entryStructure);
        return entryStructure;
    }


    get entryStructures(): EntryStructure[] {
        return this._entryStructures;
    }
}
