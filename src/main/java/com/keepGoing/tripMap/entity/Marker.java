package com.keepGoing.tripMap.entity;

import lombok.*;

import jakarta.persistence.*;

/**
 * Marker entity representing a location point in a trip
 */
@Entity
@Table(name = "markers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String time;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Integer day;

    // Many-to-one relationship with trip
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // Static factory method for creating markers
    public static Marker create(String name, String description, String time,
                                Double latitude, Double longitude, Integer day) {
        return Marker.builder()
                .name(name)
                .description(description)
                .time(time)
                .latitude(latitude)
                .longitude(longitude)
                .day(day)
                .build();
    }
}