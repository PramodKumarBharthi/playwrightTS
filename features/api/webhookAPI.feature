Feature: Webhook API

  @api
  Scenario: Create a new webhook using POST
    Given the API is up and running
    When I send a POST request to the hooks endpoint
    Then the response status code should be 200

  @api
  Scenario: Retrieve a webhook using GET
    Given the API is up and running
    When I send a GET request to the hooks endpoint
    Then the response status code should be 200

  @api
  Scenario: Update a webhook using PUT
    Given the API is up and running
    When I send a PUT request to the projects endpoint
    Then the response status code should be 200

  @api
  Scenario: Delete a webhook using DELETE
    Given the API is up and running
    When I send a DELETE request to the hook
    Then the response status code should be 200

  @api
  Scenario: Retrieve and then delete a webhook
    Given the API is up and running
    When I send a GET request to the hooks endpoint
    Then the response status code should be 200
    When I send a DELETE request to the hook
    Then the response status code should be 200

