@ui
Feature: Application Navigation and Footer Links - UI
  As an authenticated user
  I want to see footer links and navigation options
  So that I can navigate external resources and sections

  Background:
    Given user opens the login page
    And user logs in as "standard_user"

  @regression @navigation
  Scenario Outline: Footer contains visible social media links for "<platform>"
    Then the footer should contain visible "<platform>" social link

    Examples:
      | platform |
      | twitter  |
      | facebook |
      | linkedin |
