Feature: Published guidance, QS and advice list page
  As a user of guidance I can use the list of published guidance, QS and advice

  Background:
    Given I open the published guidance list page
    And I have a screen that is 1366 by 768 pixels

  Scenario: User can see the site title
    Then I expect that element "h1" contains the text "quality"
