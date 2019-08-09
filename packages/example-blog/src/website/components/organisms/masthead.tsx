import * as React from 'react';
import {Component} from 'react';

export class MastheadComponentProps {
    // FIXME public image: Asset;
    public image: any;
}

export class MastheadComponent extends Component<MastheadComponentProps> {

    public render(): React.ReactNode {
        return (
            <header className="masthead" style={{backgroundImage: 'url("img/post-bg.jpg")'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
