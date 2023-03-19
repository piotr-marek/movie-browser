import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { fromRange } from 'src/app/functions/from-range';
import { PaginationInput } from 'src/app/types/pagination-input';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  inputs: ['input$'],
  outputs: ['go'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  input$!: Observable<PaginationInput>;
  go = new EventEmitter<number>();

  getPagesCount(input: PaginationInput): number {
    return Math.ceil(input.total/10);
  }
  getNearbyPages(input: PaginationInput): Array<number>{
    const pagesCount = this.getPagesCount(input);
    if(pagesCount===1) return [];
    if(pagesCount<=5) return fromRange(1,pagesCount);
    if(input.page<=3) return fromRange(1, 5);
    if(input.page>=pagesCount-2) return fromRange(pagesCount-4, pagesCount);
    return fromRange(input.page-2, input.page+2)
  }

  isValidInput(input: PaginationInput): boolean{
    return input && input.total!==0
  }

  goToPage(page: number, input?: PaginationInput){
    if(input && input.page===page) return;
    this.go.emit(page);
  }
}
