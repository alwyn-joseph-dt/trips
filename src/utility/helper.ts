import { CustomEnqueueSnackbarProps } from "./types/custom-enqueue-snackbar/CustomEnqueueSnackbar";
import { Option, OptionLabel } from "./types/DropdownType";
import { FormValues } from "./types/flights/flight-search/FlightSearch";
import forge from "node-forge";
import { enqueueSnackbar } from 'notistack';
/**
 * Converts an array of objects with description and code properties into an array of objects with label and value properties, which can be used with MUI's Select component.
 * @param {{description: string, code: string}[]} options The array of objects to convert.
 * @returns {{label: string, value: string}[]} The converted array of objects.
 */

export const formatDropdownData = (options: Option[]): OptionLabel[] => {
    return options?.map(({ Name, Code }) => ({
        label: `${Code.toUpperCase()} - ${Name}`,
        value: Code,
    }));
};
export const formatAirportDropdownData = (options: Option[]): OptionLabel[] => {
    return options?.map(({ Name, Code, CityName }) => ({
        label: `${Code.toUpperCase()} - ${Name}`,
        value: Code.toUpperCase(),
        cityName: CityName + ',' + ' ' + Code.toUpperCase(),
    }));
};


export const priceConversion = (price: number) => {
    return price?.toFixed(2)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const capitalizeFirstLetter = (text: string) => {
    if (text?.length <= 0) return "Invalid Input"
    return text?.charAt(0) + text?.slice(1)?.toLowerCase()
}

export const formatApproverTypes = (types: string[]): string => {
    if (!types || types.length === 0) return "";

    // Optional: format each word to start with uppercase and add spacing
    const formatted = types.map(type =>
        type
            .replace(/([A-Z])/g, " $1") // Add space before capital letters
            .trim()                     // Remove leading/trailing spaces
            .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
    );

    if (formatted.length === 1) return formatted[0];
    if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
    return `${formatted.slice(0, -1).join(", ")} and ${formatted[formatted.length - 1]}`;
};


export const getInitials = (name: string) => {
    if (!name) return '';

    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
};


/**
 * Constructs an ordered query string from a given FormValues payload.
 * 
 * The function encodes multi-city travel information, passenger count, trip type, and cabin class
 * into a single query string format suitable for URL parameters.
 * 
 * Multi-city segments are encoded in the format: 
 * - Origin: o1, o2, ..., on
 * - Destination: d1, d2, ..., dn
 * - Departure Date: sd1, sd2, ..., sdn
 * 
 * Passenger information is encoded as:
 * - Adults: ad
 * - Children: ch
 * - Infants: in
 * 
 * Other optional information includes:
 * - Trip type: ty
 * - Cabin class: cs
 * 
 * @param payload - The payload containing form values for building the query string.
 * @returns A URL query string representing the encoded form values, prefixed with '&'.
 */

export const buildOrderedQueryStringFromPayload = (payload: FormValues) => {
    const parts = [];

    // Multi-city segments: o1, d1, sd1, o2, d2, sd2, ...
    payload?.multiCitySegments?.forEach((segment, i) => {
        const index = i + 1;
        if (segment.from) parts.push(`o${index}=${encodeURIComponent(segment.from)}`);
        if (segment.to) parts.push(`d${index}=${encodeURIComponent(segment.to)}`);
        if (segment.departureDate) parts.push(`sd${index}=${segment.departureDate}`);
    });

    // Return date (if roundtrip)
    if (payload.tripType === 'roundtrip' && payload.returnDate) {
        parts.push(`rd=${payload.returnDate}`);
    }

    // Passenger counts
    if (payload.pax?.adult != null) parts.push(`ad=${payload.pax.adult}`);
    if (payload.pax?.child != null) parts.push(`ch=${payload.pax.child}`);
    if (payload.pax?.infant != null) parts.push(`in=${payload.pax.infant}`);

    // Trip type
    if (payload.tripType) parts.push(`ty=${encodeURIComponent(payload.tripType)}`);

    // Cabin class
    if (payload.cabinClass) parts.push(`cs=${encodeURIComponent(payload.cabinClass)}`);

    return '&' + parts.join('&');
};

export const toggleScroll = (isLocked: boolean) => {
    document.body.style.overflow = isLocked ? "hidden" : "auto";
}

export const removeBracketedText = (input: string) => {
    return input.replace(/\s*\(.*?\)\s*/g, '').trim();
}

export const handleEncrypt = (text: any) => {
    const encryptedCombined = forge.util.encode64(text);
    return encryptedCombined;
};


export const customEnqueueSnackbar: CustomEnqueueSnackbarProps = (
    message,
    variant = 'success',
    horizontal = 'right',
    duration = 3000
) => {
    enqueueSnackbar(message, {
        variant,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal,
        },
        autoHideDuration: duration
    });
};


export interface Setting {
    label: string;
    value: string;
}
export interface User {
    name: string;
    email: string;

}
export interface Company {
    Name: string;
}
export interface TripSearch {
    AutoCompleteTripSearch: {}
}
