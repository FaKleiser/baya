import {RelativePath} from '../../../url/relative-path';
import {Language} from '../../../../platform/valueobject/language';

export interface HtmlPageOptions {
    url: RelativePath;
    title: string;
    language: Language;
    alternates: Map<Language, RelativePath>;
}
