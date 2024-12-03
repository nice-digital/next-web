Feature: Individual blog
  As a user I can open individual blog details page
  As a user of blog I can use the breadcrumb navigation

  Background:
    Given I open the home page

  Scenario: User can view blog page
    Given I open the blogs page
    Then I expect that element "h1" contains the text "NextWeb-automation-Blog-1-DONOTUSE"
    Then I expect to see blog author image does exist
    Then I expect to see blog author name contains the text "Oomi~Osh"
    Then I expect to see blog author title contains the text "NICE-DIT Snr tester"
    Then I expect the blogs tag contains the text "Blogs"

  Scenario: User can navigate Home breadcrumbs
    Given I open the blogs page
    Given I click on the home breadcrumb link
    Then I expect the url is "/"
    Then I expect to see the section heading contains the text "Latest from NICE"
