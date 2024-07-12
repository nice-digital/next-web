Feature: Individual indicator page
  As a user I can use an individual indicator details page

  Background:
    Given I open the IND63 overview page
    And I pause for 10000ms

  Scenario: User can see indicators page heading
    Then I expect that element "h1" contains the text "Pregnancy and neonates: mental health at booking appointment"
