import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/_models/country';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formCovidCases!: FormGroup;
  country!: Country;
  
  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService

    ) { }

  ngOnInit(): void {
    this.formCovidCases = this.formBuilder.group({
      'country':['',Validators.required],
      'month' : ['',Validators.required]
    })

    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        console.log(countries[0]);
        console.log(typeof countries[0])
        const test = JSON.stringify(countries[0])
        const test2 = JSON.parse(test).name
        console.log(test2)

        for (let i = 0;i<countries.length; i++){
          console.log(countries[i]);
        }
      }
    })
  }

  onSubmit(){
    if (this.formCovidCases.invalid)
      return;
    
    console.log(this.formCovidCases.value)
  }

}
function pick(arg0: any, arg1: {}): any {
  throw new Error('Function not implemented.');
}

