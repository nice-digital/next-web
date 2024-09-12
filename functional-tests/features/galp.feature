Feature: Published guidance list page
  As a user I can use the published guidance list page and in consultation guidance list page
  As a user I can use the in development guidance list page and awaiting development guidance list page
  As a user I can use the topic selection list page

  Background:
    Given I open the home page

  Scenario: User can see guidance page heading
    Given I open the published guidance list page
    Then I expect that element "h1" contains the text "Published: Guidance, quality standards and advice"

  Scenario: User can see in consultation guidance page heading
    Given I open the in consultation guidance list page
    Then I expect that element "h1" contains the text "In consultation: Guidance and quality standards"

  Scenario: User can see in development guidance page heading
    Given I open the in development guidance list page
    Then I expect that element "h1" contains the text "In development: Guidance, quality standards and advice"

  Scenario: User can see awaiting development guidance page heading
    Given I open the awaiting development guidance list page
    Then I expect that element "h1" contains the text "Awaiting development: Guidance and quality standards"

  Scenario: User can see topic selection page heading
    Given I open the topic selection list page
    Then I expect that element "h1" contains the text "Guidance in topic selection"
