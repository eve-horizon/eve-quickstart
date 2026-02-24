import assert from 'node:assert/strict';
import test from 'node:test';

import { createServer, resetStore } from '../index.js';
import { close } from '../db.js';

const startServer = () =>
  new Promise((resolve) => {
    const server = createServer();
    server.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });

test('todos CRUD flow', async () => {
  await resetStore();
  const { server, baseUrl } = await startServer();

  try {
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);

    const openapi = await fetch(`${baseUrl}/openapi.json`);
    assert.equal(openapi.status, 200);
    const openapiBody = await openapi.json();
    assert.equal(openapiBody.openapi, '3.0.0');

    const emptyList = await fetch(`${baseUrl}/todos`);
    assert.equal(emptyList.status, 200);
    assert.deepEqual(await emptyList.json(), []);

    const create = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Write tests' }),
    });
    assert.equal(create.status, 201);
    const created = await create.json();
    assert.equal(created.title, 'Write tests');
    assert.equal(created.completed, false);

    const get = await fetch(`${baseUrl}/todos/${created.id}`);
    assert.equal(get.status, 200);
    const fetched = await get.json();
    assert.equal(fetched.id, created.id);

    const update = await fetch(`${baseUrl}/todos/${created.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    assert.equal(update.status, 200);
    const updated = await update.json();
    assert.equal(updated.completed, true);

    const remove = await fetch(`${baseUrl}/todos/${created.id}`, {
      method: 'DELETE',
    });
    assert.equal(remove.status, 204);

    const listAfterDelete = await fetch(`${baseUrl}/todos`);
    assert.deepEqual(await listAfterDelete.json(), []);
  } finally {
    server.close();
    await close();
  }
});
