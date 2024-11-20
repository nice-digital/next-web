Feature: News tabs
  As a user of News, Blogs and podcasts page

  Background:
    Given I open the home page

  Scenario: User can view news article tab
    Given I open the news, blogs and podcasts page
    When I click on the element ".horizontal-nav__item:nth-of-type(2)"
    Then I expect that element ".tag" contains the text "News"
    And I expect that element ".simple-pagination" contains the text "Page 1 of 33"

  Scenario: User can view In-depth tab
    And I pause for 2000ms
    Given I open the news, blogs and podcasts page
    When I click on the element ".horizontal-nav__item:nth-of-type(3)"
    Then I expect that element ".horizontal-nav__item:nth-of-type(3)" contains the text "In-depth"
    And I expect that element ".simple-pagination" contains the text "Page 1 of 5"

  Scenario: User can view blogs tab
    And I pause for 2000ms
    Given I open the news, blogs and podcasts page
    When I click on the element ".horizontal-nav__item:nth-of-type(4)"
    Then I expect that element ".horizontal-nav__item:nth-of-type(4)" contains the text "Blogs"
    And I expect that element ".simple-pagination" contains the text "Page 1 of 11"

  Scenario: User can view blogs tab
    Given I open the news, blogs and podcasts page
    When I click on the element ".horizontal-nav__item:nth-of-type(5)"
    Then I expect that element ".horizontal-nav__item:nth-of-type(5)" contains the text "Podcasts"
    And I expect that element ".simple-pagination" contains the text "Page 1 of 5"
