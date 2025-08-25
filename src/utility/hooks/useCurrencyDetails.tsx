import { useEffect, useState } from "react";
import { CurrencyType } from "../types/homepage/homepageType";
/**
 * useCurrencyDetails Hook
 *
 * This custom React hook reads the user's selected currency from localStorage,
 * and keeps it in sync with changes across the app. It provides a reactive
 * `currency` object that updates when:
 * - The localStorage "currency" key is changed (manually or programmatically)
 * - A custom "currency-change" event is dispatched
 */
const parseCurrency = (value: string | null): CurrencyType | undefined => {
    if (!value || value === "undefined" || value === "null") return undefined;
    try {
        return JSON.parse(value) as CurrencyType;
    } catch {
        return undefined;
    }
};

export const useCurrencyDetails = (): CurrencyType | undefined => {
    const [currency, setCurrency] = useState<CurrencyType | undefined>(() => {
        return parseCurrency(localStorage.getItem("currency"));
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const latest = parseCurrency(localStorage.getItem("currency"));
            setCurrency(prev =>
                JSON.stringify(prev) !== JSON.stringify(latest) ? latest : prev
            );
        };

        window.addEventListener("currency-change", handleStorageChange);

        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function (key, value) {
            originalSetItem.apply(this, [key, value]);
            if (key === "currency") {
                handleStorageChange();
            }
        };

        return () => {
            window.removeEventListener("currency-change", handleStorageChange);
            localStorage.setItem = originalSetItem;
        };
    }, []);

    return currency;
};
