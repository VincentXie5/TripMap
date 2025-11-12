package com.keepGoing.tripMap.controller;

import com.keepGoing.tripMap.dto.TripRequest;
import com.keepGoing.tripMap.dto.TripResponse;
import com.keepGoing.tripMap.service.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for trip management operations
 */
@Slf4j
@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    /**
     * Create a new trip
     * @param tripRequest Trip creation data
     * @return Created trip response
     */
    @PostMapping
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripRequest tripRequest) {
        try {
            TripResponse trip = tripService.createTrip(tripRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(trip);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid trip creation parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to create trip", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create trip: " + e.getMessage());
        }
    }

    /**
     * Get trip by ID
     * @param id Trip ID
     * @return Trip response
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(@PathVariable Long id) {
        try {
            TripResponse trip = tripService.getTrip(id);
            return ResponseEntity.ok(trip);
        } catch (EntityNotFoundException e) {
            log.warn("Trip not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to fetch trip, ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch trip: " + e.getMessage());
        }
    }

    /**
     * Update existing trip
     * @param id Trip ID
     * @param tripRequest Updated trip data
     * @return Updated trip response
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id,
                                        @Valid @RequestBody TripRequest tripRequest) {
        try {
            TripResponse trip = tripService.updateTrip(id, tripRequest);
            return ResponseEntity.ok(trip);
        } catch (EntityNotFoundException e) {
            log.warn("Trip not found for update: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid trip update parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to update trip, ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update trip: " + e.getMessage());
        }
    }

    /**
     * Delete trip by ID
     * @param id Trip ID
     * @return Success response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        try {
            tripService.deleteTrip(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            log.warn("Trip not found for deletion: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to delete trip, ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete trip: " + e.getMessage());
        }
    }

    /**
     * Get all trips
     * @return List of all trips
     */
    @GetMapping
    public ResponseEntity<?> getAllTrips() {
        try {
            List<TripResponse> trips = tripService.getAllTrips();
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            log.error("Failed to fetch trips list", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch trips list: " + e.getMessage());
        }
    }
}