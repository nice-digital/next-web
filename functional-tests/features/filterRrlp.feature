Feature: The list of published recommendation for research page is reduced when user filter by name
	As a user of published recommendation for research list page
  As a user I filter using keywords, reference number

	Background:
    Given I open the home page

  Scenario: User can apply reference number filter published recommendation for research list page
    Given I open the recommendation for research list page
    And I enter keyword or reference number "NG289-3" to filter page list
    And I pause for 2000ms
    # Then I expect the result list count contains "Showing 1 to 1 of 1"

  Scenario: User can apply keyword filter published guidance list page
    Given I open the recommendation for research list page
    And I enter keyword or reference number "CG276-3" to filter page list
    And I pause for 5000ms
/

  # Scenario: User can apply date filter
  #   Given I open the recommendation for research list page
  #   And I enter From date "01/01/2024" to filter page list
  #   And I pause for 2000ms
  #   # Then I expect the result list count contains "Showing 1 to 10 of 138"
