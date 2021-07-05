import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../_services/api.service';
import { QrcodeReaderService } from '../../../_services/qrcode-reader.service';

@Component({
  selector: 'app-valet-ios',
  templateUrl: './valet-ios.component.html',
  styleUrls: ['./valet-ios.component.css']
})
export class ValetIosComponent {

  resp: string;
  subscription: Subscription;
  constructor(private router: Router, private apiService: ApiService, private qrReader: QrcodeReaderService) { }

  onFileChange(event) {
    this.subscription = this.qrReader.decode(event.target.files[0]).subscribe(decodedString => {
      this.resp = decodedString;
    });
  }

}
