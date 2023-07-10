import { ListSessionsRequest, SessionRawField, SessionStatus, SessionsClient, SortDirection } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, inject} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsComponent } from './components/events.component';
import { interval, merge, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  <select [(ngModel)]="currentSessionId">
    <option value="">Select a session</option>
    <option *ngFor="let sessionId of sessionsIds" [value]="sessionId"> {{ sessionId }} </option>
  </select>

<app-events *ngIf="currentSessionId" [sessionId]="currentSessionId"></app-events>
`,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    EventsComponent
  ],
  providers: [],
})
export class AppComponent implements AfterViewInit {
  #sessionsClient = inject(SessionsClient);

  sessionsIds: string[] = [];
  currentSessionId: string | null = null;

  ngAfterViewInit(): void {
    const sessionOptions = new ListSessionsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        direction: SortDirection.SORT_DIRECTION_ASC,
        field: {
          sessionRawField: SessionRawField.SESSION_RAW_FIELD_SESSION_ID
        },
      },
      filter: {
        sessionId: '',
        applicationName: '',
        applicationVersion: '',
        status: SessionStatus.SESSION_STATUS_UNSPECIFIED,
      }
    });

    interval(1000).pipe(
      startWith(0),
      switchMap(() => this.#sessionsClient.listSessions(sessionOptions))
      )
      .subscribe((data) => {
        const sessions = data.sessions ?? [];

        this.sessionsIds = sessions.map((session) => session.sessionId ?? '');
      });
  }
}
