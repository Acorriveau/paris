(() => {
  const SAGE = "#659276";
  const rows = window.COMIC_ROWS || {};
  const hot = (window.HOT_TOPICS || []).slice(0, 6);
  let hotIndex = 0;
  let hotTimer;
  const $ = (selector, root=document) => root.querySelector(selector);

  function cardMarkup(comic) {
    const visual = comic.cover
      ? `<img src="${comic.cover}" alt="${comic.title} cover art" loading="lazy">`
      : `<div class="cover-art ${comic.style || "art-blue"}"><small>${comic.publisher || "COMIC BOOKS"}</small><strong>${comic.title}</strong><em>ISSUE NO. 01</em></div>`;
    return `<a class="comic-card" href="${comic.url}" target="_blank" rel="noopener noreferrer" aria-label="Explore ${comic.title} on the publisher's official comics website">
      <div class="cover">${visual}</div><span class="comic-title">${comic.title}</span></a>`;
  }

  document.querySelectorAll(".comic-row").forEach(row => {
    const key = row.dataset.row;
    row.innerHTML = (rows[key] || []).map(cardMarkup).join("");
    const wrap = row.closest(".comic-row-wrap");
    const next = $(".next", wrap), prev = $(".prev", wrap);
    const updateArrows = () => {
      prev.style.display = row.scrollLeft > 5 ? "block" : "none";
      next.style.display = row.scrollLeft + row.clientWidth < row.scrollWidth - 5 ? "block" : "none";
    };
    next.addEventListener("click", () => row.scrollBy({left: row.clientWidth * .82, behavior:"smooth"}));
    prev.addEventListener("click", () => row.scrollBy({left: -row.clientWidth * .82, behavior:"smooth"}));
    row.addEventListener("scroll", updateArrows, {passive:true});
    window.addEventListener("resize", updateArrows);
    requestAnimationFrame(updateArrows);
  });

  function showHot(index) {
    if (!hot.length) return;
    hotIndex = (index + hot.length) % hot.length;
    const item = hot[hotIndex];
    const heroImage = $("#heroImage");
    if (item.image) {
      heroImage.style.backgroundImage = `url("${item.image}")`;
      heroImage.style.backgroundSize = "cover";
      heroImage.style.backgroundPosition = "center";
    } else {
      heroImage.style.backgroundImage = "none";
      heroImage.innerHTML = `<div class="cover-art ${item.style || "art-blue"}" style="height:100%"><small>${item.publisher}</small><strong>${item.title}</strong></div>`;
    }
    $("#heroTitle").textContent = item.title;
    $("#heroDots").querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("active", i === hotIndex);
      dot.setAttribute("aria-current", i === hotIndex ? "true" : "false");
    });
  }
  $("#heroDots").innerHTML = hot.map((_, i) => `<button aria-label="Show hot topic ${i+1}" class="${i===0?"active":""}"></button>`).join("");
  $("#heroDots").querySelectorAll("button").forEach((dot, i) => dot.addEventListener("click", () => {
    showHot(i); restartHotTimer();
  }));
  function restartHotTimer() {
    clearInterval(hotTimer);
    hotTimer = setInterval(() => showHot((hotIndex + 1) % hot.length), 5000);
  }
  showHot(0); restartHotTimer();

  const menu = $("#drawer"), scrim = $("#scrim"), menuToggle = $("#menuToggle");
  function closeMenu() {
    menu.classList.remove("open"); scrim.classList.remove("open");
    menu.setAttribute("aria-hidden","true"); menuToggle.setAttribute("aria-expanded","false");
  }
  menuToggle.addEventListener("click", () => {
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open); scrim.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open)); menuToggle.setAttribute("aria-expanded", String(open));
  });
  scrim.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  const searchPanel = $("#searchPanel"), searchToggle = $("#searchToggle"), searchInput = $("#comicSearch");
  searchToggle.addEventListener("click", () => {
    const open = !searchPanel.classList.contains("open");
    searchPanel.classList.toggle("open", open);
    searchToggle.setAttribute("aria-expanded", String(open));
    if (open) searchInput.focus();
  });
  $("#clearSearch").addEventListener("click", () => { searchInput.value = ""; filterComics(""); searchInput.focus(); });
  function filterComics(query) {
    const q = query.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll(".comic-card").forEach(card => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.hidden = !match; if (match) count++;
    });
    $("#catalogStatus").textContent = q ? `${count} matching comic${count===1?"":"s"} found.` : "";
  }
  searchInput.addEventListener("input", e => filterComics(e.target.value));

  // Social icons and footer links are decorative in this design: prevent placeholder navigation.
  document.querySelectorAll("[data-inert]").forEach(link => link.addEventListener("click", e => e.preventDefault()));

  // Date-stamped daily refresh: reload once at the next local midnight, and on return
  // if the local calendar day changed while this tab was in the background.
  const dayKey = () => new Date().toLocaleDateString("en-CA");
  let loadedDay = dayKey();
  function scheduleMidnightRefresh() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    setTimeout(() => location.reload(), midnight - now);
  }
  scheduleMidnightRefresh();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && dayKey() !== loadedDay) location.reload();
  });
  $("#year").textContent = new Date().getFullYear();
  $("#updatedAt").textContent = `Page refreshed ${new Date().toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}`;
})();
