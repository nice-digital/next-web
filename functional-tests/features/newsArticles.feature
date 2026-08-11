Feature: Individual news articles
  As a user I can open individual news articles details page
  As a user of news articles I can use the breadcrumb navigation


  Background:
    Given I open the news articles page
    And I pause for 2000ms

  Scenario: User can view news article page
    Then I expect that element "h1" contains the text "NextWeb-automation-News-1-DONOTUSE"
    Then I expect that element "h2.h5" contains the text "Associated guidance and resources"
    Then I expect to see related news stories contains the text "Related news stories"
    Then I expect the news articles tag contains the text "News"

  Scenario: User can navigate home breadcrumbs
    Given I click on the home breadcrumb link
    Then I expect the url is "/"
    Then I expect to see the section heading contains the text "Latest from NICE"
