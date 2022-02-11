import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private nzMessageService: NzMessageService) {}
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param info - log info
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(info = 'error', result?: T) {
    return (error: any): Observable<T> => {
      //  send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.nzMessageService.create('error', info, {
        nzDuration: 10000,
      });
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
