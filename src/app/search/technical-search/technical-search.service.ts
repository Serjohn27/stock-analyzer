import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Page } from '../../common/models/page';

@Injectable({
  providedIn: 'root'
})
export class TechnicalSearchService {

  endpoint = 'http://localhost:8888/stocks/search';

  constructor(private httpClient: HttpClient) { }


  search(searchCriteria: any): Observable<Page> {

    console.log('technical-search-service- 19 : Search Criterias  ' + JSON.stringify(searchCriteria));

    let params = new HttpParams();
    for (const key in searchCriteria) {
      if (searchCriteria.hasOwnProperty(key)) {
        const value = searchCriteria[key];
        params = params.append(key, value);
      }
    }
    console.log('Filter used ' + params);
    return this.httpClient.get<Page>(this.endpoint, { params });
  }


}
