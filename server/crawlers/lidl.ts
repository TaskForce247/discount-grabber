import { Category, Item, Unit, UnitMapping } from "../../common/models";
import { Crawler } from "./crawler";

import get from "axios";
import * as utils from "./utils";
import { stores } from "../../common/stores";
const HITS = Math.floor(30000 + Math.random() * 2000);

const storeUnits: Record<string, UnitMapping> = {
    "": { unit: "stk", factor: 1 },
    dosen: { unit: "stk", factor: 1 },
    flasche: { unit: "stk", factor: 1 },
    flaschen: { unit: "stk", factor: 1 },
    "pkg.": { unit: "stk", factor: 1 },
    l: { unit: "ml", factor: 1000 },
    ml: { unit: "ml", factor: 1 },
    g: { unit: "g", factor: 1 },
    kg: { unit: "g", factor: 1000 },
    "m²": { unit: "qm", factor: 1 },
    m2: { unit: "qm", factor: 1 },
};
const simpleUnitRegex = /^(\d+[.,]?\d*)\s*(\w+)\.?/;

// Pattern remains similar for multiplied and range but includes optional whitespace for flexibility.
const multipliedUnitRegex = /^(\d+[.,]?\d*)\s*x\s*(\d+[.,]?\d*)\s*(\w+)\.?$/;
const rangeUnitRegex = /^(\d+[.,]?\d*)-(\d+[.,]?\d*)\s*(\w+)\.?$/;
export class LidlCrawler implements Crawler {
    store = stores.lidl;

    async fetchData() {
        const LIDL_SEARCH = `https://www.lidl.dk/p/api/gridboxes/DK/da/?max=${HITS}`;
        return (await get(LIDL_SEARCH)).data.filter((item: any) => !!item.price.price);
    }

    getCanonical(rawItem: any, today: string): Item {
        const price = rawItem.price.price;
        const description = `${rawItem.keyfacts?.supplementalDescription?.concat(" ") ?? ""}${rawItem.fullTitle}`;
        const itemName = rawItem.fullTitle;
        const bio = description.toLowerCase().includes("bio");
        const unavailable = rawItem.stockAvailability.availabilityIndicator == 0;
        const productId = rawItem.productId;
        const defaultUnit: { quantity: number; unit: Unit } = { quantity: 1, unit: "stk" };
        let isWeighted = false;
        let quantity = 1;
        let unit: Unit = "stk";

        // Match the description with the regex patterns
        let matches = description.match(simpleUnitRegex);

        if (matches) {
            quantity = parseFloat(matches[1].replace(",", "."));
            unit = matches[2] as Unit;
        } else {
            matches = description.match(multipliedUnitRegex);

            if (matches) {
                quantity = parseFloat(matches[1].replace(",", ".")) * parseFloat(matches[2].replace(",", "."));
                unit = matches[3] as Unit;
            } else {
                matches = description.match(rangeUnitRegex);

                if (matches) {
                    const lower = parseFloat(matches[1].replace(",", "."));
                    const upper = parseFloat(matches[2].replace(",", "."));
                    quantity = (lower + upper) / 2;
                    unit = matches[3] as Unit;
                } else {
                    console.log("No regex match found for description:", description);
                }
            }
        }

        // Normalize the unit and quantity using the utility function
        const unitAndQuantity = utils.normalizeUnitAndQuantity(description, unit, quantity, storeUnits, this.store.displayName, defaultUnit);
        return new Item(
            this.store.id,
            productId,
            itemName,
            this.getCategory(rawItem),
            unavailable,
            price,
            [{ date: today, price: price, unitPrice: 0 }],
            isWeighted,
            unitAndQuantity.unit,
            unitAndQuantity.quantity,
            bio
        );
    }

    getCategory(rawItem: any): Category {
        //rawItem.category;
        return "Unknown";
    }
}
