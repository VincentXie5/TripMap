package com.keepGoing.tripMap.service;

import com.keepGoing.tripMap.dto.*;
import com.keepGoing.tripMap.entity.Marker;
import com.keepGoing.tripMap.entity.Trip;
import com.keepGoing.tripMap.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for trip management operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;

    /**
     * Create a new trip with markers
     * @param tripRequest Trip creation data
     * @return Created trip response
     */
    @Transactional
    public TripResponse createTrip(TripRequest tripRequest) {
        log.info("Creating new trip: {}", tripRequest.getName());

        // Validate date range
        if (tripRequest.getEndDate().isBefore(tripRequest.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        Trip trip = Trip.create(
                tripRequest.getName(),
                tripRequest.getStartDate(),
                tripRequest.getEndDate()
        );

        // Add markers if provided
        if (tripRequest.getMarkers() != null) {
            tripRequest.getMarkers().forEach(markerRequest -> {
                Marker marker = Marker.create(
                        markerRequest.getName(),
                        markerRequest.getDescription(),
                        markerRequest.getTime(),
                        markerRequest.getLatitude(),
                        markerRequest.getLongitude(),
                        markerRequest.getDay()
                );
                trip.addMarker(marker);
            });
        }

        Trip savedTrip = tripRepository.save(trip);
        log.info("Trip created successfully, ID: {}", savedTrip.getId());

        return convertToResponse(savedTrip);
    }

    /**
     * Get trip by ID
     * @param id Trip ID
     * @return Trip response
     */
    public TripResponse getTrip(Long id) {
        log.info("Fetching trip details, ID: {}", id);

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + id));

        return convertToResponse(trip);
    }

    /**
     * Update existing trip
     * @param id Trip ID
     * @param tripRequest Updated trip data
     * @return Updated trip response
     */
    @Transactional
    public TripResponse updateTrip(Long id, TripRequest tripRequest) {
        log.info("Updating trip, ID: {}", id);

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + id));

        // Validate date range
        if (tripRequest.getEndDate().isBefore(tripRequest.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        trip.setName(tripRequest.getName());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());

        // Clear existing markers
        trip.getMarkers().clear();

        // Add new markers
        if (tripRequest.getMarkers() != null) {
            tripRequest.getMarkers().forEach(markerRequest -> {
                Marker marker = Marker.create(
                        markerRequest.getName(),
                        markerRequest.getDescription(),
                        markerRequest.getTime(),
                        markerRequest.getLatitude(),
                        markerRequest.getLongitude(),
                        markerRequest.getDay()
                );
                trip.addMarker(marker);
            });
        }

        Trip updatedTrip = tripRepository.save(trip);
        log.info("Trip updated successfully, ID: {}", updatedTrip.getId());

        return convertToResponse(updatedTrip);
    }

    /**
     * Delete trip by ID
     * @param id Trip ID
     */
    @Transactional
    public void deleteTrip(Long id) {
        log.info("Deleting trip, ID: {}", id);

        if (!tripRepository.existsById(id)) {
            throw new EntityNotFoundException("Trip not found: " + id);
        }
        tripRepository.deleteById(id);
        log.info("Trip deleted successfully, ID: {}", id);
    }

    /**
     * Get all trips ordered by creation date
     * @return List of trip responses
     */
    public List<TripResponse> getAllTrips() {
        log.info("Fetching all trips list");

        return tripRepository.findAllOrderByCreatedAtDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert Trip entity to TripResponse DTO
     * @param trip Trip entity
     * @return TripResponse DTO
     */
    private TripResponse convertToResponse(Trip trip) {
        TripResponse response = TripResponse.builder()
                .id(trip.getId())
                .name(trip.getName())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .createdAt(trip.getCreatedAt())
                .build();

        // Convert markers to response DTOs
        if (trip.getMarkers() != null) {
            response.setMarkers(trip.getMarkers().stream()
                    .map(marker -> MarkerResponse.builder()
                            .id(marker.getId())
                            .name(marker.getName())
                            .description(marker.getDescription())
                            .time(marker.getTime())
                            .latitude(marker.getLatitude())
                            .longitude(marker.getLongitude())
                            .day(marker.getDay())
                            .build())
                    .collect(Collectors.toList()));
        }

        return response;
    }
}