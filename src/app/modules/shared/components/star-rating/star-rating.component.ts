import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnChanges {

  @Input() rating!: number;
  
  stars: number[] = [1, 2, 3, 4, 5];
  halfStarFlag !: boolean;

  ngOnChanges(): void {
    this.halfStarFlag = this.rating % 1 >= 0.3;
  }

}
