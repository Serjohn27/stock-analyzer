import { FundamentalSearchService } from './fundamental-search.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { throttleTime } from 'rxjs/operators';
import { Page } from 'src/app/common/models/page';
import { trigger } from '@angular/animations';

@Component({
  animations: [trigger('', [])],  // Without this select option doesnt update on view when browseranimationmodule is used
  selector: 'app-fundamental-search',
  templateUrl: './fundamental-search.component.html',
  styleUrls: ['./fundamental-search.component.css']
})
export class FundamentalSearchComponent implements OnInit, AfterViewInit {

  faSort = faSort;
  busyGettingData = false;

  criteriaAdded = false;
  searchForm: FormGroup;
  faChevronDown = faChevronDown;
  filterCount = 0;
  templates: any[] = [];
  searchResults: Page;

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  @ViewChild('resultsContainer')
  resultsContainer: ElementRef;

  resultsContainerWidth = 0;

  lastRequest: any;

  constructor(private searchService: FundamentalSearchService,private formBuilder: FormBuilder, private cd: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.resultsContainerWidth = this.resultsContainer.nativeElement.offsetWidth;
  }

  ngOnInit(): void {
    console.log(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
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

  newCriteria(criteriaSelectDefault: string, expressionSelectDefault: string, criteriaValueDefault: string): FormGroup {
    return this.formBuilder.group({
      criteriaSelect: [criteriaSelectDefault, Validators.required],
      expressionSelect: [expressionSelectDefault],
      criteriaValue: [criteriaValueDefault, Validators.required],
      rangeMin: [],
      rangeMax: [],
      datepicker: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  addCriteria(): void {
    this.criteriaAdded = true;

    if (this.searchForm.valid || this.criterias().at(this.criterias().length - 1).get('datepicker') != null) {
      this.criterias().push(this.newCriteria(null, null, null));
      this.templates.push({
        type: 'input',
        hint: 'Select a criteria from dropdown on the left'
      });
    }
    else {
      console.log('Form is invalid while adding ' + JSON.stringify(this.searchForm.value))
    }
    // this.criteriaAdded = false;
  }

  removeCriteria(index: number): void {
    // Keep the very first form
    if (index !== 0) {
      this.criterias().removeAt(index);
    }
  }

  criterias(): FormArray {
    return this.searchForm.get('criterias') as FormArray;
  }

  getCriteriaOptions(): any {
    return [
      { id: 'peratio', name: 'Price/Earnings Ratio' },
      { id: 'pbratio', name: 'Price/Book Ratio' },
      { id: 'price', name: 'Price' },
      { id: 'pricerange', name: 'Price Range' },
      { id: 'pegratio', name: 'Price/Earnings Growth Ratio' },
      { id: 'revenue', name: 'Revenue Growth %' },
      { id: 'eps', name: 'Earnings Per Share' },
      { id: 'epspercent', name: 'Earnings Per Share Growth %' },
      { id: 'date', name: 'Date' }

    ];
  }

  getExpressionOptions(): any {
    return [
      { id: 'gt', name: '>' },
      { id: 'lt', name: '<' },
      { id: 'eq', name: '=' },
      { id: 'lte', name: '<=' },
      { id: 'gte', name: '>=' }
    ];
  }

  getTemplate(selection: string): any {
    console.log('template passed ' + selection);

    if (null == selection) {
      return {
        type: 'input',
        hint: 'Select a criteria from dropdown on the left',
        expressionSelect: true
      };
    }
    else if ('revenue' === selection) {
      return {
        type: 'input',
        hint: 'Enter annual revenue growth %',
        expressionSelect: true
      };
    }
    else if ('peratio' === selection) {
      return {
        type: 'input',
        hint: 'Enter price to earnings ratio',
        expressionSelect: true
      };
    }
    else if ('pbratio' === selection) {
      return {
        type: 'input',
        hint: 'Enter price to book ratio',
        expressionSelect: true
      };
    }
    else if ('pegratio' === selection) {
      return {
        type: 'input',
        hint: 'Enter price to earnings growth ratio',
        expressionSelect: true
      };
    }
    else if ('eps' === selection) {
      return {
        type: 'input',
        hint: 'Enter earnings per share',
        expressionSelect: true
      };
    }
    else if ('epspercent' === selection) {
      return {
        type: 'input',
        hint: 'Enter earnings per share growth %',
        expressionSelect: true
      };
    }
    else if ('price' === selection) {
      return {
        type: 'select',
        options: [
          { id: 'above__two_hundred_sma', name: 'Price Above SMA (200)', default: true },
          { id: 'near__two_hundred_sma', name: 'Price Near SMA (200)', default: false },
          { id: 'below__two_hundred_sma', name: 'Price Below SMA (200)', default: false },
          { id: 'above__fifty_ema', name: 'Price Above EMA (50)', default: true },
          { id: 'near__fifty_ema', name: 'Price Near EMA (50)', default: false },
          { id: 'below__fifty_ema', name: 'Price Below EMA (50)', default: false },
          { id: 'near__monthly_mean', name: 'Price Above Monthly Mean', default: true },
          { id: 'above__monthly_mean', name: 'Price Near Monthly Mean', default: false },
          { id: 'below__monthly_mean', name: 'Price Below Monthly Mean', default: false },
        ],
        expressionSelect: false
      };
    }

    else if ('pricerange' === selection) {
      return {
        type: 'range',
        expressionSelect: false
      };
    }

    else if ('date' === selection) {
      return {
        type: 'datepicker',
        expressionSelect: false,
        defaultValue: `${formatDate(new Date(), 'yyyy-MM-dd', 'en')}`
      };
    }

  }

  onOptionSelected(eventTarget: any, index: number): void {
    console.log('Option is selected' + eventTarget.value + ' ,current index ' + index);
    this.templates[index] = this.getTemplate(eventTarget.value);
  }

  isNotANumber(value: any): boolean {
    return typeof value !== 'string';
  }


  submit(pageNumber: number): void {
    console.log(this.searchForm.value);
    console.log(this.searchForm.value.criterias);
    const criterias = this.searchForm.value.criterias;
    for (let i = 0; i < criterias.length; i++) {
      if (criterias[i].rangeMin != null && criterias[i].rangeMax != null && criterias[i].criteriaValue == null) {
        this.criterias().at(i).get('criteriaValue').patchValue('isRange');
      }

      if (criterias[i].datepicker != null && criterias[i].criteriaValue == null && criterias[i].criteriaSelect === 'date'){
        this.criterias().at(i).get('criteriaValue').patchValue('isDate');
      }
    }

    if (this.searchForm.valid) {
      const searchParams = this.buildRequest(criterias);
     // searchParams.date = '2021-02-12';
      console.log('Criterias  ' + JSON.stringify(searchParams));
      /** spinner starts on init */
      searchParams.size = '50';
      searchParams.page = pageNumber;
      this.lastRequest = searchParams;
      this.searchService.search(searchParams).pipe(throttleTime(2000)).subscribe(data => {
        this.searchResults = data;
        console.log('results widht ' + this.resultsContainerWidth);
      });
    }
    else {
      console.log('Form invalid ');
    }
  }


  buildRequest(criterias: FormArray): any {
    const searchParams: any = {};
    for (let i = 0; i < criterias.length; i++) {

      console.log('Criteria ' + JSON.stringify(criterias[i]));
      const criteriaSelect = criterias[i].criteriaSelect;
      const expressionSelect = criterias[i].expressionSelect;
      if (expressionSelect == null) {
        if (this.criterias().at(i).get('criteriaValue').value === 'isRange') {
          const rangeMin = this.criterias().at(i).get('rangeMin').value;
          const rangeMax = this.criterias().at(i).get('rangeMax').value;
          searchParams[criteriaSelect] = 'gt:' + rangeMin + '*lt:' + rangeMax;
        }
        else if (criteriaSelect === 'date' && criterias[i].datepicker != null && this.criterias().at(i).get('criteriaValue').value === 'isDate') {
          searchParams[criteriaSelect] = this.criterias().at(i).get('datepicker').value;
        }

        else if (criterias[i].criteriaValue === 'above__two_hundred_sma') {
          searchParams[criteriaSelect] = 'gt:two_hundred_sma';
        }
        else if (criterias[i].criteriaValue === 'below__two_hundred_sma') {
          searchParams[criteriaSelect] = 'lt:two_hundred_sma';
        }
        else if (criterias[i].criteriaValue === 'near__two_hundred_sma') {
          searchParams[criteriaSelect] = 'nr:two_hundred_sma';
        }
        else { searchParams[criteriaSelect] = criterias[i].criteriaValue; }
      }
      else {
        searchParams[criteriaSelect] = criterias[i].expressionSelect + ':' + criterias[i].criteriaValue;
      }

    }
    return searchParams;
  }

  getNextBatch(event: any): void {

    if(this.busyGettingData) {
      return;
    }
    const totalPages = this.searchResults.totalNumberOfPages;
    let currentPage = this.searchResults.pageNumber;

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    currentPage = currentPage + 1;
    if (currentPage < totalPages && end === total) {


      const searchParams =  this.lastRequest;
      searchParams.page = currentPage;
      this.busyGettingData = true;
      this.lastRequest = searchParams;
      this.searchService.search(searchParams).pipe(throttleTime(2000)).subscribe(data => {
        const stockData = data.content;
        for (const sd of stockData) {
         // console.log('pushing ' + JSON.stringify(sd));
          this.searchResults.content.push(sd);
        }
        // This is the notation for adding into immutable construct, also filtered duplicate values
        this.searchResults.content = [...this.searchResults.content.filter(
          (thing, i, arr) => arr.findIndex(t => t.symbol === thing.symbol) === i)];

        this.searchResults.pageNumber = currentPage;
        this.cd.detectChanges();

        console.log('Total length of content  ' + this.searchResults.content.length);
        // This prevents data from loading multiple times when scroll event is triggered
        this.busyGettingData = false;
      });

      // this.submit(currentPage);
    }

    console.log('There are total ' + totalPages + ' pages. Current page is ' + this.searchResults.pageNumber);

  }



  print(obj: any): boolean {
    console.log('Obje' + JSON.stringify(obj.get('criteriaSelect').value));
    return true;
  }

  sortBy(field: string): void {
    console.log('Sorting by ' + field);
  }
}
