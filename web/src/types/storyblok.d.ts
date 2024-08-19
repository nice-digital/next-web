import {StoryblokStory} from 'storyblok-generate-ts'

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
  _uid: string;
  component: "accordion";
  [k: string]: any;
}

export interface AccordionGroupStoryblok {
  accordions: AccordionStoryblok[];
  _uid: string;
  component: "accordionGroup";
  [k: string]: any;
}

export interface AssetStoryblok {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  focus?: string;
  [k: string]: any;
}

export interface ActionBannerStoryblok {
  heading: string;
  body?: RichtextStoryblok;
  cta: ButtonLinkStoryblok[];
  image: AssetStoryblok;
  _uid: string;
  component: "actionBanner";
  [k: string]: any;
}

export interface AuthorStoryblok {
  name: string;
  jobTitle?: string;
  image?: AssetStoryblok;
  _uid: string;
  component: "author";
  [k: string]: any;
}

export interface BlogPostStoryblok {
  title: string;
  image: AssetStoryblok;
  date: string;
  introText: string;
  content: RichtextStoryblok;
  author: (StoryblokStory<AuthorStoryblok> | string)[];
  metadata?: MetadataStoryblok[];
  _uid: string;
  component: "blogPost";
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
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
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      [k: string]: any;
    }
  | {
      email?: string;
      linktype?: "email";
      [k: string]: any;
    };

export interface ButtonLinkStoryblok {
  text: string;
  link: MultilinkStoryblok;
  variant: "" | "cta" | "primary" | "secondary" | "inverse";
  _uid: string;
  component: "buttonLink";
  [k: string]: any;
}

export interface CardStoryblok {
  heading: string;
  body: string;
  link?: MultilinkStoryblok;
  _uid: string;
  component: "card";
  [k: string]: any;
}

export interface CardGridStoryblok {
  cards: CardStoryblok[];
  _uid: string;
  component: "cardGrid";
  [k: string]: any;
}

export interface CategoryNavigationStoryblok {
  pageHeader: PageHeaderStoryblok[];
  cardGrid: CardGridStoryblok[];
  metadata?: MetadataStoryblok[];
  _uid: string;
  component: "categoryNavigation";
  [k: string]: any;
}

export interface GridStoryblok {
  columns?: (
    | AccordionStoryblok
    | AccordionGroupStoryblok
    | ActionBannerStoryblok
    | AuthorStoryblok
    | BlogPostStoryblok
    | ButtonLinkStoryblok
    | CardStoryblok
    | CardGridStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | HeroStoryblok
    | HomepageStoryblok
    | HomepageHeroStoryblok
    | IframeStoryblok
    | ImageOrVideoStoryblok
    | InDepthArticleStoryblok
    | InfoLandingPageStoryblok
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
    | YoutubeEmbedStoryblok
  )[];
  _uid: string;
  component: "grid";
  [k: string]: any;
}

export interface GridItemStoryblok {
  cols?: string;
  block?: CardStoryblok[];
  _uid: string;
  component: "gridItem";
  [k: string]: any;
}

export interface HeroStoryblok {
  title: string;
  summary?: string;
  description?: string;
  image: AssetStoryblok;
  cta?: ButtonLinkStoryblok[];
  ctaText?: string;
  ctaLink?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "hero";
  [k: string]: any;
}

export interface HomepageStoryblok {
  hero: HomepageHeroStoryblok[];
  featuredStory?:
    | StoryblokStory<BlogPostStoryblok>
    | StoryblokStory<NewsArticleStoryblok>
    | StoryblokStory<PodcastStoryblok>
    | StoryblokStory<InDepthArticleStoryblok>
    | string;
  primaryActionBanner?: ActionBannerStoryblok[];
  links: RichtextStoryblok;
  linksAreTransparent?: boolean;
  promoBox1?: PromoBoxStoryblok[];
  spotlight?: SpotlightStoryblok[];
  promoBox2?: PromoBoxStoryblok[];
  metadata?: MetadataStoryblok[];
  _uid: string;
  component: "homepage";
  [k: string]: any;
}

export type MultiassetStoryblok = {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  [k: string]: any;
}[];

export interface HomepageHeroStoryblok {
  title: string;
  description: string;
  images: MultiassetStoryblok;
  cta: ButtonLinkStoryblok[];
  _uid: string;
  component: "homepageHero";
  [k: string]: any;
}

export interface IframeStoryblok {
  source: string;
  _uid: string;
  component: "iframe";
  [k: string]: any;
}

export interface ImageOrVideoStoryblok {
  _uid: string;
  component: "imageOrVideo";
  [k: string]: any;
}

export interface InDepthArticleStoryblok {
  title: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image: AssetStoryblok;
  introText: string;
  date: string;
  _uid: string;
  component: "inDepthArticle";
  [k: string]: any;
}

export interface InfoPageStoryblok {
  header: (PageHeaderStoryblok | HeroStoryblok)[];
  metadata?: MetadataStoryblok[];
  content: RichtextStoryblok;
  _uid: string;
  component: "infoPage";
  [k: string]: any;
}

export interface ListItemStoryblok {
  ListItemText?: string;
  _uid: string;
  component: "ListItem";
  [k: string]: any;
}

export interface MarkdownStoryblok {
  content: string;
  _uid: string;
  component: "markdown";
  [k: string]: any;
}

export interface MetadataStoryblok {
  description?: string;
  creator?: string;
  _uid: string;
  component: "metadata";
  [k: string]: any;
}

export interface NestedRichTextStoryblok {
  richText: RichtextStoryblok;
  _uid: string;
  component: "nestedRichText";
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
  _uid: string;
  component: "nestedTable";
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
  _uid: string;
  component: "newsArticle";
  [k: string]: any;
}

export interface OrderedListStoryblok {
  StartingNumber?: string;
  ListItems?: ListItemStoryblok[];
  _uid: string;
  component: "OrderedList";
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (
    | AccordionStoryblok
    | AccordionGroupStoryblok
    | ActionBannerStoryblok
    | AuthorStoryblok
    | BlogPostStoryblok
    | ButtonLinkStoryblok
    | CardStoryblok
    | CardGridStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | HeroStoryblok
    | HomepageStoryblok
    | HomepageHeroStoryblok
    | IframeStoryblok
    | ImageOrVideoStoryblok
    | InDepthArticleStoryblok
    | InfoLandingPageStoryblok
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
    | YoutubeEmbedStoryblok
  )[];
  metadata?: MetadataStoryblok[];
  wysiwyg?: RichtextStoryblok;
  _uid: string;
  component: "page";
  uuid?: string;
  [k: string]: any;
}

export interface PageHeaderStoryblok {
  title: string;
  summary?: string;
  description?: string;
  cta?: ButtonLinkStoryblok[];
  ctaText?: string;
  ctaLink?: MultilinkStoryblok;
  _uid: string;
  component: "pageHeader";
  [k: string]: any;
}

export interface PodcastStoryblok {
  date: string;
  soundcloudEmbedID: string;
  introText: string;
  description: RichtextStoryblok;
  image?: AssetStoryblok;
  metadata?: MetadataStoryblok[];
  _uid: string;
  component: "podcast";
  [k: string]: any;
}

export interface PromoBoxStoryblok {
  heading: string;
  body?: RichtextStoryblok;
  cta?: ButtonLinkStoryblok[];
  useVideo?: boolean;
  image?: AssetStoryblok;
  youtubeEmbed?: YoutubeEmbedStoryblok[];
  swapMediaSide?: boolean;
  isTransparent?: boolean;
  _uid: string;
  component: "promoBox";
  [k: string]: any;
}

export interface QuoteStoryblok {
  quoteText: RichtextStoryblok;
  quoteAuthor: string;
  _uid: string;
  component: "quote";
  [k: string]: any;
}

export interface RelatedLinkStoryblok {
  title: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "relatedLink";
  [k: string]: any;
}

export interface RelatedNewsLinkStoryblok {
  title: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  publisher: string;
  date: string;
  _uid: string;
  component: "relatedNewsLink";
  [k: string]: any;
}

export interface SpotlightStoryblok {
  heading: string;
  mediaDescription?: string;
  stories: (
    | StoryblokStory<BlogPostStoryblok>
    | StoryblokStory<NewsArticleStoryblok>
    | StoryblokStory<InDepthArticleStoryblok>
    | StoryblokStory<PodcastStoryblok>
    | string
  )[];
  youtubeEmbed: YoutubeEmbedStoryblok[];
  isTransparent?: boolean;
  _uid: string;
  component: "spotlight";
  [k: string]: any;
}

export interface YoutubeEmbedStoryblok {
  title?: string;
  source: string;
  _uid: string;
  component: "youtubeEmbed";
  [k: string]: any;
}
