import { Store } from "./models";
const allSpacesRegex = / /g;
export const stores: Record<string, Store> = {
    lidl: {
        id: "lidl",
        displayName: "Lidl",
        budgetBrands: ["milbona", "alpengut", "cien", "livarno", "wiesentaler"],
        color: "pink",
        defaultChecked: true,
        getUrl: (item) => `https://www.lidl.dk${item.url}`,
        productUrlBase: "https://www.lidl.dk/",
        removeOld: true,
    },
    rema1000: {
        id: "rema1000",
        displayName: "REMA 1000",
        budgetBrands: [],
        color: "blue",
        defaultChecked: true,
        getUrl: (item) => `https://shop.rema1000.dk${item.url}`,
        productUrlBase: "https://shop.rema1000.dk/",
        removeOld: true,
    },
};

export const STORE_KEYS = Object.keys(stores);
export const BUDGET_BRANDS = Object.values(stores)
    .map((store) => store.budgetBrands)
    .flat();
