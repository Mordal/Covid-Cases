import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formCovidCases!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formCovidCases = this.formBuilder.group({
      'country':['',Validators.required],
      'month' : ['',Validators.required]
    })
  }
  onSubmit(){
    if (this.formCovidCases.invalid)
      return;
    
    console.log(this.formCovidCases.value)
  }

}
