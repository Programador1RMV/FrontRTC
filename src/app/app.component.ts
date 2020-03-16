import { Component, ViewChild } from '@angular/core';
declare var Peer:any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public peer:any;
  public key:string;
  public myPeerId:string;
  @ViewChild('video',{static:false}) public video:any;
  constructor(){
    this.peer = new Peer();
    setTimeout(()=>{
      this.myPeerId = this.peer.id;
    },3000)
    this.peer.on('connection',(conn)=>{
      conn.on('data',(data)=>{
        console.log(data);
      })
    })

    this.peer.on('call',async (call)=>{
      var browser = <any>navigator;

      browser.getUserMedia = (browser.getUserMedia ||
        browser.webkitGetUserMedia ||
        browser.mozGetUserMedia ||
        browser.msGetUserMedia);
      browser.getUserMedia({audio:true,video:true},
        (stream)=>{
          call.answer(stream);
          call.on('stream',(remoteStream)=>{
            console.log(remoteStream)
            this.video.srcObject = remoteStream;
            this.video.nativeElement.play();
          });
      })
      
    });
    
  }

  connect(){
    const conn = this.peer.connect(this.key)
    conn.on('open',(data)=>{
      conn.send('hola!')
    })
  }

  async videoConnect(){
    const video = this.video.nativeElement;
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);
    browser.getUserMedia({audio:true,video:true},
      (stream)=>{
        const llamada = this.peer.call(this.key,stream);
        llamada.on('stream',(remoteStream)=>{
          video.srcObject = remoteStream;
          video.play();
        })
      })
  }
}
