import { Response } from "../interfaces/response";
import { SearchResponse } from "../interfaces/search-response";

export const ERROR_RESPONSE: Response = { response: "False", error: 'Could not fetch data from server :(' };
export const EMPTY_RESPONSE: SearchResponse = {response: "False", isEmpty: true};
export const IS_FETCHING_RESPONSE: SearchResponse = {response: "False", isFetching: true};
