@web @sanity @critical
Feature: Login Functionality

  @smoke @positive
  Scenario Outline: Successful login with valid credentials
    Given I am on the login page
    When I enter "<username>" as username
    And I enter "<password>" as password
    And I click on the login button
    Then I should be redirected to the dashboard

    Examples:
      | username | password |
      | ENV_USER | ENV_PASS |

  @regression @negative
  Scenario: Unsuccessful login with invalid credentials
    Given I am on the login page
    When I enter "invalid@example.com" as username
    And I enter "wrongpassword" as password
    And I click on the login button
    Then I should see an error message "Invalid credentials"