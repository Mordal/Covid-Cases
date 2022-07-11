import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Countries, Country } from '../_models/country';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private endpointCountries = "https://restcountries.com/v2/all?fields=name"
  countriesList!: String;

  constructor(private http: HttpClient) {}

    getCountries(): Observable<Array<JSON>>{
      return this.http.get<any>(`${this.endpointCountries}`);
    }

}

