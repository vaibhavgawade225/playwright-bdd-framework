@ui @api
Feature: Combined UI + API Verification
  As a QA engineer
  I want to verify data fetched/seeded via API before UI workflow execution
  So that both backend and frontend layers are validated together in a single scenario

  @regression @e2e
  Scenario: Seed test data via API before performing UI login and product selection
    When I send a GET request to "/users/1"
    Then the response status should be 200
    And I store the response field "email" as "fetchedUserEmail"

    Given user opens the login page
    And user logs in as "standard_user"
    Then the products page should be visible
    When user adds "Sauce Labs Backpack" to the cart
    Then the cart badge count should be "1"
