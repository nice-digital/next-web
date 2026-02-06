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
    And I expect the jotform Id to exist
    # Given the element "#label_6" matches the text "Email address"
    # Given the element "#input_4" matches the text "Subscribe"

  Scenario: User can navigate to Website feedback page
    Given I open the website feedback page
    Then I expect that element "h1" contains the text "Website-feedback-automation-jotform-1-donotuse"
    # Given the element "#label_4" matches the text "Email"
    # Given the element "#input_5" matches the text "Submit"
    # Then(/^I expect the jotform field contains the text "([^"]*)"$/
