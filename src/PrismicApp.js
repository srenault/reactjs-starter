import React from 'react';
import fetch from 'whatwg-fetch';
import Prismic from 'prismic.io';
import PrismicConfig from './prismic-configuration';
import App from './App';

export default class PrismicApp extends React.Component {

  static validateOnboarding() {
    const repoEndpoint = PrismicConfig.apiEndpoint.replace('/api', '');
    fetch(`${repoEndpoint}/app/settings/onboarding/run`, { credentials: 'include', method: 'POST' })
      .catch(() => console.log('Cannot access your repository, check your api endpoint'));
  }

  static buildContext() {
    const accessToken = PrismicConfig.accessToken;
    return Prismic.api(PrismicConfig.apiEndpoint, { accessToken }).then(api => ({
      api,
      endpoint: PrismicConfig.apiEndpoint,
      accessToken,
      linkResolver: PrismicConfig.linkResolver,
    }));
  }

  state = {
    prismicCtx: null,
  }

  componentWillMount() {
    PrismicApp.buildContext().then((prismicCtx) => {
      this.setState({ prismicCtx });
    }).catch((e) => {
      console.error(`Cannot contact the API, check your prismic configuration:\n${e}`);
    });
  }

  render() {
    return <App prismicCtx={this.state.prismicCtx} />;
  }
}
