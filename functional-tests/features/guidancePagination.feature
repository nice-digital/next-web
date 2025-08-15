Feature: Users can page through the list of published guidance page
	As a user of published guidance list page
	We want to be able to page through the list of published guidance page

	Background:
  	Given I open the home page
    # Given I have a screen that is 1400 by 900 pixels

	Scenario: User can page through the list of published guidance page
    Given I open the published guidance list page
    When I scroll to pagination element
    Then I expect the first pagination option is "1"
    When I click the second pagination option
    When I scroll to pagination element
		Then I expect the first pagination option is "Previous page"
    And I click the previous page option
    Then I expect the first pagination option is "1"
