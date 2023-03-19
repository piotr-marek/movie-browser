import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { catchError, filter, map, merge, Observable, of, share, shareReplay, Subject, switchMap, takeUntil, tap, zipWith } from 'rxjs'
import { SearchResponse } from 'src/app/interfaces/search-response';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY_RESPONSE, ERROR_RESPONSE, IS_FETCHING_RESPONSE } from 'src/app/constants/responses';
import { PaginationInput } from 'src/app/types/pagination-input';
import { getImageSrc } from 'src/app/functions/get-image-src';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  queryParams$!: Observable<Params>;
  searchResponse$!: Observable<SearchResponse>;
  outputResponse$!: Observable<SearchResponse>;
  paginationInput$!: Observable<PaginationInput>;

  input: FormGroup = new FormGroup({
    s: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    y: new FormControl('', {nonNullable: true, validators: [Validators.pattern(/^[1-9][0-9]{3}$/)]}),
    type: new FormControl('', {nonNullable: true})
  })

  private _isFetching$ = new Subject<SearchResponse>();
  private _destroy$ = new Subject<void>();

  constructor(
    private _movieService: MovieService,
    private _route: ActivatedRoute,
    private _router: Router,
    ) {

    }

    ngOnInit(): void {
      this.queryParams$ = this._route.queryParams;

      this.searchResponse$ = this.queryParams$
      .pipe(
        map(queryParams => Object.fromEntries(Object.entries(queryParams).filter(([key, val]) => key==='s' || key==='y' || key==='type' || key==='page'))),
        switchMap(queryParams => queryParams['s'] ? this._movieService.search(queryParams) : of(EMPTY_RESPONSE)),
        catchError(err => of(ERROR_RESPONSE)),
        shareReplay(1)
      );

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
        }))
      )
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    search(){
      this._isFetching$.next(IS_FETCHING_RESPONSE);
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
      this._isFetching$.next(IS_FETCHING_RESPONSE);
      this._router.navigate([], {queryParams: { page }, queryParamsHandling: 'merge'});
    }

    getImageSrc = getImageSrc;

}
