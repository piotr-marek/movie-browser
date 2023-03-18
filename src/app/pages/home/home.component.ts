import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { catchError, filter, map, merge, Observable, of, Subject, switchMap, takeUntil, tap, zipWith } from 'rxjs'
import { SearchResponse } from 'src/app/interfaces/search-response';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ERROR_RESPONSE } from 'src/app/constants/error-response';
import { PaginationInput } from 'src/app/types/pagination-input';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private readonly _EMPTY_RESPONSE: SearchResponse = {response: "False", isEmpty: true};
  private readonly _IS_FETCHING_RESPONSE: SearchResponse = {response: "False", isFetching: true};
  private _destroy$ = new Subject<void>();

  queryParams$: Observable<Params>;
  searchResponse$: Observable<SearchResponse>;
  outputResponse$: Observable<SearchResponse>;
  private _isFetching$ = new Subject<SearchResponse>();
  paginationInput$!: Observable<PaginationInput>;

  isLoading: boolean = false;
  isPaginationVisible: boolean = true;

  input: FormGroup = new FormGroup({
    s: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    y: new FormControl('', {nonNullable: true, validators: [Validators.pattern(/^[1-9][0-9]{3}$/)]}),
    type: new FormControl('', {nonNullable: true})
  })
  constructor(
    private _movieService: MovieService,
    private _route: ActivatedRoute,
    private _router: Router,
    ) {
      this.queryParams$ = _route.queryParams;
      this.searchResponse$ = this.queryParams$
      .pipe(
        map(queryParams => Object.fromEntries(Object.entries(queryParams).filter(([key, val]) => key==='s' || key==='y' || key==='type' || key==='page'))),
        switchMap(queryParams => queryParams['s'] ? _movieService.search(queryParams) : of(this._EMPTY_RESPONSE)),
        catchError(err => of(ERROR_RESPONSE)),
        tap(() => this.isPaginationVisible = true)
      )

      this.outputResponse$ = merge(this._isFetching$, this.searchResponse$);

      this.queryParams$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(queryParams => {
        this.resetInput();
        for(const [key, val] of Object.entries(queryParams)) {
          this.input.get(key)?.setValue(val);
        }
      });

      this.paginationInput$ = this.queryParams$.pipe(
        zipWith(this.searchResponse$),
        map(([params, searchResponse]) => ({
          page: params['page'] ? parseInt(params['page']) : 1,
          total:searchResponse.totalResults ? parseInt(searchResponse.totalResults) : 0
        })),
        tap(v=> console.log(v))
      )
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    search(){
      this._isFetching$.next(this._IS_FETCHING_RESPONSE);
      this.isPaginationVisible = false;
      this._router.navigate([], {queryParams: {
        s: this.input.value.s,
        y: this.input.value.y || undefined,
        type: this.input.value.type || undefined,
        page: 1
      }})
    }
    resetInput(){
      this.input.reset();
    }
    isClearButtonVisible(): boolean{
      return this.input.get('s')?.value!=='' || this.input.get('y')?.value!=='' || this.input.get('type')?.value!==''
    }
    goToPage(page: number){
      this._isFetching$.next(this._IS_FETCHING_RESPONSE);
      this._router.navigate([], {queryParams: { page }, queryParamsHandling: 'merge'});
    }

}
