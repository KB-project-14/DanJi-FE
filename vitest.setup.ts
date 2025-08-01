import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/server.test'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
