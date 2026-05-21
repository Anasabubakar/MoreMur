/** Runs before paint — default light; dark only if user saved it. */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("murmur-theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
