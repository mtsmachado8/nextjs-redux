import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';

import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import Header from '../components/Header';

import '../project/api';
import '../styles/styles.scss';
import createStore from '../common/store';

// For debugging reasons for re-rendering components we use whyDidYouRender in dev mode

if (__DEV__ && typeof window !== 'undefined') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js'); whyDidYouRender(React);
}

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps;
        if (!ctx.store.getState().ready) {
            // Retrieve token cookie from req.headers
            const token = API.getStoredToken(ctx.req);
            // Post startup action with token || null
            await ctx.store.dispatch(AppActions.startup(token));
        }

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps({ ctx });
        }

        return { pageProps };
    }

    render() {
        const { Component, pageProps, store } = this.props;
        return (
            <Container>
                <Provider store={store}>
                    <React.Fragment>
                        <Head>
                            <meta charSet="utf-8"/>
                            <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
                            <meta name="description" content="The project description"/>
                            <meta name="theme-color" content="#317EFB"/>
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                            <link rel="apple-touch-icon" href="/static/images/icons-192.png"/>
                            <link rel="icon" sizes="192x192" href="/static/images/icons-192.png"/>
                            <link rel="manifest" href="/static/manifest.json"/>
                            <link rel="manifest" href="/static/site.webmanifest"/>
                            <link rel="shortcut icon" href="/static/images/favicon.ico"/>
                            <script src="../static/chrome-fix.js"/>
                            <title>TheProject</title>
                        </Head>
                        <Header/>
                        <Component {...pageProps} />
                    </React.Fragment>
                </Provider>
            </Container>
        );
    }
}

export default withRedux(createStore)(withReduxSaga(MyApp));