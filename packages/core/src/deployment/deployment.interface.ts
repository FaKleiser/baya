import {RenderedWebsite} from '../website/renderer/website/rendered-website.model';

export interface Deployment {
    deploy(website: RenderedWebsite): Promise<void>;
}
