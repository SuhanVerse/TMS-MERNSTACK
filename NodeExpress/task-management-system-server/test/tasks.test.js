import assert from 'node:assert/strict'
import { once } from 'node:events'
import { after, before, test } from 'node:test'
import app from '../app.js'
import TaskModel from '../TaskModel.js'

let server
let baseUrl
const originalSave = TaskModel.prototype.save

before(async () => {
  server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  TaskModel.prototype.save = originalSave
  server.closeAllConnections()
  await new Promise(resolve => server.close(resolve))
})

async function post(body) {
  return fetch(`${baseUrl}/api/task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('returns the persisted task after the database write resolves', async t => {
  TaskModel.prototype.save = async function () {
    await new Promise(resolve => setImmediate(resolve))
    return { _id: 'saved-task', name: this.name }
  }
  t.after(() => { TaskModel.prototype.save = originalSave })
  const response = await post({ name: '  Test the robot  ' })
  assert.equal(response.status, 201)
  const body = await response.json()
  assert.deepEqual(body.task, { _id: 'saved-task', name: 'Test the robot' })
})

test('rejects missing, blank and non-string names before saving', async t => {
  let writes = 0
  TaskModel.prototype.save = async () => { writes += 1; return {} }
  t.after(() => { TaskModel.prototype.save = originalSave })
  for (const body of [{}, { name: '' }, { name: '   ' }, { name: 123 }, { name: [] }]) {
    assert.equal((await post(body)).status, 400)
  }
  assert.equal(writes, 0)
})

test('reports duplicate task names as a conflict', async t => {
  TaskModel.prototype.save = async () => { throw Object.assign(new Error('duplicate'), { code: 11000 }) }
  t.after(() => { TaskModel.prototype.save = originalSave })
  const response = await post({ name: 'Existing task' })
  assert.equal(response.status, 409)
})

test('returns a controlled error when the database write fails', async t => {
  TaskModel.prototype.save = async () => { throw new Error('private database details') }
  t.after(() => { TaskModel.prototype.save = originalSave })
  const response = await post({ name: 'New task' })
  assert.equal(response.status, 500)
  assert.ok(!(await response.text()).includes('private database details'))
})
