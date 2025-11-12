package com.keepGoing.tripMap.repository;

import com.keepGoing.tripMap.entity.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Marker entity operations
 */
@Repository
public interface MarkerRepository extends JpaRepository<Marker, Long> {

    // Find markers by trip ID, ordered by day and time
    List<Marker> findByTripIdOrderByDayAscTimeAsc(Long tripId);

    // Delete all markers by trip ID
    void deleteByTripId(Long tripId);
}
