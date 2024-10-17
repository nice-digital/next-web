Feature: Individual jotforms page
  As a user I can use subscribe to NICE news

  Background:
    Given I open the home page
    And I pause for 2000ms

  Scenario: User can navigate to Nice newsletters and alerts page
    Given I open the nice newsletters and alerts page
    Then I expect that element "h1" contains the text "NICE newsletters and alerts"

