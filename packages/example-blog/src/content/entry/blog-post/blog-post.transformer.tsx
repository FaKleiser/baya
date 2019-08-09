import {
    AbstractTransformer,
    HtmlPage,
    HtmlPageBuilder,
    provideTransformer,
    RelativePath,
    Transformer,
    Website
} from '@baya/core';
import {BlogPostEntry} from './blog-post.entry';
import {MastheadComponent} from '../../../website/components/organisms/masthead';
import * as React from 'react';

@provideTransformer()
export class BlogPostTransformer extends AbstractTransformer<BlogPostEntry> implements Transformer<BlogPostEntry> {

    canTransform(): string[] {
        return [BlogPostEntry.name];
    }

    transform(website: Website, entry: BlogPostEntry): void {
        const page: HtmlPageBuilder = new HtmlPageBuilder(entry, RelativePath.fromString('/blog'))
            .title(entry.title)
            .description(entry.content.substr(0, 300))
            .append(<>
                <MastheadComponent image={'test.jpg'}>
                    This is some child content.
                </MastheadComponent>
            </>);
        website.addPage(page.build(), entry.published);
    }


}
