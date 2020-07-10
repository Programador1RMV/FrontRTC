import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  //Fotos tomadas y agregadas a la lista de imagenes a subir
  @Input() photos:Array<string>;
  constructor(private sanitizier:DomSanitizer) { }

  ngOnInit(): void {
    this.photos = [];
  }
  cleanURL(url){
    return this.sanitizier.bypassSecurityTrustResourceUrl(url);
  }
}
