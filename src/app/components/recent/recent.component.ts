import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecentMovie } from 'src/app/interfaces/recent-movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss']
})
export class RecentComponent implements OnInit{

  recent$!: Observable<Array<RecentMovie>>;
  constructor(private _movieService: MovieService) {}

  ngOnInit(): void {
      this.recent$ = this._movieService.recent$;
      //this.recent$.subscribe(v => console.log(JSON.parse(JSON.stringify(v)) ))
  }
}
