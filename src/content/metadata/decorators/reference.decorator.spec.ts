import {container} from '../../../jest-bootstrap';
import {entry} from './entry.decorator';
import {lang, Language} from '../../../platform/valueobject/language';
import {Entry} from '../../entry/entry';
import {MetadataStorage} from '../metadata-storage';
import {reference} from './reference.decorator';

describe('@reference decorator', () => {

    container;

    const EN: Language = lang('en');

    @entry()
    class BazEntry extends Entry {

    }

    @entry()
    class FooBarRefEntry extends Entry {
        @reference()
        public baz: BazEntry;
    }

    class WithoutDecoratorEntry extends Entry {

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
