import { Component } from '@angular/core';

import { RecommendService, Recommend } from '../providers/recommend-service';

@Component({
  selector: 'app-rx',
  templateUrl: 'rx.page.html',
  styleUrls: ['rx.page.scss']
})
export class RxPage {

  qtyItems: number = 0;

  recommends: Recommend[];
  constructor(public recommendService: RecommendService) {

  this
      .recommendService
      .recommendsData
      .subscribe((recommends: Recommend[]) => {
        this.recommends = recommends;
      });

    this.recommendService.getAllRecommends();
    }
}
