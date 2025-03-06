// This file was generated by the storyblok CLI.
// DO NOT MODIFY THIS FILE BY HAND.
import type { ISbStoryData } from "storyblok";
export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

export interface AccordionStoryblok {
  title: string;
  displayTitleAsHeading?: boolean;
  headingLevel?: string;
  content: RichtextStoryblok;
  variant: "subtle" | "callout";
  component: "accordion";
  _uid: string;
  [k: string]: any;
}

export interface AccordionGroupStoryblok {
  accordions: AccordionStoryblok[];
  component: "accordionGroup";
  _uid: string;
  [k: string]: any;
}

export interface AssetStoryblok {
  alt: string | null;
  copyright?: string | null;
  fieldtype: "asset";
  id: number;
  filename: string | null;
  name: string;
  title: string | null;
  focus: string | null;
  meta_data?: {
    [k: string]: any;
  };
  source?: string | null;
  is_external_url?: boolean;
  is_private?: boolean;
  src?: string;
  updated_at?: string;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: number | null;
  public_id?: string | null;
  content_type?: string;
  [k: string]: any;
}

export interface ActionBannerStoryblok {
  heading: string;
  body?: RichtextStoryblok;
  cta: ButtonLinkStoryblok[];
  image: AssetStoryblok;
  variant?: "fullWidth" | "fullWidthSubtle";
  component: "actionBanner";
  _uid: string;
  [k: string]: any;
}

export interface ActionBannerDefaultStoryblok {
  heading: string;
  body?: RichtextStoryblok;
  cta: ButtonLinkStoryblok[];
  variant?: "default" | "subtle";
  component: "actionBannerDefault";
  _uid: string;
  [k: string]: any;
}

export interface AuthorStoryblok {
  name: string;
  jobTitle?: string;
  image?: AssetStoryblok;
  component: "author";
  _uid: string;
  [k: string]: any;
}

export interface BlogPostStoryblok {
  title: string;
  image: AssetStoryblok;
  date: string;
  introText: string;
  content: RichtextStoryblok;
  author: (ISbStoryData<AuthorStoryblok> | string)[];
  metadata?: MetadataStoryblok[];
  excludeFromHomepage?: boolean;
  component: "blogPost";
  _uid: string;
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      anchor?: string;
      rel?: string;
      title?: string;
      prep?: string;
      linktype: "story";
      story?: {
        name: string;
        created_at?: string;
        published_at?: string;
        id: number;
        uuid: string;
        content?: {
          [k: string]: any;
        };
        slug: string;
        full_slug: string;
        sort_by_date?: null | string;
        position?: number;
        tag_list?: string[];
        is_startpage?: boolean;
        parent_id?: null | number;
        meta_data?: null | {
          [k: string]: any;
        };
        group_id?: string;
        first_published_at?: string;
        release_id?: null | number;
        lang?: string;
        path?: null | string;
        alternates?: any[];
        default_full_slug?: null | string;
        translated_slugs?: null | any[];
        [k: string]: any;
      };
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      linktype: "url";
      rel?: string;
      title?: string;
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      email?: string;
      linktype: "email";
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      linktype: "asset";
      [k: string]: any;
    };

export interface ButtonLinkStoryblok {
  text: string;
  link: MultilinkStoryblok;
  variant: "" | "cta" | "primary" | "secondary" | "inverse";
  component: "buttonLink";
  _uid: string;
  [k: string]: any;
}

export interface CalloutCardStoryblok {
  heading: string;
  body: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  component: "calloutCard";
  _uid: string;
  [k: string]: any;
}

export interface CalloutCardWithImageStoryblok {
  heading: string;
  body: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image: AssetStoryblok;
  component: "calloutCardWithImage";
  _uid: string;
  [k: string]: any;
}

export interface CardStoryblok {
  heading: string;
  body: string;
  link?: MultilinkStoryblok;
  component: "card";
  _uid: string;
  [k: string]: any;
}

export interface CardContentStoryblok {
  title?: string;
  body?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image?: AssetStoryblok;
  component: "cardContent";
  _uid: string;
  [k: string]: any;
}

export interface CardGridStoryblok {
  cards: CardStoryblok[];
  component: "cardGrid";
  _uid: string;
  [k: string]: any;
}

export interface CardGridRowBasicStoryblok {
  columns?: "" | "2" | "3";
  gridItems: CardStoryblok[];
  component: "cardGridRowBasic";
  _uid: string;
  [k: string]: any;
}

export interface CardGridRowCalloutStoryblok {
  columns?: "" | "2" | "3";
  gridItems: CalloutCardStoryblok[];
  component: "cardGridRowCallout";
  _uid: string;
  [k: string]: any;
}

export interface CardGridRowCalloutWithImageStoryblok {
  columns?: "" | "2" | "3";
  gridItems: CalloutCardWithImageStoryblok[];
  component: "cardGridRowCalloutWithImage";
  _uid: string;
  [k: string]: any;
}

export interface CardGridRowTestimonialsStoryblok {
  columns: "" | "1" | "2" | "3";
  gridItems: TestimonialGridItemStoryblok[];
  component: "cardGridRowTestimonials";
  _uid: string;
  [k: string]: any;
}

export interface CardGridSectionStoryblok {
  heading?: string;
  headingLevel: string;
  leadText?: RichtextStoryblok;
  secondaryLeadText?: RichtextStoryblok;
  cards: (
    | CardGridRowBasicStoryblok
    | CardGridRowCalloutStoryblok
    | CardGridRowTestimonialsStoryblok
    | CardGridRowCalloutWithImageStoryblok
  )[];
  theme?: "" | "subtle" | "transparent";
  verticalPadding?: "" | "small" | "medium" | "large";
  component: "cardGridSection";
  _uid: string;
  [k: string]: any;
}

export interface CardListSectionStoryblok {
  heading?: string;
  headingLevel: string;
  leadText?: RichtextStoryblok;
  secondaryLeadText?: RichtextStoryblok;
  cards: CardListSectionItemStoryblok[];
  theme?: "" | "subtle" | "transparent";
  verticalPadding?: "" | "small" | "medium" | "large";
  component: "cardListSection";
  _uid: string;
  [k: string]: any;
}

export interface CardListSectionItemStoryblok {
  heading: string;
  body: string;
  link: MultilinkStoryblok;
  component: "cardListSectionItem";
  _uid: string;
  [k: string]: any;
}

export interface CategoryLandingPageStoryblok {
  header?: (HeroStoryblok | PageHeaderStoryblok)[];
  metadata?: MetadataStoryblok[];
  content?: (
    | ActionBannerStoryblok
    | GridSectionStoryblok
    | ActionBannerDefaultStoryblok
    | PromoBoxStoryblok
    | CardListSectionStoryblok
    | TestimonialFullWidthStoryblok
    | CalloutCardStoryblok
    | CardGridSectionStoryblok
    | CalloutCardWithImageStoryblok
    | PromoPanelStoryblok
  )[];
  component: "categoryLandingPage";
  _uid: string;
  [k: string]: any;
}

export interface CategoryNavigationStoryblok {
  pageHeader: PageHeaderStoryblok[];
  cardGrid: CardGridStoryblok[];
  metadata?: MetadataStoryblok[];
  component: "categoryNavigation";
  _uid: string;
  [k: string]: any;
}

export interface GridStoryblok {
  columns?: (
    | AccordionStoryblok
    | AccordionGroupStoryblok
    | ActionBannerStoryblok
    | ActionBannerDefaultStoryblok
    | AuthorStoryblok
    | BlogPostStoryblok
    | ButtonLinkStoryblok
    | CalloutCardStoryblok
    | CalloutCardWithImageStoryblok
    | CardStoryblok
    | CardContentStoryblok
    | CardGridStoryblok
    | CardGridRowBasicStoryblok
    | CardGridRowCalloutStoryblok
    | CardGridRowCalloutWithImageStoryblok
    | CardGridRowTestimonialsStoryblok
    | CardGridSectionStoryblok
    | CardListSectionStoryblok
    | CardListSectionItemStoryblok
    | CategoryLandingPageStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | GridSectionStoryblok
    | GridSectionItemStoryblok
    | HeroStoryblok
    | HomepageStoryblok
    | HomepageHeroStoryblok
    | IframeStoryblok
    | ImageEmbedStoryblok
    | ImageOrVideoStoryblok
    | InDepthArticleStoryblok
    | InfoPageStoryblok
    | ListItemStoryblok
    | MarkdownStoryblok
    | MetadataStoryblok
    | NestedRichTextStoryblok
    | NestedTableStoryblok
    | NewsArticleStoryblok
    | OrderedListStoryblok
    | PageStoryblok
    | PageHeaderStoryblok
    | PodcastStoryblok
    | PromoBoxStoryblok
    | QuoteStoryblok
    | RelatedLinkStoryblok
    | RelatedNewsLinkStoryblok
    | SpotlightStoryblok
    | SpotlightCopyStoryblok
    | TestimonialFullWidthStoryblok
    | TestimonialGridItemStoryblok
    | YoutubeEmbedStoryblok
  )[];
  component: "grid";
  _uid: string;
  [k: string]: any;
}

export interface GridItemStoryblok {
  cols?: string;
  block?: CardStoryblok[];
  component: "gridItem";
  _uid: string;
  [k: string]: any;
}

export interface GridSectionStoryblok {
  heading?: string;
  lead?: RichtextStoryblok;
  showHeading?: boolean;
  theme: "subtle" | "impact" | "transparent";
  verticalPadding?: "small" | "medium" | "large";
  content?: GridSectionItemStoryblok[];
  component: "gridSection";
  _uid: string;
  [k: string]: any;
}

export interface GridSectionItemStoryblok {
  columns?: "12" | "6" | "4";
  cards?: CardStoryblok[];
  component: "gridSectionItem";
  _uid: string;
  [k: string]: any;
}

export interface HeroStoryblok {
  title: string;
  summary?: string;
  description?: string;
  image: AssetStoryblok;
  cta?: ButtonLinkStoryblok[];
  theme?: "subtle" | "impact";
  component: "hero";
  _uid: string;
  [k: string]: any;
}

export interface HomepageStoryblok {
  hero: HomepageHeroStoryblok[];
  featuredStory?:
    | ISbStoryData<BlogPostStoryblok>
    | ISbStoryData<NewsArticleStoryblok>
    | ISbStoryData<PodcastStoryblok>
    | ISbStoryData<InDepthArticleStoryblok>
    | string;
  primaryActionBanner?: ActionBannerStoryblok[];
  links: RichtextStoryblok;
  linksAreTransparent?: boolean;
  promoBox1?: PromoBoxStoryblok[];
  spotlight?: SpotlightStoryblok[];
  promoBox2?: PromoBoxStoryblok[];
  metadata?: MetadataStoryblok[];
  component: "homepage";
  _uid: string;
  [k: string]: any;
}

export type MultiassetStoryblok = {
  alt: string | null;
  copyright?: string | null;
  fieldtype: "asset";
  id: number;
  filename: string | null;
  name: string;
  title: string | null;
  focus: string | null;
  meta_data?: {
    [k: string]: any;
  };
  source?: string | null;
  is_external_url?: boolean;
  is_private?: boolean;
  src?: string;
  updated_at?: string;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: number | null;
  public_id?: string | null;
  content_type?: string;
  [k: string]: any;
}[];

export interface HomepageHeroStoryblok {
  title: string;
  description: string;
  images: MultiassetStoryblok;
  cta: ButtonLinkStoryblok[];
  component: "homepageHero";
  _uid: string;
  [k: string]: any;
}

export interface IframeStoryblok {
  source: string;
  component: "iframe";
  _uid: string;
  [k: string]: any;
}

export interface ImageEmbedStoryblok {
  image: AssetStoryblok;
  component: "imageEmbed";
  _uid: string;
  [k: string]: any;
}

export interface ImageOrVideoStoryblok {
  component: "imageOrVideo";
  _uid: string;
  [k: string]: any;
}

export interface InDepthArticleStoryblok {
  title: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image: AssetStoryblok;
  introText: string;
  date: string;
  component: "inDepthArticle";
  _uid: string;
  [k: string]: any;
}

export interface InfoPageStoryblok {
  header: (PageHeaderStoryblok | HeroStoryblok)[];
  isNavigationRoot?: boolean;
  metadata?: MetadataStoryblok[];
  content: RichtextStoryblok;
  component: "infoPage";
  _uid: string;
  [k: string]: any;
}

export interface ListItemStoryblok {
  ListItemText?: string;
  component: "ListItem";
  _uid: string;
  [k: string]: any;
}

export interface MarkdownStoryblok {
  content: string;
  component: "markdown";
  _uid: string;
  [k: string]: any;
}

export interface MetadataStoryblok {
  description?: string;
  creator?: string;
  component: "metadata";
  _uid: string;
  [k: string]: any;
}

export interface NestedRichTextStoryblok {
  richText: RichtextStoryblok;
  component: "nestedRichText";
  _uid: string;
  [k: string]: any;
}

export interface TableStoryblok {
  thead: {
    _uid: string;
    value?: string;
    component: number;
    [k: string]: any;
  }[];
  tbody: {
    _uid: string;
    body: {
      _uid?: string;
      value?: string;
      component?: number;
      [k: string]: any;
    }[];
    component: number;
    [k: string]: any;
  }[];
  [k: string]: any;
}

export interface NestedTableStoryblok {
  title?: string;
  summary?: string;
  table?: TableStoryblok;
  component: "nestedTable";
  _uid: string;
  [k: string]: any;
}

export interface NewsArticleStoryblok {
  title: string;
  resources?: RelatedLinkStoryblok[];
  relatedNews?: RelatedNewsLinkStoryblok[];
  date: string;
  introText: string;
  content: RichtextStoryblok;
  image: AssetStoryblok;
  metadata?: MetadataStoryblok[];
  excludeFromHomepage?: boolean;
  component: "newsArticle";
  _uid: string;
  [k: string]: any;
}

export interface OrderedListStoryblok {
  StartingNumber?: string;
  ListItems?: ListItemStoryblok[];
  component: "OrderedList";
  _uid: string;
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (
    | AccordionStoryblok
    | AccordionGroupStoryblok
    | ActionBannerStoryblok
    | ActionBannerDefaultStoryblok
    | AuthorStoryblok
    | BlogPostStoryblok
    | ButtonLinkStoryblok
    | CalloutCardStoryblok
    | CalloutCardWithImageStoryblok
    | CardStoryblok
    | CardContentStoryblok
    | CardGridStoryblok
    | CardGridRowBasicStoryblok
    | CardGridRowCalloutStoryblok
    | CardGridRowCalloutWithImageStoryblok
    | CardGridRowTestimonialsStoryblok
    | CardGridSectionStoryblok
    | CardListSectionStoryblok
    | CardListSectionItemStoryblok
    | CategoryLandingPageStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | GridSectionStoryblok
    | GridSectionItemStoryblok
    | HeroStoryblok
    | HomepageStoryblok
    | HomepageHeroStoryblok
    | IframeStoryblok
    | ImageEmbedStoryblok
    | ImageOrVideoStoryblok
    | InDepthArticleStoryblok
    | InfoPageStoryblok
    | ListItemStoryblok
    | MarkdownStoryblok
    | MetadataStoryblok
    | NestedRichTextStoryblok
    | NestedTableStoryblok
    | NewsArticleStoryblok
    | OrderedListStoryblok
    | PageStoryblok
    | PageHeaderStoryblok
    | PodcastStoryblok
    | PromoBoxStoryblok
    | QuoteStoryblok
    | RelatedLinkStoryblok
    | RelatedNewsLinkStoryblok
    | SpotlightStoryblok
    | SpotlightCopyStoryblok
    | TestimonialFullWidthStoryblok
    | TestimonialGridItemStoryblok
    | YoutubeEmbedStoryblok
  )[];
  metadata?: MetadataStoryblok[];
  wysiwyg?: RichtextStoryblok;
  component: "page";
  _uid: string;
  [k: string]: any;
}

export interface PageHeaderStoryblok {
  title: string;
  summary?: string;
  description?: string;
  cta?: ButtonLinkStoryblok[];
  theme?: "subtle" | "impact";
  component: "pageHeader";
  _uid: string;
  [k: string]: any;
}

export interface PodcastStoryblok {
  date: string;
  soundcloudEmbedID: string;
  introText: string;
  description: RichtextStoryblok;
  image?: AssetStoryblok;
  metadata?: MetadataStoryblok[];
  component: "podcast";
  _uid: string;
  [k: string]: any;
}

export interface PromoBoxStoryblok {
  heading: string;
  headingLevel: string;
  body?: RichtextStoryblok;
  cta?: ButtonLinkStoryblok[];
  media: (YoutubeEmbedStoryblok | ImageEmbedStoryblok)[];
  swapMediaSide?: boolean;
  imageAspectRatio?: "landscape" | "portrait";
  isTransparent?: boolean;
  verticalPadding?: "" | "small" | "medium" | "large";
  promotionalContent?: (ActionBannerDefaultStoryblok | CardGridRowTestimonialsStoryblok)[];
  component: "promoBox";
  _uid: string;
  [k: string]: any;
}

export interface QuoteStoryblok {
  quoteText: RichtextStoryblok;
  quoteAuthor: string;
  component: "quote";
  _uid: string;
  [k: string]: any;
}

export interface RelatedLinkStoryblok {
  title: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  component: "relatedLink";
  _uid: string;
  [k: string]: any;
}

export interface RelatedNewsLinkStoryblok {
  title: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  publisher: string;
  date: string;
  component: "relatedNewsLink";
  _uid: string;
  [k: string]: any;
}

export interface SpotlightStoryblok {
  heading: string;
  mediaDescription?: string;
  stories: (
    | ISbStoryData<BlogPostStoryblok>
    | ISbStoryData<NewsArticleStoryblok>
    | ISbStoryData<InDepthArticleStoryblok>
    | ISbStoryData<PodcastStoryblok>
    | string
  )[];
  youtubeEmbed: YoutubeEmbedStoryblok[];
  isTransparent?: boolean;
  component: "spotlight";
  _uid: string;
  [k: string]: any;
}

export interface SpotlightCopyStoryblok {
  heading: string;
  mediaDescription?: RichtextStoryblok;
  stories: (
    | ISbStoryData<BlogPostStoryblok>
    | ISbStoryData<NewsArticleStoryblok>
    | ISbStoryData<InDepthArticleStoryblok>
    | ISbStoryData<PodcastStoryblok>
    | string
  )[];
  youtubeEmbed: YoutubeEmbedStoryblok[];
  isTransparent?: boolean;
  component: "spotlight_copy";
  _uid: string;
  [k: string]: any;
}

export interface TestimonialFullWidthStoryblok {
  quoteText: string;
  quoteName: string;
  quoteRole: string;
  image: AssetStoryblok;
  link?: RelatedLinkStoryblok[];
  variant: "fullWidth" | "fullWidthWhite";
  component: "testimonialFullWidth";
  _uid: string;
  [k: string]: any;
}

export interface TestimonialGridItemStoryblok {
  quoteText: string;
  quoteName: string;
  quoteRole: string;
  image: AssetStoryblok;
  variant: "default" | "transparent";
  component: "testimonialGridItem";
  _uid: string;
  [k: string]: any;
}

export interface YoutubeEmbedStoryblok {
  title?: string;
  source: string;
  component: "youtubeEmbed";
  _uid: string;
  [k: string]: any;
}
