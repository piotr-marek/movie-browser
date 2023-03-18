import { MovieBasicInfo } from "./movie-basic-info";
import { Response } from "./response";

export interface SearchResponse extends Response {
  search?: Array<MovieBasicInfo>;
  totalResults?: string;
  isEmpty?: boolean;
  isFetching?: boolean;
}
