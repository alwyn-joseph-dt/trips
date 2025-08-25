import { Option, OptionLabel } from "./types/DropdownType";

/**
 * Converts an array of objects with description and code properties into an array of objects with label and value properties, which can be used with MUI's Select component.
 * @param {{description: string, code: string}[]} options The array of objects to convert.
 * @returns {{label: string, value: string}[]} The converted array of objects.
 */

export const formatAirportDropdownData = (options: Option[]):OptionLabel[] => {
    return options?.map(({ Name, Code,CityName,CountryName }) => ({
        label: Name + ',' + ' ' + CountryName,
        value: Code,
        cityName:CityName + ',' + ' ' + CountryName,
    }));
};


