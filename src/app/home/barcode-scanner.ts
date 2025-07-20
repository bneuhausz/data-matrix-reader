import { Injectable } from "@angular/core";
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { DecodeHintType } from "@zxing/library";

@Injectable({ providedIn: 'root' })
export class BarcodeScannerService {
  private readonly reader = new BrowserMultiFormatReader(
    new Map([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX]]]),
    { delayBetweenScanAttempts: 200 }
  );

  async scan(videoElement?: HTMLVideoElement): Promise<string | null> {
    if (Capacitor.getPlatform() !== 'web') {
      const result = await BarcodeScanner.scan();
      return result?.barcodes?.[0]?.rawValue ?? null;
    }

    if (!videoElement) {
      throw new Error('No video element provided for web scanning');
    }

    videoElement.onloadedmetadata = () => {
      console.log('videoWidth', videoElement.videoWidth);
      console.log('videoHeight', videoElement.videoHeight);
    };

    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
    const rearCamera = devices.find(d => /back|rear|environment/i.test(d.label)) || devices[0];

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: rearCamera.deviceId,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    videoElement.srcObject = stream;
    await videoElement.play();

    return new Promise<string | null>((resolve, reject) => {
      this.reader.decodeFromVideoElement(videoElement, (result, error, controls) => {
        if (result) {
          resolve(result.getText());
          controls.stop();
          stream.getTracks().forEach(t => t.stop());
        }
      }).catch(reject);
    });
  }
}