import { trigger } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { Page } from 'src/app/common/models/page';
import { TechnicalSearchService } from './technical-search.service';

@Component({
  animations: [trigger('', [])],  // Without this select option doesnt update on view when browseranimationmodule is used
  selector: 'app-technical-search',
  templateUrl: './technical-search.component.html',
  styleUrls: ['./technical-search.component.css']
})
export class TechnicalSearchComponent implements OnInit, AfterViewInit {

  faSort = faSort;

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

  constructor(private searchService: TechnicalSearchService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.resultsContainerWidth = this.resultsContainer.nativeElement.offsetWidth;
  }

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

  newCriteria(criteriaSelectDefault: string, expressionSelectDefault: string, criteriaValueDefault: string): FormGroup {
    return this.formBuilder.group({
      criteriaSelect: [criteriaSelectDefault, Validators.required],
      expressionSelect: [expressionSelectDefault],
      criteriaValue: [criteriaValueDefault, Validators.required],
      rangeMin: [],
      rangeMax: []
      // datepicker: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  addCriteria(): void {
    this.criteriaAdded = true;

    if (this.searchForm.valid) {
      this.criterias().push(this.newCriteria(null, null, null));
      this.templates.push({
        type: 'input',
        hint: 'Select a criteria from dropdown on the left'
      });
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
    else if ('rsi' === selection) {
      return {
        type: 'input',
        hint: 'Enter value for rsi eg: 30 (oversold)',
        expressionSelect: true
      };
    }
    else if ('ema' === selection) {
      return {
        type: 'select',
        options: [
          { id: 'above__two_hundred_sma', name: 'Above SMA (200)', default: true },
          { id: 'near__two_hundred_sma', name: 'Near SMA (200)', default: false },
          { id: 'below__two_hundred_sma', name: 'Below SMA (200)', default: false },
        ],
        expressionSelect: false
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

    else if ('volume' === selection) {
      return {
        type: 'select',
        options: [
          { id: 'increasing', name: 'Increasing Volume', default: true },
          { id: 'decreasing', name: 'Decreasing Volume', default: false },
          { id: 'unusual', name: 'Unusual Volume', default: false }
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

    else if ('volumerange' === selection) {
      return {
        type: 'range',
        expressionSelect: false
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
      if (criterias[i][`rangeMin`] != null && criterias[i][`rangeMax`] != null && criterias[i][`criteriaValue`] == null) {
        this.criterias().at(i).get('criteriaValue').patchValue('isRange');
      }
    }

    if (this.searchForm.valid) {
      const searchParams = this.buildRequest(criterias);
      searchParams.date = '2021-02-12';
      console.log('Criterias  ' + JSON.stringify(searchParams));
      /** spinner starts on init */
      searchParams.size = '50';
      searchParams.page = pageNumber;
      this.searchService.search(searchParams).subscribe(data => {
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
    const totalPages = this.searchResults.totalNumberOfPages;
    let currentPage = this.searchResults.pageNumber;

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (currentPage < totalPages && end === total) {
      currentPage = currentPage + 1;

      const criterias = this.searchForm.value.criterias;

      const searchParams = this.buildRequest(criterias);
      searchParams.size = '50';
      searchParams.date = '2021-02-12';
      searchParams.page = currentPage;
      this.searchService.search(searchParams).subscribe(data => {
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
