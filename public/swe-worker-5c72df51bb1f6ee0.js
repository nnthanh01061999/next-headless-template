self.onmessage = async (e) => {
  switch (e.data.type) {
    case "__START_URL_CACHE__": {
      let t = e.data.url,
        a = await fetch(t);
      if (!a.redirected) return (await caches.open("start-url")).put(t, a);
      return Promise.resolve();
    }
    case "__FRONTEND_NAV_CACHE__": {
      let t = e.data.url,
        a = await caches.open("pages");
      if (await a.match(t, { ignoreSearch: !0 })) return;
      let s = await fetch(t);
      if (!s.ok) return;
      if ((a.put(t, s.clone()), e.data.shouldCacheAggressively && s.headers.get("Content-Type")?.includes("text/html")))
        try {
          let e = await s.text(),
            t = [],
            a = await caches.open("static-style-assets"),
            r = await caches.open("next-static-js-assets"),
            c = await caches.open("static-js-assets");
          for (let [s, r] of e.matchAll(/<link.*?href=['"](.*?)['"].*?>/g)) /rel=['"]stylesheet['"]/.test(s) && t.push(a.match(r).then((e) => (e ? Promise.resolve() : a.add(r))));
          for (let [, a] of e.matchAll(/<script.*?src=['"](.*?)['"].*?>/g)) {
            let e = /\/_next\/static.+\.js$/i.test(a) ? r : c;
            t.push(e.match(a).then((t) => (t ? Promise.resolve() : e.add(a))));
          }
          return await Promise.all(t);
        } catch {}
      return Promise.resolve();
    }
    default:
      return Promise.resolve();
  }
};
