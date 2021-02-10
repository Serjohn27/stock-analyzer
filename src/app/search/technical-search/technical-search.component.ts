import {  Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-technical-search',
  templateUrl: './technical-search.component.html',
  styleUrls: ['./technical-search.component.css']
})
export class TechnicalSearchComponent implements OnInit {

  searchForm: FormGroup;
  faChevronDown = faChevronDown;
  filterCount: number = 0;
  hints: string[] = [];
  templates: any[] = [];



  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      name: '',
      criterias: this.formBuilder.array([])
    });
    this.addCriteria();
    this.templates[0] = {
      type: 'input',
      hint: 'Select a criteria from dropdown on the left'
    };
  }

  newCriteria() {
    return this.formBuilder.group({
      criteriaSelect: ['default'],
      expressionSelect: ['default'],
      criteriaValue: [],
      // datepicker: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  criterias(): FormArray {
    return this.searchForm.get("criterias") as FormArray;
  }

  getCriteriaOptions(): any {
    return [
      { id: 'rsi', name: 'RSI (14)' },
      { id: 'ema', name: 'EMA (50)' },
      { id: 'price', name: 'Price' },
      { id: 'pricerange', name: 'Price Range' },
      { id: 'volume', name: 'Volume' },
      { id: 'volumerange', name: 'Volume Range' },
      { id: 'float', name: 'Float' },
      { id: 'marketcap', name: 'Market Cap' }
    ];
  }

  getExpressionOptions(): any {
    return [
      { id: "lt", name: "<" },
      { id: "eq", name: "=" },
      { id: "lte", name: "<=" },
      { id: "gte", name: ">=" },
      { id: "gt", name: ">" },
    ]
  }

  addCriteria() {
    this.criterias().push(this.newCriteria());
    this.templates.push( {
      type: 'input',
      hint: 'Select a criteria from dropdown on the left'
    });
  }

  removeCriteria(index: number) {
    // Keep the very first form
    if (index != 0) {
      this.criterias().removeAt(index);
    }
  }


  getTemplate(selection: string): any {
    console.log('template passed ' + selection);


    if ('default' == selection) {
      return {
        type: 'input',
        hint: 'Select a criteria from dropdown on the left'
      }
    }
     else if ('rsi' == selection) {
      return {
        type: 'input',
        hint: 'Enter value for rsi eg: 30 (oversold)'
      }
    }
    else if ('ema' == selection) {
      return {
        type: 'select',
        options: [
          { id: "option1", name: "test1" },
          { id: "option2", name: "test2" },
        ],
        default: 'option1'
      }
    }

  }

  onOptionSelected(selection: string, index: number) {
    console.log('Option is selected' + selection + " ,current index " + index);
    this.templates[index] = this.getTemplate(selection);
  }




  // removeCriteria(criteria: string) {
  //   this.searchForm.removeControl(criteria);
  //   this.searchForm.get('criteriaValue').setValue('Enter a value now');
  // }

}
