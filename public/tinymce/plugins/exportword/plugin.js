/*!
 * Tiny Export to Word plugin
 *
 * Copyright (c) 2024 Ephox Corporation DBA Tiny Technologies, Inc.
 * Licensed under the Tiny commercial license. See https://www.tiny.cloud/legal/
 *
 * Version: 7.6.1-131
 */

!function() {
    "use strict";
    const t = t => parseInt(t, 10)
      , e = (t, e) => {
        const r = t - e;
        return 0 === r ? 0 : r > 0 ? 1 : -1
    }
      , r = (t, e, r) => ({
        major: t,
        minor: e,
        patch: r
    })
      , n = e => {
        const n = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e);
        return n ? r(t(n[1]), t(n[2]), t(n[3])) : r(0, 0, 0)
    }
      , o = Object.getPrototypeOf
      , i = (t, e, r) => {
        var n;
        return !!r(t, e.prototype) || (null === (n = t.constructor) || void 0 === n ? void 0 : n.name) === e.name
    }
      , s = t => e => (t => {
        const e = typeof t;
        return null === t ? "null" : "object" === e && Array.isArray(t) ? "array" : "object" === e && i(t, String, ( (t, e) => e.isPrototypeOf(t))) ? "string" : e
    }
    )(e) === t
      , a = t => e => typeof e === t
      , l = t => e => t === e
      , c = s("string")
      , u = s("object")
      , h = t => ( (t, e) => u(t) && i(t, e, ( (t, e) => o(t) === e)))(t, Object)
      , d = s("array")
      , p = l(null)
      , f = a("boolean")
      , m = l(void 0)
      , g = t => !(t => null == t)(t)
      , k = a("function")
      , y = a("number")
      , v = () => {}
      , b = (t, e) => (...r) => t(e.apply(null, r))
      , S = t => () => t
      , C = t => t;
    function w(t, ...e) {
        return (...r) => {
            const n = e.concat(r);
            return t.apply(null, n)
        }
    }
    const x = t => t()
      , A = S(!1)
      , L = S(!0);
    class E {
        constructor(t, e) {
            this.tag = t,
            this.value = e
        }
        static some(t) {
            return new E(!0,t)
        }
        static none() {
            return E.singletonNone
        }
        fold(t, e) {
            return this.tag ? e(this.value) : t()
        }
        isSome() {
            return this.tag
        }
        isNone() {
            return !this.tag
        }
        map(t) {
            return this.tag ? E.some(t(this.value)) : E.none()
        }
        bind(t) {
            return this.tag ? t(this.value) : E.none()
        }
        exists(t) {
            return this.tag && t(this.value)
        }
        forall(t) {
            return !this.tag || t(this.value)
        }
        filter(t) {
            return !this.tag || t(this.value) ? this : E.none()
        }
        getOr(t) {
            return this.tag ? this.value : t
        }
        or(t) {
            return this.tag ? this : t
        }
        getOrThunk(t) {
            return this.tag ? this.value : t()
        }
        orThunk(t) {
            return this.tag ? this : t()
        }
        getOrDie(t) {
            if (this.tag)
                return this.value;
            throw new Error(null != t ? t : "Called getOrDie on None")
        }
        static from(t) {
            return g(t) ? E.some(t) : E.none()
        }
        getOrNull() {
            return this.tag ? this.value : null
        }
        getOrUndefined() {
            return this.value
        }
        each(t) {
            this.tag && t(this.value)
        }
        toArray() {
            return this.tag ? [this.value] : []
        }
        toString() {
            return this.tag ? `some(${this.value})` : "none()"
        }
    }
    E.singletonNone = new E(!1);
    const _ = Array.prototype.slice
      , T = Array.prototype.indexOf
      , O = Array.prototype.push
      , P = (t, e) => ( (t, e) => T.call(t, e))(t, e) > -1
      , I = (t, e) => {
        for (let r = 0, n = t.length; r < n; r++)
            if (e(t[r], r))
                return !0;
        return !1
    }
      , N = (t, e) => {
        const r = t.length
          , n = new Array(r);
        for (let o = 0; o < r; o++) {
            const r = t[o];
            n[o] = e(r, o)
        }
        return n
    }
      , j = (t, e) => {
        for (let r = 0, n = t.length; r < n; r++)
            e(t[r], r)
    }
      , M = (t, e) => {
        const r = [];
        for (let n = 0, o = t.length; n < o; n++) {
            const o = t[n];
            e(o, n) && r.push(o)
        }
        return r
    }
      , D = t => {
        const e = [];
        for (let r = 0, n = t.length; r < n; ++r) {
            if (!d(t[r]))
                throw new Error("Arr.flatten item " + r + " was not an array, input: " + t);
            O.apply(e, t[r])
        }
        return e
    }
      , R = (t, e) => D(N(t, e))
      , B = k(Array.from) ? Array.from : t => _.call(t)
      , U = t => {
        if (null == t)
            throw new Error("Node cannot be null or undefined");
        return {
            dom: t
        }
    }
      , $ = (t, e) => {
        const r = (e || document).createElement(t);
        return U(r)
    }
      , V = U
      , z = (t, e) => {
        const r = t.dom;
        if (1 !== r.nodeType)
            return !1;
        {
            const t = r;
            if (void 0 !== t.matches)
                return t.matches(e);
            if (void 0 !== t.msMatchesSelector)
                return t.msMatchesSelector(e);
            if (void 0 !== t.webkitMatchesSelector)
                return t.webkitMatchesSelector(e);
            if (void 0 !== t.mozMatchesSelector)
                return t.mozMatchesSelector(e);
            throw new Error("Browser lacks native selectors")
        }
    }
      , F = "undefined" != typeof window ? window : Function("return this;")()
      , W = (t, e) => ( (t, e) => {
        let r = null != e ? e : F;
        for (let e = 0; e < t.length && null != r; ++e)
            r = r[t[e]];
        return r
    }
    )(t.split("."), e)
      , q = Object.getPrototypeOf
      , G = t => {
        const e = W("ownerDocument.defaultView", t);
        return u(t) && ((t => ( (t, e) => {
            const r = ( (t, e) => W(t, e))(t, e);
            if (null == r)
                throw new Error(t + " not available on this browser");
            return r
        }
        )("HTMLElement", t))(e).prototype.isPrototypeOf(t) || /^HTML\w*Element$/.test(q(t).constructor.name))
    }
      , J = t => e => (t => t.dom.nodeType)(e) === t
      , H = J(1)
      , K = J(9)
      , Q = J(11)
      , Y = t => V(t.dom.ownerDocument)
      , X = t => K(t) ? t : Y(t)
      , Z = t => N(t.dom.childNodes, V)
      , tt = (t, e) => {
        t.dom.appendChild(e.dom)
    }
      , et = t => {
        const e = t.dom;
        null !== e.parentNode && e.parentNode.removeChild(e)
    }
      , rt = (t, e) => {
        const r = Y(t).dom
          , n = V(r.createDocumentFragment())
          , o = ( (t, e) => {
            const r = (e || document).createElement("div");
            return r.innerHTML = t,
            Z(V(r))
        }
        )(e, r);
        var i;
        i = n,
        j(o, (t => {
            tt(i, t)
        }
        )),
        (t => {
            t.dom.textContent = "",
            j(Z(t), (t => {
                et(t)
            }
            ))
        }
        )(t),
        tt(t, n)
    }
      , nt = t => V(t.dom.getRootNode())
      , ot = t => {
        const e = t.dom.body;
        if (null == e)
            throw new Error("Body is not available yet");
        return V(e)
    }
      , it = (t, e) => ( (t, r) => {
        return (n = t.dom.childNodes,
        o = t => (t => z(t, e))(V(t)),
        ( (t, e, r) => {
            for (let n = 0, o = t.length; n < o; n++) {
                const o = t[n];
                if (e(o, n))
                    return E.some(o);
                if (r(o, n))
                    break
            }
            return E.none()
        }
        )(n, o, A)).map(V);
        var n, o
    }
    )(t)
      , st = Object.keys
      , at = Object.hasOwnProperty
      , lt = (t, e) => {
        const r = st(t);
        for (let n = 0, o = r.length; n < o; n++) {
            const o = r[n];
            e(t[o], o)
        }
    }
      , ct = (t, e) => ut(t, e) ? E.from(t[e]) : E.none()
      , ut = (t, e) => at.call(t, e)
      , ht = (t, e, r) => {
        ( (t, e, r) => {
            if (!(c(r) || f(r) || y(r)))
                throw console.error("Invalid call to Attribute.set. Key ", e, ":: Value ", r, ":: Element ", t),
                new Error("Attribute value was not simple");
            t.setAttribute(e, r + "")
        }
        )(t.dom, e, r)
    }
      , dt = t => void 0 !== t.style && k(t.style.getPropertyValue)
      , pt = (t, e, r) => {
        if (!c(r))
            throw console.error("Invalid call to CSS.set. Property ", e, ":: Value ", r, ":: Element ", t),
            new Error("CSS value must be a string: " + r);
        dt(t) && t.style.setProperty(e, r)
    }
      , ft = (t, e) => {
        const r = t.dom;
        lt(e, ( (t, e) => {
            pt(r, e, t)
        }
        ))
    }
    ;
    var mt = Object.create
      , gt = Object.defineProperty
      , kt = Object.getOwnPropertyDescriptor
      , yt = Object.getOwnPropertyNames
      , vt = Object.getPrototypeOf
      , bt = Object.prototype.hasOwnProperty
      , St = (t, e) => () => (e || t((e = {
        exports: {}
    }).exports, e),
    e.exports)
      , Ct = (t, e) => {
        for (var r in e)
            gt(t, r, {
                get: e[r],
                enumerable: !0
            })
    }
      , wt = St((t => {
        var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
        t.encode = function(t) {
            if (0 <= t && t < e.length)
                return e[t];
            throw new TypeError("Must be between 0 and 63: " + t)
        }
        ,
        t.decode = function(t) {
            return 65 <= t && t <= 90 ? t - 65 : 97 <= t && t <= 122 ? t - 97 + 26 : 48 <= t && t <= 57 ? t - 48 + 52 : 43 == t ? 62 : 47 == t ? 63 : -1
        }
    }
    ))
      , xt = St((t => {
        var e = wt();
        t.encode = function(t) {
            var r, n, o = "", i = (n = t) < 0 ? 1 + (-n << 1) : 0 + (n << 1);
            do {
                r = 31 & i,
                (i >>>= 5) > 0 && (r |= 32),
                o += e.encode(r)
            } while (i > 0);
            return o
        }
        ,
        t.decode = function(t, r, n) {
            var o, i, s = t.length, a = 0, l = 0;
            do {
                if (r >= s)
                    throw new Error("Expected more digits in base 64 VLQ value.");
                if (-1 === (i = e.decode(t.charCodeAt(r++))))
                    throw new Error("Invalid base64 digit: " + t.charAt(r - 1));
                o = !!(32 & i),
                a += (i &= 31) << l,
                l += 5
            } while (o);
            n.value = function(t) {
                var e = t >> 1;
                return 1 == (1 & t) ? -e : e
            }(a),
            n.rest = r
        }
    }
    ))
      , At = St((t => {
        t.getArg = function(t, e, r) {
            if (e in t)
                return t[e];
            if (3 === arguments.length)
                return r;
            throw new Error('"' + e + '" is a required argument.')
        }
        ;
        var e = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/
          , r = /^data:.+\,.+$/;
        function n(t) {
            var r = t.match(e);
            return r ? {
                scheme: r[1],
                auth: r[2],
                host: r[3],
                port: r[4],
                path: r[5]
            } : null
        }
        function o(t) {
            var e = "";
            return t.scheme && (e += t.scheme + ":"),
            e += "//",
            t.auth && (e += t.auth + "@"),
            t.host && (e += t.host),
            t.port && (e += ":" + t.port),
            t.path && (e += t.path),
            e
        }
        t.urlParse = n,
        t.urlGenerate = o;
        var i, s, a = (i = function(e) {
            var r = e
              , i = n(e);
            if (i) {
                if (!i.path)
                    return e;
                r = i.path
            }
            for (var s = t.isAbsolute(r), a = [], l = 0, c = 0; ; ) {
                if (l = c,
                -1 === (c = r.indexOf("/", l))) {
                    a.push(r.slice(l));
                    break
                }
                for (a.push(r.slice(l, c)); c < r.length && "/" === r[c]; )
                    c++
            }
            var u, h = 0;
            for (c = a.length - 1; c >= 0; c--)
                "." === (u = a[c]) ? a.splice(c, 1) : ".." === u ? h++ : h > 0 && ("" === u ? (a.splice(c + 1, h),
                h = 0) : (a.splice(c, 2),
                h--));
            return "" === (r = a.join("/")) && (r = s ? "/" : "."),
            i ? (i.path = r,
            o(i)) : r
        }
        ,
        s = [],
        function(t) {
            for (var e = 0; e < s.length; e++)
                if (s[e].input === t) {
                    var r = s[0];
                    return s[0] = s[e],
                    s[e] = r,
                    s[0].result
                }
            var n = i(t);
            return s.unshift({
                input: t,
                result: n
            }),
            s.length > 32 && s.pop(),
            n
        }
        );
        function l(t, e) {
            "" === t && (t = "."),
            "" === e && (e = ".");
            var i = n(e)
              , s = n(t);
            if (s && (t = s.path || "/"),
            i && !i.scheme)
                return s && (i.scheme = s.scheme),
                o(i);
            if (i || e.match(r))
                return e;
            if (s && !s.host && !s.path)
                return s.host = e,
                o(s);
            var l = "/" === e.charAt(0) ? e : a(t.replace(/\/+$/, "") + "/" + e);
            return s ? (s.path = l,
            o(s)) : l
        }
        t.normalize = a,
        t.join = l,
        t.isAbsolute = function(t) {
            return "/" === t.charAt(0) || e.test(t)
        }
        ,
        t.relative = function(t, e) {
            "" === t && (t = "."),
            t = t.replace(/\/$/, "");
            for (var r = 0; 0 !== e.indexOf(t + "/"); ) {
                var n = t.lastIndexOf("/");
                if (n < 0 || (t = t.slice(0, n)).match(/^([^\/]+:\/)?\/*$/))
                    return e;
                ++r
            }
            return Array(r + 1).join("../") + e.substr(t.length + 1)
        }
        ;
        var c = !("__proto__"in Object.create(null));
        function u(t) {
            return t
        }
        function h(t) {
            if (!t)
                return !1;
            var e = t.length;
            if (e < 9 || 95 !== t.charCodeAt(e - 1) || 95 !== t.charCodeAt(e - 2) || 111 !== t.charCodeAt(e - 3) || 116 !== t.charCodeAt(e - 4) || 111 !== t.charCodeAt(e - 5) || 114 !== t.charCodeAt(e - 6) || 112 !== t.charCodeAt(e - 7) || 95 !== t.charCodeAt(e - 8) || 95 !== t.charCodeAt(e - 9))
                return !1;
            for (var r = e - 10; r >= 0; r--)
                if (36 !== t.charCodeAt(r))
                    return !1;
            return !0
        }
        function d(t, e) {
            return t === e ? 0 : null === t ? 1 : null === e ? -1 : t > e ? 1 : -1
        }
        t.toSetString = c ? u : function(t) {
            return h(t) ? "$" + t : t
        }
        ,
        t.fromSetString = c ? u : function(t) {
            return h(t) ? t.slice(1) : t
        }
        ,
        t.compareByOriginalPositions = function(t, e, r) {
            var n = d(t.source, e.source);
            return 0 !== n || 0 != (n = t.originalLine - e.originalLine) || 0 != (n = t.originalColumn - e.originalColumn) || r || 0 != (n = t.generatedColumn - e.generatedColumn) || 0 != (n = t.generatedLine - e.generatedLine) ? n : d(t.name, e.name)
        }
        ,
        t.compareByOriginalPositionsNoSource = function(t, e, r) {
            var n;
            return 0 != (n = t.originalLine - e.originalLine) || 0 != (n = t.originalColumn - e.originalColumn) || r || 0 != (n = t.generatedColumn - e.generatedColumn) || 0 != (n = t.generatedLine - e.generatedLine) ? n : d(t.name, e.name)
        }
        ,
        t.compareByGeneratedPositionsDeflated = function(t, e, r) {
            var n = t.generatedLine - e.generatedLine;
            return 0 !== n || 0 != (n = t.generatedColumn - e.generatedColumn) || r || 0 !== (n = d(t.source, e.source)) || 0 != (n = t.originalLine - e.originalLine) || 0 != (n = t.originalColumn - e.originalColumn) ? n : d(t.name, e.name)
        }
        ,
        t.compareByGeneratedPositionsDeflatedNoLine = function(t, e, r) {
            var n = t.generatedColumn - e.generatedColumn;
            return 0 !== n || r || 0 !== (n = d(t.source, e.source)) || 0 != (n = t.originalLine - e.originalLine) || 0 != (n = t.originalColumn - e.originalColumn) ? n : d(t.name, e.name)
        }
        ,
        t.compareByGeneratedPositionsInflated = function(t, e) {
            var r = t.generatedLine - e.generatedLine;
            return 0 !== r || 0 != (r = t.generatedColumn - e.generatedColumn) || 0 !== (r = d(t.source, e.source)) || 0 != (r = t.originalLine - e.originalLine) || 0 != (r = t.originalColumn - e.originalColumn) ? r : d(t.name, e.name)
        }
        ,
        t.parseSourceMapInput = function(t) {
            return JSON.parse(t.replace(/^\)]}'[^\n]*\n/, ""))
        }
        ,
        t.computeSourceURL = function(t, e, r) {
            if (e = e || "",
            t && ("/" !== t[t.length - 1] && "/" !== e[0] && (t += "/"),
            e = t + e),
            r) {
                var i = n(r);
                if (!i)
                    throw new Error("sourceMapURL could not be parsed");
                if (i.path) {
                    var s = i.path.lastIndexOf("/");
                    s >= 0 && (i.path = i.path.substring(0, s + 1))
                }
                e = l(o(i), e)
            }
            return a(e)
        }
    }
    ))
      , Lt = St((t => {
        var e = At()
          , r = Object.prototype.hasOwnProperty
          , n = typeof Map < "u";
        function o() {
            this._array = [],
            this._set = n ? new Map : Object.create(null)
        }
        o.fromArray = function(t, e) {
            for (var r = new o, n = 0, i = t.length; n < i; n++)
                r.add(t[n], e);
            return r
        }
        ,
        o.prototype.size = function() {
            return n ? this._set.size : Object.getOwnPropertyNames(this._set).length
        }
        ,
        o.prototype.add = function(t, o) {
            var i = n ? t : e.toSetString(t)
              , s = n ? this.has(t) : r.call(this._set, i)
              , a = this._array.length;
            (!s || o) && this._array.push(t),
            s || (n ? this._set.set(t, a) : this._set[i] = a)
        }
        ,
        o.prototype.has = function(t) {
            if (n)
                return this._set.has(t);
            var o = e.toSetString(t);
            return r.call(this._set, o)
        }
        ,
        o.prototype.indexOf = function(t) {
            if (n) {
                var o = this._set.get(t);
                if (o >= 0)
                    return o
            } else {
                var i = e.toSetString(t);
                if (r.call(this._set, i))
                    return this._set[i]
            }
            throw new Error('"' + t + '" is not in the set.')
        }
        ,
        o.prototype.at = function(t) {
            if (t >= 0 && t < this._array.length)
                return this._array[t];
            throw new Error("No element indexed by " + t)
        }
        ,
        o.prototype.toArray = function() {
            return this._array.slice()
        }
        ,
        t.ArraySet = o
    }
    ))
      , Et = St((t => {
        var e = At();
        function r() {
            this._array = [],
            this._sorted = !0,
            this._last = {
                generatedLine: -1,
                generatedColumn: 0
            }
        }
        r.prototype.unsortedForEach = function(t, e) {
            this._array.forEach(t, e)
        }
        ,
        r.prototype.add = function(t) {
            !function(t, r) {
                var n = t.generatedLine
                  , o = r.generatedLine
                  , i = t.generatedColumn
                  , s = r.generatedColumn;
                return o > n || o == n && s >= i || e.compareByGeneratedPositionsInflated(t, r) <= 0
            }(this._last, t) ? (this._sorted = !1,
            this._array.push(t)) : (this._last = t,
            this._array.push(t))
        }
        ,
        r.prototype.toArray = function() {
            return this._sorted || (this._array.sort(e.compareByGeneratedPositionsInflated),
            this._sorted = !0),
            this._array
        }
        ,
        t.MappingList = r
    }
    ))
      , _t = St((t => {
        var e = xt()
          , r = At()
          , n = Lt().ArraySet
          , o = Et().MappingList;
        function i(t) {
            t || (t = {}),
            this._file = r.getArg(t, "file", null),
            this._sourceRoot = r.getArg(t, "sourceRoot", null),
            this._skipValidation = r.getArg(t, "skipValidation", !1),
            this._sources = new n,
            this._names = new n,
            this._mappings = new o,
            this._sourcesContents = null
        }
        i.prototype._version = 3,
        i.fromSourceMap = function(t) {
            var e = t.sourceRoot
              , n = new i({
                file: t.file,
                sourceRoot: e
            });
            return t.eachMapping((function(t) {
                var o = {
                    generated: {
                        line: t.generatedLine,
                        column: t.generatedColumn
                    }
                };
                null != t.source && (o.source = t.source,
                null != e && (o.source = r.relative(e, o.source)),
                o.original = {
                    line: t.originalLine,
                    column: t.originalColumn
                },
                null != t.name && (o.name = t.name)),
                n.addMapping(o)
            }
            )),
            t.sources.forEach((function(o) {
                var i = o;
                null !== e && (i = r.relative(e, o)),
                n._sources.has(i) || n._sources.add(i);
                var s = t.sourceContentFor(o);
                null != s && n.setSourceContent(o, s)
            }
            )),
            n
        }
        ,
        i.prototype.addMapping = function(t) {
            var e = r.getArg(t, "generated")
              , n = r.getArg(t, "original", null)
              , o = r.getArg(t, "source", null)
              , i = r.getArg(t, "name", null);
            this._skipValidation || this._validateMapping(e, n, o, i),
            null != o && (o = String(o),
            this._sources.has(o) || this._sources.add(o)),
            null != i && (i = String(i),
            this._names.has(i) || this._names.add(i)),
            this._mappings.add({
                generatedLine: e.line,
                generatedColumn: e.column,
                originalLine: null != n && n.line,
                originalColumn: null != n && n.column,
                source: o,
                name: i
            })
        }
        ,
        i.prototype.setSourceContent = function(t, e) {
            var n = t;
            null != this._sourceRoot && (n = r.relative(this._sourceRoot, n)),
            null != e ? (this._sourcesContents || (this._sourcesContents = Object.create(null)),
            this._sourcesContents[r.toSetString(n)] = e) : this._sourcesContents && (delete this._sourcesContents[r.toSetString(n)],
            0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null))
        }
        ,
        i.prototype.applySourceMap = function(t, e, o) {
            var i = e;
            if (null == e) {
                if (null == t.file)
                    throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');
                i = t.file
            }
            var s = this._sourceRoot;
            null != s && (i = r.relative(s, i));
            var a = new n
              , l = new n;
            this._mappings.unsortedForEach((function(e) {
                if (e.source === i && null != e.originalLine) {
                    var n = t.originalPositionFor({
                        line: e.originalLine,
                        column: e.originalColumn
                    });
                    null != n.source && (e.source = n.source,
                    null != o && (e.source = r.join(o, e.source)),
                    null != s && (e.source = r.relative(s, e.source)),
                    e.originalLine = n.line,
                    e.originalColumn = n.column,
                    null != n.name && (e.name = n.name))
                }
                var c = e.source;
                null != c && !a.has(c) && a.add(c);
                var u = e.name;
                null != u && !l.has(u) && l.add(u)
            }
            ), this),
            this._sources = a,
            this._names = l,
            t.sources.forEach((function(e) {
                var n = t.sourceContentFor(e);
                null != n && (null != o && (e = r.join(o, e)),
                null != s && (e = r.relative(s, e)),
                this.setSourceContent(e, n))
            }
            ), this)
        }
        ,
        i.prototype._validateMapping = function(t, e, r, n) {
            if (e && "number" != typeof e.line && "number" != typeof e.column)
                throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            if (!(t && "line"in t && "column"in t && t.line > 0 && t.column >= 0) || e || r || n) {
                if (t && "line"in t && "column"in t && e && "line"in e && "column"in e && t.line > 0 && t.column >= 0 && e.line > 0 && e.column >= 0 && r)
                    return;
                throw new Error("Invalid mapping: " + JSON.stringify({
                    generated: t,
                    source: r,
                    original: e,
                    name: n
                }))
            }
        }
        ,
        i.prototype._serializeMappings = function() {
            for (var t, n, o, i, s = 0, a = 1, l = 0, c = 0, u = 0, h = 0, d = "", p = this._mappings.toArray(), f = 0, m = p.length; f < m; f++) {
                if (t = "",
                (n = p[f]).generatedLine !== a)
                    for (s = 0; n.generatedLine !== a; )
                        t += ";",
                        a++;
                else if (f > 0) {
                    if (!r.compareByGeneratedPositionsInflated(n, p[f - 1]))
                        continue;
                    t += ","
                }
                t += e.encode(n.generatedColumn - s),
                s = n.generatedColumn,
                null != n.source && (i = this._sources.indexOf(n.source),
                t += e.encode(i - h),
                h = i,
                t += e.encode(n.originalLine - 1 - c),
                c = n.originalLine - 1,
                t += e.encode(n.originalColumn - l),
                l = n.originalColumn,
                null != n.name && (o = this._names.indexOf(n.name),
                t += e.encode(o - u),
                u = o)),
                d += t
            }
            return d
        }
        ,
        i.prototype._generateSourcesContent = function(t, e) {
            return t.map((function(t) {
                if (!this._sourcesContents)
                    return null;
                null != e && (t = r.relative(e, t));
                var n = r.toSetString(t);
                return Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null
            }
            ), this)
        }
        ,
        i.prototype.toJSON = function() {
            var t = {
                version: this._version,
                sources: this._sources.toArray(),
                names: this._names.toArray(),
                mappings: this._serializeMappings()
            };
            return null != this._file && (t.file = this._file),
            null != this._sourceRoot && (t.sourceRoot = this._sourceRoot),
            this._sourcesContents && (t.sourcesContent = this._generateSourcesContent(t.sources, t.sourceRoot)),
            t
        }
        ,
        i.prototype.toString = function() {
            return JSON.stringify(this.toJSON())
        }
        ,
        t.SourceMapGenerator = i
    }
    ));
    function Tt(t) {
        return t >= 48 && t <= 57
    }
    function Ot(t) {
        return Tt(t) || t >= 65 && t <= 70 || t >= 97 && t <= 102
    }
    function Pt(t) {
        return t >= 65 && t <= 90
    }
    function It(t) {
        return function(t) {
            return Pt(t) || function(t) {
                return t >= 97 && t <= 122
            }(t)
        }(t) || function(t) {
            return t >= 128
        }(t) || 95 === t
    }
    function Nt(t) {
        return It(t) || Tt(t) || 45 === t
    }
    function jt(t) {
        return t >= 0 && t <= 8 || 11 === t || t >= 14 && t <= 31 || 127 === t
    }
    function Mt(t) {
        return 10 === t || 13 === t || 12 === t
    }
    function Dt(t) {
        return Mt(t) || 32 === t || 9 === t
    }
    function Rt(t, e) {
        return !(92 !== t || Mt(e) || 0 === e)
    }
    function Bt(t, e, r) {
        return 45 === t ? It(e) || 45 === e || Rt(e, r) : !!It(t) || 92 === t && Rt(t, e)
    }
    function Ut(t, e, r) {
        return 43 === t || 45 === t ? Tt(e) ? 2 : 46 === e && Tt(r) ? 3 : 0 : 46 === t ? Tt(e) ? 2 : 0 : Tt(t) ? 1 : 0
    }
    function $t(t) {
        return 65279 === t || 65534 === t ? 1 : 0
    }
    var Vt = new Array(128)
      , zt = 130
      , Ft = 131
      , Wt = 132
      , qt = 133;
    for (let t = 0; t < Vt.length; t++)
        Vt[t] = Dt(t) && zt || Tt(t) && Ft || It(t) && Wt || jt(t) && qt || t || 128;
    function Gt(t) {
        return t < 128 ? Vt[t] : Wt
    }
    function Jt(t, e) {
        return e < t.length ? t.charCodeAt(e) : 0
    }
    function Ht(t, e, r) {
        return 13 === r && 10 === Jt(t, e + 1) ? 2 : 1
    }
    function Kt(t, e, r) {
        let n = t.charCodeAt(e);
        return Pt(n) && (n |= 32),
        n === r
    }
    function Qt(t, e, r, n) {
        if (r - e !== n.length || e < 0 || r > t.length)
            return !1;
        for (let o = e; o < r; o++) {
            let r = n.charCodeAt(o - e)
              , i = t.charCodeAt(o);
            if (Pt(i) && (i |= 32),
            i !== r)
                return !1
        }
        return !0
    }
    function Yt(t, e) {
        for (; e < t.length && Dt(t.charCodeAt(e)); e++)
            ;
        return e
    }
    function Xt(t, e) {
        for (; e < t.length && Tt(t.charCodeAt(e)); e++)
            ;
        return e
    }
    function Zt(t, e) {
        if (Ot(Jt(t, (e += 2) - 1))) {
            for (let r = Math.min(t.length, e + 5); e < r && Ot(Jt(t, e)); e++)
                ;
            let r = Jt(t, e);
            Dt(r) && (e += Ht(t, e, r))
        }
        return e
    }
    function te(t, e) {
        for (; e < t.length; e++) {
            let r = t.charCodeAt(e);
            if (!Nt(r)) {
                if (Rt(r, Jt(t, e + 1))) {
                    e = Zt(t, e) - 1;
                    continue
                }
                break
            }
        }
        return e
    }
    function ee(t, e) {
        let r = t.charCodeAt(e);
        if ((43 === r || 45 === r) && (r = t.charCodeAt(e += 1)),
        Tt(r) && (e = Xt(t, e + 1),
        r = t.charCodeAt(e)),
        46 === r && Tt(t.charCodeAt(e + 1)) && (e = Xt(t, e += 2)),
        Kt(t, e, 101)) {
            let n = 0;
            r = t.charCodeAt(e + 1),
            (45 === r || 43 === r) && (n = 1,
            r = t.charCodeAt(e + 2)),
            Tt(r) && (e = Xt(t, e + 1 + n + 1))
        }
        return e
    }
    function re(t, e) {
        for (; e < t.length; e++) {
            let r = t.charCodeAt(e);
            if (41 === r) {
                e++;
                break
            }
            Rt(r, Jt(t, e + 1)) && (e = Zt(t, e))
        }
        return e
    }
    function ne(t) {
        if (1 === t.length && !Ot(t.charCodeAt(0)))
            return t[0];
        let e = parseInt(t, 16);
        return (0 === e || e >= 55296 && e <= 57343 || e > 1114111) && (e = 65533),
        String.fromCodePoint(e)
    }
    var oe = ["EOF-token", "ident-token", "function-token", "at-keyword-token", "hash-token", "string-token", "bad-string-token", "url-token", "bad-url-token", "delim-token", "number-token", "percentage-token", "dimension-token", "whitespace-token", "CDO-token", "CDC-token", "colon-token", "semicolon-token", "comma-token", "[-token", "]-token", "(-token", ")-token", "{-token", "}-token"];
    function ie(t=null, e) {
        return null === t || t.length < e ? new Uint32Array(Math.max(e + 1024, 16384)) : t
    }
    function se(t) {
        let e = t.source
          , r = e.length
          , n = e.length > 0 ? $t(e.charCodeAt(0)) : 0
          , o = ie(t.lines, r)
          , i = ie(t.columns, r)
          , s = t.startLine
          , a = t.startColumn;
        for (let t = n; t < r; t++) {
            let n = e.charCodeAt(t);
            o[t] = s,
            i[t] = a++,
            (10 === n || 13 === n || 12 === n) && (13 === n && t + 1 < r && 10 === e.charCodeAt(t + 1) && (t++,
            o[t] = s,
            i[t] = a),
            s++,
            a = 1)
        }
        o[r] = s,
        i[r] = a,
        t.lines = o,
        t.columns = i,
        t.computed = !0
    }
    var ae = class {
        constructor() {
            this.lines = null,
            this.columns = null,
            this.computed = !1
        }
        setSource(t, e=0, r=1, n=1) {
            this.source = t,
            this.startOffset = e,
            this.startLine = r,
            this.startColumn = n,
            this.computed = !1
        }
        getLocation(t, e) {
            return this.computed || se(this),
            {
                source: e,
                offset: this.startOffset + t,
                line: this.lines[t],
                column: this.columns[t]
            }
        }
        getLocationRange(t, e, r) {
            return this.computed || se(this),
            {
                source: r,
                start: {
                    offset: this.startOffset + t,
                    line: this.lines[t],
                    column: this.columns[t]
                },
                end: {
                    offset: this.startOffset + e,
                    line: this.lines[e],
                    column: this.columns[e]
                }
            }
        }
    }
      , le = 16777215
      , ce = 24
      , ue = new Map([[2, 22], [21, 22], [19, 20], [23, 24]])
      , he = class {
        constructor(t, e) {
            this.setSource(t, e)
        }
        reset() {
            this.eof = !1,
            this.tokenIndex = -1,
            this.tokenType = 0,
            this.tokenStart = this.firstCharOffset,
            this.tokenEnd = this.firstCharOffset
        }
        setSource(t="", e=( () => {}
        )) {
            let r = (t = String(t || "")).length
              , n = ie(this.offsetAndType, t.length + 1)
              , o = ie(this.balance, t.length + 1)
              , i = 0
              , s = 0
              , a = 0
              , l = -1;
            for (this.offsetAndType = null,
            this.balance = null,
            e(t, ( (t, e, c) => {
                switch (t) {
                default:
                    o[i] = r;
                    break;
                case s:
                    {
                        let t = a & le;
                        for (a = o[t],
                        s = a >> ce,
                        o[i] = t,
                        o[t++] = i; t < i; t++)
                            o[t] === r && (o[t] = i);
                        break
                    }
                case 21:
                case 2:
                case 19:
                case 23:
                    o[i] = a,
                    s = ue.get(t),
                    a = s << ce | i
                }
                n[i++] = t << ce | c,
                -1 === l && (l = e)
            }
            )),
            n[i] = 0 | r,
            o[i] = r,
            o[r] = r; 0 !== a; ) {
                let t = a & le;
                a = o[t],
                o[t] = r
            }
            this.source = t,
            this.firstCharOffset = -1 === l ? 0 : l,
            this.tokenCount = i,
            this.offsetAndType = n,
            this.balance = o,
            this.reset(),
            this.next()
        }
        lookupType(t) {
            return (t += this.tokenIndex) < this.tokenCount ? this.offsetAndType[t] >> ce : 0
        }
        lookupOffset(t) {
            return (t += this.tokenIndex) < this.tokenCount ? this.offsetAndType[t - 1] & le : this.source.length
        }
        lookupValue(t, e) {
            return (t += this.tokenIndex) < this.tokenCount && Qt(this.source, this.offsetAndType[t - 1] & le, this.offsetAndType[t] & le, e)
        }
        getTokenStart(t) {
            return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & le : this.offsetAndType[this.tokenCount] & le : this.firstCharOffset
        }
        substrToCursor(t) {
            return this.source.substring(t, this.tokenStart)
        }
        isBalanceEdge(t) {
            return this.balance[this.tokenIndex] < t
        }
        isDelim(t, e) {
            return e ? 9 === this.lookupType(e) && this.source.charCodeAt(this.lookupOffset(e)) === t : 9 === this.tokenType && this.source.charCodeAt(this.tokenStart) === t
        }
        skip(t) {
            let e = this.tokenIndex + t;
            e < this.tokenCount ? (this.tokenIndex = e,
            this.tokenStart = this.offsetAndType[e - 1] & le,
            e = this.offsetAndType[e],
            this.tokenType = e >> ce,
            this.tokenEnd = e & le) : (this.tokenIndex = this.tokenCount,
            this.next())
        }
        next() {
            let t = this.tokenIndex + 1;
            t < this.tokenCount ? (this.tokenIndex = t,
            this.tokenStart = this.tokenEnd,
            t = this.offsetAndType[t],
            this.tokenType = t >> ce,
            this.tokenEnd = t & le) : (this.eof = !0,
            this.tokenIndex = this.tokenCount,
            this.tokenType = 0,
            this.tokenStart = this.tokenEnd = this.source.length)
        }
        skipSC() {
            for (; 13 === this.tokenType || 25 === this.tokenType; )
                this.next()
        }
        skipUntilBalanced(t, e) {
            let r, n, o = t;
            t: for (; o < this.tokenCount && (r = this.balance[o],
            !(r < t)); o++)
                switch (n = o > 0 ? this.offsetAndType[o - 1] & le : this.firstCharOffset,
                e(this.source.charCodeAt(n))) {
                case 1:
                    break t;
                case 2:
                    o++;
                    break t;
                default:
                    this.balance[r] === o && (o = r)
                }
            this.skip(o - this.tokenIndex)
        }
        forEachToken(t) {
            for (let e = 0, r = this.firstCharOffset; e < this.tokenCount; e++) {
                let n = r
                  , o = this.offsetAndType[e]
                  , i = o & le;
                r = i,
                t(o >> ce, n, i, e)
            }
        }
        dump() {
            let t = new Array(this.tokenCount);
            return this.forEachToken(( (e, r, n, o) => {
                t[o] = {
                    idx: o,
                    type: oe[e],
                    chunk: this.source.substring(r, n),
                    balance: this.balance[o]
                }
            }
            )),
            t
        }
    }
    ;
    function de(t, e) {
        function r(e) {
            return e < a ? t.charCodeAt(e) : 0
        }
        function n() {
            return c = ee(t, c),
            Bt(r(c), r(c + 1), r(c + 2)) ? (s = 12,
            void (c = te(t, c))) : 37 === r(c) ? (s = 11,
            void c++) : void (s = 10)
        }
        function o() {
            let e = c;
            return c = te(t, c),
            Qt(t, e, c, "url") && 40 === r(c) ? (c = Yt(t, c + 1),
            34 === r(c) || 39 === r(c) ? (s = 2,
            void (c = e + 4)) : void function() {
                for (s = 7,
                c = Yt(t, c); c < t.length; c++) {
                    let e = t.charCodeAt(c);
                    switch (Gt(e)) {
                    case 41:
                        return void c++;
                    case zt:
                        return c = Yt(t, c),
                        41 === r(c) || c >= t.length ? void (c < t.length && c++) : (c = re(t, c),
                        void (s = 8));
                    case 34:
                    case 39:
                    case 40:
                    case qt:
                        return c = re(t, c),
                        void (s = 8);
                    case 92:
                        if (Rt(e, r(c + 1))) {
                            c = Zt(t, c) - 1;
                            break
                        }
                        return c = re(t, c),
                        void (s = 8)
                    }
                }
            }()) : 40 === r(c) ? (s = 2,
            void c++) : void (s = 1)
        }
        function i(e) {
            for (e || (e = r(c++)),
            s = 5; c < t.length; c++) {
                let n = t.charCodeAt(c);
                switch (Gt(n)) {
                case e:
                    return void c++;
                case zt:
                    if (Mt(n))
                        return c += Ht(t, c, n),
                        void (s = 6);
                    break;
                case 92:
                    if (c === t.length - 1)
                        break;
                    let o = r(c + 1);
                    Mt(o) ? c += Ht(t, c + 1, o) : Rt(n, o) && (c = Zt(t, c) - 1)
                }
            }
        }
        let s, a = (t = String(t || "")).length, l = $t(r(0)), c = l;
        for (; c < a; ) {
            let a = t.charCodeAt(c);
            switch (Gt(a)) {
            case zt:
                s = 13,
                c = Yt(t, c + 1);
                break;
            case 34:
                i();
                break;
            case 35:
                Nt(r(c + 1)) || Rt(r(c + 1), r(c + 2)) ? (s = 4,
                c = te(t, c + 1)) : (s = 9,
                c++);
                break;
            case 39:
                i();
                break;
            case 40:
                s = 21,
                c++;
                break;
            case 41:
                s = 22,
                c++;
                break;
            case 43:
                Ut(a, r(c + 1), r(c + 2)) ? n() : (s = 9,
                c++);
                break;
            case 44:
                s = 18,
                c++;
                break;
            case 45:
                Ut(a, r(c + 1), r(c + 2)) ? n() : 45 === r(c + 1) && 62 === r(c + 2) ? (s = 15,
                c += 3) : Bt(a, r(c + 1), r(c + 2)) ? o() : (s = 9,
                c++);
                break;
            case 46:
                Ut(a, r(c + 1), r(c + 2)) ? n() : (s = 9,
                c++);
                break;
            case 47:
                42 === r(c + 1) ? (s = 25,
                c = t.indexOf("*/", c + 2),
                c = -1 === c ? t.length : c + 2) : (s = 9,
                c++);
                break;
            case 58:
                s = 16,
                c++;
                break;
            case 59:
                s = 17,
                c++;
                break;
            case 60:
                33 === r(c + 1) && 45 === r(c + 2) && 45 === r(c + 3) ? (s = 14,
                c += 4) : (s = 9,
                c++);
                break;
            case 64:
                Bt(r(c + 1), r(c + 2), r(c + 3)) ? (s = 3,
                c = te(t, c + 1)) : (s = 9,
                c++);
                break;
            case 91:
                s = 19,
                c++;
                break;
            case 92:
                Rt(a, r(c + 1)) ? o() : (s = 9,
                c++);
                break;
            case 93:
                s = 20,
                c++;
                break;
            case 123:
                s = 23,
                c++;
                break;
            case 125:
                s = 24,
                c++;
                break;
            case Ft:
                n();
                break;
            case Wt:
                o();
                break;
            default:
                s = 9,
                c++
            }
            e(s, l, l = c)
        }
    }
    var pe, fe = (pe = _t(),
    1,
    ( (t, e, r, n) => {
        if (e && "object" == typeof e || "function" == typeof e)
            for (let r of yt(e))
                !bt.call(t, r) && "default" !== r && gt(t, r, {
                    get: () => e[r],
                    enumerable: !(n = kt(e, r)) || n.enumerable
                });
        return t
    }
    )((t => gt(t, "__esModule", {
        value: !0
    }))(gt(null != pe ? mt(vt(pe)) : {}, "default", {
        value: pe,
        enumerable: !0
    })), pe)), me = new Set(["Atrule", "Selector", "Declaration"]), ge = {};
    Ct(ge, {
        safe: () => Ce,
        spec: () => Se
    });
    var ke = (t, e) => {
        if (9 === t && (t = e),
        "string" == typeof t) {
            let e = t.charCodeAt(0);
            return e > 127 ? 32768 : e << 8
        }
        return t
    }
      , ye = [[1, 1], [1, 2], [1, 7], [1, 8], [1, "-"], [1, 10], [1, 11], [1, 12], [1, 15], [1, 21], [3, 1], [3, 2], [3, 7], [3, 8], [3, "-"], [3, 10], [3, 11], [3, 12], [3, 15], [4, 1], [4, 2], [4, 7], [4, 8], [4, "-"], [4, 10], [4, 11], [4, 12], [4, 15], [12, 1], [12, 2], [12, 7], [12, 8], [12, "-"], [12, 10], [12, 11], [12, 12], [12, 15], ["#", 1], ["#", 2], ["#", 7], ["#", 8], ["#", "-"], ["#", 10], ["#", 11], ["#", 12], ["#", 15], ["-", 1], ["-", 2], ["-", 7], ["-", 8], ["-", "-"], ["-", 10], ["-", 11], ["-", 12], ["-", 15], [10, 1], [10, 2], [10, 7], [10, 8], [10, 10], [10, 11], [10, 12], [10, "%"], [10, 15], ["@", 1], ["@", 2], ["@", 7], ["@", 8], ["@", "-"], ["@", 15], [".", 10], [".", 11], [".", 12], ["+", 10], ["+", 11], ["+", 12], ["/", "*"]]
      , ve = ye.concat([[1, 4], [12, 4], [4, 4], [3, 21], [3, 5], [3, 16], [11, 11], [11, 12], [11, 2], [11, "-"], [22, 1], [22, 2], [22, 11], [22, 12], [22, 4], [22, "-"]]);
    function be(t) {
        let e = new Set(t.map(( ([t,e]) => ke(t) << 16 | ke(e))));
        return function(t, r, n) {
            let o = ke(r, n)
              , i = n.charCodeAt(0);
            return (45 === i && 1 !== r && 2 !== r && 15 !== r || 43 === i ? e.has(t << 16 | i << 8) : e.has(t << 16 | o)) && this.emit(" ", 13, !0),
            o
        }
    }
    var Se = be(ye)
      , Ce = be(ve);
    function we(t, e) {
        if ("function" != typeof e)
            t.children.forEach(this.node, this);
        else {
            let r = null;
            t.children.forEach((t => {
                null !== r && e.call(this, r),
                this.node(t),
                r = t
            }
            ))
        }
    }
    function xe(t) {
        de(t, ( (e, r, n) => {
            this.token(e, t.slice(r, n))
        }
        ))
    }
    var Ae = {};
    Ct(Ae, {
        AnPlusB: () => Me,
        Atrule: () => De,
        AtrulePrelude: () => Re,
        AttributeSelector: () => Je,
        Block: () => He,
        Brackets: () => Ke,
        CDC: () => Qe,
        CDO: () => Ye,
        ClassSelector: () => Ze,
        Combinator: () => er,
        Comment: () => rr,
        Declaration: () => nr,
        DeclarationList: () => or,
        Dimension: () => ir,
        Function: () => sr,
        Hash: () => ar,
        IdSelector: () => hr,
        Identifier: () => cr,
        MediaFeature: () => dr,
        MediaQuery: () => pr,
        MediaQueryList: () => fr,
        NestingSelector: () => gr,
        Nth: () => yr,
        Number: () => vr,
        Operator: () => br,
        Parentheses: () => Sr,
        Percentage: () => wr,
        PseudoClassSelector: () => Ar,
        PseudoElementSelector: () => Er,
        Ratio: () => _r,
        Raw: () => Pr,
        Rule: () => Ir,
        Selector: () => jr,
        SelectorList: () => Dr,
        String: () => zr,
        StyleSheet: () => Fr,
        TypeSelector: () => Jr,
        UnicodeRange: () => Hr,
        Url: () => en,
        Value: () => rn,
        WhiteSpace: () => nn
    });
    var Le = 43
      , Ee = 45
      , _e = 110
      , Te = !0;
    function Oe(t, e) {
        let r = this.tokenStart + t
          , n = this.charCodeAt(r);
        for ((n === Le || n === Ee) && (e && this.error("Number sign is not allowed"),
        r++); r < this.tokenEnd; r++)
            Tt(this.charCodeAt(r)) || this.error("Integer is expected", r)
    }
    function Pe(t) {
        return Oe.call(this, 0, t)
    }
    function Ie(t, e) {
        if (!this.cmpChar(this.tokenStart + t, e)) {
            let r = "";
            switch (e) {
            case _e:
                r = "N is expected";
                break;
            case Ee:
                r = "HyphenMinus is expected"
            }
            this.error(r, this.tokenStart + t)
        }
    }
    function Ne() {
        let t = 0
          , e = 0
          , r = this.tokenType;
        for (; 13 === r || 25 === r; )
            r = this.lookupType(++t);
        if (10 !== r) {
            if (!this.isDelim(Le, t) && !this.isDelim(Ee, t))
                return null;
            e = this.isDelim(Le, t) ? Le : Ee;
            do {
                r = this.lookupType(++t)
            } while (13 === r || 25 === r);
            10 !== r && (this.skip(t),
            Pe.call(this, Te))
        }
        return t > 0 && this.skip(t),
        0 === e && (r = this.charCodeAt(this.tokenStart),
        r !== Le && r !== Ee && this.error("Number sign is expected")),
        Pe.call(this, 0 !== e),
        e === Ee ? "-" + this.consume(10) : this.consume(10)
    }
    function je() {
        let t = this.tokenStart
          , e = null
          , r = null;
        if (10 === this.tokenType)
            Pe.call(this, !1),
            r = this.consume(10);
        else if (1 === this.tokenType && this.cmpChar(this.tokenStart, Ee))
            switch (e = "-1",
            Ie.call(this, 1, _e),
            this.tokenEnd - this.tokenStart) {
            case 2:
                this.next(),
                r = Ne.call(this);
                break;
            case 3:
                Ie.call(this, 2, Ee),
                this.next(),
                this.skipSC(),
                Pe.call(this, Te),
                r = "-" + this.consume(10);
                break;
            default:
                Ie.call(this, 2, Ee),
                Oe.call(this, 3, Te),
                this.next(),
                r = this.substrToCursor(t + 2)
            }
        else if (1 === this.tokenType || this.isDelim(Le) && 1 === this.lookupType(1)) {
            let n = 0;
            switch (e = "1",
            this.isDelim(Le) && (n = 1,
            this.next()),
            Ie.call(this, 0, _e),
            this.tokenEnd - this.tokenStart) {
            case 1:
                this.next(),
                r = Ne.call(this);
                break;
            case 2:
                Ie.call(this, 1, Ee),
                this.next(),
                this.skipSC(),
                Pe.call(this, Te),
                r = "-" + this.consume(10);
                break;
            default:
                Ie.call(this, 1, Ee),
                Oe.call(this, 2, Te),
                this.next(),
                r = this.substrToCursor(t + n + 1)
            }
        } else if (12 === this.tokenType) {
            let n = this.charCodeAt(this.tokenStart)
              , o = n === Le || n === Ee
              , i = this.tokenStart + o;
            for (; i < this.tokenEnd && Tt(this.charCodeAt(i)); i++)
                ;
            i === this.tokenStart + o && this.error("Integer is expected", this.tokenStart + o),
            Ie.call(this, i - this.tokenStart, _e),
            e = this.substring(t, i),
            i + 1 === this.tokenEnd ? (this.next(),
            r = Ne.call(this)) : (Ie.call(this, i - this.tokenStart + 1, Ee),
            i + 2 === this.tokenEnd ? (this.next(),
            this.skipSC(),
            Pe.call(this, Te),
            r = "-" + this.consume(10)) : (Oe.call(this, i - this.tokenStart + 2, Te),
            this.next(),
            r = this.substrToCursor(i + 1)))
        } else
            this.error();
        return null !== e && e.charCodeAt(0) === Le && (e = e.substr(1)),
        null !== r && r.charCodeAt(0) === Le && (r = r.substr(1)),
        {
            type: "AnPlusB",
            loc: this.getLocation(t, this.tokenStart),
            a: e,
            b: r
        }
    }
    function Me(t) {
        if (t.a) {
            let e = ("+1" === t.a || "1" === t.a ? "n" : "-1" === t.a && "-n") || t.a + "n";
            if (t.b) {
                let r = "-" === t.b[0] || "+" === t.b[0] ? t.b : "+" + t.b;
                this.tokenize(e + r)
            } else
                this.tokenize(e)
        } else
            this.tokenize(t.b)
    }
    function De(t) {
        this.token(3, "@" + t.name),
        null !== t.prelude && this.node(t.prelude),
        t.block ? this.node(t.block) : this.token(17, ";")
    }
    function Re(t) {
        this.children(t)
    }
    var Be = 36
      , Ue = 42
      , $e = 61
      , Ve = 94
      , ze = 124
      , Fe = 126;
    function We() {
        this.eof && this.error("Unexpected end of input");
        let t = this.tokenStart
          , e = !1;
        return this.isDelim(Ue) ? (e = !0,
        this.next()) : this.isDelim(ze) || this.eat(1),
        this.isDelim(ze) ? this.charCodeAt(this.tokenStart + 1) !== $e ? (this.next(),
        this.eat(1)) : e && this.error("Identifier is expected", this.tokenEnd) : e && this.error("Vertical line is expected"),
        {
            type: "Identifier",
            loc: this.getLocation(t, this.tokenStart),
            name: this.substrToCursor(t)
        }
    }
    function qe() {
        let t = this.tokenStart
          , e = this.charCodeAt(t);
        return e !== $e && e !== Fe && e !== Ve && e !== Be && e !== Ue && e !== ze && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"),
        this.next(),
        e !== $e && (this.isDelim($e) || this.error("Equal sign is expected"),
        this.next()),
        this.substrToCursor(t)
    }
    function Ge() {
        let t, e = this.tokenStart, r = null, n = null, o = null;
        return this.eat(19),
        this.skipSC(),
        t = We.call(this),
        this.skipSC(),
        20 !== this.tokenType && (1 !== this.tokenType && (r = qe.call(this),
        this.skipSC(),
        n = 5 === this.tokenType ? this.String() : this.Identifier(),
        this.skipSC()),
        1 === this.tokenType && (o = this.consume(1),
        this.skipSC())),
        this.eat(20),
        {
            type: "AttributeSelector",
            loc: this.getLocation(e, this.tokenStart),
            name: t,
            matcher: r,
            value: n,
            flags: o
        }
    }
    function Je(t) {
        this.token(9, "["),
        this.node(t.name),
        null !== t.matcher && (this.tokenize(t.matcher),
        this.node(t.value)),
        null !== t.flags && this.token(1, t.flags),
        this.token(9, "]")
    }
    function He(t) {
        this.token(23, "{"),
        this.children(t, (t => {
            "Declaration" === t.type && this.token(17, ";")
        }
        )),
        this.token(24, "}")
    }
    function Ke(t) {
        this.token(9, "["),
        this.children(t),
        this.token(9, "]")
    }
    function Qe() {
        this.token(15, "--\x3e")
    }
    function Ye() {
        this.token(14, "\x3c!--")
    }
    function Xe() {
        return this.eatDelim(46),
        {
            type: "ClassSelector",
            loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
            name: this.consume(1)
        }
    }
    function Ze(t) {
        this.token(9, "."),
        this.token(1, t.name)
    }
    function tr() {
        let t, e = this.tokenStart;
        switch (this.tokenType) {
        case 13:
            t = " ";
            break;
        case 9:
            switch (this.charCodeAt(this.tokenStart)) {
            case 62:
            case 43:
            case 126:
                this.next();
                break;
            case 47:
                this.next(),
                this.eatIdent("deep"),
                this.eatDelim(47);
                break;
            default:
                this.error("Combinator is expected")
            }
            t = this.substrToCursor(e)
        }
        return {
            type: "Combinator",
            loc: this.getLocation(e, this.tokenStart),
            name: t
        }
    }
    function er(t) {
        this.tokenize(t.name)
    }
    function rr(t) {
        this.token(25, "/*" + t.value + "*/")
    }
    function nr(t) {
        this.token(1, t.property),
        this.token(16, ":"),
        this.node(t.value),
        t.important && (this.token(9, "!"),
        this.token(1, !0 === t.important ? "important" : t.important))
    }
    function or(t) {
        this.children(t, (t => {
            "Declaration" === t.type && this.token(17, ";")
        }
        ))
    }
    function ir(t) {
        this.token(12, t.value + t.unit)
    }
    function sr(t) {
        this.token(2, t.name + "("),
        this.children(t),
        this.token(22, ")")
    }
    function ar(t) {
        this.token(4, "#" + t.value)
    }
    function lr() {
        return {
            type: "Identifier",
            loc: this.getLocation(this.tokenStart, this.tokenEnd),
            name: this.consume(1)
        }
    }
    function cr(t) {
        this.token(1, t.name)
    }
    function ur() {
        let t = this.tokenStart;
        return this.eat(4),
        {
            type: "IdSelector",
            loc: this.getLocation(t, this.tokenStart),
            name: this.substrToCursor(t + 1)
        }
    }
    function hr(t) {
        this.token(9, "#" + t.name)
    }
    function dr(t) {
        this.token(21, "("),
        this.token(1, t.name),
        null !== t.value && (this.token(16, ":"),
        this.node(t.value)),
        this.token(22, ")")
    }
    function pr(t) {
        this.children(t)
    }
    function fr(t) {
        this.children(t, ( () => this.token(18, ",")))
    }
    function mr() {
        let t = this.tokenStart;
        return this.eatDelim(38),
        {
            type: "NestingSelector",
            loc: this.getLocation(t, this.tokenStart)
        }
    }
    function gr() {
        this.token(9, "&")
    }
    function kr() {
        this.skipSC();
        let t, e = this.tokenStart, r = e, n = null;
        return t = this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? this.Identifier() : this.AnPlusB(),
        r = this.tokenStart,
        this.skipSC(),
        this.lookupValue(0, "of") && (this.next(),
        n = this.SelectorList(),
        r = this.tokenStart),
        {
            type: "Nth",
            loc: this.getLocation(e, r),
            nth: t,
            selector: n
        }
    }
    function yr(t) {
        this.node(t.nth),
        null !== t.selector && (this.token(1, "of"),
        this.node(t.selector))
    }
    function vr(t) {
        this.token(10, t.value)
    }
    function br(t) {
        this.tokenize(t.value)
    }
    function Sr(t) {
        this.token(21, "("),
        this.children(t),
        this.token(22, ")")
    }
    function Cr() {
        return {
            type: "Percentage",
            loc: this.getLocation(this.tokenStart, this.tokenEnd),
            value: this.consumeNumber(11)
        }
    }
    function wr(t) {
        this.token(11, t.value + "%")
    }
    function xr() {
        let t, e, r = this.tokenStart, n = null;
        return this.eat(16),
        2 === this.tokenType ? (t = this.consumeFunctionName(),
        e = t.toLowerCase(),
        hasOwnProperty.call(this.pseudo, e) ? (this.skipSC(),
        n = this.pseudo[e].call(this),
        this.skipSC()) : (n = this.createList(),
        n.push(this.Raw(this.tokenIndex, null, !1))),
        this.eat(22)) : t = this.consume(1),
        {
            type: "PseudoClassSelector",
            loc: this.getLocation(r, this.tokenStart),
            name: t,
            children: n
        }
    }
    function Ar(t) {
        this.token(16, ":"),
        null === t.children ? this.token(1, t.name) : (this.token(2, t.name + "("),
        this.children(t),
        this.token(22, ")"))
    }
    function Lr() {
        let t, e, r = this.tokenStart, n = null;
        return this.eat(16),
        this.eat(16),
        2 === this.tokenType ? (t = this.consumeFunctionName(),
        e = t.toLowerCase(),
        hasOwnProperty.call(this.pseudo, e) ? (this.skipSC(),
        n = this.pseudo[e].call(this),
        this.skipSC()) : (n = this.createList(),
        n.push(this.Raw(this.tokenIndex, null, !1))),
        this.eat(22)) : t = this.consume(1),
        {
            type: "PseudoElementSelector",
            loc: this.getLocation(r, this.tokenStart),
            name: t,
            children: n
        }
    }
    function Er(t) {
        this.token(16, ":"),
        this.token(16, ":"),
        null === t.children ? this.token(1, t.name) : (this.token(2, t.name + "("),
        this.children(t),
        this.token(22, ")"))
    }
    function _r(t) {
        this.token(10, t.left),
        this.token(9, "/"),
        this.token(10, t.right)
    }
    function Tr() {
        return this.tokenIndex > 0 && 13 === this.lookupType(-1) ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart
    }
    function Or(t, e, r) {
        let n, o = this.getTokenStart(t);
        return this.skipUntilBalanced(t, e || this.consumeUntilBalanceEnd),
        n = r && this.tokenStart > o ? Tr.call(this) : this.tokenStart,
        {
            type: "Raw",
            loc: this.getLocation(o, n),
            value: this.substring(o, n)
        }
    }
    function Pr(t) {
        this.tokenize(t.value)
    }
    function Ir(t) {
        this.node(t.prelude),
        this.node(t.block)
    }
    function Nr() {
        let t = this.readSequence(this.scope.Selector);
        return null === this.getFirstListNode(t) && this.error("Selector is expected"),
        {
            type: "Selector",
            loc: this.getLocationFromList(t),
            children: t
        }
    }
    function jr(t) {
        this.children(t)
    }
    function Mr() {
        let t = this.createList();
        for (; !this.eof && (t.push(this.Selector()),
        18 === this.tokenType); )
            this.next();
        return {
            type: "SelectorList",
            loc: this.getLocationFromList(t),
            children: t
        }
    }
    function Dr(t) {
        this.children(t, ( () => this.token(18, ",")))
    }
    var Rr = 92
      , Br = 34
      , Ur = 39;
    function $r(t) {
        let e = t.length
          , r = t.charCodeAt(0)
          , n = r === Br || r === Ur ? 1 : 0
          , o = 1 === n && e > 1 && t.charCodeAt(e - 1) === r ? e - 2 : e - 1
          , i = "";
        for (let r = n; r <= o; r++) {
            let n = t.charCodeAt(r);
            if (n === Rr) {
                if (r === o) {
                    r !== e - 1 && (i = t.substr(r + 1));
                    break
                }
                if (n = t.charCodeAt(++r),
                Rt(Rr, n)) {
                    let e = r - 1
                      , n = Zt(t, e);
                    r = n - 1,
                    i += ne(t.substring(e + 1, n))
                } else
                    13 === n && 10 === t.charCodeAt(r + 1) && r++
            } else
                i += t[r]
        }
        return i
    }
    function Vr() {
        return {
            type: "String",
            loc: this.getLocation(this.tokenStart, this.tokenEnd),
            value: $r(this.consume(5))
        }
    }
    function zr(t) {
        this.token(5, function(t, e) {
            let r = Br
              , n = ""
              , o = !1;
            for (let e = 0; e < t.length; e++) {
                let i = t.charCodeAt(e);
                0 !== i ? i <= 31 || 127 === i ? (n += "\\" + i.toString(16),
                o = !0) : i === r || i === Rr ? (n += "\\" + t.charAt(e),
                o = !1) : (o && (Ot(i) || Dt(i)) && (n += " "),
                n += t.charAt(e),
                o = !1) : n += "\ufffd"
            }
            return '"' + n + '"'
        }(t.value))
    }
    function Fr(t) {
        this.children(t)
    }
    var Wr = 42;
    function qr() {
        1 !== this.tokenType && !1 === this.isDelim(Wr) && this.error("Identifier or asterisk is expected"),
        this.next()
    }
    function Gr() {
        let t = this.tokenStart;
        return this.isDelim(124) ? (this.next(),
        qr.call(this)) : (qr.call(this),
        this.isDelim(124) && (this.next(),
        qr.call(this))),
        {
            type: "TypeSelector",
            loc: this.getLocation(t, this.tokenStart),
            name: this.substrToCursor(t)
        }
    }
    function Jr(t) {
        this.tokenize(t.name)
    }
    function Hr(t) {
        this.tokenize(t.value)
    }
    var Kr = 32
      , Qr = 92
      , Yr = 34
      , Xr = 39
      , Zr = 40
      , tn = 41;
    function en(t) {
        this.token(7, function(t) {
            let e = ""
              , r = !1;
            for (let n = 0; n < t.length; n++) {
                let o = t.charCodeAt(n);
                0 !== o ? o <= 31 || 127 === o ? (e += "\\" + o.toString(16),
                r = !0) : o === Kr || o === Qr || o === Yr || o === Xr || o === Zr || o === tn ? (e += "\\" + t.charAt(n),
                r = !1) : (r && Ot(o) && (e += " "),
                e += t.charAt(n),
                r = !1) : e += "\ufffd"
            }
            return "url(" + e + ")"
        }(t.value))
    }
    function rn(t) {
        this.children(t)
    }
    function nn(t) {
        this.token(13, t.value)
    }
    var on = function(t) {
        let e = new Map;
        for (let r in t.node) {
            let n = t.node[r];
            "function" == typeof (n.generate || n) && e.set(r, n.generate || n)
        }
        return function(t, r) {
            let n = ""
              , o = 0
              , i = {
                node(t) {
                    if (!e.has(t.type))
                        throw new Error("Unknown node type: " + t.type);
                    e.get(t.type).call(s, t)
                },
                tokenBefore: Ce,
                token(t, e) {
                    o = this.tokenBefore(o, t, e),
                    this.emit(e, t, !1),
                    9 === t && 92 === e.charCodeAt(0) && this.emit("\n", 13, !0)
                },
                emit(t) {
                    n += t
                },
                result: () => n
            };
            r && ("function" == typeof r.decorator && (i = r.decorator(i)),
            r.sourceMap && (i = function(t) {
                let e = new fe.SourceMapGenerator
                  , r = {
                    line: 1,
                    column: 0
                }
                  , n = {
                    line: 0,
                    column: 0
                }
                  , o = {
                    line: 1,
                    column: 0
                }
                  , i = {
                    generated: o
                }
                  , s = 1
                  , a = 0
                  , l = !1
                  , c = t.node;
                t.node = function(t) {
                    if (t.loc && t.loc.start && me.has(t.type)) {
                        let c = t.loc.start.line
                          , u = t.loc.start.column - 1;
                        (n.line !== c || n.column !== u) && (n.line = c,
                        n.column = u,
                        r.line = s,
                        r.column = a,
                        l && (l = !1,
                        (r.line !== o.line || r.column !== o.column) && e.addMapping(i)),
                        l = !0,
                        e.addMapping({
                            source: t.loc.source,
                            original: n,
                            generated: r
                        }))
                    }
                    c.call(this, t),
                    l && me.has(t.type) && (o.line = s,
                    o.column = a)
                }
                ;
                let u = t.emit;
                t.emit = function(t, e, r) {
                    for (let e = 0; e < t.length; e++)
                        10 === t.charCodeAt(e) ? (s++,
                        a = 0) : a++;
                    u(t, e, r)
                }
                ;
                let h = t.result;
                return t.result = function() {
                    return l && e.addMapping(i),
                    {
                        css: h(),
                        map: e
                    }
                }
                ,
                t
            }(i)),
            r.mode in ge && (i.tokenBefore = ge[r.mode]));
            let s = {
                node: t => i.node(t),
                children: we,
                token: (t, e) => i.token(t, e),
                tokenize: xe
            };
            return i.node(t),
            i.result()
        }
    }({
        node: Ae
    })
      , sn = null
      , an = class {
        static createItem(t) {
            return {
                prev: null,
                next: null,
                data: t
            }
        }
        constructor() {
            this.head = null,
            this.tail = null,
            this.cursor = null
        }
        createItem(t) {
            return an.createItem(t)
        }
        allocateCursor(t, e) {
            let r;
            return null !== sn ? (r = sn,
            sn = sn.cursor,
            r.prev = t,
            r.next = e,
            r.cursor = this.cursor) : r = {
                prev: t,
                next: e,
                cursor: this.cursor
            },
            this.cursor = r,
            r
        }
        releaseCursor() {
            let {cursor: t} = this;
            this.cursor = t.cursor,
            t.prev = null,
            t.next = null,
            t.cursor = sn,
            sn = t
        }
        updateCursors(t, e, r, n) {
            let {cursor: o} = this;
            for (; null !== o; )
                o.prev === t && (o.prev = e),
                o.next === r && (o.next = n),
                o = o.cursor
        }
        *[Symbol.iterator]() {
            for (let t = this.head; null !== t; t = t.next)
                yield t.data
        }
        get size() {
            let t = 0;
            for (let e = this.head; null !== e; e = e.next)
                t++;
            return t
        }
        get isEmpty() {
            return null === this.head
        }
        get first() {
            return this.head && this.head.data
        }
        get last() {
            return this.tail && this.tail.data
        }
        fromArray(t) {
            let e = null;
            this.head = null;
            for (let r of t) {
                let t = an.createItem(r);
                null !== e ? e.next = t : this.head = t,
                t.prev = e,
                e = t
            }
            return this.tail = e,
            this
        }
        toArray() {
            return [...this]
        }
        toJSON() {
            return [...this]
        }
        forEach(t, e=this) {
            let r = this.allocateCursor(null, this.head);
            for (; null !== r.next; ) {
                let n = r.next;
                r.next = n.next,
                t.call(e, n.data, n, this)
            }
            this.releaseCursor()
        }
        forEachRight(t, e=this) {
            let r = this.allocateCursor(this.tail, null);
            for (; null !== r.prev; ) {
                let n = r.prev;
                r.prev = n.prev,
                t.call(e, n.data, n, this)
            }
            this.releaseCursor()
        }
        reduce(t, e, r=this) {
            let n, o = this.allocateCursor(null, this.head), i = e;
            for (; null !== o.next; )
                n = o.next,
                o.next = n.next,
                i = t.call(r, i, n.data, n, this);
            return this.releaseCursor(),
            i
        }
        reduceRight(t, e, r=this) {
            let n, o = this.allocateCursor(this.tail, null), i = e;
            for (; null !== o.prev; )
                n = o.prev,
                o.prev = n.prev,
                i = t.call(r, i, n.data, n, this);
            return this.releaseCursor(),
            i
        }
        some(t, e=this) {
            for (let r = this.head; null !== r; r = r.next)
                if (t.call(e, r.data, r, this))
                    return !0;
            return !1
        }
        map(t, e=this) {
            let r = new an;
            for (let n = this.head; null !== n; n = n.next)
                r.appendData(t.call(e, n.data, n, this));
            return r
        }
        filter(t, e=this) {
            let r = new an;
            for (let n = this.head; null !== n; n = n.next)
                t.call(e, n.data, n, this) && r.appendData(n.data);
            return r
        }
        nextUntil(t, e, r=this) {
            if (null === t)
                return;
            let n = this.allocateCursor(null, t);
            for (; null !== n.next; ) {
                let t = n.next;
                if (n.next = t.next,
                e.call(r, t.data, t, this))
                    break
            }
            this.releaseCursor()
        }
        prevUntil(t, e, r=this) {
            if (null === t)
                return;
            let n = this.allocateCursor(t, null);
            for (; null !== n.prev; ) {
                let t = n.prev;
                if (n.prev = t.prev,
                e.call(r, t.data, t, this))
                    break
            }
            this.releaseCursor()
        }
        clear() {
            this.head = null,
            this.tail = null
        }
        copy() {
            let t = new an;
            for (let e of this)
                t.appendData(e);
            return t
        }
        prepend(t) {
            return this.updateCursors(null, t, this.head, t),
            null !== this.head ? (this.head.prev = t,
            t.next = this.head) : this.tail = t,
            this.head = t,
            this
        }
        prependData(t) {
            return this.prepend(an.createItem(t))
        }
        append(t) {
            return this.insert(t)
        }
        appendData(t) {
            return this.insert(an.createItem(t))
        }
        insert(t, e=null) {
            if (null !== e)
                if (this.updateCursors(e.prev, t, e, t),
                null === e.prev) {
                    if (this.head !== e)
                        throw new Error("before doesn't belong to list");
                    this.head = t,
                    e.prev = t,
                    t.next = e,
                    this.updateCursors(null, t)
                } else
                    e.prev.next = t,
                    t.prev = e.prev,
                    e.prev = t,
                    t.next = e;
            else
                this.updateCursors(this.tail, t, null, t),
                null !== this.tail ? (this.tail.next = t,
                t.prev = this.tail) : this.head = t,
                this.tail = t;
            return this
        }
        insertData(t, e) {
            return this.insert(an.createItem(t), e)
        }
        remove(t) {
            if (this.updateCursors(t, t.prev, t, t.next),
            null !== t.prev)
                t.prev.next = t.next;
            else {
                if (this.head !== t)
                    throw new Error("item doesn't belong to list");
                this.head = t.next
            }
            if (null !== t.next)
                t.next.prev = t.prev;
            else {
                if (this.tail !== t)
                    throw new Error("item doesn't belong to list");
                this.tail = t.prev
            }
            return t.prev = null,
            t.next = null,
            t
        }
        push(t) {
            this.insert(an.createItem(t))
        }
        pop() {
            return null !== this.tail ? this.remove(this.tail) : null
        }
        unshift(t) {
            this.prepend(an.createItem(t))
        }
        shift() {
            return null !== this.head ? this.remove(this.head) : null
        }
        prependList(t) {
            return this.insertList(t, this.head)
        }
        appendList(t) {
            return this.insertList(t)
        }
        insertList(t, e) {
            return null === t.head || (null != e ? (this.updateCursors(e.prev, t.tail, e, t.head),
            null !== e.prev ? (e.prev.next = t.head,
            t.head.prev = e.prev) : this.head = t.head,
            e.prev = t.tail,
            t.tail.next = e) : (this.updateCursors(this.tail, t.tail, null, t.head),
            null !== this.tail ? (this.tail.next = t.head,
            t.head.prev = this.tail) : this.head = t.head,
            this.tail = t.tail),
            t.head = null,
            t.tail = null),
            this
        }
        replace(t, e) {
            "head"in e ? this.insertList(e, t) : this.insert(e, t),
            this.remove(t)
        }
    }
      , ln = 100
      , cn = 60
      , un = "    ";
    function hn({source: t, line: e, column: r}, n) {
        function o(t, e) {
            return i.slice(t, e).map(( (e, r) => String(t + r + 1).padStart(l) + " |" + e)).join("\n")
        }
        let i = t.split(/\r\n?|\n|\f/)
          , s = Math.max(1, e - n) - 1
          , a = Math.min(e + n, i.length + 1)
          , l = Math.max(4, String(a).length) + 1
          , c = 0;
        (r += (un.length - 1) * (i[e - 1].substr(0, r - 1).match(/\t/g) || []).length) > ln && (c = r - cn + 3,
        r = cn - 2);
        for (let t = s; t <= a; t++)
            t >= 0 && t < i.length && (i[t] = i[t].replace(/\t/g, un),
            i[t] = (c > 0 && i[t].length > c ? "\u2026" : "") + i[t].substr(c, ln - 2) + (i[t].length > c + ln - 1 ? "\u2026" : ""));
        return [o(s, e), new Array(r + l + 2).join("-") + "^", o(e, a)].filter(Boolean).join("\n")
    }
    function dn(t, e, r, n, o) {
        return Object.assign(function(t, e) {
            let r = Object.create(SyntaxError.prototype)
              , n = new Error;
            return Object.assign(r, {
                name: t,
                message: e,
                get stack() {
                    return (n.stack || "").replace(/^(.+\n){1,3}/, `${t}: ${e}\n`)
                }
            })
        }("SyntaxError", t), {
            source: e,
            offset: r,
            line: n,
            column: o,
            sourceFragment: t => hn({
                source: e,
                line: n,
                column: o
            }, isNaN(t) ? 0 : t),
            get formattedMessage() {
                return `Parse error: ${t}\n` + hn({
                    source: e,
                    line: n,
                    column: o
                }, 2)
            }
        })
    }
    function pn(t) {
        let e = this.createList()
          , r = !1
          , n = {
            recognizer: t
        };
        for (; !this.eof; ) {
            switch (this.tokenType) {
            case 25:
                this.next();
                continue;
            case 13:
                r = !0,
                this.next();
                continue
            }
            let o = t.getNode.call(this, n);
            if (void 0 === o)
                break;
            r && (t.onWhiteSpace && t.onWhiteSpace.call(this, o, e, n),
            r = !1),
            e.push(o)
        }
        return r && t.onWhiteSpace && t.onWhiteSpace.call(this, null, e, n),
        e
    }
    var fn = () => {}
    ;
    function mn(t) {
        return function() {
            return this[t]()
        }
    }
    function gn(t) {
        let e = Object.create(null);
        for (let r in t) {
            let n = t[r]
              , o = n.parse || n;
            o && (e[r] = o)
        }
        return e
    }
    var kn = {
        parse() {
            return this.createSingleNodeList(this.SelectorList())
        }
    }
      , yn = {
        parse() {
            return this.createSingleNodeList(this.Selector())
        }
    }
      , vn = {
        parse() {
            return this.createSingleNodeList(this.Identifier())
        }
    }
      , bn = {
        parse() {
            return this.createSingleNodeList(this.Nth())
        }
    }
      , Sn = {
        dir: vn,
        has: kn,
        lang: vn,
        matches: kn,
        is: kn,
        "-moz-any": kn,
        "-webkit-any": kn,
        where: kn,
        not: kn,
        "nth-child": bn,
        "nth-last-child": bn,
        "nth-last-of-type": bn,
        "nth-of-type": bn,
        slotted: yn,
        host: yn,
        "host-context": yn
    }
      , Cn = {};
    Ct(Cn, {
        AnPlusB: () => je,
        AttributeSelector: () => Ge,
        ClassSelector: () => Xe,
        Combinator: () => tr,
        IdSelector: () => ur,
        Identifier: () => lr,
        NestingSelector: () => mr,
        Nth: () => kr,
        Percentage: () => Cr,
        PseudoClassSelector: () => xr,
        PseudoElementSelector: () => Lr,
        Raw: () => Or,
        Selector: () => Nr,
        SelectorList: () => Mr,
        String: () => Vr,
        TypeSelector: () => Gr
    });
    var wn = function(t) {
        let e = ""
          , r = "<unknown>"
          , n = !1
          , o = fn
          , i = !1
          , s = new ae
          , a = Object.assign(new he, function(t) {
            let e = {
                context: Object.create(null),
                scope: Object.assign(Object.create(null), t.scope),
                atrule: gn(t.atrule),
                pseudo: gn(t.pseudo),
                node: gn(t.node)
            };
            for (let r in t.parseContext)
                switch (typeof t.parseContext[r]) {
                case "function":
                    e.context[r] = t.parseContext[r];
                    break;
                case "string":
                    e.context[r] = mn(t.parseContext[r])
                }
            return {
                config: e,
                ...e,
                ...e.node
            }
        }(t || {}), {
            parseAtrulePrelude: !0,
            parseRulePrelude: !0,
            parseValue: !0,
            parseCustomProperty: !1,
            readSequence: pn,
            consumeUntilBalanceEnd: () => 0,
            consumeUntilLeftCurlyBracket: t => 123 === t ? 1 : 0,
            consumeUntilLeftCurlyBracketOrSemicolon: t => 123 === t || 59 === t ? 1 : 0,
            consumeUntilExclamationMarkOrSemicolon: t => 33 === t || 59 === t ? 1 : 0,
            consumeUntilSemicolonIncluded: t => 59 === t ? 2 : 0,
            createList: () => new an,
            createSingleNodeList: t => (new an).appendData(t),
            getFirstListNode: t => t && t.first,
            getLastListNode: t => t && t.last,
            parseWithFallback(t, e) {
                let r = this.tokenIndex;
                try {
                    return t.call(this)
                } catch (t) {
                    if (i)
                        throw t;
                    let n = e.call(this, r);
                    return i = !0,
                    o(t, n),
                    i = !1,
                    n
                }
            },
            lookupNonWSType(t) {
                let e;
                do {
                    if (e = this.lookupType(t++),
                    13 !== e)
                        return e
                } while (0 !== e);
                return 0
            },
            charCodeAt: t => t >= 0 && t < e.length ? e.charCodeAt(t) : 0,
            substring: (t, r) => e.substring(t, r),
            substrToCursor(t) {
                return this.source.substring(t, this.tokenStart)
            },
            cmpChar: (t, r) => Kt(e, t, r),
            cmpStr: (t, r, n) => Qt(e, t, r, n),
            consume(t) {
                let e = this.tokenStart;
                return this.eat(t),
                this.substrToCursor(e)
            },
            consumeFunctionName() {
                let t = e.substring(this.tokenStart, this.tokenEnd - 1);
                return this.eat(2),
                t
            },
            consumeNumber(t) {
                let r = e.substring(this.tokenStart, ee(e, this.tokenStart));
                return this.eat(t),
                r
            },
            eat(t) {
                if (this.tokenType !== t) {
                    let e = oe[t].slice(0, -6).replace(/-/g, " ").replace(/^./, (t => t.toUpperCase()))
                      , r = `${/[[\](){}]/.test(e) ? `"${e}"` : e} is expected`
                      , n = this.tokenStart;
                    switch (t) {
                    case 1:
                        2 === this.tokenType || 7 === this.tokenType ? (n = this.tokenEnd - 1,
                        r = "Identifier is expected but function found") : r = "Identifier is expected";
                        break;
                    case 4:
                        this.isDelim(35) && (this.next(),
                        n++,
                        r = "Name is expected");
                        break;
                    case 11:
                        10 === this.tokenType && (n = this.tokenEnd,
                        r = "Percent sign is expected")
                    }
                    this.error(r, n)
                }
                this.next()
            },
            eatIdent(t) {
                (1 !== this.tokenType || !1 === this.lookupValue(0, t)) && this.error(`Identifier "${t}" is expected`),
                this.next()
            },
            eatDelim(t) {
                this.isDelim(t) || this.error(`Delim "${String.fromCharCode(t)}" is expected`),
                this.next()
            },
            getLocation: (t, e) => n ? s.getLocationRange(t, e, r) : null,
            getLocationFromList(t) {
                if (n) {
                    let e = this.getFirstListNode(t)
                      , n = this.getLastListNode(t);
                    return s.getLocationRange(null !== e ? e.loc.start.offset - s.startOffset : this.tokenStart, null !== n ? n.loc.end.offset - s.startOffset : this.tokenStart, r)
                }
                return null
            },
            error(t, r) {
                let n = typeof r < "u" && r < e.length ? s.getLocation(r) : this.eof ? s.getLocation(function(t, e) {
                    for (; e >= 0 && Dt(t.charCodeAt(e)); e--)
                        ;
                    return e + 1
                }(e, e.length - 1)) : s.getLocation(this.tokenStart);
                throw new dn(t || "Unexpected input",e,n.offset,n.line,n.column)
            }
        });
        return Object.assign((function(t, l) {
            e = t,
            l = l || {},
            a.setSource(e, de),
            s.setSource(e, l.offset, l.line, l.column),
            r = l.filename || "<unknown>",
            n = Boolean(l.positions),
            o = "function" == typeof l.onParseError ? l.onParseError : fn,
            i = !1,
            a.parseAtrulePrelude = !("parseAtrulePrelude"in l) || Boolean(l.parseAtrulePrelude),
            a.parseRulePrelude = !("parseRulePrelude"in l) || Boolean(l.parseRulePrelude),
            a.parseValue = !("parseValue"in l) || Boolean(l.parseValue),
            a.parseCustomProperty = "parseCustomProperty"in l && Boolean(l.parseCustomProperty);
            let {context: c="default", onComment: u} = l;
            if (!(c in a.context))
                throw new Error("Unknown context `" + c + "`");
            "function" == typeof u && a.forEachToken(( (t, r, n) => {
                if (25 === t) {
                    let t = a.getLocation(r, n)
                      , o = Qt(e, n - 2, n, "*/") ? e.slice(r + 2, n - 2) : e.slice(r + 2, n);
                    u(o, t)
                }
            }
            ));
            let h = a.context[c].call(a, l);
            return a.eof || a.error(),
            h
        }
        ), {
            SyntaxError: dn,
            config: a.config
        })
    }({
        parseContext: {
            default: "SelectorList",
            selectorList: "SelectorList",
            selector: "Selector"
        },
        scope: {
            Selector: {
                onWhiteSpace: function(t, e) {
                    null !== e.last && "Combinator" !== e.last.type && null !== t && "Combinator" !== t.type && e.push({
                        type: "Combinator",
                        loc: null,
                        name: " "
                    })
                },
                getNode: function() {
                    switch (this.tokenType) {
                    case 19:
                        return this.AttributeSelector();
                    case 4:
                        return this.IdSelector();
                    case 16:
                        return 16 === this.lookupType(1) ? this.PseudoElementSelector() : this.PseudoClassSelector();
                    case 1:
                        return this.TypeSelector();
                    case 10:
                    case 11:
                        return this.Percentage();
                    case 12:
                        46 === this.charCodeAt(this.tokenStart) && this.error("Identifier is expected", this.tokenStart + 1);
                        break;
                    case 9:
                        switch (this.charCodeAt(this.tokenStart)) {
                        case 43:
                        case 62:
                        case 126:
                        case 47:
                            return this.Combinator();
                        case 46:
                            return this.ClassSelector();
                        case 42:
                        case 124:
                            return this.TypeSelector();
                        case 35:
                            return this.IdSelector();
                        case 38:
                            return this.NestingSelector()
                        }
                    }
                }
            }
        },
        atrule: {},
        pseudo: Sn,
        node: Cn
    })
      , xn = (t, e) => t.a === e.a ? t.b === e.b ? t.c - e.c : t.b - e.b : t.a - e.a
      , An = (t, e) => 0 === xn(t, e)
      , Ln = (t, e) => xn(t, e) > 0
      , En = (t, e) => xn(t, e) < 0
      , _n = (t, e="ASC") => {
        let r = t.sort(xn);
        return "DESC" === e ? r.reverse() : r
    }
      , Tn = (...t) => _n(t, "ASC")
      , On = (...t) => _n(t, "DESC")
      , Pn = (...t) => On(...t)[0]
      , In = t => {
        let e = {
            a: 0,
            b: 0,
            c: 0
        };
        return t.children.forEach((t => {
            switch (t.type) {
            case "IdSelector":
                e.a += 1;
                break;
            case "AttributeSelector":
            case "ClassSelector":
                e.b += 1;
                break;
            case "PseudoClassSelector":
                switch (t.name.toLowerCase()) {
                case "where":
                    break;
                case "is":
                case "matches":
                case "-webkit-any":
                case "-moz-any":
                case "any":
                case "not":
                case "has":
                    if (t.children) {
                        let r = Pn(...Nn(t.children.first));
                        e.a += r.a,
                        e.b += r.b,
                        e.c += r.c
                    }
                    break;
                case "nth-child":
                case "nth-last-child":
                    if (e.b += 1,
                    t.children.first.selector) {
                        let r = Pn(...Nn(t.children.first.selector));
                        e.a += r.a,
                        e.b += r.b,
                        e.c += r.c
                    }
                    break;
                case "host-context":
                case "host":
                    if (e.b += 1,
                    t.children) {
                        let r = {
                            type: "Selector",
                            children: []
                        }
                          , n = !1;
                        t.children.first.children.forEach((t => !n && ("Combinator" === t.type ? (n = !0,
                        !1) : void r.children.push(t))));
                        let o = Nn(r)[0];
                        e.a += o.a,
                        e.b += o.b,
                        e.c += o.c
                    }
                    break;
                case "after":
                case "before":
                case "first-letter":
                case "first-line":
                    e.c += 1;
                    break;
                default:
                    e.b += 1
                }
                break;
            case "PseudoElementSelector":
                switch (t.name) {
                case "slotted":
                    if (e.c += 1,
                    t.children) {
                        let r = {
                            type: "Selector",
                            children: []
                        }
                          , n = !1;
                        t.children.first.children.forEach((t => !n && ("Combinator" === t.type ? (n = !0,
                        !1) : void r.children.push(t))));
                        let o = Nn(r)[0];
                        e.a += o.a,
                        e.b += o.b,
                        e.c += o.c
                    }
                    break;
                case "view-transition-group":
                case "view-transition-image-pair":
                case "view-transition-old":
                case "view-transition-new":
                    if (t.children && "*" === t.children.first.value)
                        break;
                    e.c += 1;
                    break;
                default:
                    e.c += 1
                }
                break;
            case "TypeSelector":
                let r = t.name;
                r.includes("|") && (r = r.split("|")[1]),
                "*" !== r && (e.c += 1)
            }
        }
        )),
        new jn(e,t)
    }
      , Nn = t => {
        if (!t)
            return [];
        let e = (t => {
            if ("string" == typeof t || t instanceof String)
                try {
                    return wn(t, {
                        context: "selectorList"
                    })
                } catch (e) {
                    throw new TypeError(`Could not convert passed in source '${t}' to SelectorList: ${e.message}`)
                }
            if (t instanceof Object) {
                if (t.type && ["Selector", "SelectorList"].includes(t.type))
                    return t;
                if (t.type && "Raw" === t.type)
                    try {
                        return wn(t.value, {
                            context: "selectorList"
                        })
                    } catch (t) {
                        throw new TypeError(`Could not convert passed in source to SelectorList: ${t.message}`)
                    }
                throw new TypeError("Passed in source is an Object but no AST / AST of the type Selector or SelectorList")
            }
            throw new TypeError("Passed in source is not a String nor an Object. I don't know what to do with it.")
        }
        )(t);
        if ("Selector" === e.type)
            return [In(t)];
        if ("SelectorList" === e.type) {
            let t = [];
            return e.children.forEach((e => {
                let r = In(e);
                t.push(r)
            }
            )),
            t
        }
    }
      , jn = class {
        constructor(t, e=null) {
            this.value = t,
            this.selector = e
        }
        get a() {
            return this.value.a
        }
        set a(t) {
            throw new Error("Manipulating the port of the specificity directly is not allowed. Instead, directly set a new value")
        }
        get b() {
            return this.value.b
        }
        set b(t) {
            throw new Error("Manipulating the port of the specificity directly is not allowed. Instead, directly set a new value")
        }
        get c() {
            return this.value.c
        }
        set c(t) {
            throw new Error("Manipulating the port of the specificity directly is not allowed. Instead, directly set a new value")
        }
        selectorString() {
            return "string" == typeof this.selector || this.selector instanceof String ? this.selector : this.selector instanceof Object && "Selector" === this.selector.type ? on(this.selector) : ""
        }
        toObject() {
            return this.value
        }
        toArray() {
            return [this.value.a, this.value.b, this.value.c]
        }
        toString() {
            return `(${this.value.a},${this.value.b},${this.value.c})`
        }
        toJSON() {
            return {
                selector: this.selectorString(),
                asObject: this.toObject(),
                asArray: this.toArray(),
                asString: this.toString()
            }
        }
        isEqualTo(t) {
            return An(this, t)
        }
        isGreaterThan(t) {
            return Ln(this, t)
        }
        isLessThan(t) {
            return En(this, t)
        }
        static calculate(t) {
            return Nn(t)
        }
        static compare(t, e) {
            return xn(t, e)
        }
        static equals(t, e) {
            return An(t, e)
        }
        static lessThan(t, e) {
            return En(t, e)
        }
        static greaterThan(t, e) {
            return Ln(t, e)
        }
        static min(...t) {
            return ( (...t) => Tn(...t)[0])(...t)
        }
        static max(...t) {
            return Pn(...t)
        }
        static sortAsc(...t) {
            return Tn(...t)
        }
        static sortDesc(...t) {
            return On(...t)
        }
    }
    ;
    const Mn = t => R(t, (t => "fulfilled" === t.status ? t.value : [t]))
      , Dn = t => {
        const e = new Map
          , r = t => {
            const r = e.get(t);
            if (g(r))
                return r;
            {
                const r = jn.calculate(t)[0];
                return e.set(t, r),
                r
            }
        }
        ;
        return ( (t, e) => {
            const n = _.call(t, 0);
            return n.sort(( (t, e) => {
                const n = r(t.selector)
                  , o = r(e.selector);
                return jn.compare(n, o)
            }
            )),
            n
        }
        )(t)
    }
      , Rn = t => {
        const e = (t => R(t, (t => (t => -1 !== t.selector.indexOf(","))(t) ? (t => {
            const e = t.selector.split(/,(?![^(]*\))/g);
            return N(e, (e => {
                const r = e.trim();
                return {
                    ...t,
                    selector: r
                }
            }
            ))
        }
        )(t) : [t])))(t);
        return Dn(e)
    }
      , Bn = t => {
        const e = {};
        return j(t, (r => {
            const n = t.getPropertyValue(r);
            c(n) && (e[r] = n)
        }
        )),
        e
    }
      , Un = t => ({
        selector: t.selectorText,
        styles: Bn(t.style)
    })
      , $n = (t, e) => e(t).then((async t => {
        const r = R(t, (t => {
            if (t.type === window.CSSRule.IMPORT_RULE)
                return [$n(t.styleSheet, e)];
            if (t.type === window.CSSRule.STYLE_RULE) {
                const e = {
                    status: "fulfilled",
                    value: [Un(t)]
                };
                return [Promise.resolve([e])]
            }
            return []
        }
        ))
          , n = await Promise.allSettled(r);
        return Mn(n)
    }
    ), (t => Promise.resolve([{
        status: "rejected",
        reason: t
    }])))
      , Vn = (t, e) => {
        var r, n;
        return ( (t, e) => {
            const r = {};
            var n;
            return ( (t, e, r, n) => {
                lt(t, ( (t, o) => {
                    (e(t, o) ? r : n)(t, o)
                }
                ))
            }
            )(t, e, (n = r,
            (t, e) => {
                n[e] = t
            }
            ), v),
            r
        }
        )((r = (t, e) => ({
            ...t,
            ...e.styles
        }),
        n = {},
        j(e, ( (t, e) => {
            n = r(n, t)
        }
        )),
        n), ( (e, r) => !P(t.dom.style, r)))
    }
      , zn = (t, e) => {
        const r = ( (t, e) => $("style", X(t).dom))(t);
        ht(r, "media", "max-width: 1px"),
        rt(r, e);
        const n = (t => (t => Q(t) && g(t.dom.host))(t) ? t : (t => {
            const e = t.dom.head;
            if (null == e)
                throw new Error("Head is not available yet");
            return V(e)
        }
        )(X(t)))(t);
        tt(n, r);
        const o = E.from(r.dom.sheet).fold(( () => []), (t => B(t.cssRules)));
        return et(r),
        o
    }
    ;
    const Fn = t => R(t, (t => "fulfilled" === t.status ? t.value : []))
      , Wn = Rn
      , qn = t => e => e.options.get(t)
      , Gn = qn("body_class")
      , Jn = qn("body_id")
      , Hn = qn("skin")
      , Kn = new Set(["margin", "margin-left", "margin-right", "margin-top", "margin-bottom", "padding", "padding-left", "padding-right", "padding-top", "padding-bottom", "border", "border-width", "border-style", "border-color", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "float", "position", "left", "right", "top", "bottom", "z-index", "display", "transform", "width", "max-width", "min-width", "height", "max-height", "min-height", "overflow", "overflow-x", "overflow-y", "text-overflow", "vertical-align", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "outline", "outline-color", "outline-style", "outline-width"])
      , Qn = t => {
        const e = nt(t)
          , r = ( (t, e, r) => M(( (t, e) => {
            const r = k(e) ? e : A;
            let n = t.dom;
            const o = [];
            for (; null !== n.parentNode && void 0 !== n.parentNode; ) {
                const t = n.parentNode
                  , e = V(t);
                if (o.push(e),
                !0 === r(e))
                    break;
                n = t
            }
            return o
        }
        )(t, r), e))(t, (t => z(t, "*")), (t => {
            return r = e,
            t.dom === r.dom;
            var r
        }
        ));
        return [t].concat(r)
    }
      , Yn = (t, e) => {
        const r = (t => {
            const e = _.call(t, 0);
            return e.reverse(),
            e
        }
        )(Qn(t))
          , n = {}
          , o = Wn(e);
        return j(r, (t => {
            const e = M(o, (e => z(t, e.selector)))
              , r = ( (t, e) => {
                const r = {}
                  , n = N(e, (t => t.styles))
                  , o = (t => {
                    const e = {}
                      , r = t.dom;
                    if (dt(r))
                        for (let t = 0; t < r.style.length; t++) {
                            const n = r.style.item(t);
                            e[n] = r.style[n]
                        }
                    return e
                }
                )(t);
                return j(n.concat([o]), (t => {
                    lt(t, ( (t, e) => {
                        var n;
                        "background-color" !== e && (n = e,
                        Kn.has(n)) || (r[e] = t)
                    }
                    ))
                }
                )),
                r
            }
            )(t, e);
            lt(r, ( (t, e) => {
                n[e] = t
            }
            ))
        }
        )),
        n
    }
      , Xn = (t, e) => {
        const r = Z(t);
        j(r, (t => {
            var r;
            H(r = t) && G(r.dom) && lt(e, ( (e, r) => {
                ( (t, e) => {
                    const r = ( (t, e) => dt(t) ? t.style.getPropertyValue(e) : "")(t.dom, e);
                    return E.from(r).filter((t => t.length > 0))
                }
                )(t, r).isNone() && ( (t, e, r) => {
                    const n = t.dom;
                    pt(n, e, r)
                }
                )(t, r, e)
            }
            ))
        }
        ))
    }
      , Zn = (t, e) => {
        (t => void 0 !== t.dom.classList)(t) ? t.dom.classList.add(e) : ( (t, e) => {
            ( (t, e, r) => {
                const n = ( (t, e) => {
                    const r = ( (t, e) => {
                        const r = t.dom.getAttribute(e);
                        return null === r ? void 0 : r
                    }
                    )(t, e);
                    return void 0 === r || "" === r ? [] : r.split(" ")
                }
                )(t, e)
                  , o = n.concat([r]);
                ht(t, e, o.join(" "))
            }
            )(t, "class", e)
        }
        )(t, e)
    }
      , to = t => {
        const e = V((t => {
            if (g(t.target)) {
                const e = V(t.target);
                if (H(e) && g(e.dom.shadowRoot) && t.composed && t.composedPath) {
                    const e = t.composedPath();
                    if (e)
                        return ( (t, e) => 0 < t.length ? E.some(t[0]) : E.none())(e)
                }
            }
            return E.from(t.target)
        }
        )(t).getOr(t.target))
          , r = () => t.stopPropagation()
          , n = () => t.preventDefault()
          , o = b(n, r);
        return ( (t, e, r, n, o, i, s) => ({
            target: t,
            x: e,
            y: r,
            stop: n,
            prevent: o,
            kill: i,
            raw: s
        }))(e, t.clientX, t.clientY, r, n, o, t)
    }
      , eo = (t, e, r, n) => {
        t.dom.removeEventListener(e, r, n)
    }
      , ro = L
      , no = (t, e, r) => ( (t, e, r, n) => ( (t, e, r, n, o) => {
        const i = ( (t, e) => r => {
            t(r) && e(to(r))
        }
        )(r, n);
        return t.dom.addEventListener(e, i, o),
        {
            unbind: w(eo, t, e, i, o)
        }
    }
    )(t, e, r, n, !1))(t, e, ro, r)
      , oo = t => {
        const e = B(t);
        return 0 === e.length || I(e, (t => "screen" === t || "all" === t))
    }
      , io = t => !(t => "CSSImportRule" === t.constructor.name)(t) || oo(t.media)
      , so = (t, e, r) => {
        const n = nt(t);
        return (async (t, e) => {
            const r = (t => {
                const e = t.dom.styleSheets;
                return Array.prototype.slice.call(e)
            }
            )(t)
              , n = N(r, (t => $n(t, e)))
              , o = await Promise.allSettled(n);
            return Mn(o)
        }
        )(n, (t => ( (t, e, r) => (!!p(t.href) || !e(t.href) && (m(r) || r(t.href))) && (p(t.media) || oo(t.media)))(t, e, r) ? ( (t, e) => (t => {
            try {
                return Promise.resolve(B(t.cssRules))
            } catch (t) {
                return Promise.reject(t)
            }
        }
        )(e).catch((r => (async (t, e) => p(e.href) ? Promise.resolve([]) : fetch(e.href).then((t => t.ok ? t.text() : Promise.reject())).then((e => zn(t, e))).catch((t => [])))(t, e))))(n, t).then((t => M(t, io))) : Promise.resolve([]))).then(Fn)
    }
      , ao = async t => {
        const e = t.getContent()
          , r = (t => {
            const e = Hn(t)
              , r = (t => {
                const e = Hn(t)
                  , r = t.options.get("skin_url");
                return !1 === e ? r : r ? t.documentBaseURI.toAbsolute(r) : t.editorManager.baseURL + "/skins/ui/" + e
            }
            )(t)
              , n = t.editorManager.suffix;
            return !1 !== e && c(r) ? [r + `/skin${n}.css`, r + `/skin.shadowdom${n}.css`] : []
        }
        )(t)
          , n = V(t.getBody())
          , o = await so(n, (t => P(r, t)), void 0)
          , i = (t => {
            const e = "mce-sandbox";
            return {
                play: (r, n) => new Promise(( (o, i) => {
                    var s;
                    const a = $("div")
                      , l = $("iframe");
                    Zn(a, e),
                    ft(a, {
                        visibility: "hidden"
                    }),
                    tt(a, l),
                    tt(t, a);
                    const c = t => (...e) => {
                        et(a),
                        t(...e)
                    }
                      , u = null === (s = l.dom.contentWindow) || void 0 === s ? void 0 : s.document;
                    if (m(u))
                        return void c(i)(new Error("sandbox iframe did not init correctly"));
                    const h = no(l, "load", ( () => {
                        h.unbind();
                        const t = V(u)
                          , e = ot(t);
                        n(t, e).then(c(o), c(i))
                    }
                    ));
                    u.open(),
                    u.write(r),
                    u.close()
                }
                )),
                playInline: (r, n) => new Promise(( (o, i) => {
                    const s = $("div");
                    Zn(s, e),
                    ft(s, {
                        position: "fixed",
                        overflow: "hidden",
                        zIndex: "1000",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        top: "0",
                        opacity: "0"
                    });
                    const a = $("div");
                    ft(a, {
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top: "0",
                        height: "auto",
                        margin: "auto"
                    }),
                    rt(a, r),
                    tt(s, a),
                    tt(t, s);
                    const l = t => (...e) => {
                        et(s),
                        t(...e)
                    }
                    ;
                    setTimeout(( () => {
                        const e = Y(t);
                        n(e, a).then(l(o), l(i))
                    }
                    ), 50)
                }
                ))
            }
        }
        )(ot(V(document)))
          , s = ( (t, e) => '<!DOCTYPE html><html><head><base href="' + (0,
        t.dom.encode)(t.documentBaseURI.getURI()) + '"></head>' + ( (t, e) => {
            const r = t.dom.encode
              , n = Jn(t)
              , o = Gn(t)
              , i = t.getBody()
              , s = i.dir
              , a = s ? ' dir="' + r(s) + '"' : ""
              , l = t.inline ? i.nodeName.toLowerCase() : "body";
            return `<${l} ${t.inline ? `class="mce-content-body"${a}` : `id="${r(n)}" class="mce-content-body ${r(o)}"${a}`}>` + e + `</${l}>`
        }
        )(t, e) + "</html>")(t, e);
        return i.play(s, ( (t, e) => {
            const r = it(e, ".mce-content-body").getOr(e)
              , i = (t => {
                const e = L;
                return M(t, (t => !(t => ( (t, e, r=0, n) => {
                    const o = t.indexOf(e, r);
                    return -1 !== o && (!!m(n) || o + e.length <= n)
                }
                )(t.selector, "::"))(t) && e(t.selector)))
            }
            )(o);
            ( (t, e, r) => {
                ( (t, e, r) => {
                    const n = []
                      , o = document.createTreeWalker(t.dom, NodeFilter.SHOW_ELEMENT);
                    for (; g(o.nextNode()); ) {
                        const t = V(o.currentNode)
                          , r = M(e, (e => z(t, e.selector)));
                        if (r.length > 0) {
                            const e = Vn(t, r);
                            ft(t, e),
                            n.push(t)
                        }
                    }
                    r && j(n, (t => {
                        t.dom.removeAttribute("class")
                    }
                    ))
                }
                )(e, Rn(t), r)
            }
            )(i, r, !1);
            const s = Yn(n, i);
            return Xn(r, s),
            Promise.resolve({
                html: (a = r,
                a.dom.innerHTML)
            });
            var a
        }
        ))
    }
      , lo = t => {
        const e = e => e(t)
          , r = S(t)
          , n = () => o
          , o = {
            tag: !0,
            inner: t,
            fold: (e, r) => r(t),
            isValue: L,
            isError: A,
            map: e => uo.value(e(t)),
            mapError: n,
            bind: e,
            exists: e,
            forall: e,
            getOr: r,
            or: n,
            getOrThunk: r,
            orThunk: n,
            getOrDie: r,
            each: e => {
                e(t)
            }
            ,
            toOptional: () => E.some(t)
        };
        return o
    }
      , co = t => {
        const e = () => r
          , r = {
            tag: !1,
            inner: t,
            fold: (e, r) => e(t),
            isValue: A,
            isError: L,
            map: e,
            mapError: e => uo.error(e(t)),
            bind: e,
            exists: A,
            forall: L,
            getOr: C,
            or: C,
            getOrThunk: x,
            orThunk: x,
            getOrDie: (n = String(t),
            () => {
                throw new Error(n)
            }
            ),
            each: v,
            toOptional: E.none
        };
        var n;
        return r
    }
      , uo = {
        value: lo,
        error: co,
        fromOption: (t, e) => t.fold(( () => co(e)), lo)
    };
    var ho;
    !function(t) {
        t[t.Error = 0] = "Error",
        t[t.Value = 1] = "Value"
    }(ho || (ho = {}));
    const po = (t, e, r) => t.stype === ho.Error ? e(t.serror) : r(t.svalue)
      , fo = t => ({
        stype: ho.Value,
        svalue: t
    })
      , mo = t => ({
        stype: ho.Error,
        serror: t
    })
      , go = po
      , ko = (t, e, r) => {
        switch (t.tag) {
        case "field":
            return e(t.key, t.newKey, t.presence, t.prop);
        case "custom":
            return r(t.newKey, t.instantiator)
        }
    }
      , yo = t => (...e) => {
        if (0 === e.length)
            throw new Error("Can't merge zero objects");
        const r = {};
        for (let n = 0; n < e.length; n++) {
            const o = e[n];
            for (const e in o)
                ut(o, e) && (r[e] = t(r[e], o[e]))
        }
        return r
    }
      , vo = yo(( (t, e) => h(t) && h(e) ? vo(t, e) : e))
      , bo = (yo(( (t, e) => e)),
    t => b(mo, D)(t))
      , So = t => {
        const e = (t => {
            const e = []
              , r = [];
            return j(t, (t => {
                po(t, (t => r.push(t)), (t => e.push(t)))
            }
            )),
            {
                values: e,
                errors: r
            }
        }
        )(t);
        return e.errors.length > 0 ? bo(e.errors) : fo(e.values)
    }
      , Co = t => u(t) && st(t).length > 100 ? " removed due to size" : JSON.stringify(t, null, 2)
      , wo = (t, e) => mo([{
        path: t,
        getErrorInfo: e
    }])
      , xo = t => ({
        extract: (e, r) => {
            return n = t(r),
            o = t => ( (t, e) => wo(t, S(e)))(e, t),
            n.stype === ho.Error ? o(n.serror) : n;
            var n, o
        }
        ,
        toString: S("val")
    })
      , Ao = (t, e, r, n) => n(ct(t, e).getOrThunk(( () => r(t))))
      , Lo = (t, e, r, n, o) => {
        const i = t => o.extract(e.concat([n]), t)
          , s = t => t.fold(( () => fo(E.none())), (t => {
            const r = o.extract(e.concat([n]), t);
            return i = r,
            s = E.some,
            i.stype === ho.Value ? {
                stype: ho.Value,
                svalue: s(i.svalue)
            } : i;
            var i, s
        }
        ));
        switch (t.tag) {
        case "required":
            return ( (t, e, r, n) => ct(e, r).fold(( () => ( (t, e, r) => wo(t, ( () => 'Could not find valid *required* value for "' + e + '" in ' + Co(r))))(t, r, e)), n))(e, r, n, i);
        case "defaultedThunk":
            return Ao(r, n, t.process, i);
        case "option":
            return ( (t, e, r) => r(ct(t, e)))(r, n, s);
        case "defaultedOptionThunk":
            return ( (t, e, r, n) => n(ct(t, e).map((e => !0 === e ? r(t) : e))))(r, n, t.process, s);
        case "mergeWithThunk":
            return Ao(r, n, S({}), (e => {
                const n = vo(t.process(r), e);
                return i(n)
            }
            ))
        }
    }
      , Eo = t => ({
        extract: (e, r) => ( (t, e, r) => {
            const n = {}
              , o = [];
            for (const i of r)
                ko(i, ( (r, i, s, a) => {
                    const l = Lo(s, t, e, r, a);
                    go(l, (t => {
                        o.push(...t)
                    }
                    ), (t => {
                        n[i] = t
                    }
                    ))
                }
                ), ( (t, r) => {
                    n[t] = r(e)
                }
                ));
            return o.length > 0 ? mo(o) : fo(n)
        }
        )(e, r, t),
        toString: () => {
            const e = N(t, (t => ko(t, ( (t, e, r, n) => t + " -> " + n.toString()), ( (t, e) => "state(" + t + ")"))));
            return "obj{\n" + e.join("\n") + "}"
        }
    })
      , _o = (To = c,
    "string",
    xo((t => {
        const e = typeof t;
        return To(t) ? fo(t) : mo(`Expected type: string but got: ${e}`)
    }
    )));
    var To;
    const Oo = t => xo((e => t(e).fold(mo, fo)))
      , Po = (t, e, r) => {
        return n = ( (t, e, r) => ( (t, e) => t.stype === ho.Error ? {
            stype: ho.Error,
            serror: e(t.serror)
        } : t)(e.extract([t], r), (t => ({
            input: r,
            errors: t
        }))))(t, e, r),
        po(n, uo.error, uo.value);
        var n
    }
      , Io = (t, e, r, n) => ({
        tag: "field",
        key: t,
        newKey: e,
        presence: r,
        prop: n
    })
      , No = t => ( (t, e) => Io(t, t, {
        tag: "required",
        process: {}
    }, e))(t, _o)
      , jo = (t, e) => Io(t, t, {
        tag: "option",
        process: {}
    }, e)
      , Mo = t => jo(t, _o)
      , Do = Eo([No("html"), Mo("css")])
      , Ro = Eo([jo("default", Do), jo("even", Do), jo("odd", Do), jo("first", Do)])
      , Bo = Eo([Mo("top"), Mo("bottom"), Mo("right"), Mo("left")])
      , Uo = Eo([("orientation",
    $o = ["portrait", "landscape"],
    jo("orientation", (t => Oo((e => P(t, e) ? uo.value(e) : uo.error(`Unsupported value: "${e}", choose one of "${t.join(", ")}".`))))($o))), jo("margin", Bo), jo("size", ( (t, e) => {
        const r = C;
        return {
            extract: (e, n) => {
                const o = [];
                for (const i of t) {
                    const t = i.extract(e, n);
                    if (t.stype === ho.Value)
                        return {
                            stype: ho.Value,
                            svalue: r(t.svalue)
                        };
                    o.push(t)
                }
                return So(o)
            }
            ,
            toString: () => "oneOf(" + N(t, (t => t.toString())).join(", ") + ")"
        }
    }
    )([Eo([No("width"), No("height")]), Oo((t => {
        const e = ["Letter", "Legal", "Tabloid", "Statement", "Executive", "A3", "A4", "A5", "A6", "B4", "B5", "JB4", "JB5"]
          , r = t.toLowerCase();
        return I(e, (t => t.toLowerCase() === r)) ? uo.value(!0) : uo.error("The size should be one of these values: " + e.join(", "))
    }
    ))]))]);
    var $o;
    const Vo = {
        document: {
            size: "letter"
        }
    }
      , zo = Eo([jo("headers", Ro), jo("footers", Ro), jo("document", Uo), jo("extra_http_headers", Eo([])), Mo("base_url")])
      , Fo = t => E.from(t.options.get("exportword_service_url")).map((t => ( (t, e) => {
        const r = new URL(t);
        return r.pathname = "/v2/convert/html-docx",
        r.search = "",
        r.hash = "",
        r.toString()
    }
    )(t))).getOrDie("The Export to Word plugin requires the exportword_service_url to be configured")
      , Wo = t => E.from(t.options.get("exportword_converter_options")).getOr(Vo)
      , qo = async t => (t => E.from(t.options.get("exportword_token_provider")))(t).fold(( () => Promise.resolve(E.none())), (async t => {
        const e = t();
        if (!(u(r = e) && k(r.then) && k(r.catch)))
            throw new Error("The token provider needs to return a promise");
        var r;
        const n = await e;
        if (!u(n) || !c(n.token))
            throw new Error("Token provider should return a promise with an object that has a token string property");
        return E.some(n.token)
    }
    ))
      , Go = (t, e) => {
        const r = document.createElement("a");
        r.href = window.URL.createObjectURL(t),
        r.download = e,
        r.click(),
        r.remove()
    }
      , Jo = (t, e) => t.execCommand(e);
    tinymce.PluginManager.requireLangPack("exportword", "ar,bg_BG,ca,cs,da,de,el,es,eu,fa,fi,fr_FR,he_IL,hi,hr,hu_HU,id,it,ja,kk,ko_KR,ms,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,vi,zh_CN,zh_TW"),
    tinymce.PluginManager.add("exportword", (t => {
        ( (t, r) => !!t && -1 === ( (t, r) => {
            const n = e(t.major, r.major);
            if (0 !== n)
                return n;
            const o = e(t.minor, r.minor);
            if (0 !== o)
                return o;
            const i = e(t.patch, r.patch);
            return 0 !== i ? i : 0
        }
        )((t => n((t => [t.majorVersion, t.minorVersion].join(".").split(".").slice(0, 3).join("."))(t)))(t), n(r)))(tinymce, "7.0") ? console.error("The exportword plugin requires at least version 7.0 of TinyMCE.") : ((t => {
            t.options.register("exportword_service_url", {
                processor: t => {
                    if (!c(t))
                        return console.error("The Export to Word plugin requires the  exportword_service_url to be configured"),
                        !1;
                    try {
                        return new URL(t),
                        !0
                    } catch (t) {
                        return console.error("The value provided in exportword_service_url is not a valid URL"),
                        !1
                    }
                }
            }),
            t.options.register("exportword_converter_options", {
                processor: t => Po("exportword_converter_options", zo, t).fold((t => {
                    return console.error("Errors: \n" + (t => {
                        const e = t.length > 10 ? t.slice(0, 10).concat([{
                            path: [],
                            getErrorInfo: S("... (only showing first ten failures)")
                        }]) : t;
                        return N(e, (t => "Failed path: (" + t.path.join(" > ") + ")\n" + t.getErrorInfo()))
                    }
                    )((e = t).errors).join("\n") + "\n\nInput object: " + Co(e.input)),
                    !1;
                    var e
                }
                ), (t => !0))
            }),
            t.options.register("exportword_converter_style", {
                processor: "string",
                default: ""
            }),
            t.options.register("exportword_token_provider", {
                processor: "function"
            })
        }
        )(t),
        (t => {
            t.addCommand("ExportWord", ( () => {
                (async (t, e) => {
                    const r = (t => {
                        var e;
                        return null !== (e = t.options.get("directionality")) && void 0 !== e ? e : ""
                    }
                    )(t)
                      , n = (t => t.options.get("exportword_converter_style"))(t)
                      , o = e.converterUrl
                      , {html: i} = await (t => ({
                        getContent: () => ao(t)
                    }))(t).getContent()
                      , s = {
                        html: `<html>\n      <head>\n        <meta charset="utf-8">\n      </head>\n      <body>\n        <div class="tinymce-content" dir="${r}">\n          ${i}\n        </div>\n      <body>\n    </html>`,
                        css: n,
                        config: e.converterOptions
                    }
                      , a = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/docx",
                            ...(await qo(t)).fold(( () => ({})), (t => ({
                                Authorization: t
                            }))),
                            "x-cs-editor": `tinymce${t.editorManager.majorVersion}`
                        },
                        body: JSON.stringify(s)
                    };
                    t.setProgressState(!0),
                    window.fetch(o, a).then((async t => {
                        if (200 !== t.status)
                            throw await t.json();
                        return t.blob()
                    }
                    )).then((r => {
                        const n = "function" == typeof e.fileName ? e.fileName() : e.fileName;
                        Go(r, n),
                        (t => {
                            t.dispatch("ExportToWord")
                        }
                        )(t)
                    }
                    )).finally(( () => t.setProgressState(!1))).catch((e => {
                        t.notificationManager.open({
                            text: "Operation failed",
                            type: "error"
                        }),
                        console.error(e)
                    }
                    ))
                }
                )(t, {
                    fileName: "document.docx",
                    converterUrl: Fo(t),
                    converterOptions: Wo(t)
                })
            }
            ))
        }
        )(t),
        (t => {
            t.ui.registry.addButton("exportword", {
                tooltip: "Export to Word",
                icon: "export-word",
                onAction: () => {
                    Jo(t, "ExportWord")
                }
                ,
                context: "any"
            })
        }
        )(t),
        (t => {
            t.ui.registry.addMenuItem("exportword", {
                text: "Export to Word...",
                icon: "export-word",
                onAction: () => Jo(t, "ExportWord"),
                context: "any"
            })
        }
        )(t))
    }
    ))
}();
