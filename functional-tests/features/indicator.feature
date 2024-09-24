Feature: Individual indicator page
  As a user I can open individual indicator details page
  As a user of indicator project I can use the breadcrumb

  Background:
    Given I open the home page
    And I pause for 2000ms

  Scenario: User can see individual published indicator page heading and navigate home breadcrumb
    Then I open the IND63 overview page
    Then I expect that element "h1" contains the text "Pregnancy and neonates: mental health at booking appointment"
    # Then I expect that element "h2:nth-child(6)" contains the text "How to use NICE indicators and how we develop them"
    # And I pause for 2000ms
    # Then I open the IND63 indicator page
    # Then I expect that element "h2#indicator.title" contains the text "Indicator"
    # Then I expect that element "h3#rationale.title" contains the text "Rationale"
    Given I click on the home breadcrumb link
    Then I expect that the url is "http://localhost:3000/"
