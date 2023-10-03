export interface Store {
    name: string;
    budgetBrands: string[];
    color: string;
    defaultChecked: true;
    getUrl: (item: Item) => string;
}

export interface Price {
    date: string;
    price: number;
    unitPrice: number;
}

export class Item {
    public search: string = "";
    public vector?: Record<string, number>;
    public tokens?: string[];
    public sorted = false;
    public chart = false;

    constructor(
        public store: string,
        public id: string,
        public name: string,
        public category: string,
        public unavailable: boolean,
        public price: number,
        public priceHistory: Price[],
        public isWeighted: boolean,
        public unit: "stk" | "cm" | "g" | "ml" | "wg" | undefined,
        public quantity: number,
        public organic: boolean,
        public url?: string
    ) {}

    get unitPrice() {
        const unitPriceFactor = this.unit == "g" || this.unit == "ml" ? 1000 : 1;
        return (this.price / this.quantity) * unitPriceFactor;
    }

    get numPrices() {
        return this.priceHistory.length;
    }

    get date() {
        return this.priceHistory[0].date;
    }

    get priceOldest() {
        return this.priceHistory[this.priceHistory.length - 1].price;
    }

    get dateOldest() {
        return this.priceHistory[this.priceHistory.length - 1].date;
    }

    get price1() {
        return this.priceHistory[1] ? this.priceHistory[1].price : 0;
    }

    get date1() {
        return this.priceHistory[1] ? this.priceHistory[1].date : null;
    }

    get price2() {
        return this.priceHistory[1] ? this.priceHistory[1].price : 0;
    }

    get date2() {
        return this.priceHistory[1] ? this.priceHistory[1].date : null;
    }

    get price3() {
        return this.priceHistory[1] ? this.priceHistory[1].price : 0;
    }

    get date3() {
        return this.priceHistory[1] ? this.priceHistory[1].date : null;
    }

    get uniqueId() {
        return this.store + this.id;
    }
}

export const UNITS: Record<string, { unit: string; factor: number }> = {
    "stk.": { unit: "stk", factor: 1 },
    stück: { unit: "stk", factor: 1 },
    blatt: { unit: "stk", factor: 1 },
    paar: { unit: "stk", factor: 1 },
    stk: { unit: "stk", factor: 1 },
    st: { unit: "stk", factor: 1 },
    teebeutel: { unit: "stk", factor: 1 },
    tücher: { unit: "stk", factor: 1 },
    rollen: { unit: "stk", factor: 1 },
    tabs: { unit: "stk", factor: 1 },
    mm: { unit: "cm", factor: 0.1 },
    cm: { unit: "cm", factor: 1 },
    zentimeter: { unit: "cm", factor: 1 },
    m: { unit: "cm", factor: 100 },
    meter: { unit: "cm", factor: 100 },
    g: { unit: "g", factor: 1 },
    gramm: { unit: "g", factor: 1 },
    dag: { unit: "g", factor: 10 },
    kg: { unit: "g", factor: 1000 },
    kilogramm: { unit: "g", factor: 1000 },
    ml: { unit: "ml", factor: 1 },
    milliliter: { unit: "ml", factor: 1 },
    dl: { unit: "ml", factor: 10 },
    cl: { unit: "ml", factor: 100 },
    l: { unit: "ml", factor: 1000 },
    liter: { unit: "ml", factor: 1000 },
    wg: { unit: "wg", factor: 1 },
};
