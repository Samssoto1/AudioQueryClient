import { environment } from 'src/environments/environment'

// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Interceptor
import { AuthInterceptor } from './interceptor/auth-interceptor';

// Angular Material
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'  
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip'
import {MatSidenavModule} from '@angular/material/sidenav';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

// Components
import { AppComponent } from './components/app.component';
import { HeaderComponent } from './components/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { CreateQuizComponent } from './components/createQuiz/createQuiz.component';
import { QuestionCreator } from './components/question-creator/question-creator.component';
import { SongListComponent } from './components/song-list/song-list.component';
import { SongItemComponent } from './components/song-item/song-item.component';
import { DeleteComponent } from './components/dialog/delete/delete.component';
import { QuizDashboardComponent } from './components/quiz-dashboard/quiz-dashboard.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AddSongComponent } from './components/add-song/add-song.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FooterComponent } from './components/footer.component';
import { HomeComponent } from './components/home/home.component';
import { GamePinComponent } from './components/game/game-pin/game-pin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionComponent } from './components/question/question.component';
import { GameQuestionAnswerComponent } from './components/game/game-questionAnswer/game-questionAnswer.component';
import { ShowSongsButtonComponent } from './components/show-songs-button/show-songs-button.component';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PlayQuizComponent } from './components/play-quiz-component/play-quiz-component.component';
import { GameLobbyComponent } from './components/game/game-lobby/game-lobby.component';
import { GameNicknameComponent } from './components/game/game-nickname/game-nickname.component';

// Pipe
import { SongFilterPipe } from './pipes/song-filter.pipe';

// Directives
import { ReloadQuizDirective } from './directives/reload-quiz.directive';

// Etc
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './services/socket.service';
import { GameGameComponent } from './components/game/game-game/game-game.component';
import { GameNicknameScoreComponent } from './components/game/game-nickname-score/game-nickname-score.component';

// Taken out for build
/*
const config: SocketIoConfig = {
  url: environment.socketUrl, //socket server url;
  options: {
    autoConnect: false,
    transports: ['websocket']
  }
}
*/

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FooterComponent,
    HomeComponent,
    GamePinComponent,
    AdminDashboardComponent,
    QuizComponent,
    CreateQuizComponent,
    QuestionCreator,
    SongListComponent,
    SongItemComponent,
    DeleteComponent,
    QuizDashboardComponent,
    NotFoundPageComponent,
    AddSongComponent,
    ShowSongsButtonComponent,
    SongFilterPipe,
    QuizListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PlayQuizComponent,
    GameLobbyComponent,
    GameNicknameComponent,
    ReloadQuizDirective,
    QuestionListComponent,
    QuestionComponent,
    GameQuestionAnswerComponent,
    GameGameComponent,
    GameNicknameScoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatTooltipModule,
    MatSidenavModule,
    MatRadioModule,
    DragDropModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatAutocompleteModule,
    SocketIoModule
    // SocketIoModule.forRoot(config) (taken out for build) and replaced by above

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
