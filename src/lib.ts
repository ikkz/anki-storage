import { windowEndpoint, wrap } from "comlink";

const ID = "ikkzAnkiStorage";
const IFRAME_SRC = "https://anki-storage.pages.dev";

declare global {
    interface Window {
        [ID]: any;
    }
}

async function initAnkiStorage(page: string = IFRAME_SRC) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.setAttribute("id", ID);
    iframe.setAttribute("src", page);
    document.body.appendChild(iframe);
    await new Promise((resolve) => iframe.onload = resolve);
    return wrap(windowEndpoint(iframe.contentWindow as Window));
}

export function getAnkiStorage(page: string = IFRAME_SRC) {
    if (window[ID]) {
        return window[ID];
    }
    return (window[ID] = initAnkiStorage(page));
}