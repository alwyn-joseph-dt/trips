//FlightSelect.d.ts
export interface Pax {
    adult: number;
    child: number;
    infant: number;
}

export interface Flights {
    flightRefKey:string;
}

export interface AddRequest{
    searchKey:string;
    pax:Pax;
    flights:Flights[];
}

export interface GetRequest {
    bookFlightRefKey: string;
}

export interface Context {
    userAgent:string;
    trackingId:string;
    transactionId:string;
    ipAddress:number;
    countryCode:string;
}

export interface FlightSelectAddPayload {
    context: Context;
    request: AddRequest;
}

export interface FlightSelectGetPayload {
    context: Context;
    request: GetRequest;
}