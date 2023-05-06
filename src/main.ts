interface StopAble {
  stop: Function;
  since: () => Date;
  now: () => Date;
}

type TimeoutFn = (now: Date) => void;

const __timeout = 0;
const __interval = 1;

type __timeType = typeof __timeout | typeof __interval;

var __timeouts: Map<NodeJS.Timeout, StopAble> = new Map();
var __intervals: Map<NodeJS.Timeout, StopAble> = new Map();

class Time {
  #cb: Function;
  #type: __timeType;
  #timeout: NodeJS.Timeout;
  #scale: number;
  #since: Date;

  #speed: number;
  #times: number;

  constructor(
    cb: Function,
    type: __timeType,
    scale: number,
    since: Date,
    speed: number
  ) {
    this.#cb = cb;
    this.#type = type;
    this.#scale = scale;
    this.#since = since;
    this.#times = 1;
    this.#speed = speed;

    if (this.#type === 0) {
      this.#timeout = setTimeout(this.cbFn.bind(this), speed);
      __timeouts.set(this.#timeout, this);
    }

    if (this.#type === 1) {
      this.#timeout = setInterval(this.cbFn.bind(this), speed);
      __intervals.set(this.#timeout, this);
    }
  }

  cbFn() {
    this.#cb();
    this.#times++;
  }

  now(): Date {
    const diff = this.#times * this.#speed;
    return new Date(this.#since.getTime() + diff * this.#scale);
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

  constructor(scale: number, since?: Date) {
    this.#scale = scale;
    if (since !== undefined) {
      this.#since = since;
    }
  }

  once(when: Date, cb: TimeoutFn): StopAble | null {
    const diff = when.getTime() - this.#since.getTime();
    if (diff < 1) {
      return null;
    }

    return new Time(cb, __timeout, this.#scale, new Date(this.#since), 0);
  }

  every(e: number, d: "s" | "m" | "h", cb: Function): StopAble | null {
    let tm = 1000;
    switch (d) {
      case "s": {
        tm *= e / this.#scale;
        break;
      }
      case "m": {
        tm *= e / (this.#scale * 60);
        break;
      }
      case "h": {
        tm *= e / (this.#scale * 60 * 60);
        break;
      }
      default:
        return null;
    }

    return new Time(cb, __interval, this.#scale, new Date(this.#since), tm);
  }

  destroy() {
    __intervals.forEach((it) => it.stop());
    __timeouts.forEach((it) => it.stop());
  }
}

export default TimeGear;
