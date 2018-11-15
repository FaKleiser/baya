import {Transformer} from './transformer.interface';
import {AssetEntry, BaseEntry, EntryStore} from '../entry';
import {injectable, inject} from 'inversify';
import {RelativePath} from '../../website/url';
import {Website} from '../../website/model';
import {Language} from '../../platform/valueobject';
import {Asset} from '../../website/model/page/asset/asset';

@injectable()
export abstract class AbstractTransformer<T extends BaseEntry> implements Transformer<T> {

    constructor(@inject(EntryStore) private entryStore: EntryStore) {
    }

    abstract canTransform(): string[];

    abstract transform(website: Website, entry: T): void;

    public getAlternates(entry: T, pathBuilder: (e: T) => RelativePath): Map<Language, RelativePath> {
        const result: Map<Language, RelativePath> = new Map();
        this.entryStore.getAlternates(entry).map((e: T) => {
            result.set(e.language, pathBuilder(e));
        });
        return result;
    }

    protected asset(website: Website, assetEntry: AssetEntry): Asset {
        throw new Error('Not yet implemented');
    }

    /**
     * Returns a translated string for the defined language. To determine the language, you can also pass an {@link BaseEntry}.
     */
    protected t(key: string, lang: BaseEntry | Language): string {
        throw new Error('Not yet implemented');
    }
}
