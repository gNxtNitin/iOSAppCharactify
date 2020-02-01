import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

import { HelperProvider } from './helper.services';
import { PostProvider } from './../api-provider/api.services';
import { ServicesConstant } from './../api-provider/end-points';

@Injectable()
export class ContactDataService {

  private contactSource = new BehaviorSubject('default message');
  currentMessage = this.contactSource.asObservable();
  totalContactList: any = [];
  emailList: any = [];
  phoneList: any = [];
  userData: any = {};
  constructor(private contacts: Contacts, private helperService: HelperProvider, private service: PostProvider) { 
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  ionViewDidEnter(){
    this.userData = JSON.parse(localStorage.getItem('signUp'));
  }

  getContacts(message: string) {
    this.contacts.find(['displayName', 'photos', 'emails'], { filter: "", multiple: true, hasPhoneNumber: false }).then((list) => {
      this.totalContactList = list;
      //this.helperService.dismissLoader();
      this.filterEmailList();
    },
      (error: any) => {
        this.helperService.dismissLoader();
        console.error('Error saving contact.', error)
      });
  }

  filterEmailList() {
    this.totalContactList.forEach(element => {
      if (element.emails) {
        this.emailList.push(
          {
            email: element.emails[0].value,
            name: element.name.formatted,
            sentStatus: false
          });
      } else {
        if (element.phoneNumbers) {
          this.phoneList.push(
            {
              phone: element.phoneNumbers[0].value,
              name: element.name.formatted,
              sentStatus: false
            });
        }
      }
    });
    this.filterEmailData();
  }

  filterEmailData() {   
    let tempList: any = [];
    this.emailList.forEach(element => {
      tempList.push(element.email);
    });
    let data = {
      UserID: this.userData.UserID,
      EmailID: tempList
    }
    this.userData.UserID;
    this.service.callServiceFunction(ServicesConstant.USER_MGMT.USER_FILTER_EMAIL, data).subscribe((res: any) => {      
      if (res.code == 1001) {
        let codeList: any = [];
        let item: any = JSON.parse(res.data);
        item.forEach(server => {
          this.emailList.forEach(client => {
            if (server.EmailID == client.email) {
              codeList.push({
                name: client.name,
                email: client.email,
                Status: server.Status,
                sentStatus: false
              })
            }
          });
        });        
        this.emailList = codeList;   
        let Data:any = {
          emailList: this.emailList,
          phoneList: this.phoneList
        };
        this.contactSource.next(Data);     
      } 
    }, error => {      
      this.helperService.dismissLoader();
    });
  }

  
}