/*!
 * Tiny Comments plugin
 *
 * Copyright (c) 2023 Ephox Corporation DBA Tiny Technologies, Inc.
 * Licensed under the Tiny commercial license. See https://www.tiny.cloud/legal/
 *
 * Version: 7.6.1-131
 */

!function() {
    "use strict";
    var e = function(e) {
        if (null === e)
            return "null";
        if (void 0 === e)
            return "undefined";
        var t = typeof e;
        return "object" === t && (Array.prototype.isPrototypeOf(e) || e.constructor && "Array" === e.constructor.name) ? "array" : "object" === t && (String.prototype.isPrototypeOf(e) || e.constructor && "String" === e.constructor.name) ? "string" : t
    }
      , t = function(e) {
        return {
            eq: e
        }
    }
      , o = t((function(e, t) {
        return e === t
    }
    ))
      , n = function(e) {
        return t((function(t, o) {
            if (t.length !== o.length)
                return !1;
            for (var n = t.length, r = 0; r < n; r++)
                if (!e.eq(t[r], o[r]))
                    return !1;
            return !0
        }
        ))
    }
      , r = t((function(s, a) {
        if (s === a)
            return !0;
        var i, c = e(s);
        return c === e(a) && (function(e) {
            return -1 !== ["undefined", "boolean", "number", "string", "function", "xml", "null"].indexOf(e)
        }(c) ? s === a : "array" === c ? n(r).eq(s, a) : "object" === c && (i = r,
        t((function(e, r) {
            var s = Object.keys(e)
              , a = Object.keys(r);
            if (!function(e, o) {
                return function(e, o) {
                    return t((function(t, n) {
                        return e.eq(o(t), o(n))
                    }
                    ))
                }(n(e), (function(e) {
                    return function(e, t) {
                        return Array.prototype.slice.call(e).sort(t)
                    }(e, o)
                }
                ))
            }(o).eq(s, a))
                return !1;
            for (var c = s.length, l = 0; l < c; l++) {
                var m = s[l];
                if (!i.eq(e[m], r[m]))
                    return !1
            }
            return !0
        }
        ))).eq(s, a))
    }
    ));
    const s = Object.getPrototypeOf
      , a = (e, t, o) => {
        var n;
        return !!o(e, t.prototype) || (null === (n = e.constructor) || void 0 === n ? void 0 : n.name) === t.name
    }
      , i = e => t => (e => {
        const t = typeof e;
        return null === e ? "null" : "object" === t && Array.isArray(e) ? "array" : "object" === t && a(e, String, ( (e, t) => t.isPrototypeOf(e))) ? "string" : t
    }
    )(t) === e
      , c = e => t => typeof t === e
      , l = e => t => e === t
      , m = i("string")
      , d = i("object")
      , u = e => ( (e, t) => d(e) && a(e, t, ( (e, t) => s(e) === t)))(e, Object)
      , _ = l(null)
      , v = c("boolean")
      , p = l(void 0)
      , h = e => !(e => null == e)(e)
      , g = c("function")
      , f = c("number")
      , y = () => {}
      , b = e => () => e
      , w = e => e
      , x = e => e()
      , C = b(!1)
      , S = b(!0);
    class A {
        constructor(e, t) {
            this.tag = e,
            this.value = t
        }
        static some(e) {
            return new A(!0,e)
        }
        static none() {
            return A.singletonNone
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
            return this.tag ? A.some(e(this.value)) : A.none()
        }
        bind(e) {
            return this.tag ? e(this.value) : A.none()
        }
        exists(e) {
            return this.tag && e(this.value)
        }
        forall(e) {
            return !this.tag || e(this.value)
        }
        filter(e) {
            return !this.tag || e(this.value) ? this : A.none()
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
            return h(e) ? A.some(e) : A.none()
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
    A.singletonNone = new A(!1);
    const k = Array.prototype.slice
      , D = Array.prototype.indexOf
      , O = (e, t) => {
        return o = e,
        n = t,
        D.call(o, n) > -1;
        var o, n
    }
      , R = (e, t) => {
        const o = e.length
          , n = new Array(o);
        for (let r = 0; r < o; r++) {
            const o = e[r];
            n[r] = t(o, r)
        }
        return n
    }
      , E = (e, t) => {
        for (let o = 0, n = e.length; o < n; o++)
            t(e[o], o)
    }
      , T = (e, t) => {
        const o = [];
        for (let n = 0, r = e.length; n < r; n++) {
            const r = e[n];
            t(r, n) && o.push(r)
        }
        return o
    }
      , M = (e, t) => ( (e, t, o) => {
        for (let n = 0, r = e.length; n < r; n++) {
            const r = e[n];
            if (t(r, n))
                return A.some(r);
            if (o(r, n))
                break
        }
        return A.none()
    }
    )(e, t, C)
      , j = (e, t) => t >= 0 && t < e.length ? A.some(e[t]) : A.none()
      , N = e => j(e, 0)
      , L = e => {
        let t = e;
        return {
            get: () => t,
            set: e => {
                t = e
            }
        }
    }
      , P = Object.keys
      , I = Object.hasOwnProperty
      , U = (e, t) => {
        const o = P(e);
        for (let n = 0, r = o.length; n < r; n++) {
            const r = o[n];
            t(e[r], r)
        }
    }
      , $ = (e, t) => B(e, ( (e, o) => ({
        k: o,
        v: t(e, o)
    })))
      , B = (e, t) => {
        const o = {};
        return U(e, ( (e, n) => {
            const r = t(e, n);
            o[r.k] = r.v
        }
        )),
        o
    }
      , H = (e, t) => {
        const o = {};
        var n;
        return ( (e, t, o, n) => {
            U(e, ( (e, r) => {
                (t(e, r) ? o : n)(e, r)
            }
            ))
        }
        )(e, t, (n = o,
        (e, t) => {
            n[t] = e
        }
        ), y),
        o
    }
      , F = (e, t) => I.call(e, t)
      , q = e => parseInt(e, 10)
      , Y = (e, t) => {
        const o = e - t;
        return 0 === o ? 0 : o > 0 ? 1 : -1
    }
      , V = (e, t, o) => ({
        major: e,
        minor: t,
        patch: o
    })
      , W = e => {
        const t = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e);
        return t ? V(q(t[1]), q(t[2]), q(t[3])) : V(0, 0, 0)
    }
    ;
    let z = []
      , G = (e, t) => {
        let o = []
          , n = {
            get: () => (n.lc || n.listen(( () => {}
            ))(),
            n.value),
            l: t || 0,
            lc: 0,
            listen: (e, t) => (n.lc = o.push(e, t || n.l) / 2,
            () => {
                let t = o.indexOf(e);
                ~t && (o.splice(t, 2),
                --n.lc || n.off())
            }
            ),
            notify(e, t) {
                let r = !z.length;
                for (let r = 0; r < o.length; r += 2)
                    z.push(o[r], o[r + 1], n.value, e, t);
                if (r) {
                    for (let e = 0; e < z.length; e += 5) {
                        let t;
                        for (let o = e + 1; !t && (o += 5) < z.length; )
                            z[o] < z[e + 1] && (t = z.push(z[e], z[e + 1], z[e + 2], z[e + 3], z[e + 4]));
                        t || z[e](z[e + 2], z[e + 3], z[e + 4])
                    }
                    z.length = 0
                }
            },
            off() {},
            set(e) {
                let t = n.value;
                t !== e && (n.value = e,
                n.notify(t))
            },
            subscribe(e, t) {
                let o = n.listen(e, t);
                return e(n.value),
                o
            },
            value: e
        };
        return n
    }
      , Q = 0;
    const J = e => {
        const t = (new Date).getTime()
          , o = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295 * 1e9);
        return Q++,
        e + "_" + o + Q + String(t)
    }
      , K = "undefined" != typeof window ? window : Function("return this;")()
      , X = (e, t) => ( (e, t) => {
        let o = null != t ? t : K;
        for (let t = 0; t < e.length && null != o; ++t)
            o = o[e[t]];
        return o
    }
    )(e.split("."), t)
      , Z = Object.getPrototypeOf
      , ee = e => {
        const t = X("ownerDocument.defaultView", e);
        return d(e) && ((e => ( (e, t) => {
            const o = ( (e, t) => X(e, t))(e, t);
            if (null == o)
                throw new Error(e + " not available on this browser");
            return o
        }
        )("HTMLElement", e))(t).prototype.isPrototypeOf(e) || /^HTML\w*Element$/.test(Z(e).constructor.name))
    }
      , te = (1,
    e => 1 === (e => e.dom.nodeType)(e));
    const oe = e => t => te(t) && t.dom.nodeName.toLowerCase() === e
      , ne = (e, t, o) => {
        if (!(m(o) || v(o) || f(o)))
            throw console.error("Invalid call to Attribute.set. Key ", t, ":: Value ", o, ":: Element ", e),
            new Error("Attribute value was not simple");
        e.setAttribute(t, o + "")
    }
      , re = (e, t, o) => {
        ne(e.dom, t, o)
    }
      , se = (e, t) => {
        const o = e.dom.getAttribute(t);
        return null === o ? void 0 : o
    }
      , ae = (e, t) => A.from(se(e, t))
      , ie = (e, t) => {
        e.dom.removeAttribute(t)
    }
      , ce = (e, t, o=0, n) => {
        const r = e.indexOf(t, o);
        return -1 !== r && (!!p(n) || r + t.length <= n)
    }
      , le = (e, t) => ( (e, t, o) => "" === t || e.length >= t.length && e.substr(0, 0 + t.length) === t)(e, t)
      , me = e => t => t.replace(e, "")
      , de = me(/^\s+|\s+$/g)
      , ue = me(/^\s+/g)
      , _e = e => e.length > 0
      , ve = e => {
        if (null == e)
            throw new Error("Node cannot be null or undefined");
        return {
            dom: e
        }
    }
      , pe = (e, t) => {
        const o = (t || document).createElement(e);
        return ve(o)
    }
      , he = ve
      , ge = (e, t) => {
        const o = e.dom;
        if (1 !== o.nodeType)
            return !1;
        {
            const e = o;
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
      , fe = e => 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType || 0 === e.childElementCount
      , ye = e => A.from(e.dom.parentNode).map(he)
      , be = e => R(e.dom.childNodes, he)
      , we = () => xe(he(document))
      , xe = e => {
        const t = e.dom.body;
        if (null == t)
            throw new Error("Body is not available yet");
        return he(t)
    }
      , Ce = (e, t) => {
        e.dom.appendChild(t.dom)
    }
      , Se = e => {
        const t = e.dom;
        null !== t.parentNode && t.parentNode.removeChild(t)
    }
      , Ae = e => {
        const t = be(e);
        var o, n;
        t.length > 0 && (o = e,
        E(n = t, ( (e, t) => {
            ( (e, t) => {
                const o = (e => A.from(e.dom.nextSibling).map(he))(e);
                o.fold(( () => {
                    ye(e).each((e => {
                        Ce(e, t)
                    }
                    ))
                }
                ), (e => {
                    ( (e, t) => {
                        ye(e).each((o => {
                            o.dom.insertBefore(t.dom, e.dom)
                        }
                        ))
                    }
                    )(e, t)
                }
                ))
            }
            )(0 === t ? o : n[t - 1], e)
        }
        ))),
        Se(e)
    }
      , ke = (e, t) => {
        const o = (e => he(e.dom.ownerDocument))(e)
          , n = o.dom
          , r = he(n.createDocumentFragment());
        ( (e, t) => {
            E(t, (t => {
                Ce(e, t)
            }
            ))
        }
        )(r, ( (e, t) => {
            const o = (t || document).createElement("div");
            return o.innerHTML = e,
            be(he(o))
        }
        )(t, n)),
        (e => {
            e.dom.textContent = "",
            E(be(e), (e => {
                Se(e)
            }
            ))
        }
        )(e),
        Ce(e, r)
    }
      , De = () => Oe(0, 0)
      , Oe = (e, t) => ({
        major: e,
        minor: t
    })
      , Re = {
        nu: Oe,
        detect: (e, t) => {
            const o = String(t).toLowerCase();
            return 0 === e.length ? De() : ( (e, t) => {
                const o = ( (e, t) => {
                    for (let o = 0; o < e.length; o++) {
                        const n = e[o];
                        if (n.test(t))
                            return n
                    }
                }
                )(e, t);
                if (!o)
                    return {
                        major: 0,
                        minor: 0
                    };
                const n = e => Number(t.replace(o, "$" + e));
                return Oe(n(1), n(2))
            }
            )(e, o)
        }
        ,
        unknown: De
    }
      , Ee = (e, t) => {
        const o = String(t).toLowerCase();
        return M(e, (e => e.search(o)))
    }
      , Te = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/
      , Me = e => t => ce(t, e)
      , je = [{
        name: "Edge",
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: e => ce(e, "edge/") && ce(e, "chrome") && ce(e, "safari") && ce(e, "applewebkit")
    }, {
        name: "Chromium",
        brand: "Chromium",
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, Te],
        search: e => ce(e, "chrome") && !ce(e, "chromeframe")
    }, {
        name: "IE",
        versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
        search: e => ce(e, "msie") || ce(e, "trident")
    }, {
        name: "Opera",
        versionRegexes: [Te, /.*?opera\/([0-9]+)\.([0-9]+).*/],
        search: Me("opera")
    }, {
        name: "Firefox",
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: Me("firefox")
    }, {
        name: "Safari",
        versionRegexes: [Te, /.*?cpu os ([0-9]+)_([0-9]+).*/],
        search: e => (ce(e, "safari") || ce(e, "mobile/")) && ce(e, "applewebkit")
    }]
      , Ne = [{
        name: "Windows",
        search: Me("win"),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
    }, {
        name: "iOS",
        search: e => ce(e, "iphone") || ce(e, "ipad"),
        versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/]
    }, {
        name: "Android",
        search: Me("android"),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
    }, {
        name: "macOS",
        search: Me("mac os x"),
        versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/]
    }, {
        name: "Linux",
        search: Me("linux"),
        versionRegexes: []
    }, {
        name: "Solaris",
        search: Me("sunos"),
        versionRegexes: []
    }, {
        name: "FreeBSD",
        search: Me("freebsd"),
        versionRegexes: []
    }, {
        name: "ChromeOS",
        search: Me("cros"),
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/]
    }]
      , Le = {
        browsers: b(je),
        oses: b(Ne)
    }
      , Pe = "Edge"
      , Ie = "Chromium"
      , Ue = "Opera"
      , $e = "Firefox"
      , Be = "Safari"
      , He = e => {
        const t = e.current
          , o = e.version
          , n = e => () => t === e;
        return {
            current: t,
            version: o,
            isEdge: n(Pe),
            isChromium: n(Ie),
            isIE: n("IE"),
            isOpera: n(Ue),
            isFirefox: n($e),
            isSafari: n(Be)
        }
    }
      , Fe = () => He({
        current: void 0,
        version: Re.unknown()
    })
      , qe = He
      , Ye = (b(Pe),
    b(Ie),
    b("IE"),
    b(Ue),
    b($e),
    b(Be),
    "Windows")
      , Ve = "Android"
      , We = "Linux"
      , ze = "macOS"
      , Ge = "Solaris"
      , Qe = "FreeBSD"
      , Je = "ChromeOS"
      , Ke = e => {
        const t = e.current
          , o = e.version
          , n = e => () => t === e;
        return {
            current: t,
            version: o,
            isWindows: n(Ye),
            isiOS: n("iOS"),
            isAndroid: n(Ve),
            isMacOS: n(ze),
            isLinux: n(We),
            isSolaris: n(Ge),
            isFreeBSD: n(Qe),
            isChromeOS: n(Je)
        }
    }
      , Xe = () => Ke({
        current: void 0,
        version: Re.unknown()
    })
      , Ze = Ke
      , et = (b(Ye),
    b("iOS"),
    b(Ve),
    b(We),
    b(ze),
    b(Ge),
    b(Qe),
    b(Je),
    (e, t, o) => {
        const n = Le.browsers()
          , r = Le.oses()
          , s = t.bind((e => ( (e, t) => ( (e, t) => {
            for (let o = 0; o < e.length; o++) {
                const n = t(e[o]);
                if (n.isSome())
                    return n
            }
            return A.none()
        }
        )(t.brands, (t => {
            const o = t.brand.toLowerCase();
            return M(e, (e => {
                var t;
                return o === (null === (t = e.brand) || void 0 === t ? void 0 : t.toLowerCase())
            }
            )).map((e => ({
                current: e.name,
                version: Re.nu(parseInt(t.version, 10), 0)
            })))
        }
        )))(n, e))).orThunk(( () => ( (e, t) => Ee(e, t).map((e => {
            const o = Re.detect(e.versionRegexes, t);
            return {
                current: e.name,
                version: o
            }
        }
        )))(n, e))).fold(Fe, qe)
          , a = ( (e, t) => Ee(e, t).map((e => {
            const o = Re.detect(e.versionRegexes, t);
            return {
                current: e.name,
                version: o
            }
        }
        )))(r, e).fold(Xe, Ze)
          , i = ( (e, t, o, n) => {
            const r = e.isiOS() && !0 === /ipad/i.test(o)
              , s = e.isiOS() && !r
              , a = e.isiOS() || e.isAndroid()
              , i = a || n("(pointer:coarse)")
              , c = r || !s && a && n("(min-device-width:768px)")
              , l = s || a && !c
              , m = t.isSafari() && e.isiOS() && !1 === /safari/i.test(o)
              , d = !l && !c && !m;
            return {
                isiPad: b(r),
                isiPhone: b(s),
                isTablet: b(c),
                isPhone: b(l),
                isTouch: b(i),
                isAndroid: e.isAndroid,
                isiOS: e.isiOS,
                isWebView: b(m),
                isDesktop: b(d)
            }
        }
        )(a, s, e, o);
        return {
            browser: s,
            os: a,
            deviceType: i
        }
    }
    )
      , tt = e => window.matchMedia(e).matches
      , ot = (e => {
        let t, o = !1;
        return (...n) => (o || (o = !0,
        t = e.apply(null, n)),
        t)
    }
    )(( () => et(window.navigator.userAgent, A.from(window.navigator.userAgentData), tt)))().os.isMacOS() ? "\u2318" : "Ctrl"
      , nt = $({
        tc_conversations_title: "Comments",
        tc_announce_sidebar_available: `Comment. Sidebar available. Press ${ot} + Alt + M to switch to sidebar`,
        tc_items_addcomment: "Add comment",
        tc_items_showcomments: "Show comments",
        tc_items_deleteall: "Delete all conversations",
        tc_edit_buttons_save: "Save",
        tc_edit_buttons_saving: "Saving",
        tc_edit_buttons_cancel: "Cancel",
        tc_reply_buttons_comment: "Comment",
        tc_reply_buttons_clear: "Clear",
        tc_reply_placeholders: "Add comment...",
        tc_reply_with_mentions_placeholders: "Comment or mention with @",
        tc_kebab_tooltip: "Comment Actions",
        tc_kebab_tooltip_conversation: "Conversation Actions",
        tc_kebab_delete_conversation: "Delete conversation",
        tc_kebab_resolve_conversation: "Resolve conversation",
        tc_kebab_delete: "Delete",
        tc_kebab_edit: "Edit",
        tc_edit_problem_comment: "An error occurred editing this comment. See the console for details.",
        tc_edit_unauthorised_comment: "You are not allowed to edit this comment",
        tc_delete_buttons_cancel: "Cancel",
        tc_delete_buttons_proceed: "Delete",
        tc_resolve_buttons_proceed: "Resolve",
        tc_create_problem: "An error occurred while creating a comment. See the console for details",
        tc_reply_problem: "An error occurred while replying to a comment. See the console for details",
        tc_delete_prompts_conversation: "Delete this conversation?",
        tc_delete_prompts_conversation_detail_sing: "1 comment will be deleted. You can't undo this action.",
        tc_delete_prompts_conversation_detail_pl: "{0} comments will be deleted. You can't undo this action.",
        tc_delete_prompts_all: "Delete all conversations in the content? This cannot be undone.",
        tc_delete_prompts_comment: "Are you sure you want to delete this comment?",
        tc_resolve_prompts_conversation: "Resolve this conversation?",
        tc_resolve_prompts_conversation_detail_sing: "1 comment will be resolved. You can't undo this action.",
        tc_resolve_prompts_conversation_detail_pl: "{0} comments will be resolved. You can't undo this action.",
        tc_delete_problem_all: "An error occurred deleting all the conversations. See the console for details.",
        tc_delete_problem_conversation: "An error occurred deleting the conversation. See the console for details.",
        tc_delete_problem_comment: "An error occurred deleting the comment. See the console for details.",
        tc_delete_unauthorised_all: "You are not allowed to delete all the conversations",
        tc_delete_unauthorised_conversation: "You are not allowed to delete this conversation",
        tc_delete_unauthorised_comment: "You are not allowed to delete this comment",
        tc_resolve_unauthorised_conversation: "You are not allowed to resolve this conversation",
        tc_resolve_problem_conversation: "An error occurred resolving the conversation. See the console for details.",
        tc_date_less_than_a_minute_ago: "a moment ago",
        tc_date_1_minute_ago: "1 minute ago",
        tc_date_x_minutes_ago: "{0} minutes ago",
        tc_date_1_hour_ago: "1 hour ago",
        tc_date_x_hours_ago: "{0} hours ago",
        tc_date_1_day_ago: "1 day ago",
        tc_date_x_days_ago: "{0} days ago",
        tc_date_1_week_ago: "1 week ago",
        tc_date_x_weeks_ago: "{0} weeks ago",
        tc_date_1_month_ago: "1 month ago",
        tc_date_x_months_ago: "{0} months ago",
        tc_date_1_year_ago: "1 year ago",
        tc_date_x_years_ago: "{0} years ago",
        tc_date_comment_edited: " (edited)",
        tc_conversations_one_reply: "1 reply",
        tc_conversations_multiple_replies: "{0} replies",
        tc_dialog_delete_conversation: "Delete Conversation",
        tc_dialog_resolve_conversation: "Resolve Conversation",
        tc_dialog_delete_comment: "Delete Comment",
        tc_mentions_no_results: "No users found"
    }, w)
      , rt = J("aria-comment-description");
    let st = 0;
    const at = e => {
        const t = (o = we(),
        n = `#${rt}`,
        ( (e, t) => {
            const o = void 0 === t ? document : t.dom;
            return fe(o) ? A.none() : A.from(o.querySelector(e)).map(he)
        }
        )(n, o)).getOrThunk(( () => {
            const e = pe("span");
            return ( (e, t) => {
                const o = e.dom;
                U(t, ( (e, t) => {
                    ne(o, t, e)
                }
                ))
            }
            )(e, {
                id: rt,
                "aria-live": "polite",
                "aria-atomic": "true",
                role: "alert"
            }),
            ( (e, t) => {
                const o = e.dom;
                U({
                    position: "absolute",
                    left: "-10000px",
                    top: "-1000px"
                }, ( (e, t) => {
                    ( (e, t, o) => {
                        if (!m(o))
                            throw console.error("Invalid call to CSS.set. Property ", t, ":: Value ", o, ":: Element ", e),
                            new Error("CSS value must be a string: " + o);
                        (e => void 0 !== e.style && g(e.style.getPropertyValue))(e) && e.style.setProperty(t, o)
                    }
                    )(o, t, e)
                }
                ))
            }
            )(e),
            Ce(we(), e),
            e
        }
        ));
        var o, n;
        return st++,
        ( (e, t) => ({
            onComment: () => {
                ke(t, e.translate(nt.tc_announce_sidebar_available))
            }
            ,
            notOnComment: () => {
                ke(t, "")
            }
            ,
            getMarker: () => t,
            release: () => {
                st--,
                0 === st && Se(t)
            }
        }))(e, t)
    }
      , it = () => (new Date).toISOString();
    var ct;
    !function(e) {
        e[e.LessThanMinute = 0] = "LessThanMinute",
        e[e.Minute = 1] = "Minute",
        e[e.Hour = 2] = "Hour",
        e[e.Day = 3] = "Day",
        e[e.Week = 4] = "Week",
        e[e.Month = 5] = "Month",
        e[e.Year = 6] = "Year"
    }(ct || (ct = {}));
    const lt = (e, t="") => {
        const o = e.get()
          , n = "" === t ? 0 : Date.parse(t);
        return {
            timestamp: it(),
            events: n > 0 ? T(o, (e => Date.parse(e.timestamp) > n)) : o
        }
    }
      , mt = e => (t={}) => m(t.after) ? lt(e, t.after) : lt(e)
      , dt = (e, t) => ( (e, t) => {
        const o = void 0 === t ? document : t.dom;
        return fe(o) ? [] : R(o.querySelectorAll(e), he)
    }
    )(t, e)
      , ut = b("tox-comment")
      , _t = b("tinycomments")
      , vt = b("mce-annotation")
      , pt = b("data-mce-annotation")
      , ht = b("data-mce-annotation-uid")
      , gt = b("data-mce-annotation-active")
      , ft = b("data-mce-annotation-classes")
      , yt = b("data-mce-annotation-attrs")
      , bt = b("tmp")
      , wt = b("tox-comments-visible")
      , xt = e => P(e.annotator.getAll(_t()))
      , Ct = e => le(e, bt())
      , St = (e, t) => {
        const o = he(t.commonAncestorContainer)
          , n = te(r = o) && ee(r.dom) ? A.some(o) : (e => A.from(e.dom.parentElement).map(he))(o);
        var r;
        const s = `[${pt()}="${_t()}"]`
          , a = n.map((e => dt(e, s))).getOr([])
          , i = (e => {
            const t = k.call(e, 0);
            return t.reverse(),
            t
        }
        )(( (t, o, n) => ( (e, t, o) => T(( (e, t) => {
            const o = g(t) ? t : C;
            let n = e.dom;
            const r = [];
            for (; null !== n.parentNode && void 0 !== n.parentNode; ) {
                const e = n.parentNode
                  , t = he(e);
                if (r.push(t),
                !0 === o(t))
                    break;
                n = e
            }
            return r
        }
        )(e, o), t))(t, (e => ge(e, o)), (t => t.dom === e.getBody())))(o, s));
        return ge(o, s) && i.push(o),
        T(i.concat(a), (e => {
            return !(se(o = e, pt()) === _t() && ae(o, ht()).exists(Ct)) && ( (e, t) => e.intersectsNode(t.dom))(t, e);
            var o
        }
        ))
    }
      , At = oe("hr")
      , kt = e => {
        const t = he(e.selection.getNode())
          , o = he(e.selection.getStart());
        return (e => {
            let t = e.selection.getRng().commonAncestorContainer;
            return 3 === t.nodeType && (t = t.parentNode),
            !!h(t) && e.dom.isEmpty(t)
        }
        )(e) || At(t) || At(o)
    }
      , Dt = (e, t) => kt(e) || !(e => {
        if (e.selection) {
            const t = e.selection.getRng()
              , o = St(e, t);
            return N(o).forall((e => {
                return (n = o,
                j(n, n.length - 1)).forall((n => {
                    const r = se(e, ht());
                    if (( (e, t) => {
                        for (let t = 0, n = e.length; t < n; t++)
                            if (o = e[t],
                            se(o, ht()) !== r)
                                return !0;
                        var o;
                        return !1
                    }
                    )(o))
                        return !1;
                    const s = new window.Range;
                    return s.setStartBefore(e.dom),
                    s.setEndAfter(n.dom),
                    s.compareBoundaryPoints(window.Range.START_TO_START, t) <= 0 && s.compareBoundaryPoints(window.Range.END_TO_END, t) >= 0
                }
                ));
                var n
            }
            ))
        }
        return !1
    }
    )(e) || !t.get().canWrite
      , Ot = (e, t) => {
        const o = se(e, t);
        return void 0 === o || "" === o ? [] : o.split(" ")
    }
      , Rt = e => void 0 !== e.dom.classList
      , Et = (e, t) => {
        Rt(e) ? e.dom.classList.remove(t) : ( (e, t) => {
            ( (e, t, o) => {
                const n = T(Ot(e, t), (e => e !== o));
                n.length > 0 ? re(e, t, n.join(" ")) : ie(e, t)
            }
            )(e, "class", t)
        }
        )(e, t),
        (e => {
            const t = Rt(e) ? e.dom.classList : (e => Ot(e, "class"))(e);
            0 === t.length && ie(e, "class")
        }
        )(e)
    }
      , Tt = oe("span")
      , Mt = e => {
        Tt(e) ? Ae(e) : (e => {
            Et(e, vt()),
            ie(e, `${ht()}`),
            ie(e, `${pt()}`),
            ie(e, `${gt()}`);
            const t = ae(e, `${yt()}`).map((e => e.split(","))).getOr([])
              , o = ae(e, `${ft()}`).map((e => e.split(","))).getOr([]);
            E(t, (t => ie(e, t))),
            ( (e, t) => {
                E(t, (t => {
                    Et(e, t)
                }
                ))
            }
            )(e, o),
            ie(e, `${ft()}`),
            ie(e, `${yt()}`)
        }
        )(e)
    }
      , jt = (e, t, o, n) => (ke(e, t),
    E(dt(e, o), n),
    e.dom.innerHTML)
      , Nt = (e, t, o) => {
        const n = pe("div");
        E(e, (e => {
            if (e.content = jt(n, e.content, t, o),
            h(e.fragments))
                for (let r = 0; r < e.fragments.length; r++)
                    e.fragments[r] = jt(n, e.fragments[r], t, o)
        }
        ))
    }
      , Lt = (e, t, o) => {
        e.notificationManager.open({
            text: t,
            type: "error"
        }),
        o && console.error(t, o)
    }
      , Pt = "tc-try-delete-all-conversations"
      , It = (e, t) => {
        e.addCommand("tc-delete-conversation-at-cursor", ( (o, n) => {
            if (kt(e))
                return;
            const r = (null == n ? void 0 : n.conversationUid) ? A.from(n.conversationUid) : (e => {
                const t = H(e.annotator.getAll(_t()), (t => O(t, e.selection.getNode())));
                return N(P(t))
            }
            )(e);
            r.each((o => {
                var n;
                e.undoManager.transact(( () => e.annotator.remove(_t()))),
                n = e.undoManager.data,
                Nt(n, (e => `[${ht()}="${e}"]`)(o), Mt),
                t.set(t.get().filter((e => e !== o))),
                e.focus()
            }
            ))
        }
        ))
    }
      , Ut = (e, t, o, n) => {
        It(e, n),
        ( (e, t, o, n) => {
            e.addCommand(Pt, ( () => {
                kt(e) || e.windowManager.confirm(nt.tc_delete_prompts_all, (r => {
                    if (r)
                        return t.deleteAllConversations({}).get((t => {
                            t.fold((t => Lt(e, nt.tc_delete_problem_all, t)), (t => {
                                var r;
                                t.canDelete ? (o({
                                    type: "delete-all-conversations",
                                    timestamp: it()
                                }),
                                e.annotator.removeAll(_t()),
                                r = e.undoManager.data,
                                Nt(r, `[${pt()}="${_t()}"]`, Mt),
                                e.undoManager.dispatchChange(),
                                n.set([]),
                                e.focus()) : Lt(e, nt.tc_delete_unauthorised_all)
                            }
                            ))
                        }
                        ))
                }
                ))
            }
            ))
        }
        )(e, t, o, n)
    }
      , $t = e => {
        e.execCommand("ToggleSidebar", !1, "showcomments")
    }
      , Bt = e => {
        let t = A.none()
          , o = [];
        const n = e => {
            r() ? s(e) : o.push(e)
        }
          , r = () => t.isSome()
          , s = e => {
            t.each((t => {
                setTimeout(( () => {
                    e(t)
                }
                ), 0)
            }
            ))
        }
        ;
        return e((e => {
            r() || (t = A.some(e),
            E(o, s),
            o = [])
        }
        )),
        {
            get: n,
            map: e => Bt((t => {
                n((o => {
                    t(e(o))
                }
                ))
            }
            )),
            isReady: r
        }
    }
      , Ht = {
        nu: Bt,
        pure: e => Bt((t => {
            t(e)
        }
        ))
    }
      , Ft = e => {
        setTimeout(( () => {
            throw e
        }
        ), 0)
    }
      , qt = e => {
        const t = t => {
            e().then(t, Ft)
        }
        ;
        return {
            map: t => qt(( () => e().then(t))),
            bind: t => qt(( () => e().then((e => t(e).toPromise())))),
            anonBind: t => qt(( () => e().then(( () => t.toPromise())))),
            toLazy: () => Ht.nu(t),
            toCached: () => {
                let t = null;
                return qt(( () => (null === t && (t = e()),
                t)))
            }
            ,
            toPromise: e,
            get: t
        }
    }
      , Yt = e => qt(( () => new Promise(e)))
      , Vt = e => qt(( () => Promise.resolve(e)))
      , Wt = e => {
        const t = t => t(e)
          , o = b(e)
          , n = () => r
          , r = {
            tag: !0,
            inner: e,
            fold: (t, o) => o(e),
            isValue: S,
            isError: C,
            map: t => Gt.value(t(e)),
            mapError: n,
            bind: t,
            exists: t,
            forall: t,
            getOr: o,
            or: n,
            getOrThunk: o,
            orThunk: n,
            getOrDie: o,
            each: t => {
                t(e)
            }
            ,
            toOptional: () => A.some(e)
        };
        return r
    }
      , zt = e => {
        const t = () => o
          , o = {
            tag: !1,
            inner: e,
            fold: (t, o) => t(e),
            isValue: C,
            isError: S,
            map: t,
            mapError: t => Gt.error(t(e)),
            bind: t,
            exists: C,
            forall: S,
            getOr: w,
            or: w,
            getOrThunk: x,
            orThunk: x,
            getOrDie: (n = String(e),
            () => {
                throw new Error(n)
            }
            ),
            each: y,
            toOptional: A.none
        };
        var n;
        return o
    }
      , Gt = {
        value: Wt,
        error: zt,
        fromOption: (e, t) => e.fold(( () => zt(t)), Wt)
    }
      , Qt = e => ({
        ...e,
        toCached: () => Qt(e.toCached()),
        bindFuture: t => Qt(e.bind((e => e.fold((e => Vt(Gt.error(e))), (e => t(e)))))),
        bindResult: t => Qt(e.map((e => e.bind(t)))),
        mapResult: t => Qt(e.map((e => e.map(t)))),
        mapError: t => Qt(e.map((e => e.mapError(t)))),
        foldResult: (t, o) => e.map((e => e.fold(t, o))),
        withTimeout: (t, o) => Qt(Yt((n => {
            let r = !1;
            const s = setTimeout(( () => {
                r = !0,
                n(Gt.error(o()))
            }
            ), t);
            e.get((e => {
                r || (clearTimeout(s),
                n(e))
            }
            ))
        }
        )))
    })
      , Jt = e => Qt(Vt(Gt.value(e)))
      , Kt = e => Qt(Yt(e))
      , Xt = Jt
      , Zt = Jt
      , eo = e => Qt(Vt(Gt.error(e)))
      , to = e => t => Kt((o => e(t, (e => {
        o(Gt.value(e))
    }
    ), (e => {
        o(Gt.error(e))
    }
    ))))
      , oo = e => t => t.options.get(e)
      , no = e => t => A.from(oo(e)(t)).filter(g)
      , ro = e => t => no(e)(t).getOrDie(e + " has not been implemented.")
      , so = (e, t) => o => {
        var n;
        return null !== (n = o.options.get(e)) && void 0 !== n ? n : t(o)
    }
      , ao = (e, t) => o => {
        const n = so(e, ( () => t(go(o))))(o);
        return to(n)
    }
      , io = ro("tinycomments_create")
      , co = ro("tinycomments_reply")
      , lo = ro("tinycomments_delete")
      , mo = no("tinycomments_resolve")
      , uo = ro("tinycomments_delete_all")
      , _o = ro("tinycomments_delete_comment")
      , vo = ro("tinycomments_edit_comment")
      , po = ro("tinycomments_lookup")
      , ho = no("tinycomments_fetch")
      , go = oo("tinycomments_author")
      , fo = so("tinycomments_author_name", go)
      , yo = oo("tinycomments_author_avatar")
      , bo = ao("tinycomments_can_delete", (e => (t, o, n) => {
        o({
            canDelete: t.comments.length > 0 && t.comments[0].author === e && !0
        })
    }
    ))
      , wo = no("tinycomments_can_resolve")
      , xo = ao("tinycomments_can_delete_comment", (e => (t, o, n) => {
        o({
            canDelete: t.comment.author === e && !0
        })
    }
    ))
      , Co = ao("tinycomments_can_edit_comment", (e => (t, o, n) => {
        o({
            canEdit: t.comment.author === e && !0
        })
    }
    ))
      , So = oo("tinycomments_access")
      , Ao = oo("tinycomments_mode")
      , ko = oo("tinycomments_css_url")
      , Do = oo("tinycomments_js_url")
      , Oo = oo("disabled")
      , Ro = (Eo = (e, t) => u(e) && u(t) ? Ro(e, t) : t,
    (...e) => {
        if (0 === e.length)
            throw new Error("Can't merge zero objects");
        const t = {};
        for (let o = 0; o < e.length; o++) {
            const n = e[o];
            for (const e in n)
                F(n, e) && (t[e] = Eo(t[e], n[e]))
        }
        return t
    }
    );
    var Eo;
    const To = e => {
        const t = io(e)
          , o = co(e)
          , n = po(e)
          , r = ho(e)
          , s = lo(e)
          , a = mo(e)
          , i = uo(e)
          , c = _o(e)
          , l = vo(e);
        return {
            create: to(t),
            reply: to(o),
            lookup: to((m = n,
            (e, t, o) => {
                m(e, (e => {
                    const o = R(e.conversation.comments, (e => ({
                        authorName: e.author,
                        ...e
                    })));
                    t(Ro(e, {
                        conversation: {
                            comments: o
                        }
                    }))
                }
                ), o)
            }
            )),
            fetchConversations: r.map((e => to(e))),
            deleteConversation: to(s),
            resolveConversation: a.map((e => to(e))),
            deleteAllConversations: to(i),
            editComment: to(l),
            deleteComment: to(c),
            lifecycleHooks: {
                onPreInit: y,
                onGetContent: A.none
            }
        };
        var m
    }
      , Mo = {
        base64: {
            versions: ["2.0", "2.1"],
            encryptor: {
                encryptText: e => {
                    const t = new Blob([e],{
                        type: "application/json"
                    })
                      , o = new FileReader;
                    return Kt((e => {
                        o.addEventListener("loadend", ( () => e(Gt.value({
                            encrypted: [o.result]
                        })))),
                        o.addEventListener("error", ( () => e(Gt.error(o.error || new Error("error decoding text"))))),
                        o.readAsDataURL(t)
                    }
                    ))
                }
                ,
                decryptText: e => {
                    return (t = e[0],
                    (e => {
                        const t = e.split(",")
                          , o = /data:([^;]+)/.exec(t[0]);
                        if (!o)
                            return A.none();
                        const n = o[1]
                          , r = t[1]
                          , s = 1024
                          , a = atob(r)
                          , i = a.length
                          , c = Math.ceil(i / s)
                          , l = new Array(c);
                        for (let e = 0; e < c; ++e) {
                            const t = e * s
                              , o = Math.min(t + s, i)
                              , n = new Array(o - t);
                            for (let e = t, r = 0; e < o; ++r,
                            ++e)
                                n[r] = a[e].charCodeAt(0);
                            l[e] = new Uint8Array(n)
                        }
                        return A.some(new Blob(l,{
                            type: n
                        }))
                    }
                    )(t)).fold(( () => eo("Could not decode URI")), (e => {
                        const t = new FileReader;
                        return Kt((o => {
                            t.addEventListener("loadend", ( () => o(Gt.value({
                                decrypted: t.result
                            })))),
                            t.addEventListener("error", ( () => {
                                var e;
                                return o(Gt.error((null === (e = t.error) || void 0 === e ? void 0 : e.message) || "error decoding text"))
                            }
                            )),
                            t.readAsText(e)
                        }
                        ))
                    }
                    ));
                    var t
                }
            }
        }
    };
    Mo.current = Mo.base64;
    const jo = (e, t, o) => t === e ? o : "2.0" === e ? jo("2.1", t, (e => ({
        ...e,
        authorName: e.author
    }))(o)) : o
      , No = "tinycomments"
      , Lo = "2.1"
      , Po = e => le(ue(e), No)
      , Io = e => {
        const t = de(e).split("|");
        return t.length > 2 ? Gt.value({
            version: t[1],
            rest: t.slice(2)
        }) : Gt.error("Embedded comments not in expected format.")
    }
      , Uo = (e, t, o) => ( (e, t) => {
        const o = (e => {
            try {
                const t = JSON.parse(e);
                return Gt.value(t)
            } catch (e) {
                return Gt.error("Could not JSON parse conversations.")
            }
        }
        )(t);
        return e !== Lo ? o.map((t => $(t, (t => ({
            ...t,
            comments: R(t.comments, (t => jo(e, Lo, t)))
        }))))) : o
    }
    )(e, o).map((e => ({
        conversations: e,
        encrypted: {
            encrypted: t
        }
    })))
      , $o = e => Po(e) ? Io(e).fold((e => eo(e)), ( ({version: e, rest: t}) => ( (e, t) => (e => ( (e, t) => {
        const o = P(e);
        for (let n = 0, r = o.length; n < r; n++) {
            const r = e[o[n]];
            if (t(r))
                return A.some(r)
        }
        return A.none()
    }
    )(Mo, (t => O(t.versions, e))).map((e => e.encryptor)))(e).fold(( () => eo(`No Encryptor for version: ${e}`)), (e => e.decryptText(t))))(e, t).bindResult(( ({decrypted: o}) => Uo(e, t, o))))) : Zt({
        conversations: {},
        encrypted: {
            encrypted: []
        }
    })
      , Bo = e => {
        const t = go(e)
          , o = fo(e)
          , n = yo(e)
          , r = ( () => {
            let e = {}
              , t = A.none();
            const o = t => Object.prototype.hasOwnProperty.call(e, t) ? A.some(e[t]) : A.none();
            return {
                get: () => Ro(e, {}),
                clear: () => {
                    e = {},
                    t = A.none()
                }
                ,
                addData: (t, o) => {
                    e[t] = o
                }
                ,
                setData: (o, n) => {
                    e = o,
                    t = A.some(n)
                }
                ,
                setEncryptedData: e => {
                    t = A.some(e)
                }
                ,
                getEncryptedData: () => t,
                lookupData: o,
                removeData: t => {
                    delete e[t]
                }
                ,
                updateData: (t, n) => o(t).map((o => {
                    const r = n(o);
                    return e[t] = r,
                    r
                }
                ))
            }
        }
        )()
          , s = bo(e)
          , a = xo(e)
          , i = Co(e)
          , c = wo(e).map((e => to(e)))
          , l = {
            author: t,
            authorName: o
        }
          , m = H({
            authorAvatar: n
        }, (e => !p(e)))
          , d = Mo.current.encryptor
          , u = () => d.encryptText(JSON.stringify(r.get())).mapResult((e => r.setEncryptedData(e)))
          , _ = A.some((e => {
            return Xt({
                conversations: (t = e,
                o = (e, t) => ({
                    ...e,
                    [t]: r.get()[t]
                }),
                n = {},
                E(t, ( (e, t) => {
                    n = o(n, e)
                }
                )),
                n)
            });
            var t, o, n
        }
        ))
          , v = c.map((e => t => r.lookupData(t.conversationUid).fold(( () => eo("Could not find conversation to resolve")), (o => e({
            conversationUid: o.uid,
            comments: o.comments
        }).bindFuture((e => e.canResolve ? (r.removeData(t.conversationUid),
        u().mapResult(( () => ({
            canResolve: !0
        })))) : Zt({
            canResolve: !1
        })))))))
          , h = (e, t, o, n) => (e => r.lookupData(e.conversationUid).fold(( () => Gt.error(`Could not find conversation with uid ${e.conversationUid}`)), (t => M(t.comments, (t => t.uid === e.commentUid)).fold(( () => Gt.error(`Could not find comment with uid ${e.commentUid} in conversation ${e.conversationUid}`)), (e => Gt.value({
            conversationUid: t.uid,
            comment: e
        }))))))(e).fold((e => eo(e)), (s => o(s).bindFuture((o => !0 === o[t] ? r.updateData(e.conversationUid, n(s)).fold(( () => eo("Could not operate on comment (" + t + ")")), (e => u().mapResult(( () => ({
            [t]: !0
        }))))) : Zt({
            [t]: !1
        })))))
          , g = {
            onPreInit: t => {
                e.parser.addNodeFilter("#comment", ( (t, o, n) => {
                    n.isRootContent && (r.clear(),
                    E(t, (t => {
                        const o = t.value;
                        o && Po(o) && (t.remove(),
                        Io(o).each((e => r.setEncryptedData({
                            encrypted: e.rest
                        }))),
                        $o(o).get((t => t.fold((e => console.error("Error extracting embedded conversations: " + e)), (t => {
                            r.setData(t.conversations, t.encrypted),
                            (e => {
                                e.dispatch("mce-tinycomments-update", {})
                            }
                            )(e)
                        }
                        )))))
                    }
                    )))
                }
                ))
            }
            ,
            onGetContent: (e, t) => r.getEncryptedData().map((e => t + (e => {
                const t = he(document.createComment((e => [No, Lo, ...e.encrypted].join("|"))(e)));
                return (e => {
                    const t = pe("div")
                      , o = he(e.dom.cloneNode(!0));
                    return Ce(t, o),
                    (e => e.dom.innerHTML)(t)
                }
                )(t)
            }
            )(e)))
        };
        return {
            create: e => {
                const t = J("mce-conversation");
                return r.addData(t, {
                    uid: t,
                    comments: [{
                        uid: t,
                        ...l,
                        ...m,
                        content: e.content,
                        createdAt: e.createdAt,
                        modifiedAt: e.createdAt
                    }]
                }),
                u().mapResult(( () => ({
                    conversationUid: t
                })))
            }
            ,
            reply: e => {
                const t = J("mce-reply")
                  , o = {
                    uid: t,
                    ...l,
                    ...m,
                    content: e.content,
                    createdAt: e.createdAt,
                    modifiedAt: e.createdAt
                };
                return r.updateData(e.conversationUid, (e => ({
                    ...e,
                    comments: e.comments.concat([o])
                }))).fold(( () => eo("Could not reply to uid: " + e.conversationUid)), ( () => u().mapResult(( () => ({
                    commentUid: t,
                    author: o.author,
                    authorName: o.authorName
                })))))
            }
            ,
            lookup: e => r.lookupData(e.conversationUid).fold(( () => eo("Could not find uid: " + e.conversationUid)), (e => Zt({
                conversation: e
            }))),
            fetchConversations: _,
            deleteConversation: e => r.lookupData(e.conversationUid).fold(( () => eo("Could not find conversation to delete")), (t => s({
                conversationUid: t.uid,
                comments: t.comments
            }).bindFuture((t => t.canDelete ? (r.removeData(e.conversationUid),
            u().mapResult(( () => ({
                canDelete: !0
            })))) : Zt({
                canDelete: !1
            }))))),
            resolveConversation: v,
            deleteAllConversations: () => {
                const e = P(r.get())
                  , t = R(e, (e => r.lookupData(e).fold(( () => eo("Could not find conversation")), (e => s({
                    conversationUid: e.uid,
                    comments: e.comments
                })))));
                return Kt((e => {
                    var o;
                    (o = t,
                    ( (e, t) => t((t => {
                        const o = [];
                        let n = 0;
                        0 === e.length ? t([]) : E(e, ( (r, s) => {
                            r.get((r => s => {
                                o[r] = s,
                                n++,
                                n >= e.length && t(o)
                            }
                            )(s))
                        }
                        ))
                    }
                    )))(o, Yt)).get((t => {
                        const o = ( (e, t) => {
                            for (let t = 0, o = e.length; t < o; ++t)
                                if (!0 !== e[t].exists((e => e.canDelete)))
                                    return !1;
                            return !0
                        }
                        )(t);
                        o && r.clear(),
                        e(Gt.value({
                            canDelete: o
                        }))
                    }
                    ))
                }
                ))
            }
            ,
            deleteComment: e => h(e, "canDelete", a, (e => {
                return t = e.comment.uid,
                e => ({
                    uid: e.uid,
                    comments: T(e.comments, (e => e.uid !== t))
                });
                var t
            }
            )),
            editComment: e => h(e, "canEdit", (t => i({
                ...t,
                edit: {
                    modifiedAt: e.modifiedAt,
                    content: e.content
                }
            })), ( () => {
                return t = e.commentUid,
                o = e.content,
                n = e.modifiedAt,
                e => ({
                    uid: e.uid,
                    comments: R(e.comments, (e => e.uid === t ? {
                        ...e,
                        content: o,
                        modifiedAt: n
                    } : e))
                });
                var t, o, n
            }
            )),
            lifecycleHooks: g
        }
    }
      , Ho = (e, t) => {
        if (Oo(e))
            return "disabled";
        const o = So(e);
        return "readonly" === t && "full" === o ? "read" : o
    }
    ;
    var Fo, qo;
    !function(e) {
        e[e.Before = 0] = "Before",
        e[e.QueryingDelete = 1] = "QueryingDelete",
        e[e.QueryingResolve = 2] = "QueryingResolve",
        e[e.PostDelete = 3] = "PostDelete",
        e[e.PostResolve = 4] = "PostResolve"
    }(Fo || (Fo = {})),
    function(e) {
        e[e.Open = 0] = "Open",
        e[e.Closed = 1] = "Closed",
        e[e.Closing = 2] = "Closing"
    }(qo || (qo = {}));
    const Yo = e => {
        return ( (e=( () => he(document))()) => A.from(e.dom.activeElement).map(he))((t = e,
        he(t.dom.getRootNode()))).filter((t => e.dom.contains(t.dom)));
        var t
    }
      , Vo = "tox-button--naked"
      , Wo = "tox-button--icon"
      , zo = "tox-icon"
      , Go = "tox-button--kebab"
      , Qo = "tox-comment"
      , Jo = "tox-comment__body"
      , Ko = "tox-textarea"
      , Xo = "tox-comment__overlay"
      , Zo = "tox-comment__overlaytext"
      , en = "tox-comment__buttonspacing"
      , tn = "tox-button"
      , on = "tox-comment__edit"
      , nn = "tox-comment__scroll"
      , rn = "tox-comment__single"
      , sn = "tox-menu"
      , an = "tox-collection"
      , cn = "tox-collection--list"
      , ln = "tox-collection__group"
      , mn = "tox-menu-nav__js"
      , dn = "tox-collection__item-container"
      , un = "tox-collection__item"
      , _n = "tox-collection__item--state-disabled"
      , vn = "tox-mentions__username"
      , pn = "tox-conversations"
      , hn = e => `.${e}`;
    hn(Go),
    hn(Qo),
    hn(Jo),
    hn(Qo),
    hn(Qo),
    hn("tox-comment--selected"),
    [".tox-menu", `[role="menuitem"]:contains(${nt.tc_kebab_edit})`].join(" "),
    [".tox-menu", `[role="menuitem"]:contains(${nt.tc_kebab_delete})`].join(" "),
    [".tox-menu", `[role="menuitem"]:contains(${nt.tc_kebab_delete_conversation})`].join(" "),
    [".tox-menu", `[role="menuitem"]:contains(${nt.tc_kebab_resolve_conversation})`].join(" "),
    hn(nn),
    hn(pn),
    nt.tc_edit_buttons_save,
    nt.tc_edit_buttons_saving,
    nt.tc_reply_placeholders,
    nt.tc_edit_buttons_cancel,
    nt.tc_reply_buttons_clear,
    nt.tc_delete_buttons_proceed,
    nt.tc_resolve_buttons_proceed,
    [hn(mn), hn(un)].join(" "),
    [hn(_n), hn(vn) + `:contains(${nt.tc_mentions_no_results})`].join(" "),
    [hn(pn), hn(nn), hn(Qo), hn(rn), hn(Jo)].join(" "),
    hn(rn),
    hn(on),
    hn(Xo),
    hn(Zo),
    hn(en),
    [hn(Qo), "textarea"].join(" "),
    hn(sn),
    hn(Ko);
    const gn = {
        skeleton: ["tox-skeleton"],
        skeletonLine: ["tox-skeleton__line"],
        skeletonCircle: ["tox-skeleton__circle"],
        conversationsTitle: ["tox-conversations__title"],
        conversationsHead: ["tox-conversations__header"],
        outerContainer: [pn],
        date: ["tox-comment__date"],
        replySection: ["tox-comment__reply"],
        replyTextarea: [Ko],
        textarea: [],
        editTextarea: [],
        kebab: [Vo, Go, tn, Wo],
        kebabIcon: [zo],
        card: [Qo],
        cardHead: ["tox-comment__header"],
        cardHeadMeta: ["tox-comment__meta"],
        cardBody: [Jo],
        cardOverlay: [Xo],
        cardOverlayText: [Zo],
        cardOverlayButtons: [en],
        mentionsItem: ["tox-mentions-dropdown--menu-item"],
        mentionsUser: ["tox-mentions-user"],
        button: [tn],
        secondaryButton: [tn, "tox-button--secondary"],
        editActions: [on],
        outerScroll: [nn],
        commentList: ["tox-comment-thread"],
        comment: [rn],
        avatar: ["tox-user__avatar"],
        username: ["tox-user__name"],
        user: ["tox-user"],
        showMoreLess: [],
        kebabItem: [un],
        kebabItemLabel: ["tox-collection__item-label"],
        kebabDisabledItem: [_n],
        kebabMenu: [sn, an, cn],
        kebabMenuGroup: [ln],
        roots: [pn],
        mentionsButton: [tn, Vo, Wo],
        mentionsButtonIcon: [zo],
        mentionsDropdownContainer: ["tox-autocompleter"],
        mentionsDropdownList: [sn, an, cn],
        mentionsDropdownGroup: [ln],
        mentionsDropdownItem: [mn, un],
        mentionsDropdownItemActive: ["tox-collection__item--active"],
        mentionsDropdownItemDisabled: [mn, un, _n],
        mentionsDropdownItemRow: [dn, "tox-collection__item-container--row"],
        mentionsDropdownItemColumn: [dn, "tox-collection__item-container--column", "tox-collection__item-container--align-left", "tox-collection__item-container--valign-middle"],
        mentionsDropdownItemAvatar: ["tox-mentions__avatar"],
        mentionsDropdownItemName: [vn],
        mentionsDropdownItemDescription: ["tox-mentions__description"]
    }
      , fn = (e, t, o, n, r, s, a, i, c, l, m, d) => u => {
        if (t.set(qo.Open),
        _ = he(e.getBody()),
        v = wt(),
        Rt(_) ? _.dom.classList.add(v) : ( (e, t) => {
            ( (e, t, o) => {
                const n = Ot(e, t).concat([o]);
                re(e, t, n.join(" "))
            }
            )(e, "class", t)
        }
        )(_, v),
        a.set(xt(e)),
        o.get()) {
            const t = document.createElement("div");
            t.className = gn.outerContainer.join(" "),
            u.element().append(t),
            m.then(( () => l.then((o => {
                const l = o(e, n, r, s, a, i, c, d, t);
                e.on("remove", l)
            }
            )))),
            o.set(!1)
        }
        var _, v
    }
      , yn = (e, t) => o => {
        Yo(he(o.element())).each((t => {
            e.focus()
        }
        )),
        t.set(qo.Closed),
        Et(he(e.getBody()), wt())
    }
      , bn = (e, t, o) => {
        t.get() !== qo.Closed && t.get() !== qo.Closing || $t(e),
        o.set(xt(e))
    }
      , wn = (e, t, o, n, r) => {
        r.set(!1),
        n.set(!0),
        bn(e, t, o)
    }
      , xn = (e, t, o, n, r, s, a) => {
        const i = "comment-add";
        e.ui.registry.addToggleMenuItem("showcomments", {
            text: nt.tc_items_showcomments,
            icon: "comment",
            onAction: () => $t(e),
            onSetup: e => o.subscribe((t => {
                e.setActive(t === qo.Open)
            }
            )),
            context: "any"
        });
        const c = t => {
            const o = () => {
                t(!Dt(e, a))
            }
            ;
            return o(),
            e.on("SelectionChange NodeChange SwitchMode DisabledStateChange", o),
            () => e.off("SelectionChange NodeChange SwitchMode DisabledStateChange", o)
        }
          , l = () => {
            Dt(e, a) || ((e => !!e.selection && St(e, e.selection.getRng()).length > 0)(e) ? ( (e, t, o, n, r) => {
                r.set(!0),
                n.set(!1),
                bn(e, t, o)
            }
            )(e, o, s, n, r) : ((e => {
                const t = J(bt());
                e.selection.expand(),
                (e => {
                    const t = e.selection.bookmarkManager.getBookmark();
                    U(e.annotator.getAll(_t()), ( (t, o) => {
                        Ct(o) && t.forEach((t => {
                            e.selection.select(t),
                            e.annotator.remove(_t())
                        }
                        ))
                    }
                    )),
                    e.selection.bookmarkManager.moveToBookmark(t)
                }
                )(e),
                e.annotator.annotate(_t(), {
                    uid: t
                })
            }
            )(e),
            wn(e, o, s, n, r)))
        }
        ;
        e.ui.registry.addButton("addcomment", {
            tooltip: nt.tc_items_addcomment,
            icon: i,
            onAction: l,
            onSetup: e => c(e.setEnabled),
            context: "any"
        }),
        e.ui.registry.addMenuItem("addcomment", {
            text: nt.tc_items_addcomment,
            shortcut: "meta+Alt+M",
            icon: i,
            onAction: l,
            onSetup: e => c(e.setEnabled),
            context: "any"
        }),
        e.ui.registry.addMenuItem("deleteallconversations", {
            text: nt.tc_items_deleteall,
            onAction: () => {
                (e => {
                    e.execCommand(Pt, !1, {})
                }
                )(e)
            }
            ,
            onSetup: t => {
                const o = e.annotator.getAll(_t());
                return t.setEnabled(!(e => {
                    for (const t in e)
                        if (I.call(e, t))
                            return !1;
                    return !0
                }
                )(o) && a.get().canWrite),
                y
            }
            ,
            context: "any"
        }),
        e.shortcuts.add("meta+alt+m", "TinyComments addComment", ( () => {
            const t = H(e.annotator.getAll(_t()), (t => t.includes(e.selection.getNode())));
            N(P(t)).fold(( () => l()), ( () => wn(e, o, s, n, r)))
        }
        ))
    }
      , Cn = (e, t) => {
        const s = L(!1)
          , a = L([])
          , i = G([])
          , c = G(qo.Closed)
          , l = G(Ho(e, e.mode.get()))
          , d = ( (e, t, o) => {
            let n;
            Array.isArray(e) || (e = [e]);
            let r, s = 0, a = () => {
                let o = e.map((e => e.get()));
                if (void 0 === n || o.some(( (e, t) => e !== n[t]))) {
                    let e = ++s;
                    n = o;
                    let r = t(...o);
                    r && r.then && r.t ? r.then((t => {
                        e === s && i.set(t)
                    }
                    )) : i.set(r)
                }
            }
            , i = G(void 0, Math.max(...e.map((e => e.l))) + 1), c = o ? () => {
                clearTimeout(r),
                r = setTimeout(a)
            }
            : a;
            var l, m, d, u, _;
            return m = () => {
                let t = e.map((e => e.listen(c, -1 / i.l)));
                return a(),
                () => {
                    for (let e of t)
                        e()
                }
            }
            ,
            u = e => {
                let t = m();
                t && l.events[6].push(t)
            }
            ,
            _ = e => {
                let t = l.listen;
                l.listen = (...o) => (l.lc || l.active || (l.active = !0,
                e()),
                t(...o));
                let o = l.off;
                return l.events[6] = [],
                l.off = () => {
                    o(),
                    setTimeout(( () => {
                        if (l.active && !l.lc) {
                            l.active = !1;
                            for (let e of l.events[6])
                                e();
                            l.events[6] = []
                        }
                    }
                    ), 1e3)
                }
                ,
                () => {
                    l.listen = t,
                    l.off = o
                }
            }
            ,
            (d = l = i).events = d.events || {},
            d.events[15] || (d.events[15] = _((e => {
                d.events[5].reduceRight(( (e, t) => (t(e),
                e)), {
                    shared: {},
                    ...e
                })
            }
            ))),
            d.events[5] = d.events[5] || [],
            d.events[5].push(u),
            i
        }
        )(l, (e => {
            return t = e,
            {
                canWrite: ( () => {
                    switch (t) {
                    case "read":
                    case "disabled":
                        return !1;
                    default:
                        return !0
                    }
                }
                )()
            };
            var t
        }
        ))
          , u = G(!1)
          , v = G(!1)
          , p = ( (e, t) => o => {
            const n = mt(t);
            t.set(t.get().concat([o])),
            ( (e, t) => {
                const o = {
                    getEventLog: t
                };
                e.dispatch("CommentChange", o)
            }
            )(e, n)
        }
        )(e, a);
        ( (e, t) => {
            const o = e.options.register;
            o("tinycomments_css_url", {
                processor: "string",
                default: t + "/css"
            }),
            o("tinycomments_js_url", {
                processor: "string",
                default: t + "/js"
            }),
            o("tinycomments_mode", {
                processor: "string",
                default: "callback"
            }),
            o("tinycomments_access", {
                processor: e => {
                    const t = O(["full", "comment"], e);
                    return t ? {
                        value: e,
                        valid: t
                    } : {
                        valid: !1,
                        message: "Must be full, or comment."
                    }
                }
                ,
                default: "full"
            }),
            o("tinycomments_author", {
                processor: e => {
                    const t = "Must be a non-empty string";
                    return m(e) ? _e(e) ? {
                        valid: !0,
                        value: e
                    } : {
                        valid: !1,
                        value: "Anon",
                        message: t
                    } : {
                        valid: !1,
                        message: t
                    }
                }
                ,
                default: "Anon"
            }),
            o("tinycomments_author_name", {
                processor: e => {
                    const t = "Must be a non-empty string";
                    return m(e) ? _e(e) ? {
                        valid: !0,
                        value: e
                    } : {
                        valid: !1,
                        value: "Anon",
                        message: t
                    } : {
                        valid: !1,
                        message: t
                    }
                }
            }),
            o("tinycomments_author_avatar", {
                processor: "string"
            }),
            o("tinycomments_mentions_enabled", {
                processor: "boolean",
                default: !0
            }),
            E(["tinycomments_create", "tinycomments_reply", "tinycomments_lookup", "tinycomments_fetch", "tinycomments_delete", "tinycomments_delete_all", "tinycomments_delete_comment", "tinycomments_can_delete", "tinycomments_can_delete_comment", "tinycomments_resolve", "tinycomments_can_resolve", "tinycomments_edit_comment", "tinycomments_can_edit_comment"], (e => o(e, {
                processor: "function"
            })))
        }
        )(e, t);
        const h = (e => ("embedded" === Ao(e) ? Bo : To)(e))(e)
          , g = {
            translate: e => tinymce.translate(e),
            getIcon: t => {
                var o;
                return null !== (o = e.ui.registry.getAll().icons[t]) && void 0 !== o ? o : "temporary-placeholder"
            }
        }
          , f = ( (e, t) => tinymce.Resource.load("tinymce.plugins.tinycomments.sidebar", t))(0, (e => Do(e) + "/")(e) + "tinycomments-sidebar.min.js").then((e => (s.set(!0),
        e)))
          , y = at(g);
        e.on("remove", y.release),
        e.on("PreInit", ( () => {
            h.lifecycleHooks.onPreInit(e),
            ( (e, t) => {
                e.annotator.register(_t(), {
                    decorate: () => ({
                        classes: [ut()],
                        attributes: {}
                    })
                }),
                e.annotator.annotationChanged(_t(), ( (e, o, n) => {
                    n && Ct(n.uid) || (e ? t.onComment() : t.notOnComment())
                }
                ))
            }
            )(e, y)
        }
        )),
        Ut(e, h, p, i),
        xn(e, 0, c, u, v, i, d),
        ( (e, t, o, n, r, s, a, i, c, l) => {
            const m = L(!0)
              , d = new Promise((t => {
                e.initialized ? t() : e.on("init", ( () => {
                    t()
                }
                ), !0)
            }
            ));
            e.ui.registry.addSidebar("showcomments", {
                tooltip: nt.tc_items_showcomments,
                icon: "comment",
                onShow: fn(e, s, m, t, o, n, l, a, i, r, d, c),
                onHide: yn(e, s)
            })
        }
        )(e, h, g, p, f, c, u, v, d, i),
        ( (e, t) => {
            e.on("init DisabledStateChange", ( () => {
                o(e.mode.get())
            }
            )),
            e.on("SwitchMode", (e => {
                o(e.mode)
            }
            ));
            const o = o => {
                const n = Ho(e, o);
                var r;
                t.set(n),
                "readonly" !== o && ((e => "read" === e)(r = n) || (e => "comment" === e)(r)) && e.mode.set("readonly")
            }
        }
        )(e, l),
        e.on("PostRender", ( () => {
            (e => {
                var t;
                const o = ko(e) + "/tinycomments.css"
                  , n = A.from(null === (t = e.ui) || void 0 === t ? void 0 : t.styleSheetLoader).getOr(tinymce.DOM.styleSheetLoader);
                ( (e, t, o) => {
                    const n = null != o ? o : tinymce.DOM.styleSheetLoader;
                    if (tinymce.Resource.has(e)) {
                        const t = tinymce.Resource.get(e);
                        return tinymce.DOM.styleSheetLoader.loadRawCss(e, t),
                        Promise.resolve()
                    }
                    n.load(t)
                }
                )("tinycomments/css/tinycomments.css", o, n),
                e.on("remove", ( () => n.unload(o)))
            }
            )(e)
        }
        ));
        const b = () => {
            const t = P(e.annotator.getAll("tinycomments"));
            ( (e, t, o=r) => n(o).eq(e, t))(t, i.get(), o) || i.set(t)
        }
          , w = ( (e, t) => {
            let o = null;
            const n = () => {
                _(o) || (clearTimeout(o),
                o = null)
            }
            ;
            return {
                cancel: n,
                throttle: (...t) => {
                    n(),
                    o = setTimeout(( () => {
                        o = null,
                        e.apply(null, t)
                    }
                    ), 250)
                }
            }
        }
        )(b);
        return e.on("LoadContent", b),
        e.on("SetContent input Change", w.throttle),
        e.on("remove", w.cancel),
        e.on("GetContent", (t => {
            if (m(t.content)) {
                const o = !0 === t.source_view
                  , n = !0 === t.contextual
                  , r = !0 === t.selection
                  , s = o || n || r ? A.none() : h.lifecycleHooks.onGetContent(e, t.content);
                t.content = s.getOr(t.content)
            }
        }
        )),
        ( (e, t) => ({
            getEventLog: mt(t),
            hasLoadedUi: e.get
        }))(s, a)
    }
    ;
    tinymce.PluginManager.requireLangPack("tinycomments", "ar,bg_BG,ca,cs,da,de,el,es,eu,fa,fi,fr_FR,he_IL,hi,hr,hu_HU,id,it,ja,kk,ko_KR,ms,nb_NO,nl,pl,pt_PT,pt_BR,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,vi,zh_CN,zh_TW"),
    tinymce.PluginManager.add("tinycomments", ( (e, t) => ( (e, t) => !!e && -1 === ( (e, t) => {
        const o = Y(e.major, t.major);
        if (0 !== o)
            return o;
        const n = Y(e.minor, t.minor);
        if (0 !== n)
            return n;
        const r = Y(e.patch, t.patch);
        return 0 !== r ? r : 0
    }
    )((e => W((e => [e.majorVersion, e.minorVersion].join(".").split(".").slice(0, 3).join("."))(e)))(e), W(t)))(tinymce, "6.8.0") ? (console.error("The tinycomments plugin requires at least version 6.8.0 of TinyMCE."),
    {}) : Cn(e, t)))
}();
