// @ts-check
const path = require("path");

const config = require("config"),
	glob = require("glob"),
	withNodeConfig = require("next-plugin-node-config");

/**
 * A list of paths to hooks used in global nav that should allow transpilation.
 *
 * Avoids the error "cannot use import outside a module"
 */
const globalNavHooksToTranspile = [
	"@mantine/hooks/esm/use-debounced-value",
	"@mantine/hooks/esm/use-focus-trap",
];

/**
 * A list of paths to node modules that should allow transpilation.
 * Most of our Design System components (and Global Nav) import SCSS.
 *
 * Avoids the error "CSS Modules cannot be imported from within node_modules."
 */
const niceDigitalModulesToTranspile = glob.sync(
	"@nice-digital/{*,*/node_modules/@nice-digital/*}",
	{
		cwd: "node_modules",
	}
);

/**
 * Some npm modules are published as ES6, so we need to force them to be transpiled
 * so they're ES5 compatible whilst we still support IE11.
 *
 * As per comment at https://github.com/vercel/next.js/discussions/13922#discussioncomment-23956
 */
const nonES5ModulesToTranspile = ["pino", "serialize-error"];

const commonHeaders = [
	{
		key: "Cache-Control",
		value: config.get("public.cacheControl.defaultCacheHeader"),
	},
	{
		key: "X-App",
		value: "next-web",
	},
	/**
	 * 'Best practice' security headers as per https://edibleco.de/3xcg71N
	 */
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	/**
	 * Preload external assets and preconnecting external domains via Link header
	 */
	{
		key: "Link",
		value: [
			// Preload the cookie banner with API key domain preconnect - we want the cookie banner to show as quickly as possible
			`<${config.get("public.cookieBannerScriptURL")}>; rel=preload; as=script`,
			"<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin",
			"<https://www.googletagmanager.com>; rel=preconnect",
		].join(","),
	},
];

// Prevent emebdding this site in frames in production, but allow it in dev so we can use the Storyblok preview editor
if (process.env.NODE_ENV === "production") {
	commonHeaders.push(
		{
			key: "X-Frame-Options",
			value: "DENY",
		},
		{
			key: "Content-Security-Policy",
			value: "frame-ancestors 'none'",
		}
	);
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	nodeConfigServerKey: "server",
	nodeConfigPublicKey: "public",
	// Strict mode gives useful feedback in dev, see https://edibleco.de/3x9GXry
	reactStrictMode: true,
	eslint: {
		// We run ESLint ourselves at the root of this monorepo
		ignoreDuringBuilds: true,
	},
	// Add page.tsx for test co-location, see https://edibleco.de/3qCAkvg
	pageExtensions: ["page.tsx", "api.ts"],
	// Don't send the x-powered-by header: we don't want to expose things like that. See https://edibleco.de/2TpDVAK
	poweredByHeader: false,
	async rewrites() {
		return [
			{
				source:
					"/:productRoot(indicators|guidance|hub)/:statusSlug(indevelopment|discontinued|awaiting-development|topic-selection)/:path*",
				destination:
					"/indicators/indevelopment/:path*?productRoot=:productRoot&statusSlug=:statusSlug",
			},
			{
				source:
					"/:productRoot(indicators|guidance|advice|process|corporate|hub)/:path*",
				destination: "/indicators/:path*?productRoot=:productRoot",
			},
			{
				source: "/robots.txt",
				destination: "/api/robots",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/forms/life-sciences-contact-us",
				destination: "/forms/nice-advice-contact-us",
				permanent: true,
			},
			{
				source: "/indicators",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/news/newsandfeatures",
				destination: "/news/articles",
				permanent: true,
			},
			{
				source: "/news/blog",
				destination: "/news/blogs",
				permanent: true,
			},
			{
				source: "/news/features",
				destination: "/news/in-depth",
				permanent: true,
			},
			{
				source: "/news/nice-talks-podcasts",
				destination: "/news/podcasts",
				permanent: true,
			},
			{
				source: "/news/press-and-media",
				destination: "/press-and-media",
				permanent: true,
			},
			{
				source: "/news/nice-newsletters-and-alerts",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/news/events",
				destination: "/events",
				permanent: true,
			},
			{
				source:
					"/news/article/1-4-million-more-people-at-risk-of-severe-covid-19-to-have-access-to-antiviral-paxlovid",
				destination:
					"/news/articles/people-at-risk-of-severe-covid-19-to-have-access-to-antiviral-paxlovid",
				permanent: true,
			},
			{
				source:
					"/news/article/300-people-to-benefit-from-new-treatment-for-advanced-breast-cancer-recommended-by-nice-following-price-deal",
				destination:
					"/news/articles/new-treatment-for-advanced-breast-cancer-recommended-by-nice",
				permanent: true,
			},
			{
				source:
					"/news/article/updated-nice-guidance-recommends-more-targeting-of-antibiotics-to-those-at-the-highest-risk-of-suspected-sepsis",
				destination:
					"/news/articles/nice-recommends-better-targeting-of-antibiotics-for-suspected-sepsis",
				permanent: true,
			},
			{
				source:
					"/news/article/up-to-14-000-people-could-benefit-from-the-first-treatment-for-severe-alopecia-recommended-by-nice",
				destination:
					"/news/articles/thousands-could-benefit-from-treatment-for-severe-alopecia",
				permanent: true,
			},
			{
				source:
					"/news/article/a-public-consultation-on-our-new-approach-to-prioritising-guidance-is-now-open",
				destination:
					"/news/articles/public-consultation-on-our-new-approach-to-prioritising-guidance-now-open",
				permanent: true,
			},
			{
				source:
					"/news/article/new-treatment-option-available-today-for-womb-cancer",
				destination:
					"/news/articles/new-treatment-option-available-for-womb-cancer",
				permanent: true,
			},
			{
				source:
					"/news/article/nice-publishes-final-draft-guidance-on-enhertu-after-commercial-discussions-conclude-without-a-price-to-make-it-a-cost-effective-use-of-nhs-resources",
				destination:
					"/news/articles/nice-publishes-final-draft-guidance-on-enhertu-after-commercial-discussions-conclude",
				permanent: true,
			},
			{
				source:
					"/news/article/25-000-people-to-benefit-after-nice-recommends-new-ulcerative-colitis-treatment",
				destination:
					"/news/articles/25000-people-to-benefit-after-nice-recommends-new-ulcerative-colitis-treatment",
				permanent: true,
			},
			{
				source:
					"/news/article/children-and-young-adults-to-benefit-after-nice-recommends-personalised-immunotherapy-to-treat-blood-cancer-be-made-routinely-available-on-the-nhs",
				destination:
					"/news/articles/nice-recommended-personalised-immunotherapy-to-treat-blood-cancer-in-children-and-young-adults-to-be-made-routinely-available-on-the-nhs",
				permanent: true,
			},
			{
				source:
					"/news/article/children-and-teenagers-with-an-aggressive-form-of-brain-cancer-set-to-benefit-after-nice-recommends-new-life-extending-drug-combination-treatment",
				destination:
					"/news/articles/new-life-extending-drug-treatment-for-children-and-teenagers-with-an-aggressive-form-of-brain-cancer",
				permanent: true,
			},
			{
				source:
					"/news/article/improved-deal-signals-nice-recommendation-of-sickle-cell-treatment-voxelotor",
				destination:
					"/news/articles/around-4-000-people-with-sickle-cell-disease-could-benefit-from-a-new-treatment-recommended-by-nice",
				permanent: true,
			},
			{
				source:
					"/news/article/tests-could-lead-to-fewer-people-having-unnecessary-chemotherapy-after-surgery-for-early-breast-cancer",
				destination:
					"/news/articles/new-tests-could-spare-people-with-early-breast-cancer-from-unnecessary-chemotherapy",
				permanent: true,
			},
			{
				source:
					"/news/article/home-testing-devices-could-increase-the-number-of-people-diagnosed-with-sleep-condition",
				destination:
					"/news/articles/home-testing-devices-could-increase-the-number-of-people-diagnosed-with-sleep-apnoea",
				permanent: true,
			},
			{
				source:
					"/news/article/statins-could-be-a-choice-for-more-people-to-reduce-their-risk-of-heart-attacks-and-strokes-says-nice",
				destination:
					"/news/articles/statins-a-choice-for-more-people-to-reduce-risk-of-heart-attacks-and-strokes",
				permanent: true,
			},
			{
				source:
					"/news/article/first-treatment-for-acute-migraine-to-be-recommended-by-nice-set-to-benefit-thousands",
				destination:
					"/news/articles/new-treatment-for-acute-migraine-set-to-benefit-thousands",
				permanent: true,
			},
			{
				source: "/news/blog/international-women-s-day-2024",
				destination: "/news/blogs/women-inspiring-inclusion-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/news/blog/listening-to-patients-and-organisations-to-update-nice-s-quality-standard-on-transition-from-children-s-to-adults-services",
				destination:
					"/news/blogs/listening-to-patients-and-organisations-to-update-nice-s-quality-standard-on-transition-from-children-s-to-adults-services",
				permanent: true,
			},
			{
				source: "/news/article/:slug",
				destination: "/news/articles/:slug",
				permanent: true,
			},
			{
				source: "/news/blog/:slug",
				destination: "/news/blogs/:slug",
				permanent: true,
			},
			{
				source: "/About/What-we-do/Evidence-Services/journals-and-databases",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/organisations-eligible-to-use-the-framework",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/organisations-eligible-to-use-the-framework",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/provider-information",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/provider-information",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/sole-supplied-titles",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/sole-supplied-titles",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--further-competition",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-further-competition",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/OpenAthens",
				destination: "/library-and-knowledge-services/openathens",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-support",
				destination:
					"/library-and-knowledge-services/openathens/openathens-support",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-eligibility",
				destination:
					"/library-and-knowledge-services/openathens/openathens-eligibility",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-registration-help",
				destination:
					"/library-and-knowledge-services/openathens/openathens-registration-help",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/access",
				destination:
					"/library-and-knowledge-services/openathens/openathens-access",
				permanent: true,
			},
			{
				source: "/get-involved/jobs",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/get-involved/careers/digital-at-nice",
				destination: "/careers/digital-at-nice",
				permanent: true,
			},
			{
				source:
					"/get-involved/jobs/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/diversity-and-inclusion",
				destination: "/careers/diversity-and-inclusion",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/research-and-development/research-recommendations/:slug*",
				destination:
					"/about/what-we-do/science-policy-research/research-recommendations",
				permanent: true,
			},
			// NOTE IND114 redirect retained as it has received traffic in last twelve months
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-dementia-with-the-contact-details-of-a-named-carer-on-their-record",
				destination: "/indicators/IND114-dementia-named-carer",
				permanent: true,
			},
			//NOTE IND230 redirect retained as it has received traffic in last twelve months
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cvd-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND230-cardiovascular-disease-prevention-secondary-prevention-with-lipid-lowering-therapies",
				permanent: true,
			},
			//NOTE any orchard legacy mixed case Standards-and-Indicators urls now redirect to /indicators/published
			{
				source: "/Standards-and-Indicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			//NOTE any orchard legacy url indicators url structures now redirect to /indicators/published
			{
				source: "/standards-and-indicators/gpqualityimprovements/:path",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/qofindicators/:path",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/:path",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/hub/published",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/inconsultation",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/indevelopment",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/awaiting-development",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/topic-selection",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/guidance/proposed",
				destination: "/guidance/awaiting-development",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/index",
				destination: "/indicators/published",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				// Add common headers to all pages
				source: "/(.*)",
				headers: commonHeaders,
			},
		];
	},
	transpilePackages: [
		...niceDigitalModulesToTranspile,
		...nonES5ModulesToTranspile,
		...globalNavHooksToTranspile,
	],
	typescript: {
		// We run our own typechecking so no need to do it twice
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
	sassOptions: {
		fiber: false,
		includePaths: [path.join(__dirname, "node_modules/@nice-digital")],
	},
	images: {
		// https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
		remotePatterns: [
			{
				protocol: "https",

				hostname: "**.nice.org.uk",
				port: "",
			},
			{
				protocol: "https",

				hostname: "a.storyblok.com",
				port: "",
			},
		],
	},
};

// The weird comment syntax below is a JSDoc TypeScript cast: https://edibleco.de/2UMm8nx
/** @type {import('next').NextConfig} */
const finalConfig = withNodeConfig(nextConfig);

// Delete the following properties now we are finished with them or next-js will warn 'root value has an unexpected property xxx - which is not in the list of allowed properties'
delete finalConfig["nodeConfigServerKey"];
delete finalConfig["nodeConfigPublicKey"];

module.exports = finalConfig;
