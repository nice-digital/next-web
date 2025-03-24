Feature: Individual jotforms page
  As a user I can use subscribe to NICE news

  Background:
    Given I open the home page
    And I pause for 2000ms

  Scenario: User can navigate to Nice newsletters and alerts page
    Given I open the subscribe to NICE news for health and social care page
    Then I expect that element "h1" contains the text "Subscribe to NICE news for health and social care"

  Scenario: User can navigate to Nice newsletters and alerts page
    Given I open the leave feedback page
    Then I expect that element "h1" contains the text "Website feedback form"
