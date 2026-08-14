@ui
Feature: User Authentication - UI
  As a user of SauceDemo
  I want to log into the application
  So that I can access products and manage my shopping cart

  @smoke @regression @login
  Scenario Outline: User logs in successfully with valid role "<role>"
    Given user opens the login page
    When user logs in as "<role>"
    Then the products page should be visible

    Examples:
      | role                    |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |

  @regression @login
  Scenario: Locked out user sees an error message
    Given user opens the login page
    When user logs in as "locked_out_user"
    Then user should see login error message containing "Epic sadface: Sorry, this user has been locked out."

  @regression @login
  Scenario Outline: Invalid login attempts display error message
    Given user opens the login page
    When user enters username "<username>" and password "<password>"
    Then user should see login error message containing "<errorMessage>"

    Examples:
      | username      | password     | errorMessage                                                             |
      | invalid_user  | wrong_pass   | Epic sadface: Username and password do not match any user in this service |
      |               | secret_sauce | Epic sadface: Username is required                                       |
      | standard_user |              | Epic sadface: Password is required                                       |

  @regression @login
  Scenario: User logs out successfully via side menu navigation
    Given user opens the login page
    When user logs in as "standard_user"
    And user opens side menu and clicks logout
    Then user should be redirected to the login page

  @regression @login
  Scenario: User resets app state to clear items in cart from side menu
    Given user opens the login page
    When user logs in as "standard_user"
    And user adds "Sauce Labs Backpack" to the cart
    Then the cart badge count should be "1"
    When user opens side menu and clicks reset app state
    Then the cart badge count should be "0"
