(function () {
  const config = window.siteAnalytics || {};
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
