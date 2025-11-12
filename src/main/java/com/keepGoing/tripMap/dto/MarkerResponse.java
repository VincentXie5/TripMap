package com.keepGoing.tripMap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for marker response data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkerResponse {
    private Long id;
    private String name;
    private String description;
    private String time;
    private Double latitude;
    private Double longitude;
    private Integer day;
}