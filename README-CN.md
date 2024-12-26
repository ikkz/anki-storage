# AnkiStorage

在 AnkiDroid 中，reviewer 页面每次启动时都会托管在本地的一个随机端口上，这导致 `localStorage` 无法在每次复习之间共享。因此，使用 `localStorage` 保存用户配置的模板会无法正常工作，例如 [这个问题](https://github.com/ikkz/anki-template/issues/33)。

本项目通过在 reviewer 页面创建一个 `iframe`，利用 `iframe` 与 reviewer 页面之间通过 `postMessage` 的通信机制，使 reviewer 页面能够访问 `iframe` 中共享的 `localStorage`。

## 使用方法

### UMD

在模板代码中加入以下脚本，请注意使用 `await` 的异步方法。

```html
<script src="https://cdn.jsdelivr.net/npm/anki-storage@latest/dist/anki-storage.umd.js"></script>
<script>
  async function main() {
    const as = await AnkiStorage.getAnkiStorage();
    await as.localStorage.setItem("hello", "world");
    console.log(await as.localStorage.getItem("hello")); // 输出 `world`
  }
  main();
</script>
```

### npm

一个使用案例：[storage.ts](https://github.com/ikkz/anki-template/blob/main/src/utils/storage.ts)

```sh
npm install anki-storage
```

```js
import { getAnkiStorage } from "anki-storage";
// 用法与 UMD 版本相同
```