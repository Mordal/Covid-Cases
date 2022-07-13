import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedCasesService } from 'src/app/services/confirmedCases.service';
import { CountriesService } from 'src/app/services/countries.service';
import { VaccinesService } from 'src/app/services/vaccines.service';
import { Country } from 'src/app/_models/country';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formCovidCases!: FormGroup
  countryList!: string[]
  months!: string[]
  country!:Country
  
  
  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
    private countryCSV: VaccinesService,
    private confirmedCases: ConfirmedCasesService
    ) { }



  ngOnInit(): void {
    //validators for the inputfields
    this.formCovidCases = this.formBuilder.group({
      'country':['',Validators.required],
      'month' : ['',Validators.required]
    })

    //getting all countries from endpoint
    this.countriesService.getCountries().subscribe({
      next: (rawCountries) => {
        let countryList = new Array();
        for (let i = 0; i<rawCountries.length; i++){
          countryList.push(JSON.parse(JSON.stringify(rawCountries[i])).name);
        }
        this.countryList = countryList;
      }
    })
    
    //getting all months in a year
    this.months = this.getMonthList();

    //initiating this.country as Country
    this.country = {} as Country
  }

  onSubmit(){
    //validating inputfields before all other actions
    if (this.formCovidCases.invalid)
      return;
    
    console.log(this.formCovidCases.value)

    //setting given values in this.country
    this.country.name = this.formCovidCases.get(["country"])?.value
    this.country.month = this.formCovidCases.get(["month"])?.value

    console.log(this.country.name)
    console.log(this.country.month)


    //getting used vaccines from endpoint
    this.countryCSV.getVaccines(this.formCovidCases.get(["country"])?.value).subscribe({
      next:(csvFile) => {
        console.log("RESPONSE: ")
        //console.log(csvFile)
      },
      error: (err:any) => {
        console.log("ERROR - No vaccination data for this country")
        console.log(err)
      }
    })

    //getting population from endpoint
    this.countriesService.getPopulationByCountry(this.formCovidCases.get(["country"])?.value).subscribe({
      next:(rawPopulation) => {
        this.country.population = JSON.parse(JSON.stringify(rawPopulation[0])).population
        console.log( this.country.population)
      }
    })

    //getting confirmed Covid cases
    this.confirmedCases.getConfirmedCasesByCountryAndMonth(this.country.name,this.country.month)
    

  }


  //function
  getMonthList():string[]{
    let monthList = new Array();
    for (let i =0; i <12 ; i++){
      monthList.push(new Date(2022, i).toLocaleString('en', { month: 'long' }))
    }
    return monthList;
  }


}



