import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController } from '@ionic/angular';
import * as $ from 'jquery';
@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss'],
})
export class ReactionsComponent implements OnInit {


  showEmojis = false;
  emojiList: any[];


  constructor(private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController) {
   

    this.emojiList = [
      { name: 'Like', key: 'LK', id: 61},
      { name: 'love', key: 'LO', id: 60},
      { name: 'shocked', key:'SH', id: 59},
      { name: 'jealous', key:'JE', id: 64},
      { name: 'embarassing', key:'EM', id: 62},
      { name: 'angary', key:'AN', id: 63},
      { name: 'stupid', key:'ST', id: 66}
    ]
  }

  toggleShow() {
    this.showEmojis = !this.showEmojis
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReactionsPage');
  }

  share() {
    alert('reaction selected')    
  }
  react(reaction){
    setTimeout(() => {
      this.popoverCtrl.dismiss(reaction);
    }, 500);
    
  }

  ngOnInit() { }

}
