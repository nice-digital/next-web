Feature: News tabs
  As a user of News, Blogs and podcasts page
  We want to see the tabs

  Background:
    Given I open the news, blogs and podcasts page
    And I pause for 2000ms

  Scenario: User can view news article tab
    When I click on the news article tab
    Then I expect the news articles tag contains the text "News"
    And I expect the pagination shows the text "Page 1 of 33"

  Scenario: User can view In-depth tab
    When I click on the in depth tab
    Then I expect the in Depth tag contains the text "In-depth"
    And I expect the pagination shows the text "Page 1 of 5"

  Scenario: User can view blogs tab
    When I click on the blogs tab
    Then I expect the blogs tag contains the text "Blogs"
    And I expect the pagination shows the text "Page 1 of 11"

  Scenario: User can view podcasts tab
    When I click on the podcasts tab
    Then I expect the podcasts tag contains the text "Podcasts"
    And I expect the pagination shows the text "Page 1 of 5"
