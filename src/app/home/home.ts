import { Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { BarcodeScannerService } from "./barcode-scanner";

@Component({
  selector: 'app-home',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Data Matrix Reader</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button (click)="scan()" expand="full" color="primary">Scan</ion-button>

      <video
        #video
        width="100%"
        height="480"
        [hidden]="isNative"
        style="border: 1px solid black; margin-top: 1rem;"
        autoplay
        muted
        playsinline
      ></video>

      @if (result()) {
        <p class="result">✅ Scanned: {{ result() }}</p>
      }
    </ion-content>
  `,
})
export default class HomeComponent {
  videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');
  scanner = inject(BarcodeScannerService);

  result = signal<string | null>(null);
  isNative = Capacitor.getPlatform() !== 'web';

  async scan() {
    this.result.set(null);
    const video = this.videoRef()?.nativeElement;
    const scanned = await this.scanner.scan(video);
    this.result.set(scanned);
  }
}