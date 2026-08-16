@ui
Feature: End to End Checkout Flow - UI
  As an authenticated customer with items in the cart
  I want to complete the checkout process
  So that my order is successfully placed

  Background:
    Given user opens the login page
    And user logs in as "standard_user"
    And user adds "Sauce Labs Backpack" to the cart
    And user navigates to the shopping cart

  @smoke @regression @e2e
  Scenario: User completes checkout process successfully
    When user proceeds to checkout
    And user fills checkout information with first name "John", last name "Doe", and postal code "12345"
    And user completes the checkout order
    Then order completion header should display "Thank you for your order!"

  @regression @e2e
  Scenario: User completes checkout process with multiple items in cart
    When user clicks continue shopping on cart page
    And user adds "Sauce Labs Bike Light" to the cart
    And user navigates to the shopping cart
    And user proceeds to checkout
    And user fills checkout information with first name "Alice", last name "Smith", and postal code "90210"
    And user completes the checkout order
    Then order completion header should display "Thank you for your order!"

  @regression @e2e
  Scenario Outline: Checkout information form validation displays missing field error
    When user proceeds to checkout
    And user fills checkout information with first name "<firstName>", last name "<lastName>", and postal code "<postalCode>"
    Then user should see checkout error message containing "<errorMessage>"

    Examples:
      | firstName | lastName | postalCode | errorMessage                   |
      |           | Doe      | 12345      | Error: First Name is required  |
      | John      |          | 12345      | Error: Last Name is required   |
      | John      | Doe      |            | Error: Postal Code is required |

  @regression @e2e
  Scenario: User cancels checkout from information entry step
    When user proceeds to checkout
    And user cancels the checkout
    Then the cart badge count should be "1"

  @regression @e2e
  Scenario: User cancels checkout from overview step
    When user proceeds to checkout
    And user fills checkout information with first name "John", last name "Doe", and postal code "12345"
    And user cancels the checkout
    Then the products page should be visible

  @regression @e2e
  Scenario: Checkout pricing summary calculates subtotal tax and total correctly
    When user proceeds to checkout
    And user fills checkout information with first name "John", last name "Doe", and postal code "12345"
    Then checkout price summary total should equal item total plus tax
