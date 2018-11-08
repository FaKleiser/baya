import {MetadataStorage} from './metadata-storage';

/**
 * Default metadata storage is used as singleton and can be used to storage all metadatas.
 *
 * Reasoning behind the defaultMetadataStorage:
 *   TypeScript decorators are functions that are immediately invoked when a file
 *   is parsed for the first time. Ideally, we would have access to the inversify
 *   container at that point in time, but this turns out to be a chicken-egg-problem.
 *
 *   The class-transformer library stores all metadata in a singelton like this one:
 *     https://github.com/typestack/class-transformer/blob/c3d0030bb1c63ab7876b0ba384b17debb9570579/src/storage.ts
 *   As opposed to that, the inversify library uses `Reflect.defineMetadata` to store
 *   decorator state immediately:
 *     https://github.com/inversify/InversifyJS/blob/b0a31fb44371ffd8a6d7059177b92ab7704ec2c8/src/annotation/injectable.ts#L12
 *   And then later reads that using Reflect:
 *     https://github.com/inversify/InversifyJS/blob/b0a31fb44371ffd8a6d7059177b92ab7704ec2c8/src/planning/metadata_reader.ts
 */
export const defaultMetadataStorage = new MetadataStorage();
