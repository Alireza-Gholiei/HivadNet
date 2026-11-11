/*!
 * Tiny Mentions plugin
 *
 * Copyright (c) 2023 Ephox Corporation DBA Tiny Technologies, Inc.
 * Licensed under the Tiny commercial license. See https://www.tiny.cloud/legal/
 *
 * Version: 7.6.1-131
 */

!function() {
    "use strict";
    const e = e => parseInt(e, 10)
      , t = (e, t) => {
        const n = e - t;
        return 0 === n ? 0 : n > 0 ? 1 : -1
    }
      , n = (e, t, n) => ({
        major: e,
        minor: t,
        patch: n
    })
      , o = t => {
        const o = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(t);
        return o ? n(e(o[1]), e(o[2]), e(o[3])) : n(0, 0, 0)
    }
      , r = e => t => typeof t === e
      , s = ("string",
    e => "string" === (e => {
        const t = typeof e;
        return null === e ? "null" : "object" === t && Array.isArray(e) ? "array" : "object" === t && (n = o = e,
        (r = String).prototype.isPrototypeOf(n) || (null === (s = o.constructor) || void 0 === s ? void 0 : s.name) === r.name) ? "string" : t;
        var n, o, r, s
    }
    )(e));
    const i = r("boolean")
      , a = r("function")
      , c = r("number")
      , l = () => {}
      , m = (e, t) => e === t
      , u = () => !1;
    class d {
        constructor(e, t) {
            this.tag = e,
            this.value = t
        }
        static some(e) {
            return new d(!0,e)
        }
        static none() {
            return d.singletonNone
        }
        fold(e, t) {
            return this.tag ? t(this.value) : e()
        }
        isSome() {
            return this.tag
        }
        isNone() {
            return !this.tag
        }
        map(e) {
            return this.tag ? d.some(e(this.value)) : d.none()
        }
        bind(e) {
            return this.tag ? e(this.value) : d.none()
        }
        exists(e) {
            return this.tag && e(this.value)
        }
        forall(e) {
            return !this.tag || e(this.value)
        }
        filter(e) {
            return !this.tag || e(this.value) ? this : d.none()
        }
        getOr(e) {
            return this.tag ? this.value : e
        }
        or(e) {
            return this.tag ? this : e
        }
        getOrThunk(e) {
            return this.tag ? this.value : e()
        }
        orThunk(e) {
            return this.tag ? this : e()
        }
        getOrDie(e) {
            if (this.tag)
                return this.value;
            throw new Error(null != e ? e : "Called getOrDie on None")
        }
        static from(e) {
            return null == e ? d.none() : d.some(e)
        }
        getOrNull() {
            return this.tag ? this.value : null
        }
        getOrUndefined() {
            return this.value
        }
        each(e) {
            this.tag && e(this.value)
        }
        toArray() {
            return this.tag ? [this.value] : []
        }
        toString() {
            return this.tag ? `some(${this.value})` : "none()"
        }
    }
    d.singletonNone = new d(!1);
    const h = (e, t) => {
        const n = e.length
          , o = new Array(n);
        for (let r = 0; r < n; r++) {
            const n = e[r];
            o[r] = t(n, r)
        }
        return o
    }
      , g = (e, t) => {
        for (let n = 0, o = e.length; n < o; n++)
            t(e[n], n)
    }
      , p = e => t => t.options.get(e)
      , v = p("mentions_menu_hover")
      , f = p("mentions_fetch")
      , y = p("mentions_menu_complete")
      , _ = p("mentions_menu_cancel")
      , b = p("mentions_select")
      , x = p("mentions_selector")
      , w = p("mentions_css_url")
      , C = p("mentions_item_type")
      , T = p("mentions_min_chars")
      , E = (e, t) => e.dom.is(t, M(e))
      , M = x
      , O = "data-mce-mentions-id"
      , S = e => {
        console.error(e)
    }
      , A = e => e && "string" == typeof e.id && "string" == typeof e.name
      , N = e => {
        A(e) || S("mentions_fetch didn't produce a valid list of users.")
    }
      , L = Object.hasOwnProperty
      , R = (e, t) => P(e, t) ? d.from(e[t]) : d.none()
      , P = (e, t) => L.call(e, t);
    "undefined" != typeof window ? window : Function("return this;")();
    const j = (e, t, n) => {
        ( (e, t, n) => {
            if (!(s(n) || i(n) || c(n)))
                throw console.error("Invalid call to Attribute.set. Key ", t, ":: Value ", n, ":: Element ", e),
                new Error("Attribute value was not simple");
            e.setAttribute(t, n + "")
        }
        )(e.dom, t, n)
    }
      , D = (e, t) => {
        e.dom.removeAttribute(t)
    }
      , k = (e, t) => {
        (e => void 0 !== e.dom.classList)(e) ? e.dom.classList.add(t) : ( (e, t) => {
            ( (e, t, n) => {
                const o = ( (e, t) => {
                    const n = ( (e, t) => {
                        const n = e.dom.getAttribute(t);
                        return null === n ? void 0 : n
                    }
                    )(e, t);
                    return void 0 === n || "" === n ? [] : n.split(" ")
                }
                )(e, t)
                  , r = o.concat([n]);
                j(e, t, r.join(" "))
            }
            )(e, "class", t)
        }
        )(e, t)
    }
      , V = e => {
        if (null == e)
            throw new Error("Node cannot be null or undefined");
        return {
            dom: e
        }
    }
      , U = (e, t) => {
        const n = (t || document).createElement(e);
        return V(n)
    }
      , z = V
      , B = (e, t) => {
        const n = e.dom;
        if (1 !== n.nodeType)
            return !1;
        {
            const e = n;
            if (void 0 !== e.matches)
                return e.matches(t);
            if (void 0 !== e.msMatchesSelector)
                return e.msMatchesSelector(t);
            if (void 0 !== e.webkitMatchesSelector)
                return e.webkitMatchesSelector(t);
            if (void 0 !== e.mozMatchesSelector)
                return e.mozMatchesSelector(t);
            throw new Error("Browser lacks native selectors")
        }
    }
      , F = (e, t) => {
        e.dom.appendChild(t.dom)
    }
      , H = (e, t) => {
        e.dom.textContent = t
    }
      , I = e => t => {
        var n;
        t instanceof window.HTMLElement ? e(t) : (n = t,
        "profile" === n.type ? d.some((e => {
            var t;
            const n = U("div");
            k(n, "tox"),
            k(n, "tox-mentions__card"),
            d.from(e.image).each((e => {
                const t = U("img");
                j(t, "src", e),
                k(t, "tox-mentions__avatar"),
                F(n, t)
            }
            ));
            const o = U("div");
            k(o, "tox-mentions__container"),
            F(n, o);
            const r = U("div");
            return k(r, "tox-mentions__username"),
            H(r, null !== (t = e.fullName) && void 0 !== t ? t : e.name),
            F(o, r),
            d.from(e.description).map((e => {
                const t = U("div");
                k(t, "tox-mentions__description"),
                H(t, e),
                F(o, t)
            }
            )),
            n
        }
        )(n.user)) : d.none()).each((t => e(t.dom)))
    }
      , W = (e, t, n) => ( (e, n, o) => {
        let r = e.dom;
        const s = a(o) ? o : u;
        for (; r.parentNode; ) {
            r = r.parentNode;
            const e = z(r);
            if (B(e, t))
                return d.some(e);
            if (s(e))
                break
        }
        return d.none()
    }
    )(e, 0, n)
      , q = (e, t, n) => ( (e, t, n, o, r) => ( (e, t) => B(e, t))(n, o) ? d.some(n) : a(r) && r(n) ? d.none() : t(n, o, r))(0, W, e, t, n)
      , K = (e, t) => ({
        left: e,
        top: t,
        translate: (n, o) => K(e + n, t + o)
    })
      , $ = K
      , G = (e, t) => {
        let n;
        if (e.inline)
            return t;
        {
            n = tinymce.DOM.getPos(e.getContentAreaContainer());
            const o = (e => {
                const t = void 0 !== e ? e.dom : document
                  , n = t.body.scrollLeft || t.documentElement.scrollLeft
                  , o = t.body.scrollTop || t.documentElement.scrollTop;
                return $(n, o)
            }
            )(z(e.getDoc()));
            return {
                ...t,
                x: t.x + n.x - o.left,
                y: t.y + n.y - o.top
            }
        }
    }
      , J = (e, t) => {
        const n = tinymce.util.Delay
          , o = {};
        let r = null;
        const s = ( () => {
            const e = (e => {
                const t = (e => {
                    let t = e;
                    return {
                        get: () => t,
                        set: e => {
                            t = e
                        }
                    }
                }
                )(d.none())
                  , n = () => t.get().each(e);
                return {
                    clear: () => {
                        n(),
                        t.set(d.none())
                    }
                    ,
                    isSet: () => t.get().isSome(),
                    get: () => t.get(),
                    set: e => {
                        n(),
                        t.set(d.some(e))
                    }
                }
            }
            )(l);
            return {
                ...e,
                on: t => e.get().each(t)
            }
        }
        )()
          , i = T(e)
          , a = C(e);
        let c, u;
        const p = () => {
            null !== r && null !== r.parentNode && (r.removeEventListener("mouseover", y),
            r.removeEventListener("mouseout", _),
            r.parentNode.removeChild(r)),
            r = null
        }
          , v = () => {
            p()
        }
          , f = o => {
            clearTimeout(c),
            clearTimeout(u),
            c = n.setEditorTimeout(e, ( () => {
                return n = o,
                t.selectCard(n, (t => {
                    p(),
                    r = t,
                    r.addEventListener("mouseover", y),
                    r.addEventListener("mouseout", _),
                    r.style.position = "absolute",
                    r.style.left = "-10000px",
                    r.style.top = "-10000px",
                    k(z(r), "tox-mentions__card-common"),
                    document.body.appendChild(r),
                    ( (e, t, n, o) => {
                        let r;
                        const s = ( (e, t) => G(e, e.dom.getRect(t)))(e, n);
                        r = tinymce.DOM.getRect(t),
                        r = ( (e, t, n) => {
                            const o = tinymce.DOM.getViewPort()
                              , r = {
                                ...o,
                                w: o.w - 30,
                                h: o.h - 30
                            }
                              , s = tinymce.geom.Rect
                              , i = s.findBestRelativePosition(e, t, r, n);
                            return s.relativePosition(e, t, i || n[0] || "bl-tl")
                        }
                        )(r, s, o),
                        tinymce.DOM.setStyles(t, {
                            position: "absolute",
                            left: r.x,
                            top: r.y
                        })
                    }
                    )(e, r, n, ["bl-tl", "tl-bl", "tl-br", "bl-tr"])
                }
                ));
                var n
            }
            ), 0)
        }
          , y = () => {
            clearTimeout(u)
        }
          , _ = () => {
            clearTimeout(u),
            clearTimeout(c),
            u = n.setEditorTimeout(e, v, 300)
        }
          , b = () => s.isSet() || E(e, e.selection.getNode()) && !e.selection.isCollapsed()
          , x = "name" === a ? (e, t) => ({
            type: "autocompleteitem",
            value: e.id,
            text: e.name,
            meta: {
                user: e,
                tooltipWorker: t
            }
        }) : (e, t) => {
            const n = R(e, "image").map((t => ({
                type: "cardimage",
                src: t,
                classes: ["tox-mentions__avatar"],
                alt: e.name
            }))).toArray()
              , o = R(e, "description").map((e => ({
                type: "cardtext",
                text: e,
                classes: ["tox-mentions__description"]
            }))).toArray();
            return {
                type: "cardmenuitem",
                value: e.id,
                label: e.name,
                items: [...n, {
                    type: "cardcontainer",
                    direction: "vertical",
                    items: [{
                        type: "cardtext",
                        text: e.name,
                        name: "username",
                        classes: ["tox-mentions__username"]
                    }, ...o]
                }],
                meta: {
                    user: e,
                    tooltipWorker: t
                }
            }
        }
        ;
        e.ui.registry.addAutocompleter("mentions", {
            trigger: "@",
            minChars: i,
            maxResults: 10,
            highlightOn: ["username"],
            onAction: (n, r, s, i) => {
                if (( (e, t, n=m) => e.exists((e => n(e, t))))(R(i, "reload"), !0)) {
                    const {reload: e, ...t} = i;
                    n.reload(t)
                } else
                    ( (n, r) => {
                        const s = t.getMention(n);
                        ( (e, t) => {
                            const n = E(e, t);
                            return n || S("mentions_complete needs to produce a element that matches selector: " + M(e)),
                            n
                        }
                        )(e, s) && (s.contentEditable = "false",
                        s.setAttribute(O, n.id),
                        o[n.id] = n,
                        e.selection.setRng(r),
                        e.insertContent(s.outerHTML))
                    }
                    )(i.user, r),
                    n.hide()
            }
            ,
            fetch: (e, n, o) => new Promise((r => {
                t.getUsers(e, ( (e, n) => {
                    r(( (e, n=[]) => {
                        const o = h(e, (e => x(e, (n => t.hoverCard(e, n)))))
                          , r = h(n, (e => ({
                            value: void 0 === e.value ? "" : e.value,
                            text: e.text,
                            meta: {
                                ...e.meta,
                                reload: !0
                            }
                        })));
                        return [...o, ...r.length > 0 ? [{
                            type: "separator"
                        }] : [], ...r]
                    }
                    )(e, n))
                }
                ), n, o)
            }
            )),
            columns: 1
        }),
        (e => {
            e.on("SetContent", ( () => {
                ( (e, t) => {
                    const n = e.dom.select(M(e), void 0);
                    g(n, (e => j(z(e), "contenteditable", "false"))),
                    n.length > 0 && e.hasFocus() && e.selection.setRng(e.selection.getRng())
                }
                )(e)
            }
            )),
            e.on("PreProcess", (t => {
                ( (e, t, n) => {
                    g(e.dom.select(M(e), t), (e => {
                        const t = z(e);
                        D(t, "contenteditable"),
                        n || D(t, O)
                    }
                    ))
                }
                )(e, t.node, t.source_view)
            }
            )),
            e.on("ResolveName", (t => {
                E(e, t.target) && (t.name = "mention")
            }
            ))
        }
        )(e),
        e.on("mouseover", (t => {
            q(z(t.target), M(e)).each((e => {
                s.set(!0),
                f(e.dom)
            }
            ))
        }
        )),
        e.on("mouseout", (t => {
            q(z(t.target), M(e)).each(( () => {
                s.clear(),
                b() || v()
            }
            ))
        }
        )),
        e.on("nodechange", (t => {
            E(e, t.element) && !e.selection.isCollapsed() ? f(t.element) : b() || _()
        }
        )),
        e.on("remove", p)
    }
    ;
    tinymce.PluginManager.add("mentions", ( (e, n) => {
        if (!( (e, n) => !!e && -1 === ( (e, n) => {
            const o = t(e.major, n.major);
            if (0 !== o)
                return o;
            const r = t(e.minor, n.minor);
            if (0 !== r)
                return r;
            const s = t(e.patch, n.patch);
            return 0 !== s ? s : 0
        }
        )((e => o((e => [e.majorVersion, e.minorVersion].join(".").split(".").slice(0, 3).join("."))(e)))(e), o(n)))(tinymce, "6.8.0")) {
            ( (e, t) => {
                const n = e.options.register;
                g(["mentions_menu_hover", "mentions_fetch", "mentions_menu_complete", "mentions_menu_cancel", "mentions_select"], (e => {
                    n(e, {
                        processor: "function"
                    })
                }
                )),
                n("mentions_selector", {
                    processor: "string",
                    default: ".mention"
                }),
                n("mentions_css_url", {
                    processor: "string",
                    default: t + "/css"
                }),
                n("mentions_item_type", {
                    processor: "string",
                    default: "name"
                }),
                n("mentions_min_chars", {
                    processor: "number",
                    default: 1
                })
            }
            )(e, n);
            const t = (e => {
                const t = tinymce.util.Tools
                  , n = (e => {
                    const t = (e, t) => a(e) ? e : t
                      , n = (e, n) => {
                        let o;
                        const r = t(e, n);
                        return (...e) => {
                            let t = {};
                            const n = e.map((e => {
                                var n;
                                return "function" == typeof e && (n = e,
                                e = (...e) => {
                                    t === o && n(...e)
                                }
                                ),
                                e
                            }
                            ));
                            t = o = {},
                            r(...n)
                        }
                    }
                      , o = n(v(e), l)
                      , r = n(f(e), ( (e, t) => {
                        t([])
                    }
                    ))
                      , s = t(y(e), ( (t, n) => {
                        const o = e.dom.create("span", {
                            class: "mention"
                        });
                        return o.appendChild(e.dom.doc.createTextNode("@" + n.name)),
                        o
                    }
                    ))
                      , i = t(_(e), l);
                    return {
                        hover: o,
                        fetch: r,
                        complete: s,
                        select: n(b(e), l),
                        cancel: i
                    }
                }
                )(e);
                return {
                    getUsers: (e, o, r=10, s={}) => {
                        n.fetch({
                            term: e,
                            meta: s
                        }, ( (e, n) => {
                            t.each(e, N);
                            const s = e.slice(0, r);
                            o(t.grep(s, A), n)
                        }
                        ))
                    }
                    ,
                    getMention: t => n.complete(e, t),
                    hoverCard: (e, t) => n.hover(e, I(t)),
                    selectCard: (e, t) => n.select(e, I(t))
                }
            }
            )(e);
            return J(e, t),
            e.on("init", ( () => {
                (e => {
                    var t;
                    const n = w(e) + "/"
                      , o = d.from(null === (t = e.ui) || void 0 === t ? void 0 : t.styleSheetLoader).getOr(tinymce.DOM.styleSheetLoader)
                      , r = "mentions/css/mentions.css";
                    if (tinymce.Resource.has(r)) {
                        const e = tinymce.Resource.get(r);
                        return Promise.resolve(o.loadRawCss(r, e))
                    }
                    o.load(n + "mentions.css").catch(l)
                }
                )(e)
            }
            )),
            t
        }
        console.error("The mentions plugin requires at least version 6.8.0 of TinyMCE.")
    }
    ))
}();
