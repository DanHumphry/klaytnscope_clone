export class Queue {
    private items: any[];

    constructor(params?: any[]) {
        if (params) this.items = [...params];
        else this.items = [];
    }

    public enqueue(item: any): void {
        this.items.push(item);
    }

    public dequeue(): any {
        return this.items.shift();
    }

    public unShift(item: any): void {
        this.items.unshift(item);
    }

    public getItems(): any[] {
        return this.items;
    }

    public getLength(): number {
        return this.items.length;
    }
}

export const setPromiseAll = async (array: any[], callback: (value: any, index: number, array: any[]) => unknown) => {
    const promises = array.map(callback);
    await Promise.all(promises);
};

export const convertToKlayByFixed = (peb: string, fixed: number = 6): string => {
    const int = peb.slice(0, -18);
    const float = peb.slice(int.length, -(18 - fixed));
    return `${int}.${float}`;
};

export const convertToAge = (timeStamp: number): string => {
    const passedTime = Math.floor(Date.now() / 1000 - timeStamp);
    if (passedTime < 60) return `${passedTime} sec ago`;
    else if (passedTime < 60 * 60) return `${Math.floor(passedTime / 60)} min ago`;
    else if (passedTime < 60 * 60 * 24) return `${Math.floor(passedTime / (60 * 60))} hours ago`;
    else return `${Math.floor(passedTime / (60 * 60 * 24))} days ago`;
};

export const numberWithCommas = (number: number) => {
    let _number = String(number);
    if (number === 0) _number = '0.00';

    return _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
