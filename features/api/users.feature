@api @sanity
Feature: User API Endpoints

  @smoke @positive @critical
  Scenario: Create a new user
    Given I have the user data
    When I send a POST request to "/api/users"
    Then the response status should be 201
    And the response should contain the created user data

  @smoke @positive
  Scenario: Retrieve an existing user
    Given a user with ID "1" exists
    When I send a GET request to "/api/users/1"
    Then the response status should be 200
    And the response should contain the user data

  @regression @positive
  Scenario: Update an existing user
    Given a user with ID "1" exists
    And I have the updated user data
    When I send a PUT request to "/api/users/1"
    Then the response status should be 200
    And the response should contain the updated user data

  @regression @positive
  Scenario: Delete an existing user
    Given a user with ID "1" exists
    When I send a DELETE request to "/api/users/1"
    Then the response status should be 204
    And the user should no longer exist