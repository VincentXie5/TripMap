package com.keepGoing.tripMap.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for trip creation and update requests
 */
@Data
public class TripRequest {
    @NotBlank(message = "Trip name is required")
    private String name;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private List<MarkerRequest> markers;
}
