import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MedicoService } from 'src/app/services/medico.service';
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
  public mensajeTemp:string;
  public mensaje:string;
  @Output() colgado:EventEmitter<any>;
  @ViewChild('video',{static:true}) public video:ElementRef<HTMLVideoElement>;
  @ViewChild('me',{static:false}) public me:ElementRef<HTMLVideoElement>;
  @Output() newMessage:EventEmitter<string>;
  @Output() cierreVentana: EventEmitter<void>;
  conn: any;
  llamada: any;
  @Output() sendSMS: EventEmitter<void>;
  @Output() inicioLlamada:EventEmitter<any>;
  constructor(private _router:ActivatedRoute,private _route:Router,private __medico:MedicoService){
    this.mensaje = '';
    this.newMessage = new EventEmitter<string>();
    this.inicioLlamada = new EventEmitter();
    this.colgado = new EventEmitter();
    this.sendSMS = new EventEmitter();
    this.cierreVentana = new EventEmitter();
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
        host:environment.peerConf.ip,
        path:environment.peerConf.path,
        port:9000,
        debug:0,
        secure:environment.peerConf.secure
      });
    }else{ 
      this.peer = new Peer({
        host:environment.peerConf.ip,
        path:environment.peerConf.path,
        secure:environment.peerConf.secure,
        port:9000,
        debug:0,
        // secure:true
      });
    }    
    this.peer.on('connection',(conn)=>{
      conn.on('data',async (data)=>{
        if(data.action){
          this.colgado.emit();
          this.inCall = false;
          return;
        }
        
        if(data.message){
          this.mensaje = this.mensaje.concat(`${data.message}\n`);
          this.newMessage.emit(this.mensaje);
          return;
        }
        let hangout = await Swal.fire({
          title:'Alguien te quiere llamar, deseas contestar?',
          showCancelButton:true,
          allowOutsideClick:false
        });

        if(!hangout.dismiss){
          this.inCall = true;
          this.key = data;
          this.conn = this.peer.connect(data);
          this.inicioLlamada.emit();
          this.videoConnect();
        }
      });
    })
    this.peer.on('call',async (call)=>{
      this.inCall = true;
      this.inicioLlamada.emit();
      this.llamada = call;
      this.llamada.on('close',()=>{
        this.inCall = false;
        this.video.nativeElement.srcObject = null;
        this.video.nativeElement.pause();
      })
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
    this.conn = this.peer.connect(this.key)
    this.conn.on('open',(data)=>{
      this.inCall = true;
      this.conn.send(this.peer.id);
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
        this.llamada = this.peer.call(this.key,stream);
        this.llamada.on('stream',(remoteStream)=>{
          video.srcObject = remoteStream;
          video.play();
        });
        this.llamada.on('close',()=>{
          this.inCall = false;
          this.video.nativeElement.srcObject = null;
          this.video.nativeElement.pause();
        })        
      })
  }

  async colgar(){

    let {value,dismiss} = await Swal.fire({
      icon:'question',
      title:'Seguro desea salir?',
      text:'Si sale de esta conferencia se finalizará su consulta',
      showCancelButton:true
    });
    if(value){
      this.colgado.emit();
      this.conn.send({action:'close'})
      this.llamada.close();
      this.inCall = false;
      this.video.nativeElement.pause();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: BeforeUnloadEvent):void {
    event.returnValue = true;
    this.cierreVentana.emit()
  }

  async confirm():Promise<boolean>{
    let {dismiss} = await Swal.fire({
      title:'Seguro desea salir?',
      text:'Abandonará una llamada',
      showCancelButton:true,
      cancelButtonText:'Permanecer aquí',
      confirmButtonText:'Seguro que quiero salir', 
    })

    return !dismiss
  }

  enviarMensaje(){
    this.mensaje = this.mensaje.concat(`${this.mensajeTemp}\n`);
    this.conn.send({message:this.mensajeTemp});
    this.newMessage.emit(this.mensaje);
    this.mensajeTemp = '';
  }

  enviarSMS(){
    this.sendSMS.emit();
  }
}
