import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { Country } from 'src/app/_models/country';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})

export class InfoComponent implements OnInit {
  @Input() country!: Country

  chartData: ChartDataset[] = [

  ];
  chartLabels: string[] = []
  chartOptions: ChartOptions = {};

  constructor() { }

  ngOnInit(): void {

    console.log("CHART INITIATED")

    let month = new Date(2022, this.country.month).toLocaleString('en', { month: 'long' })
    this.chartOptions = { 
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
      title: { 
        display : true,
        position: "top",
        text: (month + " 2020") ,
        font: {
          size: 16
        }
      },
      legend: {
        display: true
      }},
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
    }}

    this.chartData = [
      {
        data: this.country.confirmedCases,
        label: 'Confirmed Cases',
        yAxisID: 'y'
      },
      {
        data:  this.getPercentageOfConfirmedCasesForPopulation(this.country),
        label: 'Relative cases',
        yAxisID: 'y1'
      }

    ];

    let percentages = this.getPercentageOfConfirmedCasesForPopulation(this.country)
    console.log(percentages)

    this.chartLabels = this.getLabelsForMonth(this.country.confirmedCases)
  }

  getLabelsForMonth(confirmedCases: Array<any>): Array<string>{
    let indexes = new Array<any>;
    confirmedCases.forEach((_value, index) => {
      indexes.push(Number(index)+1)
    })
    return indexes
  }

  getPercentageOfConfirmedCasesForPopulation(country: Country): Array<number>{
    let percentages = new Array<any>;
    for (var cases of country.confirmedCases){
      percentages.push(cases/Number(country.population)*100)
    }
    return percentages
  }
}

