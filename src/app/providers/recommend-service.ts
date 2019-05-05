import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Recommend {
  'id': string;
  'name': string;
  'description': string;
  'summary': string,
  'productId': string;
}

@Injectable()
export class RecommendService {
  public recommends: Recommend[] = [];
  public recommendsData: BehaviorSubject<Recommend[]> = new BehaviorSubject<Recommend[]>([]);

  r: Recommend;

  constructor() {
  }

  getAllRecommends() {
    this.recommends = [
      {
        id: '1000',
        name: 'TomInBurbank',
        description: 'Neck pain from car accident',
        summary: 'I have had neck pain since a car accident 3 years ago.  I am currently using the coconut CBD oil to rub on the sore areas and would recommend it to everyone',
        productId: '1003'
      },
      {
        id: '1001',
        name: 'TennisPlayer',
        description: 'Aching knee and elbow joints',
        summary: 'I have been eating the CBD infused gummy Bears and it is like a miracle came into my life.  I had aching joints from my time on the tennis circuit and the difference is times 10 for the better',
        productId: '1002'
      },
      {
        id: '1002',
        name: 'Joan',
        description: 'Pet poodle in pain',
        summary: 'Our pet poodle started having pain about a year ago.  We recently started administering dog treats that have been soaked in the coconut CBD oil and she appears to be out of a lot of the pain she was experiencing and is able to get back up on the couch',
        productId: '1003'
      },
      {
        id: '1003',
        name: 'Retired Roofer',
        description: 'Knee pain',
        summary: 'I have suffered with knee pain for many years due to my time as a roofer.  I have been rubbing the coconut CBD oil on my knees at nights and I would receommend it to anyone with this tye of pain',
        productId: '1003'
      },
      {
        id: '1004',
        name: 'Steve Grey',
        description: 'PTSD from traumatic car accident',
        summary: 'I have been using the milk chocolate bars to relax.  They are great',
        productId: '1005'
      },
      {
        id: '1005',
        name: 'Happy Camper',
        description: 'Broke my ankle',
        summary: 'I have been taking the medicinal Gummy Bears to help with pain from a broken ankle.  I feel that I was able to get off the perscription pills more quickly',
        productId: '1002'
      },
      {
        id: '1006',
        name: 'Out of Pain',
        description: 'Lower Back Pain',
        summary: 'I have to admit I am a lover of sweets and I originally tried the White Chocolate Bars from Chocolate Infusion just to see what would happen.  I am excited to report that I have felt a noticable difference in the amount of pain that I am feeling in my lower back.  It has bothered me for many years.  Also, the chocolate is so delicious!',
        productId: '1000'
      }
    ];
    this.recommendsData.next(this.recommends);
  }

}
