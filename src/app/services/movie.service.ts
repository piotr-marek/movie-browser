import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, iif, map, Observable, ReplaySubject, tap } from 'rxjs';
import { API_KEY } from '../constants/api-key';
import { API_URL } from '../constants/api-url';
import { SearchResponse } from '../interfaces/search-response';
import { toCamelCase } from '../functions/to-camel-case';
import { Movie } from '../interfaces/movie';
import { RecentMovie } from '../interfaces/recent-movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly _RECENT_LENGTH: number = 3;
  private _recent: Array<RecentMovie>;
  private _recent$: BehaviorSubject<Array<RecentMovie>>;
  recent$: Observable<Array<RecentMovie>>;

  constructor(
    private _http: HttpClient,
    ) {
      this._recent = this._getRecentLocalStorage() || new Array(/*this._RECENT_LENGTH + 1*/);
      this._recent.length = this._RECENT_LENGTH + 1;
      console.log(this._recent)
      this._recent$ = new BehaviorSubject<Array<RecentMovie>>(this._recent);
      this.recent$ = this._recent$.asObservable();
     }

  search(queryParams: Params): Observable<SearchResponse>{
    const params = new HttpParams()
    .append('apikey', API_KEY)
    .appendAll(queryParams);
    return this._http.get<SearchResponse>(API_URL, { params })
    .pipe(map(toCamelCase))
  }

  getMovie(id: string): Observable<Movie>{
    const params = new HttpParams()
    .append('apikey', API_KEY)
    .append('i', id)
    .append('plot', 'full');
    return this._http.get<Movie>(API_URL, { params })
    .pipe(map(toCamelCase))
  }

  addRecent(movieToAdd: Movie){
    //console.log(JSON.parse(JSON.stringify(this._recent)) );
    const index: number = this._recent.findIndex(movie => movie?.imdbId===movieToAdd.imdbId)
    if(index!==-1) {
      const movie = this._recent.splice(index, 1);
      this._recent.unshift(...movie)
    }
    else {
      this._recent.unshift(movieToAdd as RecentMovie);
      this._recent.pop();
    }
    //console.log(this._recent);
    this._setRecentLocalStorage();
    this._recent$.next(this._recent);
  }
  private _getRecentLocalStorage(): Array<RecentMovie> | null{
    return localStorage.getItem('recent') ? JSON.parse(localStorage.getItem('recent') as string) : null;
  }
  private _setRecentLocalStorage(){
    localStorage.setItem('recent', JSON.stringify(this._recent));
  }
}
