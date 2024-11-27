Feature: Hub detail page
  As a member of NICE I can see the hub detail page
  As a user of Hub project I can use the breeadcrumb

  Background:
    Given I open the home page
    And I pause for 2000ms

  Scenario: User can see hub detail page headings and navigate home breadcrumb
    Then I open the HUB10001 overview page
    Then I expect that element "h1" contains the text "Women’s and reproductive health guidelines"
    And I pause for 2000ms
    Then I expect to see the hub page heading contains the text "Guidelines"
    And I pause for 2000ms
    Given I click on the home breadcrumb link
    Then I expect the url is "/"

  # Scenario: User can see hub detail page headings
  #   Then I open the HUB10002 overview page
  #   Then I expect that element "h1" contains the text "Cardiometabolic disease prevention and treatment guidelines"
  #   # Then I expect to see the hub page headings contains the text "Guidelines"
  #   # Then I expect to see another hub page heading contains the text "Cardiovascular disease"
  #   # Then I expect to see table contains the text "Updates planned and in progress"

