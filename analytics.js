(function () {
  const config = window.siteAnalytics || {};
  const gtmId = typeof config.gtmId === "string" ? config.gtmId.trim() : "";
  const canLoadGtm = /^GTM-[A-Z0-9]+$/i.test(gtmId);

  window.dataLayer = window.dataLayer || [];

  function pushEvent(eventName, params) {
    window.dataLayer.push({
      event: eventName,
      ...params
    });

    if (config.debug) {
      console.info("[analytics]", eventName, params);
    }
  }

  window.trackSiteEvent = pushEvent;

  if (canLoadGtm) {
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js"
    });

    const firstScript = document.getElementsByTagName("script")[0];
    const tagManagerScript = document.createElement("script");
    tagManagerScript.async = true;
    tagManagerScript.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId);
    firstScript.parentNode.insertBefore(tagManagerScript, firstScript);
  } else if (config.debug) {
    console.info("[analytics] Add a GTM container ID in analytics-config.js to enable tracking.");
  }

  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-analytics-event]");
    if (!trigger) return;

    pushEvent(trigger.dataset.analyticsEvent, {
      event_category: trigger.dataset.analyticsCategory || "engagement",
      event_label: trigger.dataset.analyticsLabel || trigger.textContent.trim(),
      link_url: trigger.href || "",
      page_location: window.location.href,
      page_title: document.title
    });
  });
})();
