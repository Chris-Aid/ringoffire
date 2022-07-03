import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ringoffire';


  ngOnInit(): void {
    this.killStyleOfAngularComponent();
}

killStyleOfAngularComponent() {
  let ImageSelector = document.getElementById('mat-select-0-panel');
  ImageSelector.style.transform = "translateX(0px)";
  ImageSelector.style.top = "0px";
  ImageSelector.style.left = "0px";
}
}
