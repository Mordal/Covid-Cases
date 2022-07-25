import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfirmedCasesService {

    //"https://api.covid19api.com/country/belgium/status/confirmed/live?from=2020-03-01T00:00:00Z&to=2020-03-31T00:00:00Z"
  private endpointConfirmedCasses = "https://api.covid19api.com/country"

  constructor(private http: HttpClient) { }
  
  getConfirmedCasesByCountryAndMonth(country: string, month : number){
    const firstDay = this.firstDayOfMonthISOFormat(month)
    const lastDay = this.lastDayOfMonthISOFormat(month)

    console.log(firstDay)
    console.log(lastDay)

    return this.http.get(`${this.endpointConfirmedCasses}/${country}/status/confirmed/live?from=${firstDay}&to=${lastDay}`, {responseType: 'json'})


  }

  //It whould be hard to transform the local-time-zoned Date() to an ISO format
    //using the .toISOdate() methode. because of the timezone offset.
    //I opted to construct the ISO format myself
  firstDayOfMonthISOFormat(month : number) : string {
    let monthNumb = (month < 10 ) ? "0"+(Number(month)+1) : (Number(month)+1)
    return "2020-"+monthNumb+"-01T00:00:00Z"
  }
  
  lastDayOfMonthISOFormat(month : number) : string {
    let lastDay = new Date(2020,Number(month)+1,0).getDate()
    let monthNumb = (month < 10 ) ? "0"+(Number(month)+1) : (Number(month)+1)
    return "2020-"+monthNumb+"-"+lastDay+"T00:00:00Z"
  }

}
