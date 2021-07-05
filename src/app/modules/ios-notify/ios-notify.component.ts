import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../_services/socket.service';

@Component({
  selector: 'app-ios-notify',
  templateUrl: './ios-notify.component.html',
  styleUrls: ['./ios-notify.component.css']
})
export class IosNotifyComponent implements OnInit {

  iosDevice = localStorage.getItem('ios_device');
  constructor(public socket: SocketService) { }

  ngOnInit() {
  }

}