var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
define("main", ["require", "exports"], function (require, exports) {
    "use strict";
    var _Time_type, _Time_timeout, _Time_scale, _Time_since, _TimeGear_scale;
    Object.defineProperty(exports, "__esModule", { value: true });
    var __timeouts = new Map();
    var __intervals = new Map();
    class Time {
        constructor(type, timeout, scale, since) {
            _Time_type.set(this, void 0);
            _Time_timeout.set(this, void 0);
            _Time_scale.set(this, void 0);
            _Time_since.set(this, void 0);
            __classPrivateFieldSet(this, _Time_type, type, "f");
            __classPrivateFieldSet(this, _Time_scale, scale, "f");
            __classPrivateFieldSet(this, _Time_since, since, "f");
            __classPrivateFieldSet(this, _Time_timeout, timeout, "f");
            if (__classPrivateFieldGet(this, _Time_type, "f") === 0) {
                __timeouts.set(timeout, this);
            }
            if (__classPrivateFieldGet(this, _Time_type, "f") === 1) {
                __intervals.set(timeout, this);
            }
        }
        now() {
            return new Date(__classPrivateFieldGet(this, _Time_since, "f").getTime() +
                (new Date().getTime() - __classPrivateFieldGet(this, _Time_since, "f").getTime()) * __classPrivateFieldGet(this, _Time_scale, "f"));
        }
        stop() {
            if (__classPrivateFieldGet(this, _Time_type, "f") === 0) {
                clearTimeout(__classPrivateFieldGet(this, _Time_timeout, "f"));
                __timeouts.delete(__classPrivateFieldGet(this, _Time_timeout, "f"));
            }
            if (__classPrivateFieldGet(this, _Time_type, "f") === 1) {
                clearInterval(__classPrivateFieldGet(this, _Time_timeout, "f"));
                __intervals.delete(__classPrivateFieldGet(this, _Time_timeout, "f"));
            }
        }
        since() {
            return __classPrivateFieldGet(this, _Time_since, "f");
        }
    }
    _Time_type = new WeakMap(), _Time_timeout = new WeakMap(), _Time_scale = new WeakMap(), _Time_since = new WeakMap();
    class TimeGear {
        constructor(scale) {
            _TimeGear_scale.set(this, 1);
            __classPrivateFieldSet(this, _TimeGear_scale, scale, "f");
        }
        once(when, cb) {
            const diff = when.getTime() - new Date().getTime();
            if (diff < 1) {
                return null;
            }
            return new Time(0, setTimeout(cb, diff / __classPrivateFieldGet(this, _TimeGear_scale, "f")), __classPrivateFieldGet(this, _TimeGear_scale, "f"), new Date());
        }
        every(e, d, cb) {
            let tm = 1000;
            switch (d) {
                case "s": {
                    tm *= e / __classPrivateFieldGet(this, _TimeGear_scale, "f");
                    break;
                }
                case "m": {
                    tm *= (e / __classPrivateFieldGet(this, _TimeGear_scale, "f")) * 60;
                    break;
                }
                case "h": {
                    tm *= (e / __classPrivateFieldGet(this, _TimeGear_scale, "f")) * 60 * 60;
                    break;
                }
                default:
                    return null;
            }
            return new Time(1, setInterval(cb, tm), __classPrivateFieldGet(this, _TimeGear_scale, "f"), new Date());
        }
        destroy() {
            __intervals.forEach((it) => it.stop());
            __timeouts.forEach((it) => it.stop());
        }
    }
    _TimeGear_scale = new WeakMap();
    exports.default = TimeGear;
});
//# sourceMappingURL=index.js.map