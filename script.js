const faqItems = document.querySelectorAll(".faq__list details");

faqItems.forEach((item) => {
  const summary = item.querySelector("summary");
  const answer = item.querySelector(".faq__answer");

  if (item.open) {
    item.classList.add("is-open");
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  }

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    if (item.open) {
      item.classList.remove("is-open");
      answer.style.maxHeight = "0px";
      window.setTimeout(() => item.removeAttribute("open"), 320);
      return;
    }

    faqItems.forEach((other) => {
      if (other === item || !other.open) return;
      const otherAnswer = other.querySelector(".faq__answer");
      other.classList.remove("is-open");
      otherAnswer.style.maxHeight = "0px";
      window.setTimeout(() => other.removeAttribute("open"), 320);
    });

    item.setAttribute("open", "");
    window.requestAnimationFrame(() => {
      item.classList.add("is-open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    });
  });
});

window.addEventListener("resize", () => {
  faqItems.forEach((item) => {
    if (!item.open) return;
    const answer = item.querySelector(".faq__answer");
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  });
});
