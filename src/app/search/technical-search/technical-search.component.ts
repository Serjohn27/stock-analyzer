import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
       criteriaSelect: ['default'],
       expressionSelect: ['default'],
      // datepicker: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  addCriteria(){ 
    if (this.searchForm.get('criteriaSelect') != null && this.searchForm.get('criteriaSelect').value != 'default' && !this.searchForm.contains(this.searchForm.get('criteriaSelect').value)) {
      this.searchForm.addControl(this.searchForm.get('criteriaSelect').value, this.formBuilder.control(['']));
      this.searchForm.get('criteriaSelect').setValue('default');
      this.filterCount++;
      console.log('Current filter count ' + this.filterCount);
      console.log(this.searchForm.value)
    }

  }

  removeCriteria(criteria: string) {
    this.searchForm.removeControl(criteria);
  }

}
