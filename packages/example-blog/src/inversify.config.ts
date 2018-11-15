import {ContainerModule, interfaces} from 'inversify';

import {BlogPostTransformer} from './content/entry/blog-post/blog-post.transformer';
import {FilesystemAccess} from '@baya/loader-filesystem';
import {BlogLoaderProvider} from './content/storage/blog.loader';

export const BlogModule: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(BlogLoaderProvider).toSelf();
    bind(BlogPostTransformer).toSelf();
    bind(FilesystemAccess).toConstantValue(new FilesystemAccess('./content'));
});
