/**
 * A stand-in for the AWS WAF JavaScript SDK (jsapi.js), so the client integration can be developed
 * and demonstrated before a web ACL exists to point at. See docs/aws-waf-ddos-mitigation.md.
 *
 * Point `AWS_WAF_SCRIPT_URL` at it and everything the real SDK gives us is present: the API on
 * `window.AwsWafIntegration`, an `aws-waf-token` cookie, and a token attached to `fetch` calls. What
 * it can't do is give you a token AWS will actually honour, so it proves our wiring and nothing more.
 *
 * ! Delete this file once the real integration URL is available. It is served from _public_, so it
 * ! deploys with the app, and a fake token generator on a live environment is nobody's friend.
 *
 * @see https://docs.aws.amazon.com/waf/latest/developerguide/waf-js-challenge-api-specification.html
 */

/* eslint-env browser */
/* This is served as-is from _public_, so it's plain ES5 with no build step behind it, and the only
environment it ever runs in is the browser - unlike the rest of the JS in this repo, which eslint is
configured to treat as node */

(function mockAwsWafIntegration() {
	"use strict";

	/** Seconds a token stays valid. Mirrors the default web ACL immunity time of 5 minutes */
	var TOKEN_LIFETIME = 300;

	/** The cookie the real SDK writes, and the one our WAF rules would check */
	var COOKIE_NAME = "aws-waf-token";

	function readToken() {
		var match = document.cookie.match(
			new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)")
		);

		return match ? decodeURIComponent(match[1]) : null;
	}

	function writeToken() {
		// Deliberately not a real token: it's obvious in DevTools that this is the mock, and it
		// would be rejected out of hand if it ever reached AWS
		var token =
			"mock:" +
			Date.now().toString(36) +
			":" +
			Math.random().toString(36).slice(2);

		document.cookie =
			COOKIE_NAME +
			"=" +
			encodeURIComponent(token) +
			"; path=/; max-age=" +
			TOKEN_LIFETIME +
			"; SameSite=Strict";

		return token;
	}

	window.AwsWafIntegration = {
		/**
		 * Resolves with the current token, acquiring one first if we don't hold a valid one. The
		 * real SDK does a silent browser challenge here and can reject on timeout, so the promise
		 * is genuine rather than a convenience.
		 */
		getToken: function getToken() {
			var token = readToken() || writeToken();

			return Promise.resolve(token);
		},

		/** Whether we currently hold an unexpired token */
		hasToken: function hasToken() {
			return readToken() !== null;
		},

		/** A `fetch` wrapper that attaches the token, for calls that don't send the cookie */
		fetch: function wafFetch(input, init) {
			return window.AwsWafIntegration.getToken().then(function withToken(
				token
			) {
				var options = init || {},
					headers = new Headers(options.headers || {});

				headers.set("x-aws-waf-token", token);

				return window.fetch(
					input,
					Object.assign({}, options, { headers: headers })
				);
			});
		},
	};

	// The real SDK challenges the browser as soon as it loads, so that a token is in hand before
	// anything needs one. Do the same, or hasToken() would be false until something asked
	window.AwsWafIntegration.getToken().then(function announce() {
		console.info(
			"[mock-aws-waf] Stand-in for the AWS WAF SDK is active and holds a fake token. " +
				"Tokens from this script are not valid with AWS - see docs/aws-waf-ddos-mitigation.md"
		);
	});
})();
