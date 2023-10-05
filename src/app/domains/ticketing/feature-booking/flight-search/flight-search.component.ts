import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  Flight,
  FlightService,
} from '../../data';
import { CityValidator, addMinutes } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { debounceTime } from 'rxjs';

// import { HiddenService } from "../../../checkin/data/hidden.service";
// import { CheckinService } from "@demo/checkin/data";

@Component({
  standalone: true,
  imports: [
    // CommonModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,

    FormsModule,
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria
  urgent = signal(false);
  flights = signal<Flight[]>([]);
  lazyFrom$ = toObservable(this.from).pipe(
    debounceTime(300)
  );
  lazyFrom = toSignal(this.lazyFrom$, {
    initialValue: this.from()
  });
  flightRoute = computed(() => 'From ' + this.lazyFrom() + ' to ' + this.to() + '.');

  basket: { [id: number]: boolean } = {
    3: true,
    5: true,
  };

  constructor() {
    effect(() => console.log(this.flightRoute()));
  }

  search(): void {

    effect(() => console.log(this.flightRoute()));
    if (!this.from() || !this.to()) return;

    this.flightService
      .find(this.from(), this.to(), this.urgent())
      .subscribe((flights) => {

        this.flights.set(flights);

      });
  }

  delay(): void {
    /* const flight = this.flights[0];
    flight.date = addMinutes(flight.date, 15); */
  }
}
