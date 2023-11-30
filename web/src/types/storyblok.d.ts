import {StoryblokStory} from 'storyblok-generate-ts'

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
    | CardStoryblok
    | CardGridStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | HomepageStoryblok
    | MetadataStoryblok
    | PageStoryblok
    | PageHeaderStoryblok
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

export interface HomepageStoryblok {
  body: (CardGridStoryblok | RichTextStoryblok)[];
  metadata?: MetadataStoryblok[];
  _uid: string;
  component: "homepage";
  [k: string]: any;
}

export interface MetadataStoryblok {
  description?: string;
  creator?: string;
  _uid: string;
  component: "metadata";
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

export interface PageStoryblok {
  body?: (
    | CardStoryblok
    | CardGridStoryblok
    | CategoryNavigationStoryblok
    | GridStoryblok
    | GridItemStoryblok
    | HomepageStoryblok
    | MetadataStoryblok
    | PageStoryblok
    | PageHeaderStoryblok
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
