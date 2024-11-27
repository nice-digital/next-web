Feature: Home page
  As a user of NICE home page

  Background:
    Given I open the home page

  Scenario: User can view home page and navigate to new page
    Then I expect to see the section heading contains the text "Latest from NICE"
    Then I expect to see the section heading link contains the text "Implementation and planning"
    Then I expect to see another section heading link contains the text "More ways we support you"
    # When I can click on the Sign in link
    # And I pause for 2000ms
    # And I open the home page
    # When I click on the home news link
    # Then I expect that element "h1" contains the text "News, blogs and podcasts"
