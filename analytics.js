(function () {
  const config = window.siteAnalytics || {};
  window.dataLayer = window.dataLayer || [];
  let popupTimer;

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

  function showTestPopup() {
    let popup = document.querySelector(".test-error-popup");

    if (!popup) {
      popup = document.createElement("div");
      popup.className = "test-error-popup";
      popup.setAttribute("role", "alert");
      popup.setAttribute("aria-live", "assertive");
      popup.textContent = "حدث خطأ، حاول مرة أخرى لاحقًا.";
      document.body.appendChild(popup);
    }

    window.clearTimeout(popupTimer);
    popup.classList.add("is-visible");
    popupTimer = window.setTimeout(function () {
      popup.classList.remove("is-visible");
    }, 3200);
  }

  function sendTelegramNotification(params) {
    const telegram = config.telegram || {};
    const botToken = typeof telegram.botToken === "string" ? telegram.botToken.trim() : "";
    const chatId = typeof telegram.chatId === "string" ? telegram.chatId.trim() : "";

    if (!botToken || !chatId) return;

    const text = [
      "CTA click",
      "Button: " + (params.event_label || "unknown"),
      "Page: " + (params.page_title || document.title),
      "URL: " + (params.page_location || window.location.href),
      "Target: " + (params.link_url || "")
    ].join("\n");

    fetch("https://api.telegram.org/bot" + encodeURIComponent(botToken) + "/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      }),
      keepalive: true
    }).catch(function () {
      if (config.debug) {
        console.info("[analytics] Telegram notification failed.");
      }
    });
  }

  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-analytics-event]");
    if (!trigger) return;

    if (config.ctaTestMode) {
      event.preventDefault();
      event.stopPropagation();
    }

    const eventParams = {
      event_category: trigger.dataset.analyticsCategory || "engagement",
      cta_location: trigger.dataset.analyticsLabel || trigger.textContent.trim(),
      event_label: trigger.dataset.analyticsLabel || trigger.textContent.trim(),
      link_url: trigger.href || "",
      page_location: window.location.href,
      page_title: document.title
    };

    pushEvent(trigger.dataset.analyticsEvent, eventParams);

    if (config.ctaTestMode) {
      showTestPopup();
      sendTelegramNotification(eventParams);
    }
  });
})();
