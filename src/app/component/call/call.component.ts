import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, HostListener, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MedicoService } from 'src/app/services/medico.service';
import { promise } from 'protractor';
declare var Peer;
declare var MultiStreamRecorder: any;
declare function ConcatenateBlobs(array:Array<any>,type:string,callback:Function)
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit{
  public peer:any;
  public calling:boolean;
  public key:string;
  public myPeerId:string;
  public inCall:boolean;
  public mensajeTemp:string;
  public recorderWithTimer;
  public audioOfCall;
  //Tramos de la llamada para al finalizarlos obtener el archivo
  public callChunks;
  @Output() public addImage:EventEmitter<string>;
  public mensaje:string;
  @Output() colgado:EventEmitter<any>;
  @ViewChild('video',{static:true}) public video:ElementRef<HTMLVideoElement>;
  @ViewChild('me',{static:false}) public me:ElementRef<HTMLVideoElement>;
  @ViewChild('preview',{static:false}) public preview:ElementRef<HTMLAudioElement>;
  @Output() newMessage:EventEmitter<string>;
  @Output() cierreVentana: EventEmitter<void>;
  @Output() markAsConnected:EventEmitter<string>;
  @Output() finLlamadaPaciente:EventEmitter<void>;
  conn: any;
  llamada: any;
  @Output() sendSMS: EventEmitter<void>;
  @Output() inicioLlamada:EventEmitter<any>;
  @Output() finLlamadaMedico:EventEmitter<any>;
  @Input() consecutivo:string;
  remoteStream: any;
  localStream: any;
  audioTracks: any[];
  sources: any[];
  dest: any;
  recorder: any;
  audio: any;
  constructor(private _router:ActivatedRoute,private _route:Router,private __medico:MedicoService){
    this.finLlamadaPaciente = new EventEmitter();
    this.calling = false;
    this.addImage = new EventEmitter<string>();
    this.mensaje = '';
    this.newMessage = new EventEmitter<string>();
    this.inicioLlamada = new EventEmitter();
    this.markAsConnected = new EventEmitter<string>();
    this.colgado = new EventEmitter();
    this.sendSMS = new EventEmitter();
    this.finLlamadaMedico = new EventEmitter();
    this.cierreVentana = new EventEmitter();
    this.callChunks = [];
    var browser = <any>navigator;
    this.inCall = false;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);
    browser.getUserMedia({audio:true,video:true},(stream)=>{
      this.me.nativeElement.srcObject = stream;
      this.me.nativeElement.volume = 0;
      this.localStream = stream;
      this.me.nativeElement.play();
    },()=>{

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
      this.peer = new Peer(this.consecutivo,{
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
          this.finLlamadaMedico.emit();
          this.finLlamadaPaciente.emit();
          this.inCall = false;
          return;
        }
        if(data.cancelCall){
          Swal.close({value:false});
        }
        if(data.reconnect){
          this.conn = this.peer.connect();
          this.videoConnect();
          return;
        }
        
        if(data.message){
          this.mensaje = this.mensaje.concat(`${data.message}\n`);
          this.newMessage.emit(this.mensaje);
          return;
        }
        if(data.key && !data.call){
          this.key = data.key;
          this.markAsConnected.emit(data.csc);
          this.conn = this.peer.connect(data.key);
          return;
        }
        if(data.call){
          const audio = new Audio();
          audio.src = "https://notificationsounds.com/notification-sounds/goes-without-saying-608/download/mp3";
          audio.play();
          audio.onended = ()=>{
            if(!this.conn){
              audio.currentTime = 0;
              audio.play();
            }

          }
          let hangout = await Swal.fire({
            title:'Llamada entrante de Red Medica Vital',
            showCancelButton:true,
            allowOutsideClick:false
          });
  
          if(hangout.value){
            this.inCall = true;
            this.conn = this.peer.connect(data.key);
            this.inicioLlamada.emit();
            this.videoConnect();
          }


          if(hangout.dismiss){
            this.conn.send({rechazo:true});
          }
        }

        if(data.rechazo){
          await Swal.fire({
            title:'Rechazo',
            text:'El beneficiario rechazo la llamada',
            showConfirmButton:true
          })
          this.calling = false;
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
          this.remoteStream = stream;
          call.on('stream',(remoteStream)=>{
            this.video.nativeElement.srcObject = remoteStream;
            this.remoteStream = remoteStream;
            var playPromise =this.video.nativeElement.play();
            this.audioTracks = [this.localStream,this.remoteStream];
            
            this.recorder = new MultiStreamRecorder(this.audioTracks);
            this.recorder.mimeType = "audio/webm";
            this.recorder.ondataavailable = (blob)=>{
              this.callChunks.push(blob);
            }
            this.recorder.start(5000);
            
            this.recorderWithTimer = new MultiStreamRecorder(this.audioTracks);
            this.recorderWithTimer.mimeType = "audio/webm";
            this.recorderWithTimer.start(300 * 1000);
            this.recorderWithTimer.ondataavailable = (blob)=>{
              //Notify to server 5 minutos de llamada
            }
          });
      },()=>{

      })
    });
    
  }

  
  ngOnInit(): void {
    this.inCall = false;
    this._router.params.subscribe(params=>{      
      if(params.medicId){
        this.key = params.medicId;
        this.connect();
      }
    })
  }

  notifyCall(data){
    if(this.key === null || this.key === undefined){
      Swal.fire({
        timer:2000,
        text:'No puedes llamar a alguien que no está en sala de espera',
        showConfirmButton:false,
        title:'error',
        icon:'error'
      });
      return;
    }
    this.calling = true;
    this.conn.send(data);
  }

  connect(){
    this.conn = this.peer.connect(this.key)
    this.conn.on('open',(data)=>{
      this.conn.send({key:this.peer.id,csc:this.consecutivo});
    })
  }

  async videoConnect(){
    const video = this.video.nativeElement;
    var browser = <any>navigator;
    if(this.key !== null && this.key !== undefined ){
      browser.getUserMedia = (browser.getUserMedia ||
        browser.webkitGetUserMedia ||
        browser.mozGetUserMedia ||
        browser.msGetUserMedia);
      browser.getUserMedia({audio:true,video:true},
        (stream)=>{
          this.localStream = stream;
          this.inCall = true;
          this.llamada = this.peer.call(this.key,stream);
          this.llamada.on('stream',(remoteStream)=>{
            this.remoteStream = remoteStream;
            video.srcObject = remoteStream;
            video.play();
          });
          this.llamada.on('close',()=>{
            this.recorder.stop();
            
            this.inCall = false;
            this.video.nativeElement.srcObject = null;
            this.video.nativeElement.pause();
          })        
      },()=>{
        
      })
    }else{
      Swal.fire('El cliente aún no se encuentra conectado');
    }
  }

  async colgar(){
    this.conn.send({action:'close'})
    this.recorder.stop();
    this.llamada.close();
    this.inCall = false;
    this.video.nativeElement.pause();    
  }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: BeforeUnloadEvent):void {
    event.returnValue = true;
    this.cierreVentana.emit();
    this.colgar();
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

  imageCapture(){
    const canvas = document.createElement('canvas');
    canvas.width = this.video.nativeElement.videoWidth;
    canvas.height = this.video.nativeElement.videoHeight;
    canvas.getContext("2d").drawImage(this.video.nativeElement,0,0);
    let imgUrl;
    canvas.toBlob(async (blob)=>{
      imgUrl = window.URL.createObjectURL(blob);
      let {value,dismiss} = await Swal.fire({
        imageUrl:window.URL.createObjectURL(blob),
        title:'Desea guardar esta imagen en la lista de caputras de esta teleconsulta?',
        showCancelButton:true
      });
      if(value){
        this.addImage.emit(imgUrl);
      }
    });
  }

  reconect(){
    this.conn.send({reconnect:true});
  }
  async cancelCall(){
    this.calling = false;
    this.conn.send({cancelCall:true});
  }
  finalizar(){

    ConcatenateBlobs(this.callChunks, 'audio/webm', (resultingBlob) =>{
      this.audio = resultingBlob;
      this.colgado.emit();
    });
  }

  getAudio(){
    return new Promise((res,rej)=>{
      ConcatenateBlobs(this.callChunks, 'audio/webm', async (resultingBlob) =>{
        this.recorder.stop();
        res(resultingBlob);
      })

    })
  }
  // get  audioBlob(){
  //   ConcatenateBlobs(this.callChunks, 'audio/webm', async (resultingBlob) =>{
  //     this.audio = resultingBlob;
  //     // this.preview.nativeElement.src = URL.createObjectURL(resultingBlob);
  //   });
  //   return null;
  // }
}
/* 
  const audioCtx = new AudioContext();
      console.log(this.localStream);
      const dest =audioCtx.createMediaStreamDestination();
  
      let localsource = audioCtx.createMediaStreamSource(this.localStream);
      let remoteSource = audioCtx.createMediaStreamSource(this.remoteStream);
      localsource.connect(dest);
      remoteSource.connect(dest);
      console.log(dest.stream.getTracks()[0])
*/