Feature: Published recommendations for research list page
  As a user I can use the published recommendation for research list page

  Background:
    Given I open the recommendation for research list page

  Scenario: User can see recommendation for research page heading
    Then I expect that element "h1" contains the text "Published: Recommendations for research"
