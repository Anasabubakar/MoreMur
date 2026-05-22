/** Runs before paint — respects cookie consent for optional theme storage. */
export function ThemeScript() {
  const script = `(function(){try{var c=localStorage.getItem("murmur_cookie_consent");var t="light";if(c==="accepted"){var s=localStorage.getItem("murmur-theme");if(s==="dark"||s==="light")t=s;}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
