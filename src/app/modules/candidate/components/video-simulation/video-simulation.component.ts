import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {InterviewEvaluationService} from "../../../../services/evaluation/interview-evaluation.service";
import {InterviewService} from "../../../../services/recruiter/InterviewService";
import {PdfService} from "../../../../services/evaluation/pdf.service";
import {CloudinaryService} from "../../../../services/cloudinary/cloudinary.service";
import {ActivatedRoute} from "@angular/router";
import {CandidatureService} from "../../../../services/candidature/candidature.service";
import {OffreService} from "../../../../services/offreStage/offreStage";
import {OffreStageDTO} from "../../../../models/offre-stage-dto.model";
import {EntretienDTO} from "../../../../models/entretien-dto";

@Component({
  selector: 'app-video-simulation',
  templateUrl: './video-simulation.component.html',
  styleUrls: ['./video-simulation.component.css']
})
export class VideoSimulationComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  errorMessage: string = '';
  timer: number = 0; // Timer in seconds
  isFinished: boolean = false;
  private tabSwitchCount = 0;
  public isProcessing: boolean = false; // Indicateur pour le spinner

  private socket?: WebSocket;
  public transcript: string = '';
  public emotion: string = '';
  public recording: boolean = false;

  recruiterPdfBlob: Blob | null = null; // To store the recruiter's report for further use
  recruiterTotalScore: number | null = null; // To store the total score for the recruiter

  private mediaRecorderVideo?: MediaRecorder;
  private captureInterval?: any;

  // Audio PCM WAV
  private audioContext!: AudioContext;
  protected recordedAudioChunks: Float32Array[] = [];
  private sampleRate = 44100;
  entretien?: EntretienDTO;
  protected questions: any[] = [
    // "Introduce yourself",
    // "What are your strengths?",
    // // "What are your weaknesses?",
    // // "Where do you see yourself in 5 years?"
  ];
  private question: string = this.questions[0];
  protected currentQuestionIndex = 0;
  public generatedPdfUrl?: SafeResourceUrl;
  private recruiterReportUrl: string = "";
  candidatureId!: number;
  private remarques : Set<string>;
  private offreId!: number;
  offre?: OffreStageDTO;
  constructor(private entretienService:InterviewService,private http: HttpClient ,private candidatureService : CandidatureService , private route: ActivatedRoute, private sanitizer: DomSanitizer, private interviewService:InterviewEvaluationService ,    private pdfService: PdfService , private cloudinaryService:CloudinaryService , private offreService:OffreService) {
    this.remarques = new Set(); // Ensemble pour stocker des remarques uniques
  }

  ngOnInit(): void {
    console.log("hello world ")
    // Ajouter un écouteur pour `visibilitychange`
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.setupMedia();
    // Extraire candidatureId de l'URL
    this.route.queryParams.subscribe(params => {
      this.candidatureId = +params['candidatureId']; // Conversion en number
      this.offreId = +params['offreId'];
      console.log('Candidature ID:', this.candidatureId);
      console.log('Offre ID:', this.offreId);
      this.chargerOffre(this.offreId);

    });
    // Appeler le service pour récupérer les données de l'entretien
    this.entretienService.getEntretienByOffreId(this.offreId).subscribe({
      next: (data) => {
        this.entretien = data;
        console.log('Entretien reçu:', data);
        this.questions=this.entretien.questions;
        // this.loading = false;
      },
      error: (err) => {
        // this.error = 'Erreur lors de la récupération des données.';
        console.error(err);
        // this.loading = false;
      },
    });

  }

  chargerOffre(id: number): void {
    this.offreService.getOffreById(id).subscribe({
      next: (data) => {
        this.offre = data;
        console.log('Offre reçue:', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'offre:', err);
      }
    });
  }

  // loadEntretien(id: number | undefined): void {
  //   this.entretienService.getEntretienById(id).subscribe({
  //     next: (data) => {
  //       this.entretien = data;
  //       this.questions=this.entretien.questions;
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Erreur lors de la récupération de l\'entretien.';
  //       console.error(err);
  //     }
  //   });
  // }

  handleVisibilityChange = () => {
    if (document.hidden) {
      // L'utilisateur a quitté l'onglet actif
      console.warn('Onglet inactif détecté.');
      this.tabSwitchCount++;
      if (this.tabSwitchCount > 8) {
        alert('Vous avez changé d’onglet plusieurs fois. L’interview sera annulée.');
        // Logique supplémentaire : Fin de l’interview, redirection, etc.
      }
    } else {
      // L'utilisateur est revenu à l'onglet
      console.info('Onglet actif à nouveau.');
    }
  };

  ngOnDestroy(): void {
    // this.socket?.close();
    // Supprimer l'écouteur pour éviter les fuites de mémoire
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    clearInterval(this.captureInterval);
  }

  setupMedia(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log('Media stream obtenu.');

        const videoElement = document.querySelector('video') as HTMLVideoElement;
        videoElement.srcObject = stream;
        videoElement.muted = true; // Couper le son de l'élément vidéo
        videoElement.play();

        const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(audioStream);
        const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
          const channelData = event.inputBuffer.getChannelData(0);
          this.recordedAudioChunks.push(new Float32Array(channelData));
        };

        source.connect(processor);
        processor.connect(this.audioContext.destination);

        const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
        this.mediaRecorderVideo = new MediaRecorder(videoStream);

        console.log('Audio et vidéo configurés.');
      })
      .catch((err) => {
        console.error('Erreur lors de l’accès aux périphériques multimédia :', err);
      });
  }

  startRecording(): void {
    if (!this.audioContext || !this.mediaRecorderVideo) {
      console.error('Les périphériques multimédia ne sont pas initialisés.');
      return;
    }

    this.socket = new WebSocket('ws://localhost:8000/ws');

    this.socket.onmessage = (event) => {
      const message = event.data;

      if (message.startsWith('Emotion détectée:')) {
        this.emotion = message;
      }
      if (message.startsWith('Transcription:')) {
        this.transcript = message.replace('Transcription:', '').trim();
      }
      if (message.startsWith('Detection:')) {
        const detection = message.replace('Detection:', '').trim();

        if (!this.remarques.has(detection)) { // Vérifie si la détection est déjà présente
          this.remarques.add(detection); // Ajouter à l'ensemble des remarques
          console.log(`Remarque ajoutée : ${detection}`);
        } else {
          console.log(`Remarque déjà présente : ${detection}`);
        }
      }
    };


    this.recordedAudioChunks = [];
    this.recording = true;
    console.log('Enregistrement démarré.');

    this.mediaRecorderVideo.start();
    this.captureInterval = setInterval(this.captureFrames.bind(this), 500);
  }

  stopRecording(): void {
    if (!this.audioContext || !this.mediaRecorderVideo) {
      console.error('Les périphériques multimédia ne sont pas initialisés.');
      return;
    }
    this.socket?.close();

    this.recording = false;
    this.mediaRecorderVideo.stop();
    clearInterval(this.captureInterval);
    console.log('Enregistrement arrêté.');
  }

  captureFrames(): void {
    if (!this.recording) return;

    const videoElement = document.querySelector('video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    this.socket?.send(`image:${imageData.split(',')[1]}`);
    // console.log('Image capturée et envoyée.');
  }

  sendAudioOnDemand(): void {
    // Obtenir la question en cours avant de passer à la suivante
    const currentQuestion = this.questions[this.currentQuestionIndex].contenu;

    // Passer immédiatement à la question suivante
    this.currentQuestionIndex++;

    // Si c'était la dernière question, lancer son traitement et attendre avant d'afficher le rapport
    if (this.currentQuestionIndex === this.questions.length) {
      console.log('Dernière question en cours de traitement...');
      this.isProcessing = true; // Activer le spinner
      // Traiter la dernière question
      const audioBlob = this.exportWAV();
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      this.stopRecording()

      this.http.post<{ transcription: string }>('http://localhost:8000/transcribe_audio/', formData)
        .subscribe(
          (response) => {
            console.log('Réponse du backend reçue :', response);
            const transcript = response.transcription;

            console.log('Transcription mise à jour.');

            // Évaluer la dernière réponse
            this.interviewService.evaluateResponse(currentQuestion, transcript).subscribe(
              (apiResponse) => {
                console.log('Réponse de l\'API d\'évaluation reçue :', apiResponse);
                this.interviewService.addResult(currentQuestion, transcript, apiResponse);
                console.log('Dernière réponse ajoutée au tableau.');

                // // Arrêter l'enregistrement et afficher l'indicateur de chargement
                // this.stopRecording();

                // Génération du rapport
                const results = this.interviewService.getResults();
                // const pdfBlob = this.pdfService.generateInterviewReport(results);
                //
                // // Créer une URL pour afficher le PDF
                // const pdfUrl = URL.createObjectURL(pdfBlob);
                //
                // this.generatedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);

                // Générer le rapport pour le candidat
                const candidatePdfBlob = this.pdfService.generateCandidateReport(results);

                // Générer le rapport pour le recruteur et récupérer les scores
                const { pdfBlob: recruiterPdfBlob, averageScore } = this.pdfService.generateRecruiterReport(results,this.remarques);

                // Créer une URL pour afficher le PDF du candidat
                const candidatePdfUrl = URL.createObjectURL(candidatePdfBlob);
                this.generatedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(candidatePdfUrl);

                // Stocker le PDF du recruteur pour un traitement ultérieur
                // (par exemple, pour l'enregistrer, envoyer ou analyser les scores)
                this.recruiterPdfBlob = recruiterPdfBlob;
                // Convert Blob to File
                const recruiterPdfFile = new File([recruiterPdfBlob], 'recruiter_report.pdf', { type: 'application/pdf' });

                // Upload using the existing uploadFile method
                this.cloudinaryService.uploadFile(recruiterPdfFile).subscribe({
                  next: (secureUrl) => {
                    console.log('Recruiter report uploaded to Cloudinary:', secureUrl);
                    this.recruiterReportUrl = secureUrl; // Store the URL for further use

                    // Mise à jour de la candidature après avoir obtenu l'URL
                    this.candidatureService.updateCandidature(this.candidatureId, averageScore, this.recruiterReportUrl).subscribe({
                      next: (data) => {
                        alert('Candidature mise à jour avec succès.');
                        console.log(data);
                      },
                      error: (err) => {
                        console.error('Erreur lors de la mise à jour de la candidature:', err);
                      }
                    });

                  },
                  error: (err) => {
                    console.error('Error uploading recruiter report:', err);
                  }
                });

                this.recruiterTotalScore = averageScore; // Stocker le score total pour un éventuel affichage ou analyse

                // Mettre à jour la candidature avec le score final et le rapport
                // this.candidatureService.updateCandidature(this.candidatureId, averageScore, this.recruiterReportUrl).subscribe({
                //   next: (data) => {
                //     alert('Candidature mise à jour avec succès.');
                //     console.log(data);
                //   },
                //   error: (err) => {
                //     console.error('Erreur lors de la mise à jour de la candidature:', err);
                //   }
                // });

                this.isFinished = true; // Marquer la simulation comme terminée
                this.isProcessing = false; // Désactiver le spinner une fois le rapport généré
                return;

              },
              (error) => {
                console.error('Erreur lors de l\'évaluation de la réponse :', error);
              }
            );
          },
          (error) => {
            console.error('Erreur lors de l’envoi de l’audio :', error);
          }
        );

      return; // Ne pas continuer plus loin pour la dernière question
    }

    // Sinon, traiter la question en arrière-plan
    console.log('Envoi de l’audio au backend pour traitement...');
    const audioBlob = this.exportWAV();
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    this.http.post<{ transcription: string }>('http://localhost:8000/transcribe_audio/', formData)
      .subscribe(
        (response) => {
          console.log('Réponse du backend reçue :', response);
          const transcript = response.transcription;

          console.log('Transcription mise à jour.');

          // Évaluer la réponse pour la question précédente
          this.interviewService.evaluateResponse(currentQuestion, transcript).subscribe(
            (apiResponse) => {
              console.log('Réponse de l\'API d\'évaluation reçue :', apiResponse);
              this.interviewService.addResult(currentQuestion, transcript, apiResponse);
              console.log('Résultat ajouté au tableau.');
            },
            (error) => {
              console.error('Erreur lors de l\'évaluation de la réponse :', error);
            }
          );
        },
        (error) => {
          console.error('Erreur lors de l’envoi de l’audio :', error);
        }
      );

    // Réinitialiser les morceaux audio pour le prochain enregistrement
    this.recordedAudioChunks = [];
    console.log('Prêt à enregistrer la prochaine question.');
  }







  exportWAV(): Blob {
    console.log('Conversion des données audio en PCM WAV...');

    const bufferLength = this.recordedAudioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const buffer = new Float32Array(bufferLength);
    let offset = 0;

    for (const chunk of this.recordedAudioChunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    const pcmBuffer = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      pcmBuffer[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7FFF; // Clamp and scale
    }

    const wavHeader = this.createWAVHeader(pcmBuffer.length, this.sampleRate);
    return new Blob([wavHeader, pcmBuffer], { type: 'audio/wav' });
  }

  private createWAVHeader(dataLength: number, sampleRate: number): ArrayBuffer {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength * 2, true);

    return header;
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
