Feature: Home page
  As a user of NICE home page
  As a user I can see the home page and sections
  As a user I can navigate to the guidance page

  Background:
    Given I open the home page

  Scenario: User can view home page
    And I pause for 2000ms
    Then I expect that element ".hero__title" contains any text

  Scenario: User click guidance button and view guidance page
    And I pause for 2000ms
    Then I expect that element ".btn" does exist
    When I click on the element ".btn"
    Then I expect that the url is "https://test.nice.org.uk/guidance"
    Then I expect that element ".hero__title" contains the text "NICE guidance"

  Scenario: User can view home page sections
    And I pause for 10000ms
    Then I expect that element ".HomepageLatestNews_title__w_1ni" contains the text "Latest from NICE"
    Then I expect that element ".sbRichtextHeading2:nth-of-type(1)" contains the text "Implementation and planning"
    Then I expect that element ".sbRichtextHeading2:nth-of-type(2)" contains the text "More ways we support you"
    Then I expect that element ".PromoBox_heading__VV7OC:nth-of-type(1)" contains the text "How NICE makes decisions"
    # Then I expect that element "h2" contains the text "You could help us develop our guidance"

  Scenario: User can click to view all news, blogs and podcasts
    And I pause for 2000ms
    When I click on the element "a[href='/news']"
    And I pause for 2000ms
    Then I expect the url to contain "http://localhost:4000/news"
    Then I expect that element "h1.page-header__heading " contains the text "News, blogs and podcasts"
    Then I click on the element "a[href='/']"
    Then I expect the url to contain "http://localhost:4000"


# guidance
#    -status.feature   *DONE
# guidanceListPage
#    -guidanceListPage.feature
#    -filterSortIndicatorListPage.feature
# home
#    -homePage.feature   *DONE
# hub
#    -hubPage
# indicators.feature
#    -indicators.feature   *DONE
#    -published-list.feature  *DONE
#    -filterSortIndicatorListPage.feature
# jotforms
#    -jotforms.feature  *ALMOST DONE
# news
#    - blogs.feature
#    - header.feature
#    - inDepth.feature
#    - newsArticle.feature      *ALMOST DONE - fix
#    - newsBlogsPodcastPage.feature     *DONE
#    - newsSections.feature    -fix
#    - podcasts.feature
