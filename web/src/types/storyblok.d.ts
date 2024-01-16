import {StoryblokStory} from 'storyblok-generate-ts'

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

export interface AuthorStoryblok {
  name: string;
  jobTitle?: string;
  image?: AssetStoryblok;
  _uid: string;
  component: "author";
  [k: string]: any;
}

export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

export interface BlogPostStoryblok {
  title: string;
  date: string;
  introText: string;
  content: RichtextStoryblok;
  author: StoryblokStory<AuthorStoryblok> | string;
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
  columns: string;
  _uid: string;
  component: "cardGrid";
  [k: string]: any;
}

export interface CategoryNavigationStoryblok {
  hero: PageHeaderStoryblok[];
  cardGrid: CardGridStoryblok[];
  metadata?: MetadataStoryblok[];
  _uid: string;
  component: "categoryNavigation";
  [k: string]: any;
}

export interface GridStoryblok {
  columns?: (
    | AuthorStoryblok
    | BlogPostStoryblok
    | CardStoryblok
    | CardGridStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | HeroStoryblok
    | HomepageStoryblok
    | IframeStoryblok
    | InfoPageStoryblok
    | MetadataStoryblok
    | NestedRichTextStoryblok
    | NestedTableStoryblok
    | NewsArticleStoryblok
    | PageStoryblok
    | PageHeaderStoryblok
    | QuoteStoryblok
    | RelatedLinkStoryblok
    | RelatedNewsLinkStoryblok
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
  ctaText?: string;
  ctaLink?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "hero";
  [k: string]: any;
}

export interface HomepageStoryblok {
  body: (CardGridStoryblok | RichTextStoryblok | HeroStoryblok)[];
  metadata?: MetadataStoryblok[];
  authorOption?: StoryblokStory<AuthorStoryblok> | string;
  authorBlock?: AuthorStoryblok[];
  _uid: string;
  component: "homepage";
  [k: string]: any;
}

export interface IframeStoryblok {
  source: string;
  _uid: string;
  component: "iframe";
  [k: string]: any;
}

export interface InfoPageStoryblok {
  header: (HeroStoryblok | PageHeaderStoryblok)[];
  content: RichtextStoryblok;
  _uid: string;
  component: "infoPage";
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
  table?: TableStoryblok;
  _uid: string;
  component: "nestedTable";
  [k: string]: any;
}

export interface NewsArticleStoryblok {
  title: string;
  date: string;
  introText: string;
  content: RichtextStoryblok;
  image: AssetStoryblok;
  resources?: RelatedLinkStoryblok[];
  relatedNews?: RelatedNewsLinkStoryblok[];
  _uid: string;
  component: "newsArticle";
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (
    | AuthorStoryblok
    | BlogPostStoryblok
    | CardStoryblok
    | CardGridStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | HeroStoryblok
    | HomepageStoryblok
    | IframeStoryblok
    | InfoPageStoryblok
    | MetadataStoryblok
    | NestedRichTextStoryblok
    | NestedTableStoryblok
    | NewsArticleStoryblok
    | PageStoryblok
    | PageHeaderStoryblok
    | QuoteStoryblok
    | RelatedLinkStoryblok
    | RelatedNewsLinkStoryblok
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
  ctaText?: string;
  ctaLink?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "pageHeader";
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

export interface YoutubeEmbedStoryblok {
  source: string;
  _uid: string;
  component: "youtubeEmbed";
  [k: string]: any;
}
