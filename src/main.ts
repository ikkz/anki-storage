import { expose, windowEndpoint } from 'comlink'

expose({
  localStorage
}, windowEndpoint(self.parent));