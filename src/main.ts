interface StopAble {
  stop: Function;
  since: () => Date;
  now: () => Date;
}

const __timeout = 0;
const __interval = 1;

type __timeType = typeof __timeout | typeof __interval;

var __timeouts: Map<number, StopAble> = new Map();
var __intervals: Map<number, StopAble> = new Map();

class Time {
  #type: __timeType;
  #timeout: number;
  #scale: number;
  #since: Date;

  constructor(type: __timeType, timeout: number, scale: number, since: Date) {
    this.#type = type;
    this.#scale = scale;
    this.#since = since;
    this.#timeout = timeout;

    if (this.#type === 0) {
      __timeouts.set(timeout, this);
    }

    if (this.#type === 1) {
      __intervals.set(timeout, this);
    }
  }

  now(): Date {
    return new Date(
      this.#since.getTime() +
        (new Date().getTime() - this.#since.getTime()) * this.#scale
    );
  }

  stop() {
    if (this.#type === 0) {
      clearTimeout(this.#timeout);
      __timeouts.delete(this.#timeout);
    }
    if (this.#type === 1) {
      clearInterval(this.#timeout);
      __intervals.delete(this.#timeout);
    }
  }

  since(): Date {
    return this.#since;
  }
}

class TimeGear {
  #scale: number = 1;
  #since: Date = new Date();

  constructor(scale: number, since: Date | undefined) {
    this.#scale = scale;
    if (since !== undefined) {
      this.#since = since;
    }
  }

  once(when: Date, cb: Function): StopAble | null {
    const diff = when.getTime() - this.#since.getTime();
    if (diff < 1) {
      return null;
    }

    return new Time(
      __timeout,
      setTimeout(cb, diff / this.#scale),
      this.#scale,
      new Date(this.#since)
    );
  }

  every(e: number, d: "s" | "m" | "h", cb: Function): StopAble | null {
    let tm = 1000;
    switch (d) {
      case "s": {
        tm *= e / this.#scale;
        break;
      }
      case "m": {
        tm *= (e / this.#scale) * 60;
        break;
      }
      case "h": {
        tm *= (e / this.#scale) * 60 * 60;
        break;
      }
      default:
        return null;
    }

    return new Time(
      __interval,
      setInterval(cb, tm),
      this.#scale,
      new Date(this.#since)
    );
  }

  destroy() {
    __intervals.forEach((it) => it.stop());
    __timeouts.forEach((it) => it.stop());
  }
}

export default TimeGear;
