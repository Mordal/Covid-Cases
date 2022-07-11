import { SubscriptionLoggable } from "rxjs/internal/testing/SubscriptionLoggable";

export interface Country{
    name:string;
    independent: Boolean;
}

export interface Countries{
    countryiesList: Array<Country>
}



