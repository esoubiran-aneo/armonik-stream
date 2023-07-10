import { EventSubscriptionRequest, EventsClient } from "@aneoconsultingfr/armonik.api.angular";
import { Component, Input, OnDestroy, SimpleChanges, inject } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-events",
  template: `
<div>

</div>
`,
  standalone: true,
  imports: [],
  providers: [],
})
export class EventsComponent implements OnDestroy {
  #eventsClient = inject(EventsClient);

  @Input({ required: true }) sessionId: string = "";

  #subscription: Subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges) {
    if(changes['sessionId']) {
      this.#listen();
    }
  }

  ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  #listen() {
    const request = new EventSubscriptionRequest({
      sessionId: this.sessionId,
    });

    const eventsSubscription = this.#eventsClient
      .getEvents(request)
      .subscribe((event) => console.log("event", event));

    this.#subscription.add(eventsSubscription);
  }
}
