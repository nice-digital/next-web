Feature: Individual indicator page
  As a user I can open individual indicator details page
  As a user of indicator project I can use the breadcrumb

  Background:
    Given I open the IND63 overview page

  Scenario: User can see individual published indicator page heading and navigate home breadcrumb
    Then I expect that element "h1" contains the text "Pregnancy and neonates: mental health at booking appointment"
    Then I expect to see the indicator page heading contains the text "How to use NICE indicators and how we develop them"
    And I pause for 2000ms
    Given I open the IND63 indicator page
    Then I expect to see the first horizontal nav item contains the text "Indicator"
    Then I expect to see the second horizontal nav item contains the text "History"
    Given I click on the home breadcrumb link
    Then I expect the url is "http://localhost:3000/"
