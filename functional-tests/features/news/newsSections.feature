Feature: News section
  As a user of News, Blogs and podcasts page
  As a user I can see the Latest article section, Latest in-depth section
  As a user I can see the Latest blogs section, Latest podcasts section

  Background:
    Given I open the news, blogs and podcasts page

# Scenario: User can view Latest articles sections
#     And I pause for 2000ms
#     # And I expect that element "//*[@id="__next"]/div/main/div[1]/section[1]/div/h2" contains the text "Latest articles"
#     When I click on the link "#__next > div > main > div.container > section:nth-child(3) > div > p > a"
#     Then I expect the url to contain "http://localhost:4000/news/articles"
#     And I expect that element "h1.page-header__heading" contains the text "News articles"

  # Scenario: User can view Latest in-depth sections
  #   And I pause for 2000ms
  #   And I expect that element "#__next > div > main > div.container > section:nth-child(4) > div > h2" contains the text "Latest in-depth"
  #   When I click on the link "#__next > div > main > div.container > section:nth-child(4) > div > p > a"
  #   Then I expect the url to contain "http://localhost:4000/news/in-depth"
  #   And I expect that element "h1.page-header__heading" contains the text "In-depth"
  #   And I expect that element ".page-header__lead" contains the text "Our in-depth articles explore how our work is making a real difference to people's lives."
  #   Then I expect that element ".page-header__description" contains the text "Through this featured content, you'll learn how our guidance and advice is supporting effective decision making, for the benefit of individuals and society as a whole."

  # Scenario: User can view Latest blogs sections
  #   And I pause for 2000ms
  #   And I expect that element "#__next > div > main > div.container > section:nth-child(5) > div > h2" contains the text "Latest blogs"
  #   When I click on the link "#__next > div > main > div.container > section:nth-child(5) > div > p > a"
  #   Then I expect the url to contain "http://localhost:4000/news/blogs"
  #   And I expect that element "h1.page-header__heading" contains the text "Blogs"

  # Scenario: User can view Latest podcasts sections
  #   And I pause for 2000ms
  #   And I expect that element "#__next > div > main > div.container > section:nth-child(6) > div > h2" contains the text "Latest podcasts"
  #   When I click on the link "#__next > div > main > div.container > section:nth-child(6) > div > p > a"
  #   Then I expect the url to contain "http://localhost:4000/news/podcasts"
  #   And I expect that element "h1.page-header__heading" contains the text "Podcasts"
  #   And I expect that element ".page-header__lead" contains the text "Our NICE talks podcasts bring you the real life experiences of people working within the NHS, public health and social care."
