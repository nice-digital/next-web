Feature: Status page
  As a member of NICE I can see the status page

  Background:
    Given I open the status page

  Scenario: User can see status page heading
    Then I expect that element "h1" contains the text "OK"
