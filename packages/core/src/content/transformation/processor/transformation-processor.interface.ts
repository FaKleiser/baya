import {TransformationQueue} from '../transformation-queue';

/**
 * Processes the transformation of a {@link TransformationQueue} queue filled
 * with {@link Entry}s.
 */
export interface TransformationProcessor {
    process(queue: TransformationQueue): void;
}
