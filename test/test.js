import retch from '../src/retch';

test('fetching something works', () => {
  expect.assertions(1);
  return retch('http://google.com')
    .then(data => expect(data).toBeDefined());
});

test('throws if no url provided', () => {
  expect.assertions(1);
  return expect(retch()).rejects.toBeDefined();
});

test('throws if invalid url provided', () => {
  expect.assertions(1);
  return expect(retch({ nota: 'url' })).rejects.toBeDefined();
});

test('fetching a nonexistent thing throws', () => {
  expect.assertions(1);
  return expect(retch('http://sfhbsdivuzbsnfdsdf.com')).rejects.toBeDefined();
});

test('get something works', () => {
  expect.assertions(1);
  return retch.get('http://google.com')
    .then(data => expect(data).toBeDefined());
});

// The following tests use jsonplaceholder, a fake, but realistic REST
// api dealing with JSON content. Requests that don't make sense
// e.g. POST to /posts/1 or PUT to /posts will 404

test('del something works', () => {
  expect.assertions(1);
  return retch.del('https://jsonplaceholder.typicode.com/posts/1')
    .then(data => expect(data).toBeDefined());
});

test('fetchJson works', () => {
  expect.assertions(1);
  return retch.getJson('https://jsonplaceholder.typicode.com/posts')
    .then(ret => expect(ret).toHaveLength(100));
});

test('404 status code rejects', () => {
  expect.assertions(1);
  const urlThat404s = 'https://jsonplaceholder.typicode.com/posts/sdfsff';
  return expect(retch(urlThat404s)).rejects.toBeDefined();
});

test('postJson works', () => {
  expect.assertions(1);
  const body = {
    userId: 1234,
    title: 'A Tale of Two Cities',
    body: 'It was the best of times. It was the worst of times.'
  }
  return expect(retch.postJson('https://jsonplaceholder.typicode.com/posts/', body))
    .resolves.toBeDefined();
});

test('postJson throws if no body provided', () => {
  expect.assertions(1);
  return expect(retch.postJson('https://jsonplaceholder.typicode.com/posts'))
    .rejects.toBeDefined();
});

test('putJson works', () => {
  expect.assertions(1);
  const body = {
    id: 1,
    userId: 1,
    title: 'A Tale of Two Cities',
    body: 'It was the best of times. It was the worst of times.'
  }
  return expect(retch.putJson('https://jsonplaceholder.typicode.com/posts/1', body))
    .resolves.toBeDefined();
});