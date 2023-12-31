package mk.dians.finki.backend.web;

import mk.dians.finki.backend.model.Place;
import mk.dians.finki.backend.service.PlaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/places")
public class PlaceController {


    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @GetMapping("/name/{name}")
    public Place getPlaceByName(@PathVariable String name) {
        return placeService.getPlaceByName(name);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable Long id) {
        Optional<Place> placeOptional = placeService.getPlaceById(id);

        return placeOptional
                .map(place -> new ResponseEntity<>(place, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
