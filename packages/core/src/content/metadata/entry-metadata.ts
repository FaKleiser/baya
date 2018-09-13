import {BaseEntry} from '../entry';
import {TypeFunction} from './type-function';
import {PropertyMetadata} from './property-metadata';
import {ReferenceMetadata} from './reference-metadata';

export class EntryMetadata {

    private _entryClass: typeof BaseEntry;

    private _properties: Map<string, PropertyMetadata> = new Map();
    private _references: Map<string, ReferenceMetadata> = new Map();

    constructor(entryClass: typeof BaseEntry) {
        this._entryClass = entryClass;
    }

    public addProperty(propertyName: string, reflectedType: any, typeFunction: TypeFunction): this {
        const propMeta: PropertyMetadata = new PropertyMetadata(this, propertyName, reflectedType, typeFunction);
        if (this.hasProperty(propertyName)) {
            throw new Error(`Cannot add property '${propertyName}' to entry ${this.entryClass.name}, as the property is already defined!`);
        }
        this._properties.set(propMeta.propertyName, propMeta);
        return this;
    }

    public addReference(referenceName: string, referencedEntry: EntryMetadata): this {
        const refMeta: ReferenceMetadata = new ReferenceMetadata(this, referenceName, referencedEntry);
        if (this.hasReference(referenceName) || this.hasProperty(referenceName)) {
            throw new Error(`Cannot add reference '${referenceName}' to entry ${this.entryClass.name}, as the property/reference is already defined!`);
        }
        this._references.set(referenceName, refMeta);
        return this;
    }

    get entryName(): string {
        return this.entryClass.name;
    }

    get entryClass(): typeof BaseEntry {
        return this._entryClass;
    }

    public hasProperties(): boolean {
        return this._properties.size > 0;
    }

    public hasProperty(propertyName: string): boolean {
        return this._properties.has(propertyName);
    }

    public getProperty(propertyName: string): PropertyMetadata {
        return this._properties.get(propertyName);
    }

    public getProperties(): ReadonlyMap<string, PropertyMetadata> {
        return this._properties;
    }

    public hasReferences(): boolean {
        return this._references.size > 0;
    }

    public hasReference(referenceName: string): boolean {
        return this._references.has(referenceName);
    }

    public getReference(referenceName: string): ReferenceMetadata {
        return this._references.get(referenceName);
    }

    public getReferences(): ReadonlyMap<string, ReferenceMetadata> {
        return this._references;
    }

}
