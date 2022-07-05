import { Component, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {
  @Output() avatarValue = 1;
  avatarImages = [
    { value: '1', image: '/assets/img/avatar/avatar-1.jpg' },
    { value: '2', image: '/assets/img/avatar/avatar-2.jpg' },
    { value: '3', image: '/assets/img/avatar/avatar-3.jpg' },
  ];

  name: string = '';
  disableSelect = true;
  
  constructor(
    public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  safeValue(value) {
    this.avatarValue = value;
  }
}
