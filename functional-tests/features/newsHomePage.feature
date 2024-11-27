Feature: Home page
  As a user of News, Blogs and podcasts page
  As a user I can see the Latest article section

  Background:
    Given I open the news, blogs and podcasts page

  Scenario: User can view news, blogs and podcasts page
    And I pause for 2000ms
    Then I expect that element "h1" contains the text "News, blogs and podcasts"
    Given I click on the home breadcrumb link
    Then I expect the url is "/"

  Scenario: User can view headings and newsletter alerts banner
    Then I expect to see the page heading contains the text "Latest articles"
    # And I expect the news articles tag contains the text "News"
    # When I click on the news article tab
    # Then I expect the url is "/news/articles"
    # And I click the sign up for newsletter and alerts button
    # Then I expect that element "h1" contains the text "NICE newsletters and alerts"
