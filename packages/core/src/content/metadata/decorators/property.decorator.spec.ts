import {container} from '../../../jest-bootstrap';
import {Entry} from './entry.decorator';
import {lang, Language} from '../../../platform/valueobject';
import {BaseEntry} from '../../entry';
import {MetadataStorage} from '../metadata-storage';
import {Property} from './property.decorator';

describe('@property decorator', () => {

    container;

    const EN: Language = lang('en');

    @Entry()
    class FooBarPropEntry extends BaseEntry {
        @Property()
        public foo: string;

        @Property(() => Date)
        public bar: Date;
    }

    class WithoutPropDecoratorEntry extends BaseEntry {

    }

    test('Can construct entry as usual with property decorator set', () => {
        const sut: FooBarPropEntry = new FooBarPropEntry('myid', EN);
        expect(sut.id).toBe('myid');
        expect(sut.language).toEqual(EN);
    });

    test('Class Metadata object contains property', () => {
        const sut: MetadataStorage = container.get(MetadataStorage);
        expect(sut.hasMetadataFor(FooBarPropEntry)).toBeTruthy();
        expect(sut.hasMetadataFor(WithoutPropDecoratorEntry)).toBeFalsy();
        expect(sut.metadataFor(FooBarPropEntry).hasProperty('foo')).toBeTruthy();
        expect(sut.metadataFor(FooBarPropEntry).hasProperty('bar')).toBeTruthy();
        expect(sut.metadataFor(FooBarPropEntry).hasProperty('baz')).toBeFalsy();
    });
});
