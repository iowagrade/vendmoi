import { Component } from '@angular/core';

import { RecommendService, Recommend } from '../providers/recommend-service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

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
