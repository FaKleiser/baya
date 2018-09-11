import {container} from '../../../jest-bootstrap';
import {Entry} from './entry.decorator';
import {lang, Language} from '../../../platform/valueobject';
import {BaseEntry} from '../../entry';
import {MetadataStorage} from '../metadata-storage';

describe('@entry decorator', () => {

    container;

    const EN: Language = lang('en');

    @Entry()
    class FooBarEntry extends BaseEntry {
        public foo: string;
        public bar: string;
    }

    class WithoutDecoratorEntry extends BaseEntry {

    }

    test('Can construct entry as usual with entry decorator set', () => {
        const sut: FooBarEntry = new FooBarEntry('myid', EN);
        expect(sut.id).toBe('myid');
        expect(sut.language).toEqual(EN);
    });

    test('Class Metadata object has been created by decorator', () => {
        const sut: MetadataStorage = container.get(MetadataStorage);
        expect(sut.hasMetadataFor(FooBarEntry)).toBeTruthy();
        expect(sut.hasMetadataFor(WithoutDecoratorEntry)).toBeFalsy();
    });
});
