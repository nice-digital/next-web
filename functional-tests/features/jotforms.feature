Feature: Individual jotforms page
  As a user I can use subscribe to update for Primary Care form
  As a user I can use Webiste feedback form

  Background:
    Given I open the home page
    And I pause for 2000ms

  Scenario: User can navigate to Subscribe to update for Primary Care page
    Given I open the subscribe to update for Primary Care page
    Then I expect that element "h1" contains the text "Subscribe to update for Primary Care"
    And I pause for 2000ms
    And I expect subscribe to update for primary care jotform Id to exist
    Given I enter name details in the jotform field

  Scenario: User can navigate to Website feedback page
    Given I open the website feedback page
    Then I expect that element "h1" contains the text "Website-feedback-automation-jotform-1-donotuse"
    And I expect website feedback page jotform Id to exist
    Given I enter email address details in the jotform field

