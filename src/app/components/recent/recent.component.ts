import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieBasicInfo } from 'src/app/interfaces/movie-basic-info';
import { RecentMovie } from 'src/app/interfaces/recent-movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentComponent implements OnInit{

  recent$!: Observable<Array<RecentMovie>>;
  constructor(private _movieService: MovieService) {}

  ngOnInit(): void {
      this.recent$ = this._movieService.recent$;
  }
  isValidRecentList(recent: Array<MovieBasicInfo>): boolean{
    return recent.filter(movie => movie).length>1;
  }
}
