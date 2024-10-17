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
    Then I expect that element "h2:nth-child(3)" contains the text "Guidelines"
    And I pause for 2000ms
    Given I click on the home breadcrumb link
    Then I expect that the url is "http://localhost:3000/"

  Scenario: User can see hub detail page headings
    Then I open the HUB10002 overview page
    Then I expect that element "h1" contains the text "Cardiometabolic disease prevention and treatment guidelines"
    Then I expect that element "h2:nth-child(2)" contains the text "Guidelines"
    Then I expect that element "h3:nth-child(3)" contains the text "Cardiovascular disease"
    Then I expect that element "td:nth-child(2)" contains the text "Updates planned and in progress"

