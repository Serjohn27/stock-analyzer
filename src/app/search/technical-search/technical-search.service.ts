import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from '../../common/models/page';

@Injectable({
  providedIn: 'root'
})
export class TechnicalSearchService {

  endpoint = 'http://localhost:8888/stocks/search';

  constructor(private httpClient: HttpClient) { }


  search(searchCriteria: any) {

    console.log('technical-search-service- 19 : Search Criterias  ' + JSON.stringify(searchCriteria));

    let params = new HttpParams();
    for (let key in searchCriteria) {
      let value = searchCriteria[key];
      console.log('value ' + value);
      const tokens = value.split(":");
      console.log('tokens ' + tokens);
      if(tokens[0]==null || tokens[0]=='null'){
        const tkValue = tokens[1];
        const tkTokens = tkValue.split('__');
        const expression = tkTokens[0];
        const comparedTo = tkTokens[1];
        if(expression=='above'){
          params = params.append(key, 'gt:'+comparedTo);
        }
      }
      else {
        params = params.append(key,value);   
      }
      
  }
    console.log("Filter used "+params);
    return this.httpClient.get<Page>(this.endpoint,{ params: params }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
