declare module "main" {
    interface StopAble {
        stop: Function;
        now: () => Date;
        since: () => Date;
    }
    class TimeGear {
        #private;
        constructor(scale: number);
        once(when: Date, cb: Function): StopAble | null;
        every(e: number, d: "s" | "m" | "h", cb: Function): StopAble | null;
        destroy(): void;
    }
    export default TimeGear;
}
