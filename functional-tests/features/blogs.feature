Feature: Individual Blog
  As a user I can open individual blog details page
  As a user of blog I can use the breadcrumb navigation

  Background:
    Given I open the blogs 1 page

  Scenario: User can view blog page
    Then I expect that element "h1" contains the text "NextWeb-automation-Blog-1-DONOTUSE"
    Then I expect to see blog author image does exist
    Then I expect to see blog author name contains the text "Oomi~Osh"
    Then I expect to see blog author title contains the text "NICE-DIT Snr tester"
    Then I expect the blogs tag contains the text "Blogs"

  Scenario: User can navigate Home breadcrumbs
    Given I click on the home breadcrumb link
    Then I expect the url is "/"
    Then I expect to see the section heading contains the text "Latest from NICE"

  # Scenario: User can navigate News breadcrumbs
  #   Given I click on the news breadcrumb link
  #   And I pause for 2000ms
  #   Then I expect the url is "/news"
  #   Then I expect that element "h1" contains the text "News, blogs and podcasts"
  #   And I open the home page
  #   Given I open the blogs 1 page

  # Scenario: User can navigate Blogs breadcrumbs
  #   Given I click on the blogs breadcrumb link
  #   Then I expect the url is "news/blogs"
  #   And I pause for 2000ms
  #   Then I expect that element "h1" contains the text "Blogs"
