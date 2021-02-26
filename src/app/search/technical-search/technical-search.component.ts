import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Page } from 'src/app/common/models/page';
import { TechnicalSearchService } from './technical-search.service';

@Component({
  animations: [trigger('', [])],  // Without this select option doesnt update on view when browseranimationmodule is used
  selector: 'app-technical-search',
  templateUrl: './technical-search.component.html',
  styleUrls: ['./technical-search.component.css']
})
export class TechnicalSearchComponent implements OnInit {

  criteriaAdded: boolean = false;

  searchForm: FormGroup;
  faChevronDown = faChevronDown;
  filterCount: number = 0;
  hints: string[] = [];
  templates: any[] = [];

  searchResults: Page;

  constructor(private searchService: TechnicalSearchService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name: '',
      criterias: this.formBuilder.array([]),
    });
    this.criterias().push(this.newCriteria(null, null, null));
    this.templates.push({
      type: 'input',
      hint: 'Select a criteria from dropdown on the left'
    });
    this.templates[0] = {
      type: 'input',
      hint: 'Select a criteria from dropdown on the left'
    };
  }

  newCriteria(criteriaSelectDefault: string, expressionSelectDefault: string, criteriaValueDefault: string) {
    return this.formBuilder.group({
      criteriaSelect: [criteriaSelectDefault, Validators.required],
      expressionSelect: [expressionSelectDefault],
      criteriaValue: [criteriaValueDefault, Validators.required],
      rangeMin: [],
      rangeMax: []
      // datepicker: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  addCriteria() {
    this.criteriaAdded = true;

    //this.searchForm.updateValueAndValidity();

    if (this.searchForm.valid) {
      this.criterias().push(this.newCriteria(null, null, null));
      this.templates.push({
        type: 'input',
        hint: 'Select a criteria from dropdown on the left'
      });
    }
    // this.criteriaAdded = false;
  }

  removeCriteria(index: number) {
    // Keep the very first form
    if (index != 0) {
      this.criterias().removeAt(index);
    }
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
      { id: 'volumerange', name: 'Volume Range' }

      // { id: 'float', name: 'Float' },
      // { id: 'marketcap', name: 'Market Cap' }
    ];
  }

  getExpressionOptions(): any {
    return [
      { id: "gt", name: ">" },
      { id: "lt", name: "<" },
      { id: "eq", name: "=" },
      { id: "lte", name: "<=" },
      { id: "gte", name: ">=" }
    ]
  }

  getTemplate(selection: string): any {
    console.log('template passed ' + selection);

    if (null == selection) {
      return {
        type: 'input',
        hint: 'Select a criteria from dropdown on the left',
        expressionSelect: true
      }
    }
    else if ('rsi' == selection) {
      return {
        type: 'input',
        hint: 'Enter value for rsi eg: 30 (oversold)',
        expressionSelect: true
      }
    }
    else if ('ema' == selection) {
      return {
        type: 'select',
        options: [
          { id: "above__two_hundred_sma", name: "Above SMA (200)", default: true },
          { id: "near__two_hundred_sma", name: "Near SMA (200)", default: false },
          { id: "below__two_hundred_sma", name: "Below SMA (200)", default: false },
        ],
        expressionSelect: false
      }
    }
    else if ('price' == selection) {
      return {
        type: 'select',
        options: [
          { id: "above__two_hundred_sma", name: "Price Above SMA (200)", default: true },
          { id: "near__two_hundred_sma", name: "Price Near SMA (200)", default: false },
          { id: "below__two_hundred_sma", name: "Price Below SMA (200)", default: false },
          { id: "above__fifty_ema", name: "Price Above EMA (50)", default: true },
          { id: "near__fifty_ema", name: "Price Near EMA (50)", default: false },
          { id: "below__fifty_ema", name: "Price Below EMA (50)", default: false },
          { id: "near__monthly_mean", name: "Price Above Monthly Mean", default: true },
          { id: "above__monthly_mean", name: "Price Near Monthly Mean", default: false },
          { id: "below__monthly_mean", name: "Price Below Monthly Mean", default: false },
        ],
        expressionSelect: false
      }
    }

    else if ('volume' == selection) {
      return {
        type: 'select',
        options: [
          { id: "increasing", name: "Increasing Volume", default: true },
          { id: "decreasing", name: "Decreasing Volume", default: false },
          { id: "unusual", name: "Unusual Volume", default: false }
        ],
        expressionSelect: false
      }
    }

    else if ('pricerange' == selection) {
      return {
        type: 'range',
        expressionSelect: false
      }
    }

    else if ('volumerange' == selection) {
      return {
        type: 'range',
        expressionSelect: false
      }
    }

  }

  onOptionSelected(selection: string, index: number) {
    console.log('Option is selected' + selection + " ,current index " + index);
    this.templates[index] = this.getTemplate(selection);
  }

  isNotANumber(value: any) {
    return typeof value !== "string"
  }



  submit() {
    console.log(this.searchForm.value);
    console.log(this.searchForm.value.criterias);
    const criterias = this.searchForm.value.criterias;



    for (let i = 0; i < criterias.length; i++) {
      console.log('Control ' + JSON.stringify(criterias[i]['rangeMin']));
      if (criterias[i]['rangeMin'] != null && criterias[i]['rangeMax'] != null && criterias[i]['criteriaValue'] == null) {
        console.log('range is passed ');
        console.log('value ' + this.criterias().at(i).get('criteriaValue').patchValue('isRange'));
        console.log('updated to  ' + this.criterias().at(i).get('criteriaValue').value);
      }
    }

    let searchParams: any = {};

    if (this.searchForm.valid) {
      for (let i = 0; i < criterias.length; i++) {

        console.log('Criteria ' + JSON.stringify(criterias[i]));
        let criteriaSelect = criterias[i].criteriaSelect;
        let expressionSelect = criterias[i].expressionSelect;
        if (expressionSelect == null) {
          if (this.criterias().at(i).get('criteriaValue').value == 'isRange') {
            let rangeMin = this.criterias().at(i).get('rangeMin').value;
            let rangeMax = this.criterias().at(i).get('rangeMax').value;
            searchParams[criteriaSelect] = 'gt:' + rangeMin + '*lt:' + rangeMax;
          }
          else if (criterias[i].criteriaValue == 'above__two_hundred_sma') {
            searchParams[criteriaSelect] = 'gt:two_hundred_sma';
          }
          else if (criterias[i].criteriaValue == 'below__two_hundred_sma') {
            searchParams[criteriaSelect] = 'lt:two_hundred_sma';
          }
          else if (criterias[i].criteriaValue == 'near__two_hundred_sma') {
            searchParams[criteriaSelect] = 'nr:two_hundred_sma';
          }
          else { searchParams[criteriaSelect] = criterias[i].criteriaValue }
        }
        else {
          searchParams[criteriaSelect] = criterias[i].expressionSelect + ':' + criterias[i].criteriaValue;
        }

      }
      searchParams.date = '2021-02-23'
      console.log('Criterias  ' + JSON.stringify(searchParams));
      /** spinner starts on init */

      this.searchService.search(searchParams).subscribe(data => {
        this.searchResults = data
      });
    }
    else {
      console.log('Form invalid ')
    }
  }


  getNextBatch(event: any) {
    console.log('scrolled ' + event);
  }



  print(obj: any): boolean {
    console.log('Obje' + JSON.stringify(obj.get('criteriaSelect').value));
    return true;
  }


}
