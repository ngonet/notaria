// Regions each HTTP function that Hosting rewrites to is deployed in. Each
// firebase.json rewrite must target one of its function's regions (checked by
// regions.test.ts). Functions handling personal data run in Santiago
// (southamerica-west1). calendarProxy has no region option of its own: it
// uses the setGlobalOptions default in index.ts.
//
// contactForm is moving to Santiago in two deploys: this one adds the
// southamerica-west1 copy while /api/contact still targets us-central1 (a
// Hosting preview can only rewrite to functions that already exist); the
// next one moves the rewrite and drops us-central1.
export const FUNCTION_REGIONS = {
  calendarProxy: ["us-central1"],
  contactForm: ["us-central1", "southamerica-west1"],
  deedLookup: ["southamerica-west1"],
  publishedTemplates: ["southamerica-west1"],
} as const;
