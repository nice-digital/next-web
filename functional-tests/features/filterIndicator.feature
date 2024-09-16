Feature: The list of indicators is reduced when user filter by name
	As a user of indicators list page
  As a user I filter using keywords, reference number
	We want to be able to filter the indicators list by title and sorting

  Background:
    Given I open the home page
    And I pause for 2000ms

  Scenario: User can apply reference number filter published indicators list page
    Given I open the published indicators list page
    # And I enter keyword or reference number or date "IND65" to filter page list
    And I enter keyword or reference number "IND65" to filter page list
    Then I expect the result list count contains "Showing 1 to 1 of 1"

  Scenario: User can apply keyword filter in development indicators list page
    Given I open the in development indicators list page
    And I enter keyword or reference number "pulse" to filter page list
    Then I expect the result list count contains "Showing 1 to 1 of 1"

  Scenario: User can apply keyword filter in consultation indicators list page
    Given I open the in consultation indicators list page
    And I enter keyword or reference number "test" to filter page list
    Then I expect that element "#results:nth-child(2)" contains the text "No results found"

  Scenario: User can apply date filter
    Given I open the published indicators list page
    And I enter From date "01/01/2024" to filter page list
    And I pause for 2000ms
    Then I expect the result list count contains "Showing 1 to 8 of 8"
