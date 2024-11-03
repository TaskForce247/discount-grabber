import { Category, Item, Unit, UnitMapping } from "../../common/models";
import { Crawler } from "./crawler";

import get from "axios";
import * as utils from "./utils";
import { stores } from "../../common/stores";
const HITS = Math.floor(30000 + Math.random() * 2000);

const storeUnits: Record<string, UnitMapping> = {
    "": { unit: "stk", factor: 1 },
    bakke: { unit: "stk", factor: 1 },
    ltr: { unit: "ml", factor: 1000 },
    bdt: { unit: "stk", factor: 1 },
    pk: { unit: "stk", factor: 1 },
    rl: { unit: "stk", factor: 1 },
};
const simpleUnitRegex = /^(\d+[.,]?\d*)\s*(\w+)\.?/;

// Pattern remains similar for multiplied and range but includes optional whitespace for flexibility.
const multipliedUnitRegex = /^(\d+[.,]?\d*)\s*x\s*(\d+[.,]?\d*)\s*(\w+)\.?$/;
const rangeUnitRegex = /^(\d+[.,]?\d*)-(\d+[.,]?\d*)\s*(\w+)\.?$/;
export class Rema1000Crawler implements Crawler {
    store = stores.rema1000;

    // async fetchData() {
    //     const LIDL_SEARCH = `https://www.lidl.dk/p/api/gridboxes/DK/da/?max=${HITS}`;
    //     return (await get(LIDL_SEARCH)).data.filter((item: any) => !!item.price.price);
    // }

    async fetchData() {
        const REMA1000_SEARCH = "https://cphapp.rema1000.dk/api/v1/catalog/store/1/withchildren";
        const response = await get(REMA1000_SEARCH);

        if (!response.data) {
            throw new Error("Failed to fetch data from Rema 1000 API");
        }
        let items = [];
        response.data.departments.forEach((department) => {
            department.categories.forEach((category) => {
                category.items.forEach((item) => {
                    items.push(item);
                });
            });
        });
        return items;
    }

    getCanonical(rawItem: any, today: string): Item {
        const price = rawItem.pricing.price; // Adjusted to match the JSON structure
        const description = rawItem.description;
        const underline = rawItem.underline;
        const itemName = rawItem.name;
        const bio =
            rawItem.name.toLowerCase().startsWith("øko.") ||
            rawItem.name.toLowerCase().includes("økologisk") ||
            rawItem.description.toLowerCase().includes("økologisk") ||
            rawItem.declaration.toLowerCase().includes("økologisk");

        const unavailable = false; // Adjusted for availability
        const isWeighted = rawItem.is_self_scale_item;
        const productId = rawItem.id; // Convert to string for consistency
        const defaultUnit: { quantity: number; unit: Unit } = { quantity: 1, unit: "stk" };
        let quantity = 1;
        let unit: Unit = "stk";
        const itemUrl = "/varer/" + productId;

        // Match the description with the regex patterns
        let matches = underline.match(simpleUnitRegex);

        if (matches) {
            quantity = parseFloat(matches[1].replace(",", "."));
            unit = matches[2] as Unit;
        } else {
            matches = underline.match(multipliedUnitRegex);

            if (matches) {
                quantity = parseFloat(matches[1].replace(",", ".")) * parseFloat(matches[2].replace(",", "."));
                unit = matches[3] as Unit;
            } else {
                matches = underline.match(rangeUnitRegex);

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

        // Convert and return the normalized item using utility function
        const unitAndQuantity = utils.normalizeUnitAndQuantity(rawItem.description, unit, quantity, storeUnits, this.store.displayName, defaultUnit);
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
            bio,
            itemUrl
        );
    }

    getCategory(rawItem: any): Category {
        //rawItem.category;
        return "Unknown";
    }
}
