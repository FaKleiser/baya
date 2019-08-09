import {Layout} from '@baya/core';
import * as React from 'react';

export class DefaultLayout extends Layout {
    public layout(): React.ReactNode {
        return (
            <html>
            <head>
                <title></title>
            </head>
            <body>
            <header className="masthead" style={{backgroundImage: 'url("img/post-bg.jpg")'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto">
                            <div className="post-heading">
                                <h1>Man must explore, and this is exploration at its greatest</h1>
                                <h2 className="subheading">Problems look mighty small from 150 miles up</h2>
                                <span className="meta">Posted by
                <a href="#">Start Bootstrap</a>
                on August 24, 2018</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            </body>
            </html>
        );
    }
}
