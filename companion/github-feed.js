"use strict";
// This optional panel fetches public metadata only. Never place private GitHub tokens in browser code.
const office = document.getElementById("office");
const preview = document.getElementById("preview");
const feedState = document.getElementById("feed-state");
const commits = document.getElementById("commits");
const refresh = document.getElementById("refresh");

preview.addEventListener("click", () => {
  const showingOriginal = office.classList.toggle("preview");
  preview.textContent = showingOriginal ? "Ver simulação" : "Ver pixel art original";
  preview.classList.toggle("active", showingOriginal);
});

async function fetchCommits() {
  refresh.disabled = true;
  feedState.textContent = "Consultando commits públicos...";
  try {
    const response = await fetch(
      "https://api.github.com/repos/sunwu8/pixel-agents/commits?sha=dev%2Fmobile-office-v1&per_page=5",
      { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }
    );
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Resposta inválida");
    commits.replaceChildren();
    for (const item of data) {
      const url = String(item.html_url || "");
      if (!/^https:\/\/github\.com\/sunwu8\/pixel-agents\/commit\/[a-f0-9]{40}$/.test(url)) continue;
      const row = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.className = "repo-link";
      anchor.textContent = String(item.commit?.message || "Commit").split("\n")[0].slice(0,140);
      const timestamp = item.commit?.committer?.date;
      const info = document.createElement("small");
      info.textContent = timestamp ? " · " + new Date(timestamp).toLocaleString("pt-BR") : "";
      row.append(anchor, info);
      commits.append(row);
    }
    feedState.textContent = commits.childElementCount
      ? "Dados públicos reais · dev/mobile-office-v1 · " + new Date().toLocaleTimeString("pt-BR")
      : "Nenhum commit recebido.";
  } catch (error) {
    feedState.textContent = "Não foi possível acessar o GitHub: " + String(error.message).slice(0,60);
  } finally {
    refresh.disabled = false;
  }
}
refresh.addEventListener("click", fetchCommits);
fetchCommits();
