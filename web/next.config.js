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
					"/:productRoot(indicators|guidance)/:statusSlug(indevelopment|discontinued|awaiting-development|topic-selection)/:path*",
				destination:
					"/indicators/indevelopment/:path*?productRoot=:productRoot&statusSlug=:statusSlug",
			},
			{
				source:
					"/:productRoot(indicators|guidance|advice|process|corporate)/:path*",
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
					"/library-and-knowledge-services/buy-books-journals-and-databases",
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
				source: "/get-involved/careers",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/get-involved/careers/digital-at-nice",
				destination: "/careers/digital-at-nice",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/we-care-about-our-staff",
				destination: "/careers/we-care-about-our-staff",
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
				source: "/get-involved/careers/we-care-about-our-staff",
				destination: "/careers/we-care-about-our-staff",
				permanent: true,
			},
			{
				source:
					"/get-involved/careers/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source: "/get-involved/careers/diversity-and-inclusion",
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
			{
				source: "/standards-and-indicators/ccgoisindicators/cancer-ccg01",
				destination:
					"/indicators/IND1-cancer-invasive-cancer-diagnosed-via-emergency-routes",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/cancer-ccg02",
				destination: "/indicators/IND2-cancer-stage-at-diagnosis-recorded",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/cancer-ccg03",
				destination:
					"/indicators/IND3-cancer-detected-at-stage-1-or-2-all-cancer",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/breast-cancer-mortality-rates-ccg04",
				destination: "/indicators/IND4-cancer-breast-cancer-mortality-rate",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/lung-cancer-ccg06",
				destination: "/indicators/IND5-cancer-lung-cancer-stage-at-diagnosis",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/copd-ccg08",
				destination:
					"/indicators/IND6-copd-referral-for-pulmonary-rehabilitation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/heart-failure-ccg11",
				destination:
					"/indicators/IND8-heart-failure-mortality-within-12-months-of-admission",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/diabetes-ccg12",
				destination: "/indicators/IND9-diabetes-complications",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/diabetes-ccg13",
				destination: "/indicators/IND10-diabetes-annual-care-processes",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/diabetes-ccg14",
				destination:
					"/indicators/IND11-diabetes-structured-education-within-12-months-of-diagnosis",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/dementia-ccg18",
				destination: "/indicators/IND12-dementia-anti-psychotic-prescriptions",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-people-with-hip-fracture-who-receive-a-formal-hip-fracture-programme-from-admission",
				destination:
					"/indicators/IND13-hip-fracture-formal-hip-fracture-programme-from-admission",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-people-with-hip-fracture-who-receive-surgery-on-the-day-of-or-the-day-after-admission",
				destination:
					"/indicators/IND14-hip-fracture-surgery-on-the-day-or-day-after-admission",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/hip-fracture-ccg22",
				destination: "/indicators/IND15-hip-fracture-falls-risk-assessment",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/hip-fracture-ccg23",
				destination: "/indicators/IND16-hip-fracture-composite-care-processes",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/hip-fracture-ccg24",
				destination: "/indicators/IND17-hip-fracture-admission-rates",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-pregnant-women-who-were-smokers-during-pregnancy",
				destination:
					"/indicators/IND18-pregnancy-and-neonates-smokers-at-booking-appointment",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/maternity-ccg32",
				destination:
					"/indicators/IND19-pregnancy-and-neonates-smokers-at-delivery",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-successful-births-where-breast-feeding-is-initiated",
				destination:
					"/indicators/IND20-pregnancy-and-neonates-breastfeeding-48-hours",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-pregnancies-resulting-in-a-neonatal-or-still-birth",
				destination:
					"/indicators/IND21-pregnancy-and-neonates-neonatal-deaths-or-still-births",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/maternity-ccg35",
				destination:
					"/indicators/IND22-pregnancy-and-neonates-low-birth-weight",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/maternity-ccg36",
				destination:
					"/indicators/IND23-pregnancy-and-neonates-neonatal-admissions",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/maternity-ccg37",
				destination:
					"/indicators/IND24-pregnancy-and-neonates-planned-caesarean-after-39-weeks",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/postnatal-ccg38",
				destination:
					"/indicators/IND25-pregnancy-and-neonates-6-to-8-week-breastfeeding",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/mental-health-ccg41",
				destination:
					"/indicators/IND26-depression-and-anxiety-recovery-following-talking-therapies",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/smoking-ccg44",
				destination:
					"/indicators/IND27-smoking-current-smokers-bipolar-schizophrenia-and-other-psychoses",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg45",
				destination:
					"/indicators/IND28-stroke-and-ischaemic-attack-mortality-within-30-days",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg47",
				destination:
					"/indicators/IND30-stroke-and-ischaemic-attack-care-plan-on-discharge",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg48",
				destination:
					"/indicators/IND31-stroke-and-ischaemic-attack-review-6-months-after-discharge",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg49",
				destination:
					"/indicators/IND32-stroke-and-ischaemic-attack-early-supported-discharge",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg50",
				destination:
					"/indicators/IND33-stroke-and-ischaemic-attack-thrombolysis",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg51",
				destination:
					"/indicators/IND34-stroke-and-ischaemic-attack-4-hour-admission-to-a-stroke-unit",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg52",
				destination:
					"/indicators/IND35-stroke-and-ischaemic-attack-90-of-time-on-a-stroke-unit",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/stroke-ccg53",
				destination:
					"/indicators/IND36-stroke-and-ischaemic-attack-4-hour-swallowing-assessment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-people-treated-by-iapt-for-anxiety-disorders-who-return-to-full-function",
				destination:
					"/indicators/IND37-depression-and-anxiety-recovery-post-iapt",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-patients-with-atrial-fibrillation-on-anticoagulation-admitted-to-hospital-for-stroke",
				destination:
					"/indicators/IND38-atrial-fibrillation-admission-rates-stroke-on-anticoagulation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-patients-with-atrial-fibrillation-not-on-anticoagulation-admitted-to-hospital-for-stroke",
				destination:
					"/indicators/IND39-atrial-fibrillation-admission-rates-stroke-not-on-anticoagulation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admission-rates-for-people-with-diabetes-due-to-complications-associated-with-diabetes",
				destination: "/indicators/IND40-diabetes-admission-rates-complications",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admissions-rates-due-to-angina-in-people-with-diabetes",
				destination: "/indicators/IND41-diabetes-admission-rates-angina",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admissions-rates-due-to-myocardial-infarction-in-people-with-diabetes",
				destination: "/indicators/IND42-diabetes-admission-rates-mi",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admission-rates-due-to-heart-failure-in-people-with-diabetes",
				destination: "/indicators/IND43-diabetes-admission-rates-heart-failure",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admission-rates-due-to-stroke-in-people-with-diabetes",
				destination: "/indicators/IND44-diabetes-admission-rates-stroke",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admissions-rates-for-renal-replacement-therapy-in-people-with-diabetes",
				destination:
					"/indicators/IND45-diabetes-admission-rates-renal-replacement-therapy",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admission-rates-due-to-diabetic-ketoacidosis-in-people-with-diabetes",
				destination: "/indicators/IND46-diabetes-admission-rates-ketoacidosis",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/admission-rates-due-to-lower-limb-amputations-in-people-with-diabetes",
				destination:
					"/indicators/IND47-diabetes-admission-rates-lower-limb-amputation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-children-and-young-people-with-diabetes-who-receive-the-following-individual-care-processes-in-the-past-12-months",
				destination:
					"/indicators/IND48-diabetes-annual-care-processes-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-children-and-young-people-with-diabetes-who-have-had-their-glycated-haemoglobin-a1c-hba1c-monitored-in-the-previous-12-months",
				destination: "/indicators/IND49-diabetes-annual-hba1c-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-children-and-young-people-years-with-diabetes-who-have-had-their-body-mass-index-bmi-recorded",
				destination: "/indicators/IND50-diabetes-annual-bmi-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-young-people-aged-12-18-years-with-diabetes-who-have-had-their-blood-pressure-recorded-in-the-previous-12-months",
				destination:
					"/indicators/IND51-diabetes-annual-blood-pressure-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-young-people-aged-12-18-years-with-diabetes-who-have-had-their-urinary-albumin-recorded-in-the-previous-12-months",
				destination:
					"/indicators/IND52-diabetes-annual-urinary-albumin-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-young-people-aged-12-18-years-with-diabetes-who-have-a-record-of-eye-screening-in-the-previous-12-months",
				destination: "/indicators/IND53-diabetes-annual-eye-screening-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-children-and-young-people-aged-12-18-years-with-diabetes-who-have-a-record-of-a-foot-examination-in-the-previous-12-months",
				destination:
					"/indicators/IND54-diabetes-annual-foot-examination-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-young-people-age-12-18-who-have-had-their-smoking-status-recorded-in-the-previous-12-months",
				destination:
					"/indicators/IND55-diabetes-annual-smoking-status-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-children-and-young-people-with-type-1-diabetes-who-have-been-screened-for-thyroid-and-coeliac-disease",
				destination:
					"/indicators/IND56-diabetes-thyroid-disease-screening-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-children-and-young-people-with-diabetes-who-have-received-a-psychological-assessment-in-the-previous-12-months",
				destination:
					"/indicators/IND57-diabetes-annual-psychological-assessment-children",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/rates-of-hysterectomy",
				destination:
					"/indicators/IND58-gynaecological-conditions-rates-of-hysterectomy-heavy-menstrual-bleeding",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/rates-of-endometrial-ablation",
				destination:
					"/indicators/IND59-gynaecological-conditions-rates-of-endometrial-ablation-heavy-menstrual-bleeding",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/readmission-rates-for-surgical-site-infections-within-30-days-of-discharge-from-surgery",
				destination:
					"/indicators/IND60-healthcare-associated-infections-readmission-rates",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/mortality-rates-directly-associated-with-vte",
				destination:
					"/indicators/IND61-embolism-and-thrombosis-mortality-rates-from-vte",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-pregnant-women-accessing-antenatal-care-who-are-seen-for-booking-by-10-weeks-and-0-days",
				destination: "/indicators/IND62-pregnancy-10-week-booking-appointment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/proportion-of-pregnant-women-who-were-asked-about-their-mental-health-at-their-first-booking-appointment",
				destination:
					"/indicators/IND63-pregnancy-and-neonates-mental-health-at-booking-appointment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-eligible-people-aged-60-74-years-whose-record-shows-a-bowel-screening-test-has-been-performed-within-the-last-2-5-years",
				destination: "/indicators/IND64-cancer-bowel-screening-60-to-74-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-women-aged-50-70-years-whose-record-shows-a-breast-screening-test-has-been-performed-within-the-last-3-years",
				destination: "/indicators/IND65-cancer-breast-screening-50-to-70-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-babies-with-a-not-suspected-result-for-all-the-conditions-tested-for-by-newborn-blood-spot-testing-who-have-a-results-letter-sent-to-their-parents-directly-from-the-child-health-information-service-chis-within-6-weeks-of-birth",
				destination:
					"/indicators/IND66-pregnancy-and-neonates-newborn-blood-spot-test-communication-within-6-weeks-of-birth",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-babies-with-a-not-suspected-result-for-all-the-conditions-tested-for-by-newborn-blood-spot-testing-who-have-a-results-letter-sent-to-their-parents-directly-from-the-child-health-information-service-chis-within-6-weeks-of-notification-of-",
				destination:
					"/indicators/IND67-pregnancy-and-neonates-newborn-blood-spot-test-communication-with-6-weeks-of-movement-in",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-eligible-people-with-diabetes-who-have-not-attended-for-diabetic-eye-screening-in-the-previous-3-years",
				destination:
					"/indicators/IND68-diabetes-did-not-attend-retinal-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-eligible-people-with-diabetes-who-are-offered-an-appointment-for-diabetic-eye-screening",
				destination: "/indicators/IND69-diabetes-offered-retinal-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-eligible-people-with-diabetes-who-are-suspended-from-diabetic-eye-screening-due-to-previous-screening-results",
				destination:
					"/indicators/IND70-diabetes-suspended-from-retinal-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-eligible-people-with-diabetes-who-are-excluded-from-diabetic-eye-screening-as-they-have-opted-out-or-are-classed-as-medically-unfit",
				destination:
					"/indicators/IND71-diabetes-excluded-from-retinal-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-patients-with-st-segment-elevation-myocardial-infarction-stemi-who-had-coronary-reperfusion-therapy",
				destination:
					"/indicators/IND72-myocardial-infarction-coronary-reperfusion",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/CCGOISIndicators/the-proportion-of-patients-with-st-segment-elevation-myocardial-infarction-stemi-who-had-balloon-inflation-for-primary-percutaneous-coronary-intervention-pci-in-less-than-60-minutes-from-time-of-admission-at-a-centre-with-primary-pci-facilities",
				destination:
					"/indicators/IND73-myocardial-infarction-pci-in-less-than-60-minutes",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-patients-with-st-segment-elevation-myocardial-infarction-stemi-who-had-balloon-inflation-for-primary-percutaneous-coronary-intervention-pci-in-less-than-60-minutes-from-time-of-admission-at-a-centre-with-primary-pci-facilities",
				destination:
					"/indicators/IND73-myocardial-infarction-pci-in-less-than-60-minutes",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/CCGOISIndicators/the-time-between-call-for-help-and-balloon-inflation-for-patients-with-st-segment-elevation-myocardial-infarction-stemi-undergoing-reperfusion-by-primary-percutaneous-coronary-intervention-pci",
				destination: "/indicators/IND74-myocardial-infarction-pci-rates",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-time-between-call-for-help-and-balloon-inflation-for-patients-with-st-segment-elevation-myocardial-infarction-stemi-undergoing-reperfusion-by-primary-percutaneous-coronary-intervention-pci",
				destination: "/indicators/IND74-myocardial-infarction-pci-rates",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-patients-with-acute-myocardial-infarction-with-measurement-of-left-ventricular-ejection-fraction-before-discharge",
				destination:
					"/indicators/IND75-myocardial-infarction-measurement-of-ejection-fraction",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/CCGOISIndicators/the-proportion-of-patients-with-acute-myocardial-infarction-who-were-discharged-on-dual-antiplatelet-therapy",
				destination:
					"/indicators/IND76-myocardial-infarction-dual-antiplatelets",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-patients-with-acute-myocardial-infarction-who-were-discharged-on-dual-antiplatelet-therapy",
				destination:
					"/indicators/IND76-myocardial-infarction-dual-antiplatelets",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/ccgoisindicators/the-proportion-of-babies-with-a-screen-positive-newborn-hip-result-who-attend-for-ultrasound-scan-of-the-hips-within-the-designated-timescale",
				destination: "/indicators/IND77-pregnancy-and-neonates-hip-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-under-the-age-of-55-years-who-are-taking-antiepileptic-drugs",
				destination:
					"/indicators/IND78-contraception-advice-for-people-taking-anti-seizure-medication",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/percentage-of-patients-on-the-learning-disability-register-with-down-s-syndrome-aged-18-and-over-who-have-a-record-of-blood-tsh-in-the-previous-15-months-excluding-those-who-are-on-the-thyroid-disease-register",
				destination: "/indicators/IND79-learning-disabilities-annual-tsh-test",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-with-a-new-diagnosis-of-dementia-recorded-in-the-preceding-1-april-to-31-march-with-a-record-of-fbc-calcium-glucose-renal-and-liver-function-thyroid-function-tests-serum-vitamin-b12-and-folate-levels-recorded-between-6-months-be",
				destination:
					"/indicators/IND80-dementia-target-organ-damage-new-diagnoses",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-with-a-record-of-a-foot-examination-and-risk-classification-1-low-risk-normal-sensation-palpable-pulses-2-increased-risk-neuropathy-or-absent-pulses-3-high-risk-neuropathy-or-absent-pulses-plus-deformity-or-skin-ch",
				destination:
					"/indicators/IND81-diabetes-annual-foot-exam-and-risk-classification",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-have-a-record-of-alcohol-consumption-in-the-preceding-15-months",
				destination:
					"/indicators/IND82-bipolar-schizophrenia-and-other-psychoses-annual-record-of-alcohol-consumption",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-have-a-record-of-bmi-in-the-preceding-15-months",
				destination:
					"/indicators/IND83-bipolar-schizophrenia-and-other-psychoses-annual-bmi-recording",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-have-a-record-of-blood-pressure-in-the-preceding-15-months",
				destination:
					"/indicators/IND84-bipolar-schizophrenia-and-other-psychoses-annual-blood-pressure",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-aged-25-or-over-and-who-have-not-attained-the-age-of-65-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-whose-notes-record-that-a-cervical-screening-test-has-been-performed-in-the-preceding-5-years",
				destination:
					"/indicators/IND85-bipolar-schizophrenia-and-other-psychoses-cervical-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-on-lithium-therapy-with-a-record-of-serum-creatinine-and-tsh-in-the-preceding-9-months",
				destination:
					"/indicators/IND86-bipolar-schizophrenia-and-other-psychoses-target-organ-damage",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-on-lithium-therapy-with-a-record-of-lithium-levels-in-the-therapeutic-range-within-the-previous-4-months",
				destination:
					"/indicators/IND87-bipolar-schizophrenia-and-other-psychoses-lithium-levels-in-therapeutic-range",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-newly-diagnosed-with-diabetes-on-the-register-in-the-preceding-1-april-to-31-march-who-have-a-record-of-being-referred-to-a-structured-education-programme-within-9-months-after-entry-on-to-the-diabetes-register",
				destination:
					"/indicators/IND88-diabetes-referral-for-structured-education",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-who-have-a-record-of-a-dietary-review-by-a-suitably-competent-professional-in-the-preceding-15-months",
				destination: "/indicators/IND89-diabetes-annual-dietary-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-1-aged-50-or-over-and-who-have-not-attained-the-age-of-75-with-a-record-of-a-fragility-fracture-on-or-after-1-april-2012-and-a-diagnosis-of-osteoporosis-confirmed-on-dxa-scan-and-2-aged-75-or",
				destination: "/indicators/IND90-osteoporosis-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-aged-50-or-over-and-who-have-not-attained-the-age-of-75-with-a-record-of-a-fragility-fracture-on-or-after-1-april-2012-in-whom-osteoporosis-is-confirmed-on-dxa-scan-who-are-currently-treated-with-an-appropriate-bone-sparing-agen",
				destination:
					"/indicators/IND91-osteoporosis-bone-sparing-agents-50-74-years",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/GPQualityImprovements/the-percentage-of-patients-aged-75-or-over-with-a-fragility-fracture-on-or-after-1-april-2012-who-are-currently-treated-with-an-appropriate-bone-sparing-agent",
				destination:
					"/indicators/IND92-osteoporosis-bone-sparing-agents-75-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-aged-75-or-over-with-a-fragility-fracture-on-or-after-1-april-2012-who-are-currently-treated-with-an-appropriate-bone-sparing-agent",
				destination:
					"/indicators/IND92-osteoporosis-bone-sparing-agents-75-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-peripheral-arterial-disease",
				destination: "/indicators/IND93-peripheral-arterial-disease-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-peripheral-arterial-disease-with-a-record-in-the-preceding-15-months-that-aspirin-or-an-alternative-anti-platelet-is-being-taken",
				destination:
					"/indicators/IND94-peripheral-arterial-disease-antiplatelets",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-hypertension-aged-16-to-74-years-in-whom-there-is-an-annual-assessment-of-physical-activity-using-gppaq-in-the-preceding-15-months",
				destination:
					"/indicators/IND95-hypertension-assessment-of-physical-activity",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-hypertension-aged-16-to-74-years-who-score-less-than-active-on-gppaq-in-the-preceding-15-months-who-also-have-a-record-of-a-brief-intervention-in-the-preceding-15-months",
				destination:
					"/indicators/IND96-hypertension-brief-intervention-to-increase-physical-activity",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-any-or-any-combination-of-the-following-conditions-chd-pad-stroke-or-tia-hypertension-diabetes-copd-ckd-asthma-schizophrenia-bipolar-affective-disorder-or-other-psychoses-who-are-recorded-as-current-smokers-who-have-a-recor",
				destination:
					"/indicators/IND97-smoking-smoking-status-for-people-with-long-term-conditions",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-any-or-any-combination-of-the-following-conditions-chd-pad-stroke-or-tia-hypertension-diabetes-copd-ckd-asthma-schizophrenia-bipolar-affective-disorder-or-other-psychoses-who-smoke-whose-notes-contain-a-record-of-an-offer-o",
				destination:
					"/indicators/IND98-smoking-support-and-treatment-for-people-with-long-term-conditions-or-smi",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-15-years-and-over-who-are-recorded-as-current-smokers-who-have-a-record-of-an-offer-of-support-and-treatment-within-the-preceding-24-months",
				destination:
					"/indicators/IND99-smoking-support-and-treatment-all-patients",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-all-patients-aged-17-or-over-with-diabetes-mellitus-which-specifies-the-type-of-diabetes-where-a-diagnosis-has-been-confirmed",
				destination: "/indicators/IND100-diabetes-register-including-type",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-copd-and-medical-research-council-mrc-dyspnoea-scale--3-at-any-time-in-the-preceding-15-months-with-a-subsequent-record-of-an-offer-of-referral-to-a-pulmonary-rehabilitation-programme",
				destination: "/indicators/IND101-copd-offered-pulmonary-rehabilitation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-heart-failure-diagnosed-within-the-preceding-15-months-with-a-record-of-an-offer-of-referral-for-an-exercise-based-rehabilitation-programme",
				destination:
					"/indicators/IND102-heart-failure-referral-for-cardiac-rehabilitation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-in-the-preceding-1-april-to-31-march-who-have-had-a-bio-psychosocial-assessment-by-the-point-of-diagnosis",
				destination:
					"/indicators/IND103-depression-and-anxiety-biopsychosocial-assessment-at-diagnosis",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-in-the-preceding-1-april-to-31-march-who-have-been-reviewed-within-10-35-days-of-the-date-of-diagnosis",
				destination:
					"/indicators/IND104-depression-and-anxiety-review-within-10-to-35-days",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-male-patients-with-diabetes-with-a-record-of-being-asked-about-erectile-dysfunction-in-the-preceding-15-months",
				destination:
					"/indicators/IND105-diabetes-asking-about-erectile-dysfunction",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-male-patients-with-diabetes-who-have-a-record-of-erectile-dysfunction-with-a-record-of-advice-and-assessment-of-contributory-factors-and-treatment-options-in-the-preceding-15-months",
				destination:
					"/indicators/IND106-diabetes-advice-for-erectile-dysfunction",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-practice-can-produce-a-register-of-all-patients-aged-16-years-and-over-with-rheumatoid-arthritis",
				destination: "/indicators/IND107-rheumatoid-arthritis-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-rheumatoid-arthritis-aged-30-84-years-who-have-had-a-cardiovascular-risk-assessment-using-a-cvd-risk-assessment-tool-adjusted-for-ra-in-the-preceding-15-months",
				destination:
					"/indicators/IND108-rheumatoid-arthritis-cardiovascular-risk-assessment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-50-90-years-with-rheumatoid-arthritis-who-have-had-an-assessment-of-fracture-risk-using-a-risk-assessment-tool-adjusted-for-ra-in-the-preceding-27-months",
				destination:
					"/indicators/IND109-rheumatoid-arthritis-fracture-risk-assessment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-rheumatoid-arthritis-on-the-register-who-have-had-a-face-to-face-review-in-the-preceding-12-months",
				destination: "/indicators/IND110-rheumatoid-arthritis-annual-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-who-have-a-record-of-an-albumin-creatinine-ratio-acr-test-in-the-preceding-15-months",
				destination:
					"/indicators/IND111-diabetes-annual-albumin-creatinine-test",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-40-years-and-over-with-a-blood-pressure-measurement-recorded-in-the-preceding-5-years",
				destination:
					"/indicators/IND112-cardiovascular-disease-prevention-blood-pressure-measurement-every-5-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cancer-diagnosed-within-the-preceding-15-months-who-have-a-review-recorded-as-occurring-within-3-months-of-the-practice-receiving-confirmation-of-the-diagnosis",
				destination: "/indicators/IND113-cancer-3-month-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-dementia-with-the-contact-details-of-a-named-carer-on-their-record",
				destination: "/indicators/IND114-dementia-named-carer",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-diagnosed-on-or-after-1-april-2014-which-has-been-confirmed-by-ambulatory-blood-pressure-monitoring-abpm-or-home-blood-pressure-monitoring-hbpm-in-the-three-months-before-entering-on-to-the-r",
				destination:
					"/indicators/IND115-hypertension-confirming-diagnosis-with-hbpm-or-abpm",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-women-with-diabetes-aged-17-or-over-and-who-have-not-attained-the-age-of-45-who-have-a-record-of-being-given-information-and-advice-about-pregnancy-or-conception-or-contraception-tailored-to-their-pregnancy-and-contraceptive-intentions-r",
				destination:
					"/indicators/IND116-contraception-advice-for-people-with-diabetes",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-with-epilepsy-who-are-aged-18-or-over-but-under-45-who-are-taking-anti-epileptic-drug",
				destination:
					"/indicators/IND117-contraception-advice-for-people-with-epilepsy",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/GPQualityImprovements/the-percentage-of-patients-with-dementia-diagnosed-on-or-after-1-april-2014-with-a-record-of-fbc-calcium-glucose-renal-and-liver-function-thyroid-function-tests-serum-vitamin-b12-and-folate-levels-recorded-up-to-12-months-before-entering-on-to-the-registe",
				destination:
					"/indicators/IND118-dementia-target-organ-damage-all-patients",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-with-dementia-diagnosed-on-or-after-1-april-2014-with-a-record-of-fbc-calcium-glucose-renal-and-liver-function-thyroid-function-tests-serum-vitamin-b12-and-folate-levels-recorded-up-to-12-months-before-entering-on-to-the-registe",
				destination:
					"/indicators/IND118-dementia-target-organ-damage-all-patients",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-learning-disabilities",
				destination: "/indicators/IND119-learning-disabilities-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-who-have-had-the-following-care-processes-performed-in-the-preceding-12-months---bmi-measurement---bp-measurement--hba1c-measurement---cholesterol-measurement---record-of-smoking-status---foot-examination---albumin",
				destination:
					"/indicators/IND120-diabetes-annual-general-practice-checks",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-1st-april-to-31st-march-who-have-a-record-of-urinary-albumin-creatinine-ratio-test-in-the-three-months-before-or-after-the-date-of-entry-to-the-hypertension-register",
				destination:
					"/indicators/IND121-hypertension-urinary-albumin-for-target-organ-damage",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-1st-april-to-31st-march-who-have-a-record-of-a-test-for-haematuria-in-the-three-months-before-or-after-the-date-of-entry-to-the-hypertension-register",
				destination:
					"/indicators/IND122-hypertension-haematuria-for-target-organ-damage",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-1st-april-to-31st-march-who-have-a-record-of-a-12-lead-ecg-performed-in-the-three-months-before-or-after-the-date-of-entry-to-the-hypertension-register",
				destination:
					"/indicators/IND123-hypertension-ecg-for-target-organ-damage",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-with-schizophrenia-bipolar-affective-disorder-or-other-psychoses-under-the-age-of-45-years-who-have-been-given-information-and-advice-in-the-previous-12-months",
				destination:
					"/indicators/IND124-contraception-advice-for-people-with-bipolar-schizophrenia-or-other-psychoses",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/GPQualityImprovements/the-percentage-of-patients-who-had-a-myocardial-infarction-in-the-preceding-1-april-to-31-march-and-who-are-currently-being-treated-with-ace-i-or-arb-if-ace-i-intolerant-dual-anti-platelet-therapy-a-statin-and-a-beta-blocker-for-those-patients-with-left-v",
				destination:
					"/indicators/IND125-myocardial-infarction-medication-for-mi-in-preceding-12-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-who-had-a-myocardial-infarction-in-the-preceding-1-april-to-31-march-and-who-are-currently-being-treated-with-ace-i-or-arb-if-ace-i-intolerant-dual-anti-platelet-therapy-a-statin-and-a-beta-blocker-for-those-patients-with-left-v",
				destination:
					"/indicators/IND125-myocardial-infarction-medication-for-mi-in-preceding-12-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-history-of-myocardial-infarction-more-than-12-months-ago-currently-treated-with-an-ace-i-or-arb-if-ace-i-intolerant-aspirin-or-anticoagulant-and-a-statin",
				destination:
					"/indicators/IND126-myocardial-infarction-medication-for-mi-more-than-12-months-ago",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-atrial-fibrillation-in-whom-stroke-risk-has-been-assessed-using-the-cha2ds2-vasc-score-risk-stratification-scoring-system-in-the-preceding-12-months-excluding-those-whose-previous-cha2ds2-vasc-score-of-2-or-above",
				destination:
					"/indicators/IND127-atrial-fibrillation-annual-stroke-risk-assessment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/in-those-patients-with-atrial-fibrillation-whose-latest-record-of-a-cha2ds2-vasc-score-is-2-or-above-the-percentage-of-patients-who-are-currently-treated-with-anti-coagulation-drug-therapy",
				destination:
					"/indicators/IND128-atrial-fibrillation-current-treatment-with-anticoagulation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-years-or-over-with-ckd-with-classification-of-categories-g3a-to-g5-previously-stage-3-to-5",
				destination:
					"/indicators/IND129-kidney-conditions-ckd-register-3a-to-5",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-on-the-ckd-register-who-have-hypertension-and-proteinuria-and-who-are-currently-being-treated-with-renin-angiotensin-system-antagonists",
				destination:
					"/indicators/IND130-kidney-conditions-ckd-and-reninangiotensin-system-antagonists",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-coronary-heart-disease-who-have-had-influenza-immunisation-in-the-preceding-1-august-to-31-march-nm87",
				destination:
					"/indicators/IND131-immunisation-flu-vaccine-for-people-with-chd",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-coronary-heart-disease-with-a-record-in-the-preceding-12-months-that-aspirin-an-alternative-anti-platelet-therapy-or-an-anti-coagulant-is-being-taken-nm88",
				destination:
					"/indicators/IND132-angina-and-coronary-heart-disease-anti-platelet-or-anticoagulation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-stroke-shown-to-be-non-haemorrhagic-or-a-history-of-tia-who-have-a-record-in-the-preceding-12-months-that-an-anti-platelet-agent-or-an-anti-coagulant-is-being-taken-nm94",
				destination:
					"/indicators/IND133-stroke-and-ischaemic-attack-anti-platelet-or-anticoagulation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-with-a-diagnosis-of-nephropathy-clinical-proteinuria-or-micro-albuminuria-who-are-currently-treated-with-an-ace-i-or-arbs-nm95",
				destination: "/indicators/IND134-diabetes-acei-or-arbs",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-in-whom-the-last-ifcc-hba1c-is-64-mmol-mol-or-less-in-the-preceding-12-months-nm96",
				destination: "/indicators/IND135-diabetes-ifcc-hba1c-64mmolmol-or-less",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-in-whom-the-last-ifcc-hba1c-is-75-mmol-mol-or-less-in-the-preceding-12-months-nm97",
				destination: "/indicators/IND136-diabetes-ifcc-hba1c-75mmolmol-or-less",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-who-have-a-record-of-retinal-screening-in-the-preceding-12-months-nm98",
				destination: "/indicators/IND137-diabetes-annual-retinal-screening",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-hypothyroidism-who-are-currently-treated-with-levothyroxine-nm99",
				destination: "/indicators/IND138-hypothyroidism-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-hypothyroidism-on-the-register-with-thyroid-function-tests-recorded-in-the-preceding-12-months-nm100",
				destination:
					"/indicators/IND139-hypothyroidism-annual-thyroid-function-test",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-copd-with-a-record-of-fev1-in-the-preceding-12-months-nm105",
				destination: "/indicators/IND140-copd-fev1",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-copd-who-have-had-influenza-immunisation-in-the-preceding-1-august-to-31-march-nm106",
				destination:
					"/indicators/IND141-immunisation-flu-vaccine-for-people-with-copd",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-diagnosed-with-dementia-whose-care-plan-has-been-reviewed-in-a-face-to-face-review-in-the-preceding-12-months-nm107",
				destination: "/indicators/IND142-dementia-care-planning",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-have-a-comprehensive-care-plan-documented-in-the-record-in-the-preceding-12-months-agreed-between-individuals-their-family-and-or-carers-as-appropriate-nm108",
				destination:
					"/indicators/IND143-bipolar-schizophrenia-and-other-psychoses-care-planning",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-on-the-ckd-register-whose-notes-have-a-record-of-a-urine-albumin-creatinine-ratio-or-protein-creatinine-ratio-test-in-the-preceding-12-months-nm109",
				destination:
					"/indicators/IND144-kidney-conditions-ckd-urine-albumincreatinine-ratio",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-18-or-over-on-drug-treatment-for-epilepsy-who-have-been-seizure-free-for-the-last-12-months-recorded-in-the-preceding-12-months-inherited-nm110",
				destination:
					"/indicators/IND145-epilepsy-seizure-free-in-preceding-12-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-diagnosed-with-hypertension-diagnosed-on-or-after-1-april-2009-who-are-given-lifestyle-advice-in-the-preceding-12-months-for-smoking-cessation-safe-alcohol-consumption-and-healthy-diet",
				destination: "/indicators/IND146-hypertension-lifestyle-advice",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-women-on-the-register-prescribed-an-oral-or-patch-contraceptive-method-in-the-preceding-12-months-who-also-received-information-from-the-contractor-about-long-acting-reversible-methods-of-contraception-in-the-preceding-12-months-nm114",
				destination:
					"/indicators/IND148-contraception-larc-for-people-on-oral-or-patch-contraceptives",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-on-the-register-prescribed-emergency-hormonal-contraception-1-or-more-times-in-the-preceding-12-months-by-the-contractor-who-have-received-information-from-the-contractor-about-long-acting-reversible-methods-of-contraception-nm115",
				destination:
					"/indicators/IND149-contraception-larc-for-people-using-emergency-contraception",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-aged-25-84-excluding-those-with-pre-existing-chd-diabetes-stroke-and-or-tia-who-have-had-a-cvd-risk-assessment-performed-in-the-preceding-12-months-nm120",
				destination:
					"/indicators/IND150-cardiovascular-disease-prevention-cardiovascular-risk-assessment-for-people-with-bipolar-schizophrenia-or-other-psychoses",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-coronary-heart-disease-stroke-or-tia-diabetes-hypertension-peripheral-arterial-disease-heart-failure-copd-asthma-and-or-rheumatoid-arthritis-who-have-had-a-bmi-recorded-in-the-preceding-12-months-nm121",
				destination:
					"/indicators/IND151-weight-management-bmi-recording-long-term-conditions",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-coronary-heart-disease-stroke-or-transient-ischemic-attack-diabetes-and-or-chronic-obstructive-pulmonary-disease-who-have-influenza-immunisation-in-the-preceding-1-august-and-31-march-nm122",
				destination:
					"/indicators/IND152-immunisation-flu-vaccine-for-people-with-long-term-conditions",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-or-other-psychoses-whose-notes-record-smoking-status-in-the-preceding-12-months-nm124",
				destination:
					"/indicators/IND154-smoking-smoking-status-of-people-with-bipolar-schizophrenia-and-other-psychoses",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-or-other-psychoses-who-are-recorded-as-current-smokers-who-have-a-record-of-an-offer-of-support-and-treatment-within-the-preceding-12-months-nm125",
				destination:
					"/indicators/IND155-smoking-support-and-treatment-for-people-with-bipolar-schizophrenia-and-other-psychoses",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-any-or-any-combination-conditions-chd-pad-stroke-or-tia-hypertension-diabetes-copd-ckd-or-asthma-whose-notes-record-smoking-status-in-preceding-12-months-nm126",
				destination:
					"/indicators/IND156-smoking-smoking-status-of-people-with-long-term-conditions",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-any-or-any-combination-of-the-following-conditions-chd-pad-stroke-or-tia-hypertension-diabetes-copd-ckd-asthma-recorded-as-current-smokers-with-offer-of-support-and-treatment-within-12-months-nm127",
				destination:
					"/indicators/IND157-smoking-support-and-treatment-for-people-with-long-term-conditions",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-18-and-over-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-have-a-record-of-total-cholesterol-hdl-ratio-in-the-preceding-12-months-nm129",
				destination:
					"/indicators/IND158-bipolar-schizophrenia-and-other-psychoses-annual-cholesterol",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-18-years-and-over-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-have-a-record-of-blood-glucose-or-hba1c-in-the-preceding-12-months-nm130",
				destination:
					"/indicators/IND159-bipolar-schizophrenia-and-other-psychoses-annual-blood-glucose-or-hba1c",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-with-a-record-of-testing-of-foot-sensation-using-a-10g-monofilament-within-the-preceding-12-months",
				destination:
					"/indicators/IND160-diabetes-annual-examination-of-foot-sensation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-25-84-years-with-a-new-diagnosis-of-hypertension-or-type-2-diabetes-recorded-between-the-preceding-1-april-to-31-march-excluding-those-with-pre-existing-chd-type1-diabetes-stroke-and-or-tia-who-have-had-a-consultation-nm132",
				destination:
					"/indicators/IND161-cardiovascular-disease-prevention-cardiovascular-risk-assessment-for-people-newly-diagnosed-with-hypertension-or-t2dm",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/in-those-patients-with-a-new-diagnosis-of-hypertension-or-type-2-diabetes-aged-25-84-years-recorded-between-the-preceding-1-april-to-31-march-excluding-those-with-pre-existing-chd-diabetes-stroke-and-or-tia-who-have-a-recorded-cvd-risk-assessment-nm133",
				destination:
					"/indicators/IND162-cardiovascular-disease-prevention-statins-for-people-newly-diagnosed-with-hypertension-or-t2dm",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-who-have-had-influenza-immunisation-in-the-preceding-1-august-to-31-march-nm139",
				destination:
					"/indicators/IND163-immunisation-flu-vaccine-for-people-with-diabetes",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-stroke-or-tia-who-have-had-influenza-immunisation-in-the-preceding-1-august-to-31-march-nm140",
				destination:
					"/indicators/IND164-immunisation-flu-vaccine-for-people-with-stroke-or-tia",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-in-whom-the-last-ifcc-hba1c-is-58-mmol-mol-or-less-in-the-preceding-12-months",
				destination: "/indicators/IND165-diabetes-ifcc-hba1c-58mmolmol-or-less",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/percentage-of-patients-with-type1-diabetes-over-40-years-currently-treated-with-a-statin",
				destination: "/indicators/IND166-diabetes-t1dm-and-statins",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-18-or-over-on-or-after-1-april-2017-who-have-had-a-record-of-a-bmi-being-calculated-in-the-preceding-5-years-and-after-their-18th-birthday",
				destination:
					"/indicators/IND167-weight-management-bmi-calculation-in-preceding-5-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-registered-at-the-practice-aged-65-years-and-over-who-have-been-diagnosed-with-one-or-more-of-the-following-conditions-coronary-heart-disease-heart-failure-hypertension-diabetes-ckd-pad-or-stroke-tia-who-have-had-a-pulse-rhythm-",
				destination:
					"/indicators/IND168-atrial-fibrillation-pulse-rhythm-assessment-in-people-at-risk",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-atrial-fibrillation-currently-treated-with-an-anticoagulant-who-have-had-a-review-in-the-preceding-12-months-which-included-a-assessment-of-stroke-vte-risk-b-assessment-of-bleeding-risk-c-assessment-of-renal-function-creati",
				destination:
					"/indicators/IND169-atrial-fibrillation-review-of-anticoagulation",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-practice-establishes-and-maintains-a-register-of-all-patients-with-a-diagnosis-of-non-diabetic-hyperglycaemia",
				destination: "/indicators/IND170-diabetes-ndh-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-newly-diagnosed-with-non-diabetic-hyperglycaemia-in-the-preceding-12-months-who-have-been-referred-to-a-healthier-you-nhs-diabetes-prevention-programme-for-intensive-lifestyle-advice-ndpp-areas-only",
				destination:
					"/indicators/IND171-diabetes-ndh-diabetes-prevention-programme",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-non-diabetic-hyperglycaemia-who-have-had-an-hba1c-or-fpg-test-in-the-preceding-12-months",
				destination: "/indicators/IND172-diabetes-ndh-annual-hba1c-or-fpg-test",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-women-who-have-had-gestational-diabetes-diagnosed-more-than-12-months-ago-who-have-had-an-hba1c-test-in-the-preceding-12-months",
				destination:
					"/indicators/IND173-diabetes-gestational-diabetes-annual-hba1c-test",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-practice-establishes-and-maintains-a-register-of-all-patients-who-have-had-an-episode-of-aki",
				destination: "/indicators/IND174-kidney-conditions-aki-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-practice-establishes-and-maintains-a-register-of-all-patients-with-a-diagnosis-of-autism",
				destination: "/indicators/IND175-autism-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-proportion-of-women-eligible-for-screening-and-aged-25-49-years-at-end-of-period-reported-whose-notes-record-that-an-adequate-cervical-screening-test-has-been-performed-in-the-previous-3-5-years",
				destination:
					"/indicators/IND176-screening-cervical-screening-25-to-49-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-proportion-of-women-eligible-for-screening-and-aged-50-64-years-at-end-of-period-reported-whose-notes-record-that-an-adequate-cervical-screening-test-has-been-performed-in-the-previous-5-5-years",
				destination:
					"/indicators/IND177-screening-cervical-screening-50-to-64-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-women-who-have-given-birth-in-the-preceding-12-months-who-have-had-an-enquiry-about-their-mental-health-between-4-16-weeks-postpartum",
				destination:
					"/indicators/IND178-pregnancy-and-neonates-postnatal-mental-health",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-without-moderate-or-severe-frailty-on-the-register-in-whom-the-last-ifcc-hba1c-is-58-mmol-mol-or-less-in-the-preceding-12-months",
				destination: "/indicators/IND179-diabetes-hba1c-58-mmolmol",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-with-moderate-or-severe-frailty-on-the-register-in-whom-the-last-ifcc-hba1c-is-75-mmol-mol-or-less-in-the-preceding-12-months",
				destination: "/indicators/IND180-diabetes-hba1c-75-mmolmol",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-25-84-years-with-a-diagnosis-of-type-2-diabetes-without-moderate-or-severe-frailty-not-currently-treated-with-a-statin-who-have-had-a-consultation-for-a-cardiovascular-risk-assessment-using-a-risk-assessment-tool-agreed-wit",
				destination: "/indicators/IND181-diabetes-cvd-risk-assessment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-diagnosis-of-type-2-diabetes-and-a-recorded-cvd-risk-assessment-score-of-10-without-moderate-or-severe-frailty-who-are-currently-treated-with-a-statin-unless-there-is-a-contraindication-or-statin-therapy-is-declined",
				destination:
					"/indicators/IND182-diabetes-statins-for-primary-prevention-of-cvd-t2dm-and-10-risk",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-aged-40-years-and-over-with-no-history-of-cvd-and-without-moderate-or-severe-frailty-who-are-currently-treated-with-a-statin-excluding-patients-with-type-2-diabetes-and-a-cvd-risk-score-of-10-recorded-in-the-preced",
				destination:
					"/indicators/IND183-diabetes-statins-for-primary-prevention-of-cvd-40-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-and-a-history-of-cvd-excluding-a-history-of-haemorrhagic-stroke-who-are-currently-treated-with-a-statin",
				destination:
					"/indicators/IND184-diabetes-statins-for-secondary-prevention-of-cvd",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-atrial-fibrillation-including-patients-with-af-resolved",
				destination: "/indicators/IND185-atrial-fibrillation-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-asthma-aged-5-or-over",
				destination: "/indicators/IND186-asthma-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-asthma-on-the-register-from-start-date-with-a-record-of-spirometry-and-one-other-objective-test-feno-or-reversibility-or-variability-between-3-months-before-or-3-months-after-diagnosis",
				destination: "/indicators/IND187-asthma-objective-tests",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-asthma-on-the-register-who-have-had-an-asthma-review-in-the-preceding-12-months-that-includes-an-assessment-of-asthma-control-using-a-validated-asthma-control-questionnaire-including-assessment-of-short-acting-beta-agonist-",
				destination: "/indicators/IND188-asthma-annual-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-asthma-on-the-register-aged-19-or-under-in-whom-there-is-a-record-of-smoking-status-active-or-passive-in-the-preceding-12-months",
				destination: "/indicators/IND189-asthma-smoking-status-under-19",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-1-patients-with-a-clinical-diagnosis-of-copd-before-start-date-and-2-patients-with-a-clinical-diagnosis-of-copd-on-or-after-start-date-whose-diagnosis-has-been-confirmed-by-a-quality-assured-post-bron",
				destination: "/indicators/IND190-copd-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-copd-on-the-register-who-have-had-a-review-in-the-preceding-12-months-including-a-record-of-the-number-of-exacerbations-and-an-assessment-of-breathlessness-using-the-medical-research-council-dyspnoea-scale",
				destination: "/indicators/IND191-copd-annual-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-diagnosis-of-heart-failure-after-start-date-which-has-been-confirmed-by-an-echocardiogram-or-by-specialist-assessment-between-3-months-before-or-3-months-after-entering-on-to-the-register",
				destination:
					"/indicators/IND192-heart-failure-confirmation-of-diagnosis",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-current-diagnosis-of-heart-failure-due-to-left-ventricular-systolic-dysfunction-who-are-currently-treated-with-an-ace-i-or-arb",
				destination: "/indicators/IND193-heart-failure-acei-or-arbs",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-current-diagnosis-of-heart-failure-due-to-left-ventricular-systolic-dysfunction-who-are-currently-treated-with-a-beta-blocker-licensed-for-heart-failure",
				destination: "/indicators/IND194-heart-failure-beta-blockers",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-heart-failure-on-the-register-who-had-a-review-in-the-preceding-12-months-including-an-assessment-of-functional-capacity-using-the-new-york-heart-association-classification-and-a-review-of-medication",
				destination: "/indicators/IND195-heart-failure-annual-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-12-months-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-the-date-of-entry-on-the-hypertension-register",
				destination:
					"/indicators/IND196-alcohol-use-risk-assessment-for-people-with-hypertension",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-12-months-with-a-fast-score-of-3-or-audit-c-score-of-5-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-",
				destination:
					"/indicators/IND197-alcohol-use-brief-intervention-for-people-with-hypertension",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-or-anxiety-in-the-preceding-12-months-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-their-diagnosis-being-recorded",
				destination:
					"/indicators/IND198-alcohol-use-risk-assessment-for-people-with-depression-or-anxiety",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-or-anxiety-and-a-fast-score-of-3-or-audit-c-score-of-5-in-the-preceding-12-months-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-scor",
				destination:
					"/indicators/IND199-alcohol-use-brief-intervention-for-people-with-depression-or-anxiety",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-with-a-fast-score-of-3-or-audit-c-score-of-5-in-the-preceding-12-months-who-have-received-a-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-with",
				destination:
					"/indicators/IND200-alcohol-use-brief-intervention-for-people-with-smi",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-preceding-2-years",
				destination:
					"/indicators/IND201-alcohol-use-risk-assessment-for-people-with-a-long-term-condition",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-audit-c-score-of-5-in-the-preceding-2-years-who-have-received-brief-interven",
				destination:
					"/indicators/IND202-alcohol-use-brief-intervention-for-people-with-a-long-term-condition",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-people-aged-29-years-and-under-with-a-total-cholesterol-concentration-greater-than-7-5-mmol-l-that-are-assessed-against-the-simon-broome-or-dutch-lipid-clinic-network-dlcn-criteria",
				destination:
					"/indicators/IND203-lipids-disorders-fh-assessment-29-years-and-under",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-people-aged-30-years-and-older-with-a-total-cholesterol-concentration-greater-than-9-0mmol-l-that-are-assessed-against-the-simon-broome-or-dutch-lipid-clinic-network-dlcn-criteria",
				destination:
					"/indicators/IND204-lipids-disorders-fh-assessment-30-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-practice-can-produce-a-register-of-people-with-multimorbidity-who-would-benefit-from-a-tailored-approach-to-care",
				destination:
					"/indicators/IND205-multiple-long-term-conditions-multimorbidity-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-practice-can-produce-a-register-of-people-with-moderate-to-severe-frailty",
				destination:
					"/indicators/IND206-multiple-long-term-conditions-frailty-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-moderate-or-severe-frailty-and-or-multimorbidity-who-have-received-a-medication-review-in-the-last-12-months-which-is-structured-has-considered-the-use-of-a-recognised-tool-and-taken-place-as-a-shared-discussion",
				destination:
					"/indicators/IND207-multiple-long-term-conditions-medication-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-65-years-and-over-with-moderate-or-severe-frailty-who-have-been-asked-whether-they-have-had-a-fall-about-the-total-number-of-falls-and-about-the-type-of-falls-in-the-last-12-months",
				destination:
					"/indicators/IND208-multiple-long-term-conditions-falls-risk-assessment",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-65-years-and-over-with-moderate-or-severe-frailty-who-have-been-asked-whether-they-have-had-a-fall-about-the-total-number-of-falls-and-about-the-type-of-falls-in-the-last-12-months-were-found-to-be-at-risk-and-have-been-pro",
				destination:
					"/indicators/IND209-multiple-long-term-conditions-falls-prevention-advice",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-adults-and-young-people-newly-registered-with-a-gp-in-an-area-of-high-or-extremely-high-hiv-prevalence-who-receive-an-hiv-test-within-3-months-of-registration",
				destination: "/indicators/IND210-hiv-testing-at-registration",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-adults-and-young-people-at-a-gp-surgery-in-an-area-of-high-or-extremely-high-hiv-prevalence-who-have-not-had-an-hiv-test-in-the-last-12-months-who-are-having-a-blood-test-and-receive-an-hiv-test-at-the-same-time",
				destination: "/indicators/IND211-hiv-routine-blood-tests",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-very-severe-chronic-obstructive-pulmonary-disease-copd-with-a-record-of-oxygen-saturation-value-within-the-preceding-12-months",
				destination: "/indicators/IND212-copd-oxygen-saturation-recording",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-aged-25-or-over-and-who-have-not-attained-the-age-of-50-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-whose-notes-record-that-a-cervical-screening-test-has-been-performed-in-the-preceding-3-years-and-6-months",
				destination:
					"/indicators/IND213-bipolar-schizophrenia-and-other-psychoses-cervical-screening-25-to-49-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-women-aged-50-or-over-and-who-have-not-attained-the-age-of-65-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-whose-notes-record-that-a-cervical-screening-test-has-been-performed-in-the-preceding-5-years-and-6-months",
				destination:
					"/indicators/IND214-bipolar-schizophrenia-and-other-psychoses-cervical-screening-50-to-64-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-babies-who-reached-8-months-old-in-the-preceding-12-months-who-have-received-at-least-3-doses-of-a-diphtheria-tetanus-and-pertussis-containing-vaccine-before-the-age-of-8-months",
				destination: "/indicators/IND215-immunisation-dtap-18-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-children-who-reached-18-months-old-in-the-preceding-12-months-who-have-received-at-least-1-dose-of-mmr-between-the-ages-of-12-and-18-months",
				destination: "/indicators/IND216-immunisation-mmr-18-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-children-who-reached-5-years-old-in-the-preceding-12-months-who-have-received-a-reinforcing-dose-of-dtap-ipv-and-at-least-2-doses-of-mmr-between-the-ages-of-1-and-5-years",
				destination: "/indicators/IND217-immunisation-dtapipv-and-mmr-5-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-children-who-reached-5-years-old-in-the-preceding-12-months-who-have-received-1-dose-of-mmr-between-the-ages-of-1-and-5-years",
				destination: "/indicators/IND218-immunisation-mmr-5-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-who-reached-75-years-old-in-the-preceding-12-months-who-have-received-a-shingles-vaccine-between-the-ages-of-70-and-75-years",
				destination: "/indicators/IND219-immunisation-shingles",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-bmi-of-27-5-kg-m2-or-more-or-30-kg-m2-or-more-if-ethnicity-is-recorded-as-white-in-the-preceding-12-months-who-have-been-offered-referral-to-a-weight-management-programme-within-90-days-of-the-bmi-being-recorded",
				destination:
					"/indicators/IND220-weight-management-referral-to-weight-management-programmes-for-obesity",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-hypertension-or-diabetes-and-a-bmi-of-27-5-kg-m2-or-more-or-30-kg-m2-or-more-if-ethnicity-is-recorded-as-white-in-the-preceding-12-months-who-have-been-referred-to-a-weight-management-programme-within-90-days-of-the-bmi-bei",
				destination:
					"/indicators/IND221-weight-management-referral-to-weight-management-programmes-for-obesity-co-existing-hypertension-or-diabetes",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cancer-diagnosed-within-the-preceding-12-months-who-have-had-a-discussion-within-3-months-of-diagnosis-about-the-support-available-from-primary-care",
				destination: "/indicators/IND222-cancer-review-within-3-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cancer-diagnosed-within-the-preceding-24-months-who-have-a-patient-cancer-care-review-using-a-structured-template-within-12-months-of-diagnosis",
				destination: "/indicators/IND223-cancer-review-within-12-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-babies-who-reached-24-weeks-old-in-the-preceding-12-months-who-have-received-2-doses-of-rotavirus-vaccine-before-the-age-of-24-weeks",
				destination: "/indicators/IND224-immunisation-rotavirus-24-weeks",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-babies-who-reached-8-months-old-in-the-preceding-12-months-who-have-received-2-doses-of-a-meningitis-b-vaccine-before-the-age-of-8-months",
				destination: "/indicators/IND225-immunisation-meningitis-b-8-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-babies-who-reached-18-months-old-in-the-preceding-12-months-who-have-received-2-primary-doses-and-1-booster-dose-of-a-meningitis-b-vaccine-before-the-age-of-18-months",
				destination: "/indicators/IND226-immunisation-meningitis-b-18-months",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-adults-receiving-drug-treatment-for-epilepsy-who-had-a-structured-review-in-the-preceding-12-months",
				destination: "/indicators/IND227-epilepsy-annual-review",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-cvd-risk-assessment-score-of-10-or-more-identified-in-the-preceding-12-months-who-are-offered-advice-and-support-for-smoking-cessation-safe-alcohol-consumption-healthy-diet-and-exercise-within-3-months-of-the-score-being-",
				destination:
					"/indicators/IND228-cardiovascular-disease-prevention-primary-prevention-with-lifestyle-changes",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-cvd-risk-assessment-score-of-10-or-more-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND229-cardiovascular-disease-prevention-primary-prevention-with-lipid-lowering-therapies",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cvd-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND230-cardiovascular-disease-prevention-secondary-prevention-with-lipid-lowering-therapies",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-ckd-on-the-register-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND231-kidney-conditions-ckd-and-lipid-lowering-therapies",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-excluding-those-on-the-ckd-register-prescribed-long-term-chronic-oral-non-steroidal-anti-inflammatory-drugs-nsaids-who-have-had-an-egfr-measurement-in-the-preceding-12-months",
				destination:
					"/indicators/IND232-kidney-conditions-egfr-for-long-term-nsaid-use",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-ckd-stage-g3a-g5-on-the-register-within-the-preceding-12-months-who-had-egfr-measured-on-at-least-2-occasions-separated-by-at-least-90-days-and-the-second-test-within-90-days-before-the-diagnosis",
				destination: "/indicators/IND233-kidney-conditions-ckd-and-egfr",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-ckd-stage-g3a-g5-on-the-register-within-the-preceding-12-months-who-had-egfr-and-acr-urine-albumin-to-creatinine-ratio-measurements-recorded-within-90-days-before-or-after-diagnosis",
				destination: "/indicators/IND234-kidney-conditions-ckd-egfr-and-acr",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-on-the-ckd-register-and-with-an-albumin-to-creatinine-ratio-acr-of-less-than-70-mg-mmol-without-moderate-or-severe-frailty-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-135-85-mmhg-if-u",
				destination:
					"/indicators/IND235-kidney-conditions-ckd-and-blood-pressure-when-acr-less-than-70",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-or-over-with-a-bmi-of-23-kg-m2-or-more-or-25-kg-m2-or-more-if-ethnicity-is-recorded-as-white-in-the-preceding-12-months",
				destination: "/indicators/IND237-weight-management-overweight-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-or-over-with-a-bmi-of-27-5-kg-m2-or-more-or-30-kg-m2-or-more-if-ethnicity-is-recorded-as-white-in-the-preceding-12-months",
				destination: "/indicators/IND238-weight-management-obesity-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-or-over-with-a-bmi-of-27-5-kg-m2-or-more-or-30-kg-m2-or-more-if-ethnicity-is-recorded-as-white-in-the-preceding-12-months",
				destination: "/indicators/IND238-weight-management-obesity-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-79-years-or-under-with-hypertension-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-135-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-140-90-mmhg-if-monitored-in-clinic",
				destination:
					"/indicators/IND239-hypertension-blood-pressure-79-years-and-under",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-80-years-or-over-with-hypertension-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-145-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-150-90-mmhg-if-monitored-in-clinic",
				destination:
					"/indicators/IND240-hypertension-blood-pressure-80-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-79-years-or-under-with-coronary-heart-disease-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-135-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-140-90-mmhg-if-monitored",
				destination:
					"/indicators/IND241-angina-and-coronary-heart-disease-blood-pressure-79-years-and-under",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-80-years-or-over-with-coronary-heart-disease-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-145-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-150-90-mmhg-if-monitored-",
				destination:
					"/indicators/IND242-angina-and-coronary-heart-disease-blood-pressure-80-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-79-years-or-under-with-a-history-of-stroke-or-tia-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-135-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-140-90-mmhg-if-monit",
				destination:
					"/indicators/IND243-stroke-and-ischaemic-attack-blood-pressure-79-years-and-under",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-80-years-or-over-with-a-history-of-stroke-or-tia-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-145-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-150-90-mmhg-if-monito",
				destination:
					"/indicators/IND244-stroke-and-ischaemic-attack-blood-pressure-80-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-aged-79-years-or-under-with-peripheral-arterial-disease-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-135-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-140-90-mmhg-if-moni",
				destination:
					"/indicators/IND245-peripheral-arterial-disease-blood-pressure-79-years-and-under",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-aged-80-years-or-over-with-peripheral-arterial-disease-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-145-85-mmhg-if-using-ambulatory-or-home-monitoring-or-less-than-150-90-mmhg-if-monit",
				destination:
					"/indicators/IND246-peripheral-arterial-disease-blood-pressure-80-years-and-over",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/percentage-of-patients-with-atrial-fibrillation-and-a-last-recorded-cha2ds2-vasc-score-of-2-or-more-who-are-currently-prescribed-a-direct-acting-oral-anticoagulant-doac-if-eligible-or-a-vitamin-k-antagonist-if-not-eligible-for-a-doac-or-a-doac-is-declined",
				destination:
					"/indicators/IND247-atrial-fibrillation-doacs-and-vitamin-k-antagonists",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/percentage-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-who-in-the-preceding-12-months-received-all-six-elements-of-physical-health-checks-for-people-with-severe-mental-illness",
				destination:
					"/indicators/IND248-bipolar-schizophrenia-and-other-psychoses-6-physical-health-checks",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-on-the-register-aged-79-years-and-under-without-moderate-or-severe-frailty-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-135-85-mmhg-if-using-ambulatory-or-home-monitoring",
				destination:
					"/indicators/IND249-diabetes-blood-pressure-without-moderate-or-severe-frailty",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-all-cancer-patients-excluding-non-melanotic-skin-cancers",
				destination: "/indicators/IND250-cancer-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-all-cancer-patients-excluding-non-melanotic-skin-cancers",
				destination: "/indicators/IND250-cancer-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-coronary-heart-disease",
				destination: "/indicators/IND251-coronary-heart-disease-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-coronary-heart-disease",
				destination: "/indicators/IND251-coronary-heart-disease-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-diagnosed-with-dementia",
				destination: "/indicators/IND252-dementia-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-diagnosed-with-dementia",
				destination: "/indicators/IND252-dementia-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-or-over-receiving-drug-treatment-for-epilepsy",
				destination: "/indicators/IND253-epilepsy-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-or-over-receiving-drug-treatment-for-epilepsy",
				destination: "/indicators/IND253-epilepsy-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-aged-18-or-over-with-heart-failure",
				destination: "/indicators/IND254-heart-failure-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-established-hypertension",
				destination: "/indicators/IND255-hypertension-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-established-hypertension",
				destination: "/indicators/IND255-hypertension-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-and-other-patients-on-lithium-therapy",
				destination:
					"/indicators/IND256-bipolar-schizophrenia-and-other-psychoses-register-lithium-therapy",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses-and-other-patients-on-lithium-therapy",
				destination:
					"/indicators/IND256-bipolar-schizophrenia-and-other-psychoses-register-lithium-therapy",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses",
				destination:
					"/indicators/IND257-bipolar-schizophrenia-and-other-psychoses-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-schizophrenia-bipolar-affective-disorder-and-other-psychoses",
				destination:
					"/indicators/IND257-bipolar-schizophrenia-and-other-psychoses-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-contractor-establishes-and-maintains-a-register-of-patients-in-need-of-palliative-care-or-support",
				destination: "/indicators/IND258-gp-services-palliative-care-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-in-need-of-palliative-care-or-support",
				destination: "/indicators/IND258-gp-services-palliative-care-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-contractor-establishes-and-maintains-a-register-of-patients-with-stroke-or-transient-ischaemic-attack-tia",
				destination: "/indicators/IND259-stroke-and-ischaemic-attack-register",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-percentage-of-patients-with-a-total-cholesterol-reading-greater-than-7-5-mmol-litre-when-aged-29-years-or-under-or-greater-than-9-0-mmol-litre-when-aged-30-years-or-over-who-have-been-diagnosed-with-secondary-hyperlipidaemia-or-clinically-assessed-for",
				destination:
					"/indicators/IND260-lipid-disorders-fh-assessment-and-diagnosis-historical-readings",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-total-cholesterol-reading-greater-than-7-5-mmol-litre-when-aged-29-years-or-under-or-greater-than-9-0-mmol-litre-when-aged-30-years-or-over-who-have-been-diagnosed-with-secondary-hyperlipidaemia-or-clinically-assessed-for",
				destination:
					"/indicators/IND260-lipid-disorders-fh-assessment-and-diagnosis-historical-readings",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-percentage-of-patients-with-a-total-cholesterol-reading-in-the-preceding-12-months-greater-than-7-5-mmol-litre-who-have-been-diagnosed-with-secondary-hyperlipidaemia-or-clinically-assessed-for-familial-hypercholesterolaemia-or-referred-for-assessment-        ",
				destination:
					"/indicators/IND261-lipid-disorders-fh-assessment-and-diagnosis-new-readings",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-total-cholesterol-reading-in-the-preceding-12-months-greater-than-7-5-mmol-litre-who-have-been-diagnosed-with-secondary-hyperlipidaemia-or-clinically-assessed-for-familial-hypercholesterolaemia-or-referred-for-assessment-",
				destination:
					"/indicators/IND261-lipid-disorders-fh-assessment-and-diagnosis-new-readings",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-on-the-ckd-register-and-currently-treated-with-an-arb-or-an-ace-inhibitor-who-are-also-currently-treated-with-an-sglt2-inhibitor-if-they-have-either-no-type-2-diabetes-and-a-urine-acr-of-22-6-mg-mmol-or-more-or-type-2-diabetes-a",
				destination:
					"/indicators/IND262-kidney-conditions-ckd-and-sglt2-inhibitors",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/GPQualityImprovements/the-percentage-of-patients-on-the-ckd-register-and-with-an-albumin-to-creatinine-ratio-acr-of-70-mg-mmol-or-more-without-diabetes-who-are-currently-treated-with-an-arb-or-an-ace-inhibitor",
				destination: "/indicators/IND263-kidney-conditions-ckd-acei-and-arb",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-on-the-ckd-register-and-with-an-albumin-to-creatinine-ratio-acr-of-70-mg-mmol-or-more-without-diabetes-who-are-currently-treated-with-an-arb-or-an-ace-inhibitor",
				destination: "/indicators/IND263-kidney-conditions-ckd-acei-and-arb",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/GPQualityImprovements/the-percentage-of-patients-on-the-ckd-register-and-with-an-albumin-to-creatinine-ratio-acr-of-70-mg-mmol-or-more-without-moderate-or-severe-frailty-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-125-75-mmhg-if-usi",
				destination:
					"/indicators/IND264-kidney-conditions-ckd-and-blood-pressure-when-acr-70-or-more",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/gpqualityimprovements/the-percentage-of-patients-on-the-ckd-register-and-with-an-albumin-to-creatinine-ratio-acr-of-70-mg-mmol-or-more-without-moderate-or-severe-frailty-in-whom-the-last-blood-pressure-reading-measured-in-the-preceding-12-months-is-less-than-125-75-mmhg-if-usi",
				destination:
					"/indicators/IND264-kidney-conditions-ckd-and-blood-pressure-when-acr-70-or-more",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-on-the-learning-disability-register-who-received-a-learning-disability-health-check-and-had-a-completed-health-action-plan-in-the-preceding-12-months",
				destination:
					"/indicators/IND265-learning-disabilities-health-checks-and-action-plans",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-on-the-learning-disability-register-who-received-a-learning-disability-health-check-and-had-a-completed-health-action-plan-in-the-preceding-12-months-and-have-a-recording-of-ethnicity",
				destination:
					"/indicators/IND266-learning-disabilities-health-checks-action-plans-and-ethnicity",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-urgent-suspected-colorectal-cancer-referrals-accompanied-by-a-faecal-immunochemical-test-fit-result-with-the-result-recorded-in-the-twenty-one-days-leading-up-to-the-referral",
				destination: "/indicators/IND267-cancer-faecal-immunochemical-testing",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cvd-in-whom-the-last-recorded-ldl-cholesterol-level-is-2-0-mmol-per-litre-or-less-or-last-recorded-non-hdl-cholesterol-level-is-2-6-mmol-per-litre-or-less-if-ldl-cholesterol-is-not-recorded",
				destination:
					"/indicators/IND268-cardiovascular-disease-prevention-cholesterol-treatment-target-secondary-prevention",
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
