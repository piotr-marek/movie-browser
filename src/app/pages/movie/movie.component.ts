import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, Observable, of, scan, switchMap, take, tap } from 'rxjs';
import { ERROR_RESPONSE } from 'src/app/constants/error-response';
import { Movie } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit{
  movie$!: Observable<Partial<Movie>>;

  constructor(
    private _movieService: MovieService,
    private _route: ActivatedRoute,
    ){}

  ngOnInit(): void {
    // this.movie$ = combineLatest([this._route.params, this._movieService.recent$])
    // .pipe(
    //   switchMap(([params, recent]) => {
    //     const movie = recent.find(movie => movie?.imdbId===params['id']);
    //     return movie ? of(movie) : this._movieService.getMovie(params['id'])
    //   }),
    //   tap(movie => {if(movie.response==='True') this._movieService.addRecent(movie)}),
    //   catchError(err => of(ERROR_RESPONSE))
    // )

    this.movie$ = this._route.params
    .pipe(
      switchMap(params => this._movieService.recent$
        .pipe(
          take(1),
          switchMap(recent => {
            const movie = recent.find(movie => movie?.imdbId===params['id']);
            return movie ? of(movie) : this._movieService.getMovie(params['id'])
          })
        )
      ),
      tap(movie => {if(movie.response==='True') this._movieService.addRecent(movie)}),
      catchError(err => of(ERROR_RESPONSE))
    )
  }
}
