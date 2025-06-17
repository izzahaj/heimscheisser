const BASE_URL = "http://localhost:";

// Toilet Service
const TOILET_SVC_PORT = 5000;
const TOILET_SVC_PREFIX = "/api/v1/toilet-service";
const TOILET_SVC_RESOURCE = "/toilets";
const NEARBY = "/nearby";
export const TOILET_SVC_URI =
  BASE_URL + TOILET_SVC_PORT + TOILET_SVC_PREFIX + TOILET_SVC_RESOURCE;
export const TOILET_SVC_NEARBY_URI = TOILET_SVC_URI + NEARBY;
