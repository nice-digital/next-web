Feature: Published indicators list page
  As a user I can use the published indicators list page

  Background:
    Given I open the published indicators list page

  Scenario: User can see indicators page heading
    Then I expect that element "h1" contains the text "Indicators"
