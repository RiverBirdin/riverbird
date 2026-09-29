/**
 * Copy to config.secrets.js (gitignored) on each environment — upload to Hostinger too.
 * Google Cloud: enable "Places API (New)", billing on, key restricted to https://riverbird.in/*
 * Live rating/count in the footer patches the review widget when this key works.
 */
window.RIVERBIRD_SECRETS = {
  placesApiKey: 'YOUR_GOOGLE_PLACES_API_KEY'
};
