import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfirmedCasesService {

  private endpointVaccines = "https://api.covid19api.com/country/belgium/status/confirmed/live?from=2020-03-01T00:00:00Z&to=2020-03-31T00:00:00Z"

  constructor(private http: HttpClient) { }
  
  getConfirmedCasesByCountryAndMonth(country: string, month : number){
    const firstDay1 = "01/01/2020"
    // format must be: 2020-03-01T00:00:00Z
    const lastDay1 = "31/01/2020"

    let firstDay = new Date(2020,month,1)
    console.log(firstDay)

    let lastDay = new Date(2020,Number(month)+1,0)
    console.log(lastDay)

  }

}
