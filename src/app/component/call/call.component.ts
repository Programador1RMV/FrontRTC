import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
declare var Peer;
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {

  public peer:any;
  public key:string;
  public myPeerId:string;
  public inCall:boolean;
  @ViewChild('video',{static:true}) public video:ElementRef<HTMLVideoElement>;
  @ViewChild('me',{static:false}) public me:ElementRef<HTMLVideoElement>;
  constructor(private _router:ActivatedRoute){
    var browser = <any>navigator;
    this.inCall = false;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);
    browser.getUserMedia({audio:false,video:true},(stream)=>{
      this.me.nativeElement.srcObject = stream;
      this.me.nativeElement.play();
    })
    let documento= JSON.parse(localStorage.getItem('documento'));
    if(documento){

      this.peer = new Peer(documento+'rmv',{
        host : 'localhost',
        port:9000,
        debug:0,
      });
    }else{ 
      this.peer = new Peer({
        host : 'localhost',
        port:9000,
      });
    }    
    this.peer.on('connection',(conn)=>{
      conn.on('data',async (data)=>{
        console.log(conn,data);
        let hangout = await Swal.fire({
          title:'Alguien te quiere llamar, deseas contestar?',
          showCancelButton:true
        });

        if(!hangout.dismiss){
          this.inCall = true;
          this.key = data;
          this.videoConnect();
        }
      });
    })

    this.peer.on('disconnected',()=>{
      this.inCall = false;
      console.log('disconnected')
      this.video.nativeElement.srcObject = null;
      this.video.nativeElement.pause();
    })

    this.peer.on('call',async (call)=>{
      this.inCall = true;
      browser.getUserMedia({audio:true,video:true},
        (stream)=>{
          call.answer(stream);
          call.on('stream',(remoteStream)=>{
            this.video.nativeElement.srcObject = remoteStream;
            this.video.nativeElement.play();
          });
      })
      
    });
    
  }
  ngOnInit(): void {
    this._router.params.subscribe(params=>{
      if(params.medicId){
        this.key = params.medicId;
        this.connect();
      }
    })
  }

  connect(){
    const conn = this.peer.connect(this.key)
    conn.on('open',(data)=>{
      this.inCall = true;
      conn.send(this.peer.id);
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
        this.inCall = true;
        const llamada = this.peer.call(this.key,stream);
        llamada.on('stream',(remoteStream)=>{
          video.srcObject = remoteStream;
          video.play();
        })
      })
  }

  colgar(){

  }
}
