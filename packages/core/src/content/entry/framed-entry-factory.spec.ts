import {BaseEntry} from './base-entry';
import {Entry, Property, Reference} from '../metadata/decorators';
import {FramedEntryFactory} from './framed-entry-factory';
import {container} from '../../jest-bootstrap';
import {lang, Language} from '../../platform/valueobject';
import {EntryFrame, EntryFrameStore} from './frame';

describe('EntryFactory', () => {

    @Entry()
    class AddressEntry extends BaseEntry {
        @Property()
        public street: string;
        @Property()
        public country: string;
    }

    @Entry()
    class UserEntry extends BaseEntry {
        @Property()
        public name: string;
        @Reference()
        public address: AddressEntry;
        @Reference()
        public spouse?: UserEntry;
    }

    const EN: Language = lang('EN');
    let entryFactory: FramedEntryFactory;
    let entryFrameStore: EntryFrameStore;

    beforeAll(() => {
        entryFactory = container.get(FramedEntryFactory);
        entryFrameStore = container.get(EntryFrameStore);
        entryFrameStore.clear();
    });

    test('Can create simple Entry', () => {
        const addressFrame: AddressEntry = entryFactory.factoryEntryFrame<AddressEntry>(AddressEntry, 'fooid', EN, {
            street: 'Awesome Street',
            country: 'Some Tropical Island',
        }).entry;

        expect(addressFrame.id).toEqual('fooid');
        expect(addressFrame.language).toBe(EN);
        expect(addressFrame.street).toEqual('Awesome Street');
        expect(addressFrame.country).toEqual('Some Tropical Island');
    });

    test('Can create referenced Entry', () => {
        // create address frame
        const addressData: any = {
            street: 'Awesome Street',
            country: 'Some Tropical Island',
        };
        const addressFrame: EntryFrame<AddressEntry> = entryFactory.factoryEntryFrame(AddressEntry, 'tropicalAddress', EN, addressData);

        // create user frame
        const userData: any = {
            name: 'John Doe',
            address: 'tropicalAddress',
        };
        const userFrame: EntryFrame<UserEntry> = entryFactory.factoryEntryFrame(UserEntry, 'engineer', EN, userData);

        expect(userFrame.entry.address).not.toBeInstanceOf(AddressEntry);
        entryFactory.factoryEntryReferences(userFrame, userData);
        expect(userFrame.entry.address).toBeInstanceOf(AddressEntry);
        expect(userFrame.entry.address).toBe(addressFrame.entry);
    });

    test('Calling factoryEntryReferences with an entry without references defined does not raise an error', () => {
        // create address frame
        const addressData: any = {
            street: 'Awesome Street',
            country: 'Some Tropical Island',
        };
        const addressFrame: EntryFrame<AddressEntry> = entryFactory.factoryEntryFrame(AddressEntry, 'tropicalAddress', EN, addressData);
        entryFactory.factoryEntryReferences(addressFrame, addressData);

        // assert that factoryEntryReferences() was a no-op
        expect(addressFrame.entry.id).toEqual('tropicalAddress');
        expect(addressFrame.entry.language).toBe(EN);
        expect(addressFrame.entry.street).toEqual('Awesome Street');
        expect(addressFrame.entry.country).toEqual('Some Tropical Island');
    });

    test('Calling factoryEntryReferences when linking to an entry of wrong type raises an error', () => {
        // create entry
        const userId: string = 'johndoe';
        const userData: any = {
            name: 'John Doe',
            address: userId, // linking to wrong entry type
        };
        const userFrame: EntryFrame<AddressEntry> = entryFactory.factoryEntryFrame(UserEntry, userId, EN, userData);
        expect(() => entryFactory.factoryEntryReferences(userFrame, userData)).toThrowError();
    });

    test('Entry factory can create cyclic reference', () => {
        // create entry
        const userId: string = 'narcissist';
        const userData: any = {
            name: 'John Narc',
            spouse: userId,
        };
        const userFrame: EntryFrame<UserEntry> = entryFactory.factoryEntryFrame(UserEntry, userId, EN, userData);
        const john: UserEntry = entryFactory.factoryEntryReferences(userFrame, userData);
        expect(john.spouse).toBe(john);
    });
});
