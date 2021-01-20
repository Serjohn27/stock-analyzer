import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-technical-search',
  templateUrl: './technical-search.component.html',
  styleUrls: ['./technical-search.component.css']
})
export class TechnicalSearchComponent implements OnInit {

  searchForm: FormGroup;
  faChevronDown = faChevronDown;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
       criteriaSelect: ['default'],
      // datepicker: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

}
