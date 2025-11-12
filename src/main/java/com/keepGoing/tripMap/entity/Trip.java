package com.keepGoing.tripMap.entity;

import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Trip entity representing a travel itinerary
 */
@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    // One-to-many relationship with markers
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Marker> markers = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDate createdAt = LocalDate.now();

    // Helper methods for managing markers
    public void addMarker(Marker marker) {
        markers.add(marker);
        marker.setTrip(this);
    }

    public void removeMarker(Marker marker) {
        markers.remove(marker);
        marker.setTrip(null);
    }

    // Static factory method for creating trips
    public static Trip create(String name, LocalDate startDate, LocalDate endDate) {
        return Trip.builder()
                .name(name)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }
}
