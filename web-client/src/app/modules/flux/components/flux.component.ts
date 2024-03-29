import { Component, OnInit } from '@angular/core';

import { EventSourceService } from '../services/event-source.service';
import { SseService } from '../services/sse.service';

import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { PageElement } from '../models/page-element.model';

@Component({
  selector: 'app-flux',
  templateUrl: './flux.component.html',
  styleUrls: ['./flux.component.css']
})
export class FluxComponent implements OnInit {

  latestString: string = "Execute curl above.";
  serverDateTime: string = "default text";
  currentSubscription;
  elements: PageElement[];
  currentPage: number = 1;
  totalPages: number = 100;
  hideLoadingBar = false;

  constructor(private eventSourceService: EventSourceService, private sseService: SseService) { }

  ngOnInit() {
    this.streamUpdatableString();
    this.streamServerDateTime();
    this.getUsingSse('');
  }

  private streamUpdatableString() {
    this.sseService.streamUpdatableString().subscribe(newString => {
      this.latestString = newString;
    });
  }

  private streamServerDateTime() {
    this.sseService.streamServerDateTime().subscribe(serverDateTime => {
      this.serverDateTime = serverDateTime;
    });
  }

  // Subscribed to an Observable derived from the handling of EventSource.
  getUsingEventSource(): void {
    this.handleObservable(this.eventSourceService.getEventSourceObservable());
  }

  // Subscribed to an Observable derived from the handling of SSE. Ideal to use other Http Methods in addition to GET.
  getUsingSse(path: string): void {
    this.handleObservable(this.sseService.getObservable(path));
  }

  private handleObservable(observable: Observable<Page>): void {
    console.log("Getting pages.");
    if (this.currentSubscription) {
    console.log("Unsubscribing from previous subscription.");
      this.currentSubscription.unsubscribe();
    }

    console.log("Resetting values.");
    this.elements = [];
    this.currentPage = 1;
    this.totalPages = 100;
    this.hideLoadingBar = false;

    console.log("Subscribing...");
    this.currentSubscription = observable.subscribe(page => {
      console.log(page);

      this.currentPage = page.page;
      this.totalPages = page.totalPages;

      // Add each element from the page to the global list of elements.
      page.elements.forEach(element => {
        this.elements.push(element);
      });

      // If last page, set hideLoadingBar to true with a delay, so that the progress bar shows as 100% for the given delay.
      if (this.currentPage == this.totalPages) {
        setTimeout(() => {
          this.hideLoadingBar = true;
        }, 500);
      }
    });
  }

}
