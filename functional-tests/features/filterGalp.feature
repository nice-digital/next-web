Feature: The list of guidance list page is reduced when user filter by name
	As a user of guidance list page
  As a user I filter using keywords, reference number
	We want to be able to filter the Indicators list by title and sorting

	Background:
    Given I open the home page

  Scenario: User can apply reference number filter published guidance list page
    Given I open the published guidance list page
    And I enter keyword or reference number "TA100" to filter page list
    And I pause for 2000ms
    Then I expect the result list count contains "Showing 1 to 1 of 1"

  Scenario: User can apply keyword filter published guidance list page
    Given I open the published guidance list page
    And I enter keyword or reference number "syndrome" to filter page list
    Then I expect the result list count contains "Showing 1 to 10 of 42"

  Scenario: User can apply keyword filter topic selection list page
    Given I open the topic selection list page
    And I enter keyword or reference number "test" to filter page list
    Then I expect the result list count contains "Showing 1 to 6 of 6"

  Scenario: User can apply keyword filter in consultation guidance list page
    Given I open the in consultation guidance list page
    And I enter keyword or reference number "test" to filter page list
    Then I expect that element "#results:nth-child(2)" contains the text "No results found"

  Scenario: User can apply date filter
    Given I open the published guidance list page
    And I enter From date "01/01/2024" to filter page list
    And I pause for 2000ms
    Then I expect the result list count contains "Showing 1 to 10 of 120"
    Given I open the topic selection list page
    And I enter From date "02/02/2024" to filter page list
    Then I expect the result list count contains "Showing 1 to 10 of 23"
