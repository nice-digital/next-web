import { logger } from "@/logger";
import { fetchStory, type StoryVersion } from "@/utils/storyblok";

/**
 * FDR-17 spike: self-serve redirects managed by the web team in Storyblok.
 *
 * The list lives in a single story, outside of any section served by next-web:
 *
 *   site-config/redirects   (content type: redirectsConfig)
 *     redirects: blocks field, restricted to the redirectEntry nestable block
 *
 *   redirectEntry
 *     source       text, required   e.g. /about-us/old-page
 *     destination  text, required   e.g. /about-us/new-page
 *     owner        text             team that owns the redirect
 *     reason       text
 *     reviewDate   date
 *     keep         boolean          never remove on hits alone
 *
 * Only one-to-one redirects between paths on this site are supported.
 */

export const REDIRECTS_FOLDER_SLUG = "site-config";
export const REDIRECTS_STORY_SLUG = `${REDIRECTS_FOLDER_SLUG}/redirects`;
export const REDIRECTS_CONTENT_TYPE = "redirectsConfig";

/** How long each server process keeps the redirect list in memory */
export const REDIRECTS_TTL_MS = 60 * 1000;

export type RedirectEntryStoryblok = {
	source?: string;
	destination?: string;
	owner?: string;
	reason?: string;
	reviewDate?: string;
	keep?: boolean;
	component: "redirectEntry";
	_uid: string;
};

export type RedirectsConfigStoryblok = {
	redirects?: RedirectEntryStoryblok[];
	component: "redirectsConfig";
	_uid: string;
};

export type RejectedRedirect = {
	source: string;
	destination: string;
	reason: string;
};

export type RedirectMap = Map<string, string>;

/**
 * Tidies a path so that entries can be compared: lowercase, no query string
 * or hash, no trailing slash.
 *
 * Returns null for anything that isn't a path on this site, which stops the
 * list being used to redirect to other domains.
 */
export const normaliseRedirectPath = (
	path: string | undefined
): string | null => {
	if (typeof path !== "string") return null;

	const trimmed = path.trim();

	// Must be a root-relative path: rules out full URLs and "//host" URLs
	if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
	if (/[\s\\]/.test(trimmed)) return null;

	const withoutQuery = trimmed.split(/[?#]/)[0].toLowerCase();
	const withoutTrailingSlash = withoutQuery.replace(/\/+$/, "");

	return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
};

/** Whether a slug belongs to the redirect list, which is never a public page */
export const isRedirectsConfigSlug = (slug: string): boolean => {
	const lowerSlug = slug.toLowerCase().replace(/^\/+|\/+$/g, "");

	return (
		lowerSlug === REDIRECTS_FOLDER_SLUG ||
		lowerSlug.startsWith(`${REDIRECTS_FOLDER_SLUG}/`)
	);
};

/**
 * Builds the lookup from the entries in Storyblok.
 *
 * Storyblok can't check one entry against another, so this is the safety net:
 * anything that could cause a loop or a chain is left out and reported. The
 * worst case for a bad entry is a redirect that doesn't work.
 */
export const buildRedirectMap = (
	entries: RedirectEntryStoryblok[] = []
): { map: RedirectMap; rejected: RejectedRedirect[] } => {
	const candidates: RedirectMap = new Map();
	const rejected: RejectedRedirect[] = [];

	const reject = (entry: RedirectEntryStoryblok, reason: string) =>
		rejected.push({
			source: entry.source ?? "",
			destination: entry.destination ?? "",
			reason,
		});

	for (const entry of entries) {
		const source = normaliseRedirectPath(entry.source);
		const destination = normaliseRedirectPath(entry.destination);

		if (!source) reject(entry, "source is not a path on this site");
		else if (!destination)
			reject(entry, "destination is not a path on this site");
		else if (source === destination)
			reject(entry, "source and destination are the same");
		else if (isRedirectsConfigSlug(source))
			reject(entry, "source is inside the redirects folder");
		else if (candidates.has(source)) reject(entry, "duplicate source");
		else candidates.set(source, destination);
	}

	// A destination that is itself a source means a chain or a loop. Leave out
	// every entry involved: both halves of a loop, and the first hop of a chain.
	const map: RedirectMap = new Map();

	candidates.forEach((destination, source) => {
		if (candidates.has(destination))
			rejected.push({
				source,
				destination,
				reason: "destination is redirected again (chain or loop)",
			});
		else map.set(source, destination);
	});

	return { map, rejected };
};

type CachedRedirects = { map: RedirectMap; expires: number };

const cachedRedirects = new Map<string, CachedRedirects>();

/** Clears the in-memory list. Only needed by tests. */
export const clearRedirectsCache = (): void => cachedRedirects.clear();

/**
 * Gets the redirect list, from memory if it was loaded recently.
 *
 * Never throws: if Storyblok is unavailable we carry on with the last list we
 * had, or with no redirects, so that pages are still served.
 */
export const getRedirectMap = async (
	version: StoryVersion = "published"
): Promise<RedirectMap> => {
	const cacheKey = version ?? "published";
	const cached = cachedRedirects.get(cacheKey);

	if (cached && cached.expires > Date.now()) return cached.map;

	let map: RedirectMap = cached?.map ?? new Map();

	try {
		const result = await fetchStory<RedirectsConfigStoryblok>(
			REDIRECTS_STORY_SLUG,
			version
		);

		const content = result.story?.content;

		if (content && content.component !== REDIRECTS_CONTENT_TYPE) {
			logger.error(
				`Redirects: story at ${REDIRECTS_STORY_SLUG} is a ${content.component}, expected ${REDIRECTS_CONTENT_TYPE}`
			);
		} else {
			const built = buildRedirectMap(content?.redirects);
			map = built.map;

			for (const { source, destination, reason } of built.rejected)
				logger.warn(
					{ source, destination, reason },
					`Redirects: ignored redirect from "${source}" to "${destination}": ${reason}`
				);
		}
	} catch (error) {
		logger.error(
			`Redirects: could not load ${REDIRECTS_STORY_SLUG}, using the previous list of ${map.size}. Error: ${error}`
		);
	}

	cachedRedirects.set(cacheKey, {
		map,
		expires: Date.now() + REDIRECTS_TTL_MS,
	});

	return map;
};

/**
 * Looks up a self-serve redirect for the given path.
 *
 * @returns The path to redirect to, or null if there isn't one
 */
export const findRedirect = async (
	path: string,
	version: StoryVersion = "published"
): Promise<string | null> => {
	const source = normaliseRedirectPath(path);

	if (!source) return null;

	const destination = (await getRedirectMap(version)).get(source) ?? null;

	// Logged so we can see which redirects are still being used
	if (destination)
		logger.info(
			{ source, destination },
			`Redirects: hit from "${source}" to "${destination}"`
		);

	return destination;
};
