import { windowEndpoint, wrap } from "comlink";

const ID = "ikkzAnkiStorage";
const IFRAME_SRC = "https://ikkz.github.io/anki-storage/index.html";

declare global {
    interface Window {
        [ID]: any;
    }
}

async function initAnkiStorage() {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.setAttribute("id", ID);
    iframe.setAttribute("src", IFRAME_SRC);
    document.body.appendChild(iframe);
    await new Promise((resolve) => iframe.onload = resolve);
    return wrap(windowEndpoint(iframe.contentWindow as Window));
}

export function getAnkiStorage() {
    if (window[ID]) {
        return window[ID];
    }
    return (window[ID] = initAnkiStorage());
}