package com.keepGoing.tripMap.repository;

import com.keepGoing.tripMap.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Trip entity operations
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    // Find all trips ordered by creation date (newest first)
    @Query("SELECT t FROM Trip t ORDER BY t.createdAt DESC")
    List<Trip> findAllOrderByCreatedAtDesc();
}