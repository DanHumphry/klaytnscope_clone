export class Queue {
    items: any[];

    constructor(params?: any[]) {
        if (params) this.items = [...params];
        else this.items = [];
    }

    public enqueue(item: any) {
        this.items.push(item);
    }

    public dequeue() {
        return this.items.shift();
    }

    public getItems() {
        return this.items;
    }
}

export const setPromiseAll = async (array: any[], callback: (value: any, index: number, array: any[]) => unknown) => {
    const promises = array.map(callback);
    await Promise.all(promises);
};
