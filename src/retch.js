let _fetch;
if (process && process.env && process.env.NODE_ENV == 'test') {
  // in test mode, use node-fetch. The window check fails because
  // jest seems to have a window object, but it has no fetch function
  _fetch = require('node-fetch');
}
else if (typeof window === 'undefined') {
  // node
  _fetch = require('node-fetch');
}
else {
  // browser
  _fetch = window.fetch;
}

const retch = function(url, opts) {
  if (typeof(url) != 'string')
    return Promise.reject('url is required');

  opts = Object.assign({ }, {
    credentials: 'same-origin'
  }, opts);

  return _fetch(url, opts)
    .then(response => {
      if (response.status >= 200 && response.status < 300)
        return Promise.resolve(response);
      else {
        let error = new Error(response.statusText || response.status);
        error.response = response;
        return Promise.reject(error);
      }
    });
};

retch.get = function(url, opts) {
  return retch(url, Object.assign({ }, opts, { method: 'GET' }));
};

retch.post = function(url, opts) {
  return retch(url, Object.assign({ }, opts, { method: 'POST' }));
};

retch.put = function(url, opts) {
  return retch(url, Object.assign({ }, opts, { method: 'PUT' }));
};

retch.del = function(url, opts) {
  return retch(url, Object.assign({ }, opts, { method: 'DELETE' }));
};

retch.getJson = function(url, opts) {
  return retch(url, opts)
    .then(response => response.json());
};

retch.postJson = function(url, body, opts) {
  return _putOrPostJson('POST', url, body, opts);
};

retch.putJson = function(url, body, opts) {
  return _putOrPostJson('PUT', url, body, opts);
};

function _putOrPostJson(method, url, body, opts) {
  if (typeof(body) != 'object')
    return Promise.reject('a JSON body is required');

  opts = Object.assign({ }, opts, {
    method: method,
    body: JSON.stringify(body)
  });
  opts.headers = Object.assign({ }, opts.headers, {
    'Content-Type': 'application/json',
  });

  return retch(url, opts);
};

export { retch as default };