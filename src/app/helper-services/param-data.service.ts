import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  private uploadPost = new BehaviorSubject('share-post');
  postUploadMsg = this.uploadPost.asObservable();

  private notificationChange = new BehaviorSubject('notification-change');
  notificationChangeMsg = this.notificationChange.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeUploadFeedMsg(message: string) {
    this.uploadPost.next(message)
  }

  changeNotificationMsg(message: any) {
    this.notificationChange.next(message)
  }

  getTraitList(){
    let traitList = [
      {Traitid: 301, Score: 0, Image: 'assets/traits-icons/honest.png', ClassName: 'rating-button', TraitMsg:'Generally speaks the truth'},
      {Traitid: 302, Score: 0, Image: 'assets/traits-icons/confident.png', ClassName: 'rating-button', TraitMsg:'Being self assured and certain of one’s own ability'},
      {Traitid: 303, Score: 0, Image: 'assets/traits-icons/respectful.png', ClassName: 'rating-button', TraitMsg:'Civil and courteous towards others'},
      {Traitid: 304, Score: 0, Image: 'assets/traits-icons/fair.png', ClassName: 'rating-button', TraitMsg:'Completely just and appropriate in most situations'},
      {Traitid: 305, Score: 0, Image: 'assets/traits-icons/forgiving.png', ClassName: 'rating-button', TraitMsg:'Ready to excuse an error or offence'},
      {Traitid: 306, Score: 0, Image: 'assets/traits-icons/generous.png', ClassName: 'rating-button', TraitMsg:'Happy to help and give more than generally expected'},
      {Traitid: 307, Score: 0, Image: 'assets/traits-icons/courageous.png', ClassName: 'rating-button', TraitMsg:'Fearless and brave in most situations'},
      {Traitid: 308, Score: 0, Image: 'assets/traits-icons/adaptive.png', ClassName: 'rating-button', TraitMsg:'The ability to adjust to different and at times difficult situations'},
      {Traitid: 309, Score: 0, Image: 'assets/traits-icons/compassionate.png', ClassName: 'rating-button', TraitMsg:'The ability to feel and show concern for others'},
      {Traitid: 310, Score: 0, Image: 'assets/traits-icons/loyal.png', ClassName: 'rating-button', TraitMsg:'Truly faithful to someone or some cause'}
    ]
    return traitList;
  }
  
  getCategoryList(){
    let categoryList:any = [
      {Category: '1',name:'Family'},
      {Category: '2',name:'Friends'},
      {Category: '3',name:'Co-worker'},
      {Category: '4',name:'Acquaintances'}
    ] 
    return categoryList;   
  }

  getAcquaintancesList(){
    let categoryList:any = [
      {Category: '201',name:'Less than 2 years'},
      {Category: '202',name:'2-5 years'},
      {Category: '203',name:'5-10 years'},
      {Category: '204',name:'More than 10 years'}
    ] 
    return categoryList;   
  }

  getFamilyList(){
    let familyList:any = [
      {Category: '101',name: 'Mother'},
      {Category: '102',name: 'Father'},
      {Category: '103',name: 'Daughter'},
      {Category: '104',name: 'Son'},
      {Category: '105',name: 'Sister'},
      {Category: '106',name: 'Brother'},
      {Category: '107',name: 'Aunt'},
      {Category: '108',name: 'Uncle'},
      {Category: '109',name: 'Niece'},
      {Category: '110',name: 'Nephew'},
      {Category: '111',name: 'Cousin (female)'},
      {Category: '112',name: 'Cousin (male)'},
      {Category: '113',name: 'Grandmother'},
      {Category: '114',name: 'Grandfather'},
      {Category: '115',name: 'Granddaughter'},
      {Category: '116',name: 'Grandson'},
      {Category: '117',name: 'Stepsister'},
      {Category: '118',name: 'Stepbrother'},
      {Category: '119',name: 'Stepmother'},
      {Category: '120',name: 'Stepfather'},
      {Category: '121',name: 'Stepdaughter'},
      {Category: '122',name: 'Stepson'},
      {Category: '123',name: 'Sister-in-law'},
      {Category: '124',name: 'Brother-in-law'},
      {Category: '125',name: 'Mother-in-law'},
      {Category: '126',name: 'Father-in-law'},
      {Category: '127',name: 'Daughter-in-law'},
      {Category: '128',name: 'Son-in-law'},
      {Category: '129',name: 'Sibling (gender neutral)'},
      {Category: '130',name: 'Parent (gender neutral)'},
      {Category: '131',name: 'Child (gender neutral)'},
      {Category: '132',name: 'Sibling of Parent (gender neutral)'},
      {Category: '133',name: 'Child of Sibling (gender neutral)'},
      {Category: '134',name: 'Cousin (gender neutral)'},
      {Category: '135',name: 'Grandparent (gender neutral)'},
      {Category: '136',name: 'Grandchild (gender neutral)'},
      {Category: '137',name: 'Step Sibling (gender neutral)'},
      {Category: '138',name: 'Step Parent (gender neutral)'},
      {Category: '139',name: 'Step Child (gender neutral)'},
      {Category: '140',name: 'Sibling-in-law (gender neutral)'},
      {Category: '141',name: 'Parent-in-law (gender neutral)'},
      {Category: '142',name: 'Child-in-law (gender neutral)'},
      {Category: '143',name: 'Pet (gender neutral)'}

    ]
    return familyList;
  }

}