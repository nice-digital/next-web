Feature: Users can page through the list of indicator
	As a user of indicators
	We want to be able to page through the list of indicator

	Background:
  	Given I open the home page
    # Given I have a screen that is 1400 by 900 pixels

	Scenario: User can page through the list of indicators
    Given I open the published indicators list page
		And I expect the result list count contains "Showing 1 to 10 of 125"
    Then I expect the first pagination option is "1"
    When I click the second pagination option
		# Then I expect the first pagination option is "Previous page"
		# And I click the next pagination option
		# And I click the previous pagination option
		# And I click the previous pagination option
		# Then I expect the first pagination option is "1"
