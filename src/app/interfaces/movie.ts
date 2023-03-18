import { MovieBasicInfo } from "./movie-basic-info";
import { Response } from "./response";
import { Rating } from "./rating";

export interface Movie extends MovieBasicInfo, Response {
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  ratings: Array<Rating>;
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  dvd: string;
  boxOffice: string;
  production: string;
  website: string;
}
