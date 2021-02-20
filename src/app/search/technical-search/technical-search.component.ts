import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Page } from 'src/app/common/models/page';
import { TechnicalSearchService } from './technical-search.service';

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

  searchResults: Page;

  constructor(private searchService: TechnicalSearchService, private formBuilder: FormBuilder) { }

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

  newCriteria(criteriaSelectDefault: string, expressionSelectDefault: string, criteriaValueDefault: string) {
    return this.formBuilder.group({
      criteriaSelect: [criteriaSelectDefault],
      expressionSelect: [expressionSelectDefault],
      criteriaValue: [criteriaValueDefault],
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
      { id: "gt", name: ">" },
      { id: "lt", name: "<" },
      { id: "eq", name: "=" },
      { id: "lte", name: "<=" },
      { id: "gte", name: ">=" }
    ]
  }

  addCriteria() {
    this.criterias().push(this.newCriteria('default', 'default', 'default'));
    this.templates.push({
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
          { id: "abovesma", name: "Above SMA (200)", default: true },
          { id: "nearsma", name: "Near SMA (200)", default: false },
          { id: "belowsma", name: "Below SMA (200)", default: false },
        ],
        expressionSelect: false
      }
    }
    else if ('price' == selection) {
      return {
        type: 'select',
        options: [
          { id: "abovesma", name: "Price Above SMA (200)", default: true },
          { id: "nearsma", name: "Price Near SMA (200)", default: false },
          { id: "belowsma", name: "Price Below SMA (200)", default: false },
          { id: "aboveema", name: "Price Above EMA (50)", default: true },
          { id: "nearema", name: "Price Near EMA (50)", default: false },
          { id: "belowema", name: "Price Below EMA (50)", default: false },
          { id: "nearmonthlymean", name: "Price Above Monthly Mean", default: true },
          { id: "abovemonthlymean", name: "Price Near Monthly Mean", default: false },
          { id: "belowmonthlymean", name: "Price Below Monthly Mean", default: false },
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

  }

  onOptionSelected(selection: string, index: number) {
    console.log('Option is selected' + selection + " ,current index " + index);
    this.templates[index] = this.getTemplate(selection);
  }

  isNotANumber(value: any) {
    return typeof value !== "string"
 }


  submit() {
    console.log(this.searchForm.value.criterias);
    const criterias = this.searchForm.value.criterias;

    let searchParams: any = {};

    for (let criteria of criterias) {
      console.log('Criteria ' + JSON.stringify(criteria));
      let criteriaSelect = criteria.criteriaSelect;
      let expressionSelect = criteria.expressionSelect;

      if (expressionSelect == 'default') {
        if (criteria.criteriaValue == 'abovesma') {
          searchParams[criteriaSelect] = 'gt:two_hundred_sma';
        }
        else if (criteria.criteriaValue == 'belowsma') {
          searchParams[criteriaSelect] = 'lt:two_hundred_sma';
        }
        else if (criteria.criteriaValue == 'nearsma') {
          searchParams[criteriaSelect] = 'nr:two_hundred_sma';
        }
      }
      else {
        searchParams[criteriaSelect] = criteria.expressionSelect + ':' + criteria.criteriaValue;
      }

    }
    searchParams.date = '2021-02-18'
    console.log('Criterias  ' + JSON.stringify(searchParams));
    this.searchService.search(searchParams).subscribe(data => this.searchResults = data);
  }


getNextBatch(event: any) {
   console.log('scrolled ' + event);
}

  // removeCriteria(criteria: string) {
  //   this.searchForm.removeControl(criteria);
  //   this.searchForm.get('criteriaValue').setValue('Enter a value now');
  // }

}
