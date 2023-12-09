import { Component, OnInit } from '@angular/core';
import { Place } from '../../models/map.models';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, of } from 'rxjs';
import { PlacesFacade } from '../../state/map-state.facade';
import { MapDirectionsService } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export default class MapComponent implements OnInit {
  locations: Place[] = [];
  cities: string[] = [];
  mapLoaded: boolean = false;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 41.6086, lng: 21.7453 },
    zoom: 8,
    disableDefaultUI: true,
  };

  request: google.maps.DirectionsRequest | null = null;

  directionsResults$: Observable<
    google.maps.DirectionsResult | null | undefined
  > = of(null);

  showButtons = false;
  filtersActive = false;
  selectedFilter = 'All';

  searchForm: FormGroup = new FormGroup({
    search: new FormControl<string>(''),
    type: new FormControl(),
    fee: new FormControl(),
    city: new FormControl(),
  });

  constructor(
    public modalService: NgbModal,
    private placesFacade: PlacesFacade,
    private mapDirectionsService: MapDirectionsService,
    private router: Router
  ) {
    this.placesFacade.getRoute().subscribe((route) => {
      this.request = route;

      this.directionsResults$ = this.mapDirectionsService
        .route(this.request)
        .pipe(map((response) => response.result));
    });
  }

  ngOnInit(): void {
    this.placesFacade.getPlaces().subscribe((x) => {
      this.locations = x;
      this.mapLoaded = true;
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((formValue) => {
        const queryParams: string[] = [];

        if (formValue.search) {
          queryParams.push(`search=${formValue.search}`);
        }
        if (formValue.type && formValue.type != 'All') {
          queryParams.push(`type=${formValue.type}`);
        }
        if (formValue.fee && formValue.fee !== '') {
          queryParams.push(`fee=${formValue.fee}`);
        }
        if (formValue.city && formValue.city !== '') {
          queryParams.push(`city=${formValue.city}`);
        }

        const queryString = queryParams.join('&');

        this.placesFacade.fetchPlaces(queryString);
      });

    this.placesFacade.getCities().subscribe((x) => (this.cities = x));
  }

  openLocationDetails(location: Place) {
    const modalRef = this.modalService.open(LocationDetailsComponent, {
      size: 'lg',
      windowClass: 'modal-class',
    });
    modalRef.componentInstance.place = location;

    modalRef.componentInstance.cancelModal.subscribe(() => {
      modalRef.close();
    });
  }

  showFilters(): void {
    this.showButtons = !this.showButtons;
    this.filtersActive = !this.filtersActive;
  }

  toggleFilters(filter: string): void {
    if (filter !== this.selectedFilter) {
      this.selectedFilter = filter;
      this.showButtons = true;
      this.searchForm.controls['type'].setValue(filter);
    } else {
      this.selectedFilter = 'All';
      this.showButtons = false;
      this.searchForm.controls['type'].setValue(filter);
    }
  }

  goToLocationList(): void {
    this.router.navigate(['/locationList']);
  }
}