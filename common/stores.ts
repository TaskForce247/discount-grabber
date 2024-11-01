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
};

export const STORE_KEYS = Object.keys(stores);
export const BUDGET_BRANDS = Object.values(stores)
    .map((store) => store.budgetBrands)
    .flat();
