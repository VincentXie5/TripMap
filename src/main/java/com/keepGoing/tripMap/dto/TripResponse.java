package com.keepGoing.tripMap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for trip response data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate createdAt;
    private List<MarkerResponse> markers;
}
