Feature: Individual indicator page
  As a user I can open individual published, in development indicator details page

  Background:
    Given I open the home page
    And I pause for 10000ms

  Scenario: User can see published indicators page heading
    Given I open the published indicators list page
    Then I open the IND63 overview page
    Then I expect that element "h1" contains the text "Pregnancy and neonates: mental health at booking appointment"
