# Category landing page

## Card grid

- Can take testimonial or cards as children.

### Initial content model

- columns 1|2|3 - 2 by default
- cards - takes card bloks
- will be accepted child on fullwidth

## Card list

- wrapper for existing NDS card list component

### initial content model

- listItems (could be card, up for discussion)

## Card

Extend the current card model to accept all card variants.

Should the card be able to link other stories within Storyblok?  
If so, how would we handle non SB story content fields for card content.
If so, how do we bring in the related content with a restricted set of properties from that story

### Initial content model

card content || story
story

- related resources [newsArticle, infoPage, blogPost, podcast, categoryLanding, categoryNav]
card content
- heading
- body
- link
- image? - will be conditional on variant choice

- variant ['default', callout]

## Fullwidth section

Still in design, we can run with a basic model and template to get started while waiting

### initial content model

- verticalPadding
- themeColour
- children/content [cardGrid,cardList,actionBanner,PromoBox,]
- heading?
- hideHeading?
- leadtext?

## ButtonLink

should accept all variants, work already started in Storyblok Alpha,
Needs implementing in code. Might have a branch on local (Dale)

### additional props on content model

- variant

## Testimonials

Still in design
We need to consider change in bioImage based on the testimonial component width
e.g. <https://www.figma.com/design/mR8DYAcH9ziKc6KJp1Ffu9/Category-landing-template?node-id=427-47&node-type=rounded_rectangle&m=dev>

### initial content model

- quote
- bioName
- bioJobRole
- bioImage

## PromoBox

Already exists as a blok on homepage,
We need to add this to fullwidth section
The might be updates after design is completed
