import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { range } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { VaccinesService } from 'src/app/services/vaccines.service';
import { Country } from 'src/app/_models/country';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formCovidCases!: FormGroup;
  countryList!: string[]
  months!: string[]
  
  
  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
    private countryCSV: VaccinesService
    ) { }



  ngOnInit(): void {
    this.formCovidCases = this.formBuilder.group({
      'country':['',Validators.required],
      'month' : ['',Validators.required]
    })

    this.countriesService.getCountries().subscribe({
      next: (rawCountries) => {
        let countryList = new Array();
        for (let i = 0; i<rawCountries.length; i++){
          countryList.push(JSON.parse(JSON.stringify(rawCountries[i])).name);
        }
        this.countryList = countryList;
      }
    })
    
    this.months = this.getMonthList();


  }

  onSubmit(){
    if (this.formCovidCases.invalid)
      return;
    
    console.log(this.formCovidCases.value)
    console.log(this.formCovidCases.get(["country"])?.value)
    console.log(this.formCovidCases.get(["month"])?.value)

    this.countryCSV.getVaccines(this.formCovidCases.get(["country"])?.value).subscribe({
      next:(csvFile) => {
        console.log("RESPONSE: ")
        console.log(csvFile)
      },
      error: (err:any) => {
        console.log("ERROR - No vaccination data for this country")
        console.log(err)
      }
    })


  }


  getMonthList():string[]{
    let monthList = new Array();
    for (let i =0; i <12 ; i++){
      monthList.push(new Date(2022, i).toLocaleString('en', { month: 'long' }))
    }
    return monthList;
  }

}



