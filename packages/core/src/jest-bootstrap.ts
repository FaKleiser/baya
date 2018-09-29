// == DI imports first
import 'reflect-metadata';
export {TYPES} from './types';
import {container} from './inversify.container';
import {ContentModule} from './content';

container.load(ContentModule);
export {
    container
};
