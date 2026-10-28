package com.midespensa;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class InfrastructureTest {
    @Autowired TestRestTemplate http;
    @Autowired JdbcTemplate jdbc;

    @Test
    void healthRespondsWithoutSensitiveInformation() {
        var response = http.getForEntity("/api/health", java.util.Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(java.util.Map.of("status", "UP"));
    }

    @Test
    void migrationHasRunOnPostgres() {
        assertThat(jdbc.queryForObject(
                "SELECT count(*) FROM flyway_schema_history WHERE version = '1' AND success",
                Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT version()", String.class)).startsWith("PostgreSQL");
    }

    @Test
    void corsAllowsOnlyConfiguredOrigin() {
        var allowed = requestFrom("http://localhost:5173");
        assertThat(allowed.getHeaders().getAccessControlAllowOrigin()).isEqualTo("http://localhost:5173");
        var rejected = requestFrom("https://example.org");
        assertThat(rejected.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(rejected.getHeaders().getAccessControlAllowOrigin()).isNull();
    }

    private ResponseEntity<String> requestFrom(String origin) {
        var headers = new HttpHeaders();
        headers.setOrigin(origin);
        return http.exchange("/api/health", HttpMethod.GET, new HttpEntity<>(headers), String.class);
    }
}
