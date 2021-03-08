import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/common/models/page';

@Injectable({
  providedIn: 'root'
})
export class FundamentalSearchService {

  endpoint = 'http://localhost:8888/stocks/search';

  constructor(private httpClient: HttpClient) { }


  search(searchCriteria: any): Observable<Page> {

    console.log('fundamental-search-service- 18 : Search Criterias  ' + JSON.stringify(searchCriteria));

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
