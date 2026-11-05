// An empty page that shows only its title.
export function blankPage(title) {
  return (container) => {
    container.innerHTML = `<div class="page-title">${title}</div>`;
  };
}
