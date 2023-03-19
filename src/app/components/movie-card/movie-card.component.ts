import { Component } from '@angular/core';
import { getImageSrc } from 'src/app/functions/get-image-src';
import { MovieBasicInfo } from 'src/app/interfaces/movie-basic-info';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  inputs: ['movie']
})
export class MovieCardComponent {
  movie!: MovieBasicInfo;
  getImageSrc = getImageSrc
}
