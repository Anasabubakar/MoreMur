export function PrivacyPolicyPanel() {
  return (
    <>
      <section className="legal-section" id="pp-intro">
        <div className="legal-sec-tag">
          <span className="num">1</span>Introduction
        </div>
        <h1 className="legal-sec-h1">WHO WE ARE</h1>
        <p className="legal-body-text">
          Murmur (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, &quot;the Platform&quot;) is an
          anonymous, organisation-scoped community discussion platform accessible at{" "}
          <strong>moremur.vercel.app</strong>. Murmur is operated as an independent hobby
          project by <strong>Anas Abubakar</strong>, based in Nigeria. Murmur is not a
          registered legal entity.
        </p>
        <p className="legal-body-text">
          This Privacy Policy explains what personal data we collect, why we collect it, how
          we use it, who we may share it with, and what rights you have over it. By creating
          an account and using Murmur, you confirm that you have read, understood, and agreed
          to this Privacy Policy.
        </p>
        <div className="legal-highlight-box">
          <p>
            Murmur is built on the principle that your identity should stay yours. We collect
            the minimum data necessary to operate the platform and no more. Your email is
            verified, then locked away. Your posts are anonymous. Your conversations belong to
            your organisation, not to us.
          </p>
        </div>
      </section>

      <section className="legal-section" id="pp-collect">
        <div className="legal-sec-tag">
          <span className="num">2</span>Data We Collect
        </div>
        <h1 className="legal-sec-h1">WHAT WE COLLECT</h1>

        <h2 className="legal-sec-h2">Data You Provide Directly</h2>
        <table className="legal-data-table">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>Data Type</th>
              <th style={{ width: "30%" }}>What We Collect</th>
              <th style={{ width: "24%" }}>How It&apos;s Stored</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email Address</td>
              <td>Your institutional or company email used at signup</td>
              <td>
                Hashed and encrypted at rest in our database. Plaintext is never stored
                permanently.
              </td>
              <td>OTP verification, account recovery, moderation, and compliance</td>
            </tr>
            <tr>
              <td>OTP Code</td>
              <td>The 6-digit one-time password sent to your email</td>
              <td>Temporary, expires in 10 minutes, deleted after use</td>
              <td>To confirm you own and have access to the institutional inbox</td>
            </tr>
            <tr>
              <td>Account Password</td>
              <td>
                Password you set after OTP verification (bcrypt-hashed on the server; never
                stored in plaintext)
              </td>
              <td>Hashed at rest in Neon Postgres</td>
              <td>Sign-in after initial email verification</td>
            </tr>
            <tr>
              <td>Post Content</td>
              <td>The text of your Murmurs and comments</td>
              <td>
                Stored in our database linked to an internal anonymous user ID — never to your
                email or identity in public-facing systems
              </td>
              <td>To display your posts in your organisation&apos;s feed</td>
            </tr>
            <tr>
              <td>Reactions &amp; Interactions</td>
              <td>Likes, reposts, poll votes, emoji reactions</td>
              <td>
                Stored as anonymised counts — we do not record which anonymous user performed
                which interaction in public data
              </td>
              <td>To display engagement metrics on posts</td>
            </tr>
          </tbody>
        </table>

        <h2 className="legal-sec-h2">Data We Collect Automatically</h2>
        <table className="legal-data-table">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>Data Type</th>
              <th style={{ width: "35%" }}>What We Collect</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Server Logs</td>
              <td>
                IP addresses, request timestamps, HTTP method, endpoint accessed, status
                codes. Logged automatically by our infrastructure providers (Vercel, Render).
              </td>
              <td>Security, debugging, abuse prevention</td>
            </tr>
            <tr>
              <td>Session Data</td>
              <td>
                JWT in browser localStorage (<code>murmur_token</code>) after OTP + password
                sign-in
              </td>
              <td>Authentication and session management</td>
            </tr>
            <tr>
              <td>Device &amp; Browser Info</td>
              <td>
                Browser type, operating system, general device category. Collected passively
                via server logs.
              </td>
              <td>Debugging and platform compatibility</td>
            </tr>
            <tr>
              <td>Cookies &amp; local storage</td>
              <td>
                Consent flag, optional theme preference, and strictly necessary session token in
                localStorage; third-party advertising only if introduced later. See Cookie Policy.
              </td>
              <td>Session management, preferences, and potential advertising</td>
            </tr>
          </tbody>
        </table>

        <div className="legal-warning-box">
          <div className="warn-label">⚠ Note on IP Logging</div>
          <p>
            We disclose clearly that IP addresses are logged passively by our infrastructure
            providers (Vercel for the frontend, Render for the backend API). We do not
            actively use IP addresses to identify or track individual users, but these logs do
            exist. If you require complete IP anonymity, we recommend using a VPN when
            accessing Murmur.
          </p>
        </div>
      </section>

      <section className="legal-section" id="pp-use">
        <div className="legal-sec-tag">
          <span className="num">3</span>How We Use Your Data
        </div>
        <h1 className="legal-sec-h1">DATA USAGE</h1>

        <h2 className="legal-sec-h2">Primary Uses</h2>
        <ul className="legal-ul">
          <li>
            <strong>Verification:</strong> Your email is used once to send an OTP that
            confirms your institutional membership. After verification, the plaintext email is
            not used for communication except for account-critical notifications such as
            suspension or deletion.
          </li>
          <li>
            <strong>Account &amp; Session Management:</strong> We use your session token to
            keep you authenticated. We use your hashed email to associate your anonymous
            account with your organisation&apos;s feed.
          </li>
          <li>
            <strong>Moderation:</strong> In cases of reported content or suspected abuse, the
            platform administrator (Anas Abubakar) may access the email address associated
            with an internal user ID. Posts that receive 10 unique reports from members of
            the same organisation are automatically removed from that org&apos;s feed. This
            access is strictly for moderation purposes and is never disclosed publicly.
          </li>
          <li>
            <strong>Platform Improvement:</strong> Aggregate, anonymised data about usage
            patterns (post volume, engagement rates, popular categories) is used to improve
            the platform.
          </li>
        </ul>

        <h2 className="legal-sec-h2">Data Sold to Third Parties</h2>
        <p className="legal-body-text">
          We may sell or share <strong>anonymised, aggregated data</strong> about activity
          within organisations to third parties, including to the organisations themselves.
          This data:
        </p>
        <ul className="legal-ul">
          <li>
            Contains <strong>no personally identifiable information</strong>. No email
            addresses, no user IDs, nothing traceable to any individual.
          </li>
          <li>
            Is <strong>grouped by organisation domain</strong>. For example, an organisation
            may receive a report showing that in a given period, discussion topics in their
            feed trended toward Management and Culture.
          </li>
          <li>
            Uses a <strong>minimum cohort size of 10</strong> per data point. In plain
            English: a statistic only appears in a sold report when at least{" "}
            <strong>10 different people</strong> from the same organisation contributed to
            that topic in the reporting period. If fewer than 10 people participated, that
            line item is left out entirely — so small teams cannot be re-identified from
            aggregate numbers.
          </li>
          <li>
            Is sold only in <strong>aggregate report format</strong>, not as raw post exports
            or individual activity logs.
          </li>
        </ul>
        <div className="legal-highlight-box">
          <p>
            By signing up, you consent to your anonymised, non-identifiable activity data being
            included in aggregate organisational reports that may be sold or shared. No data
            that can identify you personally is ever sold.
          </p>
        </div>
      </section>

      <section className="legal-section" id="pp-infra">
        <div className="legal-sec-tag">
          <span className="num">4</span>Infrastructure &amp; Third Parties
        </div>
        <h1 className="legal-sec-h1">WHO HANDLES YOUR DATA</h1>
        <p className="legal-body-text">
          Murmur is built on the following third-party infrastructure providers. By using
          Murmur, you acknowledge that your data passes through these services:
        </p>
        <table className="legal-data-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Provider</th>
              <th style={{ width: "20%" }}>Role</th>
              <th style={{ width: "20%" }}>Data Region</th>
              <th>What They Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel</td>
              <td>Frontend Hosting</td>
              <td>Global CDN (US-based)</td>
              <td>
                Serves the frontend application. May log IP addresses and request metadata by
                default.
              </td>
            </tr>
            <tr>
              <td>Render</td>
              <td>Backend API Hosting</td>
              <td>US East (North Virginia)</td>
              <td>Hosts the Fastify backend. Logs server requests including IP addresses.</td>
            </tr>
            <tr>
              <td>Neon</td>
              <td>Database</td>
              <td>US East (North Virginia)</td>
              <td>
                Stores all user account data, posts, and organisation data. Data is encrypted
                at rest.
              </td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Transactional Email</td>
              <td>US-based</td>
              <td>
                Sends OTP verification emails. Handles email delivery only. Does not store
                your content.
              </td>
            </tr>
          </tbody>
        </table>
        <p className="legal-body-text">
          All providers listed above are US-based. Your data is stored and processed in the
          United States. By using Murmur, you consent to this cross-border data transfer if you
          are located outside the US.
        </p>
      </section>

      <section className="legal-section" id="pp-rights">
        <div className="legal-sec-tag">
          <span className="num">5</span>Your Rights
        </div>
        <h1 className="legal-sec-h1">YOUR DATA RIGHTS</h1>
        <p className="legal-body-text">
          Depending on where you are located, you may have the following rights regarding your
          personal data:
        </p>
        <ul className="legal-ul">
          <li>
            <strong>Right to Access:</strong> You can request a summary of what personal data
            we hold about you.
          </li>
          <li>
            <strong>Right to Deletion:</strong> You can delete your account at any time from
            within the app. Upon deletion, your posts and comments are permanently and
            immediately removed from the platform. Your likes and reactions are anonymised and
            detached from your account. Your email and account record are permanently deleted
            from our database with no grace period.
          </li>
          <li>
            <strong>Right to Object:</strong> You may object to your anonymised data being
            included in aggregate reports sold to third parties. To do so, contact us at the
            email below before deleting your account.
          </li>
          <li>
            <strong>Right to Correction:</strong> Since we store minimal identity data, the
            primary correctable item is your email address. Contact us directly for email
            corrections.
          </li>
        </ul>
        <p className="legal-body-text">To exercise any of these rights, contact:</p>
        <div className="legal-contact-block">
          <div className="c-label">Data Controller</div>
          <a className="c-val" href="mailto:anasabubakar840@gmail.com">
            anasabubakar840@gmail.com
          </a>
          <div className="c-label" style={{ marginTop: 8 }}>
            Response Time
          </div>
          <div className="c-val" style={{ fontSize: 11, color: "#555" }}>
            Within 14 days of receiving your request
          </div>
        </div>
      </section>

      <section className="legal-section" id="pp-retention">
        <div className="legal-sec-tag">
          <span className="num">6</span>Data Retention
        </div>
        <h1 className="legal-sec-h1">HOW LONG WE KEEP IT</h1>
        <table className="legal-data-table">
          <thead>
            <tr>
              <th style={{ width: "28%" }}>Data Type</th>
              <th style={{ width: "30%" }}>Retention Period</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email Address (hashed)</td>
              <td>Until account deletion</td>
              <td>Permanently deleted immediately upon account deletion request</td>
            </tr>
            <tr>
              <td>OTP Codes</td>
              <td>10 minutes</td>
              <td>Auto-expired and deleted from database after use or expiry</td>
            </tr>
            <tr>
              <td>Posts &amp; Comments</td>
              <td>Until account deletion</td>
              <td>Immediately and permanently deleted when account is deleted</td>
            </tr>
            <tr>
              <td>Likes &amp; Reactions</td>
              <td>Indefinitely (anonymised)</td>
              <td>
                Detached from user on account deletion. Retained as anonymous engagement
                counts.
              </td>
            </tr>
            <tr>
              <td>Server Logs (IP, etc.)</td>
              <td>As determined by Vercel/Render defaults</td>
              <td>
                We do not control infrastructure log retention. Typically 30 to 90 days.
              </td>
            </tr>
            <tr>
              <td>Session Tokens (JWT)</td>
              <td>30 days or until logout</td>
              <td>Auto-expired after 30 days of inactivity</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="legal-section" id="pp-minors">
        <div className="legal-sec-tag">
          <span className="num">7</span>Minors &amp; Jurisdiction
        </div>
        <h1 className="legal-sec-h1">AGE &amp; SCOPE</h1>
        <h2 className="legal-sec-h2">Minimum Age</h2>
        <p className="legal-body-text">
          Murmur is strictly for users aged <strong>18 and over</strong>. By creating an
          account, you confirm you are at least 18 years old. We do not knowingly collect data
          from anyone under 18. If we become aware that a user is under 18, their account will
          be immediately terminated and their data deleted.
        </p>
        <h2 className="legal-sec-h2">EU &amp; International Users</h2>
        <p className="legal-body-text">
          Murmur is a global hobby project primarily operated from Nigeria. It is{" "}
          <strong>not directed at residents of the European Union</strong>. If you are an EU
          resident and choose to use Murmur, you do so voluntarily and at your own discretion.
          We endeavour to apply GDPR-equivalent data protection principles, but we make no
          formal GDPR compliance representations. EU residents who require full GDPR guarantees
          should not use this platform.
        </p>
        <h2 className="legal-sec-h2">Nigeria (NDPA)</h2>
        <p className="legal-body-text">
          Murmur operates primarily under the{" "}
          <strong>Nigeria Data Protection Act (NDPA) 2023</strong>. We aim to comply with NDPA
          principles including lawful processing, data minimisation, storage limitation, and
          your rights as a data subject.
        </p>
      </section>

      <section className="legal-section" id="pp-changes">
        <div className="legal-sec-tag">
          <span className="num">8</span>Policy Changes
        </div>
        <h1 className="legal-sec-h1">UPDATES TO THIS POLICY</h1>
        <p className="legal-body-text">
          We may update this Privacy Policy from time to time. When we do, we will update the
          effective date at the top of this page. Continued use of Murmur after a policy
          update constitutes your acceptance of the revised policy. If changes are material, we
          will notify users via the platform feed or email where practicable.
        </p>
      </section>
    </>
  );
}
