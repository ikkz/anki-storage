import { expose, windowEndpoint } from 'comlink'

export interface AnkiStorage {
  localStorage: Storage;
}

expose({
  localStorage: localStorage
} as AnkiStorage, windowEndpoint(self.parent));