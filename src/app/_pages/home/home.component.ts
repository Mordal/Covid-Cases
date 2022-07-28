
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedCasesService } from 'src/app/services/confirmedCases.service';
import { CountriesService } from 'src/app/services/countries.service';
import { VaccinesService } from 'src/app/services/vaccines.service';
import { Country } from 'src/app/_models/country';
import { DateModel } from 'src/app/_models/dateModel';
import { Progress } from 'src/app/_models/progress';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formCovidCases!: FormGroup
  countryList!: string[]
  months!: string[]
  country!: Country
  errorMessage!: string
  confirmedCasesInDay !: Map<string, number>
  checkExecutionAllWeeks !: number
  readyForChart !: Boolean
  progress !: Progress
  
  
  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
    private countryCSV: VaccinesService,
    private confirmedCases: ConfirmedCasesService,
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
    this.months = DateModel.getMonthList();

    //initiating this.country as Country
    this.country = {} as Country
  }

  onSubmit(){
    //validating inputfields before all other actions
    if (this.formCovidCases.invalid)
      return;
    
    //reset
    this.readyForChart = false
    this.errorMessage = ""

    //setting given values in this.country
    this.country.name = this.formCovidCases.get(["country"])?.value
    this.country.month = this.formCovidCases.get(["month"])?.value


    //getting last used vaccines from endpoint
    this.countryCSV.getVaccines(this.formCovidCases.get(["country"])?.value).subscribe({
      next:(csvFile) => {
        //response is in csv-string-format
          // all lines in the string are separated in the lines[] array
        let lines = csvFile.split("\n"); 
          // headers are extracted from first line
        let headers = lines[0].split(",")
          // for extensibility reasons, the index number of the column with header 'vaccine' is retrieved
           // rather than hardcoded
        let vaccineIndex = 0
        headers.forEach((header:string, index:number) =>{
          if (header === "vaccine"){
            vaccineIndex = index
          }
        })
        // from the last line and in column 'vaccineIndex' we extract the last used vaccines
        let usedVaccines = this.splitCsvRow(lines[lines.length - 2])
        // vaccines are split to become a list
        this.country.vaccinesUsed = usedVaccines[vaccineIndex].split(",")
      },
      error: (err:any) => {
        //when API call returns an error
        this.country.vaccinesUsed = ["NO DATA"]
      }
    })

    //getting population from endpoint
    this.countriesService.getPopulationByCountry(this.formCovidCases.get(["country"])?.value).subscribe({
      next:(rawPopulation) => {
        this.country.population = JSON.parse(JSON.stringify(rawPopulation[0])).population
      }
    })

    //getting confirmed Covid cases
    this.confirmedCases.getConfirmedCasesByCountryAndMonth(this.country.name,this.country.month).subscribe({
      next:(response) => {
        //initialise new Array to be filled in the forEach loop
        let confirmedCasesInMonth = new Array();
        // parsing to readable JSON object
        let allDays = JSON.parse(JSON.stringify(response))
        allDays.forEach((day: { Cases: number; }) => {
          confirmedCasesInMonth.push(day.Cases)
        });
        this.country.confirmedCases = confirmedCasesInMonth
        //allowing to initiate the chart.html component
        this.readyForChart = true
      },
      // when API call returns an error
      error: (err:any) => {
        let errorMessage = JSON.parse(JSON.stringify(err)).error.message
        //some countries have restrictions on certain months with the folowing error as response
        if (errorMessage == "for performance reasons, please specify a province or a date range up to a week"){
          //this error-cases are is handled in the following function (example: USA november and december)
          this.confirmedCasesByWeek()
        }else{
          this.errorMessage = errorMessage
        }
      }
    }) 
    
  }

// ## FUNCTIONS ## //

//for some countries (USA for example) we need to retrieve the data week by week
confirmedCasesByWeek(){
  this.country.confirmedCases = []
  this.progress = {} as Progress
  // all calls are done at the same time, the responses can be in a wrong order, 
    // I needed to add a key (with date info) to the data
  this.confirmedCasesInDay = new Map<string, number>()
  let lastDayOfMonth = DateModel.lastDayOfMonth(this.country.month)
  this.checkExecutionAllWeeks = 0
  
  // for each week in the month, get the confirmed cases
  for (let i = 0 ; i < lastDayOfMonth; i+=8){
    //first day of first week = 1, first days of other weeks = i+8
    let firstDay = (i < 8) ? (i+1) : i
    //last day of each week = i+7 except for last day of the month
    let lastDay = (i+7 > lastDayOfMonth) ? lastDayOfMonth : (i+7)

    //getting confirmed Covid cases
    this.confirmedCases.getConfirmedCasesByCountryAndDays(this.country.name,DateModel.dayOfMonthISOFormat(this.country.month,firstDay),DateModel.dayOfMonthISOFormat(this.country.month,lastDay))
    .subscribe({
      next:(response) => {
        let confirmedCasesInDay = new Map<string, number>()
        let allDays = JSON.parse(JSON.stringify(response))
        this.progress.total = allDays.length
        //save the cases with the date as key()
        allDays.forEach((day: { Cases: number, Date: string }, index: number) => {
          //if date already exist, new cases are added to this record
          if (confirmedCasesInDay.has(day.Date)){
            this.progress.date = day.Date
            this.progress.currentProccessing = index
            let totalCases = Number(confirmedCasesInDay.get(day.Date)) + day.Cases
            confirmedCasesInDay.delete(day.Date)
            confirmedCasesInDay.set(day.Date, totalCases)
          } else{
            //if date doesn't exist yet, new record is created
            confirmedCasesInDay.set(day.Date, day.Cases)
          }
        });
        //adding all records to confirmedCases
        this.confirmedCasesInDay = new Map<string, number>([...this.confirmedCasesInDay,...confirmedCasesInDay])
        
        //when all requests have returned a response, checkExecutionsAllWeeks is now = 3 (there are always 4 weeks in a month)
        if(this.checkExecutionAllWeeks == 3){
          //sorting all entries before populating the country.confirmedCases
          this.confirmedCasesInDay = new Map([...this.confirmedCasesInDay.entries()].sort())
          this.country.confirmedCases = [...this.confirmedCasesInDay.values()]
          //allowing to initiate the chart.html component
          this.readyForChart = true
        }
        this.checkExecutionAllWeeks +=1
      }
    })
  }
}

  splitCsvRow(row: string):string[]{
    //splitting is done by first replacing the "," characters by "|", but only those 
    // which are not in between quotes; these "," need to stay intact.
    let string = ""
    let quotes= false
    for(let character of row){
      if (character == "," && quotes == false){
        character = "|"
      }
      if (character == '"'){
        character = ""
        if (quotes == false){
          quotes = true
        }else{
          quotes = false
        }
      }
      string += character
    }
  return string.split("|")
  }

}