Feature: Published indicators list page
  As a user I can use the indicators list page tabs

  Background:
    Given I open the home page

  Scenario: User can see published indicators page heading
    Given I open the published indicators list page
    Then I expect that element "h1" contains the text "Published: Indicators"

  Scenario: User can see in consultation indicators page heading
    Given I open the in consultation indicators list page
    Then I expect that element "h1" contains the text "In consultation: Indicators"

  Scenario: User can see in development indicators page heading
    Given I open the in development indicators list page
    Then I expect that element "h1" contains the text "In development: Indicators"

