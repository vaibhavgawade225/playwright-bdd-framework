@ui
Feature: Products Inventory and Shopping Cart Management - UI
  As an authenticated user
  I want to browse products, sort them, and manage items in my shopping cart
  So that I can select items for purchase

  Background:
    Given user opens the login page
    And user logs in as "standard_user"

  @smoke @regression @cart
  Scenario: User can add and remove items from cart and check badge count
    When user adds "Sauce Labs Backpack" to the cart
    And user adds "Sauce Labs Bike Light" to the cart
    Then the cart badge count should be "2"
    When user removes product "Sauce Labs Bike Light" from the cart
    Then the cart badge count should be "1"

  @regression @inventory
  Scenario Outline: User can sort products by price
    When user sorts products by "<sortOption>"
    Then products should be ordered by price "<order>"

    Examples:
      | sortOption | order      |
      | lohi       | ascending  |
      | hilo       | descending |

  @regression @inventory
  Scenario Outline: User can sort products alphabetically
    When user sorts products by "<sortOption>"
    Then products should be ordered by name "<order>"

    Examples:
      | sortOption | order      |
      | az         | ascending  |
      | za         | descending |

  @regression @inventory
  Scenario: User can navigate to product details page and add item to cart
    When user clicks on product "Sauce Labs Backpack"
    Then product detail page should display name "Sauce Labs Backpack" and price "$29.99"
    When user adds product to cart from details page
    Then the cart badge count should be "1"

  @regression @inventory
  Scenario: User can navigate back to products from detail page
    When user clicks on product "Sauce Labs Backpack"
    And user clicks back to products
    Then the products page should be visible

  @regression @cart
  Scenario: User can add all available products to cart
    When user adds all available products to cart
    Then the cart badge count should be "6"

  @regression @cart
  Scenario: User can navigate back to inventory page from cart using Continue Shopping
    When user adds "Sauce Labs Backpack" to the cart
    And user navigates to the shopping cart
    And user clicks continue shopping on cart page
    Then the products page should be visible
