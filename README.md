# AnkiStorage

[简体中文](./README-CN.md)

In AnkiDroid, the reviewer page is hosted on a random local port each time it is launched. This prevents `localStorage` from being shared between reviews. As a result, using `localStorage` to save user-configured templates does not work properly, as described in [this issue](https://github.com/ikkz/anki-template/issues/33).

This project solves the problem by creating an `iframe` on the reviewer page. The `iframe` communicates with the reviewer page using `postMessage`, allowing the reviewer page to access the shared `localStorage` within the `iframe`.

## Usage

### UMD

Add the following script to your template code. Note the use of `await` in asynchronous methods.

```html
<script src="https://cdn.jsdelivr.net/npm/anki-storage@latest/dist/anki-storage.umd.js"></script>
<script>
  async function main() {
    const as = await AnkiStorage.getAnkiStorage();
    await as.localStorage.setItem("hello", "world");
    console.log(await as.localStorage.getItem("hello")); // outputs `world`
  }
  main();
</script>
```

### npm

An example use case: [storage.ts](https://github.com/ikkz/anki-template/blob/main/src/utils/storage.ts)

```sh
npm install anki-storage
```

```js
import { getAnkiStorage } from "anki-storage";
// Usage is the same as with UMD
```
