import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private endpointCountries = "https://restcountries.com/v2/all?fields=name"

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Array<string>>{
    return this.http.get<Array<string>>(`${this.endpointCountries}`)
  }

}

