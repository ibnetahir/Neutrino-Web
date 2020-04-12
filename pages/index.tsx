import React from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Translation } from 'react-i18next';

import Head from 'next/head';
import 'locales/config';
import { GlobalLinksContext } from 'shared/Layout/context';
import { getDefaultLearnLinks, getDefaultProductLinks } from 'shared/Layout/defaults';

import 'style/index.scss';
import 'shared/Layout/Layout.scss';

interface AppConfig {
    env: {
        [key: string]: string;
    };
}
const getGoogleTag = (config: AppConfig) => config.env.google_tag_id;

interface State {
    googleTagId?: string;
}

class LandingPage extends React.Component<{}, State> {
    constructor(props) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        try {
            const res = await axios.get('/api/v1/init');

            this.setState({ googleTagId: getGoogleTag(res.data.config) });
        } catch (err) {
            console.warn('Error occured on google tag id fetch');
        }
    }

    getGlobalLinksContextValue(t) {
        return { links: getDefaultLearnLinks(t), product: getDefaultProductLinks(t) };
    }

    render() {
        const { googleTagId } = this.state;
        const DynamicLandingPage = dynamic(() => import('routes/LandingPage'), { ssr: true });

        return (
            <Translation>
                {(t) => (
                    <GlobalLinksContext.Provider value={this.getGlobalLinksContextValue(t)}>
                        <div>
                            <Head>
                                <title>Neutrino</title>
                                <link rel="icon" href={'static/images/favicon.ico'} />
                                <title>Neutrino</title>
                            </Head>
                            <div className="Layout">
                                <div></div>
                                <DynamicLandingPage />
                            </div>
                            <script
                                async
                                src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
                            ></script>
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${googleTagId}');
                    `,
                                }}
                            />
                            <style jsx>{`
                                background: #f1f1f1;
                            `}</style>
                        </div>
                    </GlobalLinksContext.Provider>
                )}
            </Translation>
        );
    }
}

export default LandingPage;
