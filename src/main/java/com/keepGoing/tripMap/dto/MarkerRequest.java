package com.keepGoing.tripMap.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for marker creation and update requests
 */
@Data
public class MarkerRequest {
    @NotBlank(message = "Location name is required")
    private String name;

    private String description;

    private String time;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Day number is required")
    private Integer day;
}