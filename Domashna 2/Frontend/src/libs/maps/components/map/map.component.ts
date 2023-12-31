import { Component, OnInit } from '@angular/core';
import { Place } from '../../models/map.models';
import { MapService } from '../../services/map.service';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import locations from '../../models/hardcoded.models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export default class MapComponent implements OnInit {
  locations: Place[] = [];
  mapLoaded: boolean = false;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 41.6086, lng: 21.7453 },
    zoom: 8,
    disableDefaultUI: true,
  };

  showButtons = false;
  filtersActive = false;
  selectedFilter = 'All';

  constructor(private mapService: MapService, public modalService: NgbModal) {}

  ngOnInit(): void {
    this.mapService.getLocations().subscribe((data: Place[]) => {
      this.locations = data;
      console.log(this.locations);
      this.mapLoaded = true;
    });
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
    } else {
      this.selectedFilter = 'All';
      this.showButtons = false;
    }
  }
}
