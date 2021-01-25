import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  hint: string = 'Select a criteria from dropdown on the left';






  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      name: '',
      criterias: this.formBuilder.array([])
    });
    this.addCriteria();
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
  }

  removeCriteria(index: number) {
    // Keep the very first form
    if (index != 0) {
      this.criterias().removeAt(index);
    }
  }

  onOptionSelected(selection: string) {
    console.log('Option is selected' + selection);
    if (selection == 'rsi') {
      this.hint = 'Enter value for rsi eg: 30 (oversold)';
    }
  }

  getPlaceHolder() {
    return this.hint;
  }

  // removeCriteria(criteria: string) {
  //   this.searchForm.removeControl(criteria);
  //   this.searchForm.get('criteriaValue').setValue('Enter a value now');
  // }

}
