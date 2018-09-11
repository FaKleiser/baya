import {container} from '../../../jest-bootstrap';
import {Entry} from './entry.decorator';
import {lang, Language} from '../../../platform/valueobject';
import {BaseEntry} from '../../entry';
import {MetadataStorage} from '../metadata-storage';
import {Reference} from './reference.decorator';

describe('@reference decorator', () => {

    container;

    const EN: Language = lang('en');

    @Entry()
    class BazEntry extends BaseEntry {

    }

    @Entry()
    class FooBarRefEntry extends BaseEntry {
        @Reference()
        public baz: BazEntry;
    }

    class WithoutDecoratorEntry extends BaseEntry {

    }

    test('Can construct entry as usual with reference decorator set', () => {
        const sut: FooBarRefEntry = new FooBarRefEntry('myid', EN);
        expect(sut.id).toBe('myid');
        expect(sut.language).toEqual(EN);
    });

    test('Class Metadata object contains property', () => {
        const sut: MetadataStorage = container.get(MetadataStorage);
        expect(sut.hasMetadataFor(FooBarRefEntry)).toBeTruthy();
        expect(sut.hasMetadataFor(WithoutDecoratorEntry)).toBeFalsy();
        expect(sut.metadataFor(FooBarRefEntry).hasReference('baz')).toBeTruthy();
        expect(sut.metadataFor(FooBarRefEntry).getReference('baz').referencedEntry.entryClass).toBe(BazEntry);
        expect(sut.metadataFor(FooBarRefEntry).hasReference('ghost')).toBeFalsy();
    });
});
