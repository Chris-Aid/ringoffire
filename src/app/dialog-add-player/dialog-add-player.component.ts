import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  avatarImages = [
    { value: '1', image: '/assets/img/avatar/avatar-1.png' },
    { value: '2', image: '/assets/img/avatar/avatar-2.png' },
    { value: '3', image: '/assets/img/avatar/avatar-3.png' },
    { value: '4', image: '/assets/img/avatar/avatar-4.png' },
    { value: '5', image: '/assets/img/avatar/avatar-5.png' },
  ];

  name: string = '';
  avatarValue = 1;
  disableSelect = true;

  constructor(
    public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }

  ngOnInit(): void {
  }

  safeValue(value) {
    this.avatarValue = value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
