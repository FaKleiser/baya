import {RelativePath} from '../../../url/relative-path';
import {Language} from '../../../../platform/valueobject/language';

export interface RssFeedOptions {
    url: RelativePath;
    title: string;
    language: Language;
}
