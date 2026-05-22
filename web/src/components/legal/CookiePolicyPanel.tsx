export function CookiePolicyPanel() {
  return (
    <>
      <section className="legal-section" id="cp-intro">
        <div className="legal-sec-tag">
          <span className="num">1</span>What Are Cookies
        </div>
        <h1 className="legal-sec-h1">COOKIE POLICY</h1>
        <p className="legal-body-text">
          Cookies are small text files placed on your device by a website when you visit it.
          Murmur also uses browser <strong>localStorage</strong> for sign-in and preferences.
          This policy covers both HTTP cookies (where applicable) and similar on-device
          storage technologies.
        </p>
        <p className="legal-body-text">
          This Cookie Policy explains what cookies and similar tracking technologies Murmur
          uses, why we use them, and what choices you have — including the consent banner on
          first visit.
        </p>
      </section>

      <section className="legal-section" id="cp-types">
        <div className="legal-sec-tag">
          <span className="num">2</span>Cookies We Use
        </div>
        <h1 className="legal-sec-h1">TYPES OF COOKIES</h1>
        <table className="legal-data-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Cookie Type</th>
              <th style={{ width: "18%" }}>Category</th>
              <th style={{ width: "24%" }}>What It Does</th>
              <th style={{ width: "18%" }}>Duration</th>
              <th>Can You Opt Out?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Session token (<code>murmur_token</code>)</td>
              <td>Strictly Necessary</td>
              <td>
                JWT stored in <strong>localStorage</strong> after email OTP verification and
                password sign-in. Keeps you logged in without re-verifying every visit.
              </td>
              <td>Until logout or expiry (server-defined)</td>
              <td>
                No — required for authentication. Clearing site data logs you out.
              </td>
            </tr>
            <tr>
              <td>Theme preference (<code>murmur-theme</code>)</td>
              <td>Functional</td>
              <td>
                Remembers light/dark mode in localStorage when you accept optional storage in
                the cookie banner.
              </td>
              <td>Persistent until cleared</td>
              <td>
                Yes — reject optional storage in the banner, or clear site data. Theme still
                works for the current session but is not saved.
              </td>
            </tr>
            <tr>
              <td>Consent choice (<code>murmur_cookie_consent</code>)</td>
              <td>Strictly Necessary</td>
              <td>Records whether you accepted or rejected optional storage.</td>
              <td>Persistent until cleared</td>
              <td>No — needed to honour your choice.</td>
            </tr>
            <tr>
              <td>Vercel Analytics</td>
              <td>Performance</td>
              <td>
                Vercel may collect anonymised performance data about how pages load and are
                accessed. This is set by our hosting provider.
              </td>
              <td>Session</td>
              <td>
                Partially — you can block this via browser settings or an ad blocker, but it is
                set by Vercel infrastructure and not fully within our control.
              </td>
            </tr>
            <tr>
              <td>Third-Party Advertising Cookies</td>
              <td>Advertising (Future)</td>
              <td>
                If and when Murmur introduces advertising, third-party ad providers (such as
                Google AdSense) may set cookies to serve relevant ads and measure ad performance.
              </td>
              <td>Varies by provider</td>
              <td>
                Yes — you will be prompted for consent before advertising cookies are set. You
                can also opt out via your browser or ad provider opt-out tools.
              </td>
            </tr>
          </tbody>
        </table>

        <div className="legal-highlight-box">
          <p>
            Currently, Murmur does not run advertising. No advertising cookies are active on
            the platform as of the effective date of this policy. If advertising is introduced,
            this policy will be updated and users will be notified.
          </p>
        </div>
      </section>

      <section className="legal-section" id="cp-third">
        <div className="legal-sec-tag">
          <span className="num">3</span>Third-Party Cookies
        </div>
        <h1 className="legal-sec-h1">THIRD-PARTY TRACKING</h1>
        <p className="legal-body-text">
          Beyond the cookies Murmur sets directly, our infrastructure providers may set their
          own cookies or tracking technologies:
        </p>
        <ul className="legal-ul">
          <li>
            <strong>Vercel:</strong> As our frontend hosting provider, Vercel may collect
            anonymised performance and traffic data. Their privacy policy governs their data
            practices. See vercel.com/legal/privacy-policy.
          </li>
          <li>
            <strong>Render:</strong> Our backend API host may log request data including IP
            addresses as part of standard server operation. See render.com/privacy.
          </li>
          <li>
            <strong>Resend:</strong> Our email provider handles OTP delivery. They may track
            email open and delivery status. See resend.com/legal/privacy-policy.
          </li>
        </ul>
        <p className="legal-body-text">
          We do not control the cookies set by these third-party providers. Their respective
          privacy policies govern their data collection practices.
        </p>
      </section>

      <section className="legal-section" id="cp-control">
        <div className="legal-sec-tag">
          <span className="num">4</span>Your Cookie Choices
        </div>
        <h1 className="legal-sec-h1">MANAGING COOKIES</h1>
        <h2 className="legal-sec-h2">Browser Controls</h2>
        <p className="legal-body-text">
          You can control and manage cookies through your browser settings. Most browsers allow
          you to:
        </p>
        <ul className="legal-ul">
          <li>View all cookies stored on your device and delete them individually or in bulk.</li>
          <li>Block cookies from specific websites or all third-party cookies.</li>
          <li>Set your browser to notify you before a cookie is stored.</li>
        </ul>
        <p className="legal-body-text">
          Note that clearing <code>murmur_token</code> (strictly necessary) logs you out.
          Rejecting optional storage in our banner prevents saving theme preference; sign-in
          still works.
        </p>

        <h2 className="legal-sec-h2">Browser-Specific Instructions</h2>
        <ul className="legal-ul">
          <li>
            <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and Other Site
            Data
          </li>
          <li>
            <strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data
          </li>
          <li>
            <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
          </li>
          <li>
            <strong>Edge:</strong> Settings → Cookies and Site Permissions → Cookies and Site
            Data
          </li>
        </ul>

        <h2 className="legal-sec-h2">Do Not Track</h2>
        <p className="legal-body-text">
          Some browsers offer a &quot;Do Not Track&quot; (DNT) signal. Murmur does not currently
          respond to DNT signals as there is no universal standard for how platforms should
          handle them. This may change in future updates.
        </p>
      </section>

      <section className="legal-section" id="cp-changes">
        <div className="legal-sec-tag">
          <span className="num">5</span>Policy Updates
        </div>
        <h1 className="legal-sec-h1">CHANGES TO THIS POLICY</h1>
        <p className="legal-body-text">
          We may update this Cookie Policy from time to time, particularly if we introduce
          advertising or change our infrastructure providers. Any updates will be reflected on
          this page with a revised effective date. Continued use of Murmur after a policy
          update constitutes your acceptance of the revised Cookie Policy.
        </p>
        <p className="legal-body-text">For questions about cookies or this policy, contact us at:</p>
        <div className="legal-contact-block">
          <div className="c-label">Contact</div>
          <a className="c-val" href="mailto:anasabubakar840@gmail.com">
            anasabubakar840@gmail.com
          </a>
        </div>
      </section>
    </>
  );
}
