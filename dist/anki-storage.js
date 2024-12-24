/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const P = Symbol("Comlink.proxy"), N = Symbol("Comlink.endpoint"), H = Symbol("Comlink.releaseProxy"), A = Symbol("Comlink.finalizer"), E = Symbol("Comlink.thrown"), x = (e) => typeof e == "object" && e !== null || typeof e == "function", I = {
  canHandle: (e) => x(e) && e[P],
  serialize(e) {
    const { port1: t, port2: n } = new MessageChannel();
    return C(e, t), [n, [n]];
  },
  deserialize(e) {
    return e.start(), O(e);
  }
}, _ = {
  canHandle: (e) => x(e) && E in e,
  serialize({ value: e }) {
    let t;
    return e instanceof Error ? t = {
      isError: !0,
      value: {
        message: e.message,
        name: e.name,
        stack: e.stack
      }
    } : t = { isError: !1, value: e }, [t, []];
  },
  deserialize(e) {
    throw e.isError ? Object.assign(new Error(e.value.message), e.value) : e.value;
  }
}, R = /* @__PURE__ */ new Map([
  ["proxy", I],
  ["throw", _]
]);
function V(e, t) {
  for (const n of e)
    if (t === n || n === "*" || n instanceof RegExp && n.test(t))
      return !0;
  return !1;
}
function C(e, t = globalThis, n = ["*"]) {
  t.addEventListener("message", function f(r) {
    if (!r || !r.data)
      return;
    if (!V(n, r.origin)) {
      console.warn(`Invalid origin '${r.origin}' for comlink proxy`);
      return;
    }
    const { id: a, type: g, path: c } = Object.assign({ path: [] }, r.data), u = (r.data.argumentList || []).map(d);
    let s;
    try {
      const o = c.slice(0, -1).reduce((i, y) => i[y], e), l = c.reduce((i, y) => i[y], e);
      switch (g) {
        case "GET":
          s = l;
          break;
        case "SET":
          o[c.slice(-1)[0]] = d(r.data.value), s = !0;
          break;
        case "APPLY":
          s = l.apply(o, u);
          break;
        case "CONSTRUCT":
          {
            const i = new l(...u);
            s = U(i);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: i, port2: y } = new MessageChannel();
            C(e, y), s = j(i, [i]);
          }
          break;
        case "RELEASE":
          s = void 0;
          break;
        default:
          return;
      }
    } catch (o) {
      s = { value: o, [E]: 0 };
    }
    Promise.resolve(s).catch((o) => ({ value: o, [E]: 0 })).then((o) => {
      const [l, i] = k(o);
      t.postMessage(Object.assign(Object.assign({}, l), { id: a }), i), g === "RELEASE" && (t.removeEventListener("message", f), T(t), A in e && typeof e[A] == "function" && e[A]());
    }).catch((o) => {
      const [l, i] = k({
        value: new TypeError("Unserializable return value"),
        [E]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, l), { id: a }), i);
    });
  }), t.start && t.start();
}
function W(e) {
  return e.constructor.name === "MessagePort";
}
function T(e) {
  W(e) && e.close();
}
function O(e, t) {
  const n = /* @__PURE__ */ new Map();
  return e.addEventListener("message", function(r) {
    const { data: a } = r;
    if (!a || !a.id)
      return;
    const g = n.get(a.id);
    if (g)
      try {
        g(a);
      } finally {
        n.delete(a.id);
      }
  }), M(e, n, [], t);
}
function w(e) {
  if (e)
    throw new Error("Proxy has been released and is not useable");
}
function z(e) {
  return m(e, /* @__PURE__ */ new Map(), {
    type: "RELEASE"
  }).then(() => {
    T(e);
  });
}
const b = /* @__PURE__ */ new WeakMap(), p = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
  const t = (b.get(e) || 0) - 1;
  b.set(e, t), t === 0 && z(e);
});
function v(e, t) {
  const n = (b.get(t) || 0) + 1;
  b.set(t, n), p && p.register(e, t, e);
}
function D(e) {
  p && p.unregister(e);
}
function M(e, t, n = [], f = function() {
}) {
  let r = !1;
  const a = new Proxy(f, {
    get(g, c) {
      if (w(r), c === H)
        return () => {
          D(a), z(e), t.clear(), r = !0;
        };
      if (c === "then") {
        if (n.length === 0)
          return { then: () => a };
        const u = m(e, t, {
          type: "GET",
          path: n.map((s) => s.toString())
        }).then(d);
        return u.then.bind(u);
      }
      return M(e, t, [...n, c]);
    },
    set(g, c, u) {
      w(r);
      const [s, o] = k(u);
      return m(e, t, {
        type: "SET",
        path: [...n, c].map((l) => l.toString()),
        value: s
      }, o).then(d);
    },
    apply(g, c, u) {
      w(r);
      const s = n[n.length - 1];
      if (s === N)
        return m(e, t, {
          type: "ENDPOINT"
        }).then(d);
      if (s === "bind")
        return M(e, t, n.slice(0, -1));
      const [o, l] = S(u);
      return m(e, t, {
        type: "APPLY",
        path: n.map((i) => i.toString()),
        argumentList: o
      }, l).then(d);
    },
    construct(g, c) {
      w(r);
      const [u, s] = S(c);
      return m(e, t, {
        type: "CONSTRUCT",
        path: n.map((o) => o.toString()),
        argumentList: u
      }, s).then(d);
    }
  });
  return v(a, e), a;
}
function F(e) {
  return Array.prototype.concat.apply([], e);
}
function S(e) {
  const t = e.map(k);
  return [t.map((n) => n[0]), F(t.map((n) => n[1]))];
}
const L = /* @__PURE__ */ new WeakMap();
function j(e, t) {
  return L.set(e, t), e;
}
function U(e) {
  return Object.assign(e, { [P]: !0 });
}
function G(e, t = globalThis, n = "*") {
  return {
    postMessage: (f, r) => e.postMessage(f, n, r),
    addEventListener: t.addEventListener.bind(t),
    removeEventListener: t.removeEventListener.bind(t)
  };
}
function k(e) {
  for (const [t, n] of R)
    if (n.canHandle(e)) {
      const [f, r] = n.serialize(e);
      return [
        {
          type: "HANDLER",
          name: t,
          value: f
        },
        r
      ];
    }
  return [
    {
      type: "RAW",
      value: e
    },
    L.get(e) || []
  ];
}
function d(e) {
  switch (e.type) {
    case "HANDLER":
      return R.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function m(e, t, n, f) {
  return new Promise((r) => {
    const a = Y();
    t.set(a, r), e.start && e.start(), e.postMessage(Object.assign({ id: a }, n), f);
  });
}
function Y() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
const h = "ikkzAnkiStorage", q = "https://ikkz.github.io/anki-storage/index.html";
async function X() {
  const e = document.createElement("iframe");
  return e.style.display = "none", e.setAttribute("id", h), e.setAttribute("src", q), document.body.appendChild(e), await new Promise((t) => e.onload = t), O(G(e.contentWindow));
}
function $() {
  return window[h] ? window[h] : window[h] = X();
}
export {
  $ as getAnkiStorage
};
