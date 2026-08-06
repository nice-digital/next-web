Feature: Hub detail page
  As a member of NICE I can see the hub detail page
  As a user of Hub project I can use the breeadcrumb

  Background:
    Given I open the home page

  Scenario: User can see hub detail page headings and navigate home breadcrumb
    Then I open the HUB10001 overview page
    Then I expect that element "h1" contains the text "Women’s and reproductive health guidelines"
    Then I expect to see the hub page heading contains the text "Guidelines"
    Given I click on the home breadcrumb link
    Then I expect the url is "/"
    Then I open the HUB10002 overview page
    Then I expect that element "h1" contains the text "Cardiometabolic disease prevention and treatment guidelines"
    # Then I see table contains the text "Updates planned and in progress"

