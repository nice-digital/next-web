Feature: Individual indicator page
  As a user I can use subscribe-to-nice-news-for-health-and-social-care page

  Background:
    Given I open the nice newsletters and alerts page
    And I pause for 2000ms

  Scenario: User can navigate to Nice newsletters and alerts page
    Then I expect that element "h1" contains the text "NICE newsletters and alerts"
    And I click on the breadcrumb Newsletters and alerts


  Scenario: User can subscribe to NICE news for health and social care
    When I pause for 2000ms
    Given I open the subscribe to NICE news for health and social care page
    Then I expect that element "h1" contains the text "Subscribe to NICE news for health and social care"
    # When I add details to subscribe to newsletters
    # Then I expect that element "h1" contains the text "Thank You!"
    # And I click on the breadcrumb Home
