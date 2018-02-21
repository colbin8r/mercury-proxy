import { Router } from 'express';

import rp from 'request-promise';
import validUrl from 'valid-url';
import errors from 'throw.js';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

/**
 * GET /article
 *
 * Proxies requests to Mercury's Web Parser API. The private API key is added
 * to the request. Accepts only one parameter: URL
 * See https://mercury.postlight.com/web-parser/
 */
routes.get('/article', (req, res, next) => {
  const { url } = req.query;

  // verify url is valid
  if (url == null) {
    next(new errors.BadRequest('Missing URL query parameter', 'Missing-URL'));
  } else if (url === '') {
    next(new errors.BadRequest('Empty URL query parameter', 'Empty-URL'));
  } else if (!validUrl.isUri(url)) {
    next(new errors.BadRequest('Invalid URL query paramter', 'Invalid-URL'));
  }

  const options = {
    uri: 'https://mercury.postlight.com/parser',
    qs: {
      url
    },
    headers: {
      'x-api-key': process.env.MERCURY_API_KEY,
      'Content-Type': 'application/json'
    },
    json: true
  };

  rp(options)
  .then((article) => res.status(200).json(article))
  .catch((err) => next(err));

});

export default routes;
