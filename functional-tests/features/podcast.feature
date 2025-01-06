Feature: Individual podcast
  As a user I can open individual podcast details page
  As a user of blog I can use the breadcrumb navigation

  Background:
    Given I open the home page

  Scenario: User can view podcast page
    Given I open the podcasts page
    Then I expect that element "h1" contains the text "NextWeb-automation-Podcasts-1-DONOTUSE"
    Then I expect the blogs tag contains the text "Podcasts"
    Then I expect to see the heading contains the text "About this episode"
    Given I click on the home breadcrumb link
    Then I expect the url is "/"
    Then I expect to see the section heading contains the text "Latest from NICE"
