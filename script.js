const faqItems = document.querySelectorAll(".faq__list details");

faqItems.forEach((item) => {
  const summary = item.querySelector("summary");

  if (item.open) {
    item.classList.add("is-open");
  }

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    if (item.open) {
      item.classList.remove("is-open");
      window.setTimeout(() => item.removeAttribute("open"), 320);
      return;
    }

    faqItems.forEach((other) => {
      if (other === item || !other.open) return;
      other.classList.remove("is-open");
      window.setTimeout(() => other.removeAttribute("open"), 320);
    });

    item.setAttribute("open", "");
    window.requestAnimationFrame(() => {
      item.classList.add("is-open");
    });
  });
});
