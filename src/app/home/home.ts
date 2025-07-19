import { Component } from "@angular/core";
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Data Matrix Reader</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      
    </ion-content>
  `,
})
export default class HomeComponent {

}