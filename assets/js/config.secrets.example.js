/**
 * Copy to config.secrets.js (gitignored) on each environment — upload to Hostinger too.
 * Google Cloud: enable Maps JavaScript API + Places API (New), billing on.
 * Restrict the key to https://riverbird.in/* (HTTP referrers).
 * Footer badge uses Google when this key works; otherwise rating/count from the GRW API feed (syncs on a delay).
 */
window.RIVERBIRD_SECRETS = {
  placesApiKey: 'YOUR_GOOGLE_PLACES_API_KEY'
};
