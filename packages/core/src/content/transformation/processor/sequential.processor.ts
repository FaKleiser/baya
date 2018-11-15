import {TransformationProcessor} from './transformation-processor.interface';
import {TransformationQueue} from '../transformation-queue';
import {Transformer} from '../transformer.interface';
import * as winston from 'winston';
import {Website} from '../../../website/model/website';

/**
 * Sequentially processes a {@link TransformationQueue}.
 *
 * I.e. This implementation does not make use of parallelism, although
 * transformation should be side-effect free.
 */
export class SequentialProcessor implements TransformationProcessor {

    private _transformers: Map<string, Transformer<any>> = new Map();

    constructor(private website: Website) {
    }

    public process(queue: TransformationQueue): void {
        for (const entry of queue.toBeTransformed) {
            const entryName: string = entry.constructor.name;
            if (!this._transformers.has(entryName)) {
                throw new Error(`Entry ${entryName} does not have an accompanying transformer.`
                    + `Known transformers: [${Array.from(this._transformers.keys()).join(', ')}]`);
            }
            winston.debug(`About to transform entry "${entry.id}" for language "${entry.languageAsLocaleString}"`);
            this._transformers.get(entryName).transform(this.website, entry);
        }
    }

    public registerTransformer(transformer: Transformer<any>): this {
        for (const entryName of transformer.canTransform()) {
            if (this._transformers.has(entryName)) {
                throw new Error(`Transformer for entry ${entryName} already defined.`);
            }
            this._transformers.set(entryName, transformer);
        }
        return this;
    }

}
