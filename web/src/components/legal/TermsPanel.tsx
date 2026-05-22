export function TermsPanel() {
  return (
    <>
      <section className="legal-section" id="tc-intro">
        <div className="legal-sec-tag">
          <span className="num">1</span>Agreement
        </div>
        <h1 className="legal-sec-h1">TERMS OF USE</h1>
        <p className="legal-body-text">
          These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of
          Murmur (&quot;Platform&quot;, &quot;Service&quot;), operated by Anas Abubakar
          (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;). By accessing or using Murmur
          at <strong>moremur.vercel.app</strong>, you agree to be bound by these Terms in
          full. If you do not agree, do not use the platform.
        </p>
        <div className="legal-warning-box">
          <div className="warn-label">⚠ Important — Read This First</div>
          <p>
            Murmur is a hobby project. It is not a registered company. It is provided as-is
            with no guarantees of uptime, data preservation, or continued availability. By
            using this platform, you accept all associated risks. The Operator shall not be
            liable for any damages, losses, disputes, or legal consequences arising from your
            use of Murmur.
          </p>
        </div>
      </section>

      <section className="legal-section" id="tc-eligibility">
        <div className="legal-sec-tag">
          <span className="num">2</span>Eligibility
        </div>
        <h1 className="legal-sec-h1">WHO CAN USE MURMUR</h1>
        <ul className="legal-ul">
          <li>
            You must be at least <strong>18 years old</strong> to use Murmur.
          </li>
          <li>
            You must have access to a valid <strong>institutional or company email address</strong>
            . Generic personal email providers (gmail.com, yahoo.com, outlook.com, hotmail.com,
            and similar) are not accepted.
          </li>
          <li>You must have the legal capacity to enter into a binding agreement in your jurisdiction.</li>
          <li>You must not have previously been suspended or banned from Murmur.</li>
          <li>
            You must not be located in a jurisdiction where using this platform is prohibited by
            local law.
          </li>
        </ul>
      </section>

      <section className="legal-section" id="tc-account">
        <div className="legal-sec-tag">
          <span className="num">3</span>Your Account
        </div>
        <h1 className="legal-sec-h1">ACCOUNT RULES</h1>
        <h2 className="legal-sec-h2">One Account Per Person</h2>
        <p className="legal-body-text">
          You may only hold one Murmur account. Creating multiple accounts to circumvent a
          ban, manipulate post engagement, or impersonate other organisations is strictly
          prohibited and will result in permanent termination of all associated accounts.
        </p>
        <h2 className="legal-sec-h2">Email Ownership</h2>
        <p className="legal-body-text">
          You must use an institutional email address that you personally own and have
          authorised access to. Using someone else&apos;s company email address or an email
          address you are no longer authorised to use is a violation of these Terms and may
          constitute fraud.
        </p>
        <h2 className="legal-sec-h2">Account Security</h2>
        <p className="legal-body-text">
          You are responsible for maintaining the security of your account. Sign-up uses
          email OTP verification, then you set a password. Sign-in uses your password. Murmur
          stores a JWT in your browser&apos;s localStorage (<code>murmur_token</code>) — not in
          HTTP cookies. Do not share your device or token with anyone. We are not liable for
          unauthorised access arising from your failure to protect your session.
        </p>
        <h2 className="legal-sec-h2">Account Deletion</h2>
        <p className="legal-body-text">
          You may delete your account at any time from within the platform. Deletion is
          immediate and permanent. All your posts and comments are immediately and permanently
          removed. Your likes and reactions are anonymised. Your email record is permanently
          deleted. This action cannot be undone.
        </p>
      </section>

      <section className="legal-section" id="tc-conduct">
        <div className="legal-sec-tag">
          <span className="num">4</span>Acceptable Use
        </div>
        <h1 className="legal-sec-h1">WHAT YOU CAN &amp; CANNOT DO</h1>
        <h2 className="legal-sec-h2">You May</h2>
        <ul className="legal-ul">
          <li>Post anonymously within your verified organisation&apos;s feed.</li>
          <li>Like, comment, repost, and react to posts from your organisation.</li>
          <li>Report posts that violate these Terms.</li>
          <li>
            Each org member may report a given post once. Reports from verified org members
            are counted toward automatic moderation.
          </li>
          <li>Delete your account and all associated data at any time.</li>
          <li>Contact the Operator with data or moderation requests.</li>
        </ul>
        <h2 className="legal-sec-h2">You May Not</h2>
        <ul className="legal-ul">
          <li>
            <strong>
              Post content that is hateful, discriminatory, or incites violence
            </strong>{" "}
            on the basis of race, ethnicity, religion, gender, sexual orientation, disability,
            or any other protected characteristic.
          </li>
          <li>
            <strong>Harass, threaten, or intimidate</strong> any individual, identifiable or
            not, through your posts or comments.
          </li>
          <li>
            <strong>Post content that is defamatory, false, or misleading</strong> in a way that
            could cause reputational or material harm to a person or organisation.
          </li>
          <li>
            <strong>Attempt to de-anonymise</strong> any user, including yourself or others,
            through pattern matching, cross-referencing, or any other method.
          </li>
          <li>
            <strong>Use Murmur for illegal activity</strong> of any kind, including but not
            limited to fraud, impersonation, data harvesting, or the distribution of illegal
            content.
          </li>
          <li>
            <strong>Attempt to breach, circumvent, or interfere</strong> with the platform&apos;s
            security, infrastructure, or anonymity architecture.
          </li>
          <li>
            <strong>Scrape, copy, or extract</strong> data from Murmur in bulk through automated
            means.
          </li>
          <li>
            <strong>Use the platform if you are under 18</strong> years of age.
          </li>
          <li>
            <strong>Post content that violates intellectual property rights</strong> of any third
            party.
          </li>
        </ul>
      </section>

      <section className="legal-section" id="tc-moderation">
        <div className="legal-sec-tag">
          <span className="num">5</span>Moderation
        </div>
        <h1 className="legal-sec-h1">CONTENT MODERATION</h1>
        <p className="legal-body-text">
          Murmur operates an active moderation system. The Operator reserves the right to remove
          any content and take action on any account at any time, with or without notice, if
          that content or account is found to violate these Terms or the general spirit of the
          platform.
        </p>
        <h2 className="legal-sec-h2">Community Reporting &amp; Auto-Removal</h2>
        <p className="legal-body-text">
          Any verified member of your organisation may report a post they believe violates
          these Terms. Each member may submit one report per post. When a post receives{" "}
          <strong>10 unique reports from members of the same organisation</strong>, it is
          automatically removed from that org&apos;s feed without waiting for manual review.
          Removed posts are hidden from all users in the organisation; the Operator may still
          review reports and take further action on the associated account.
        </p>
        <h2 className="legal-sec-h2">Moderation Actions Available</h2>
        <ul className="legal-ul">
          <li>
            <strong>Automatic Post Removal:</strong> Posts that reach 10 unique org-member
            reports are removed automatically.
          </li>
          <li>
            <strong>Post Removal:</strong> Individual posts or comments may also be removed by the
            Operator upon detection or report.
          </li>
          <li>
            <strong>Warning:</strong> A notification sent to your institutional email address
            informing you of a Terms violation.
          </li>
          <li>
            <strong>Shadow Ban:</strong> Your posts remain visible to you but are hidden from
            all other users. You will not be notified of a shadow ban.
          </li>
          <li>
            <strong>Account Suspension:</strong> Temporary restriction from posting. Duration
            determined by the Operator.
          </li>
          <li>
            <strong>Permanent Termination:</strong> Permanent removal of your account and all
            associated data. Applied to severe or repeat violations.
          </li>
        </ul>
        <h2 className="legal-sec-h2">Identity Disclosure in Moderation</h2>
        <p className="legal-body-text">
          Your anonymity is protected in all public-facing contexts. However, in cases of
          serious reported violations such as threats, harassment, or illegal activity, the
          Operator may access the email address associated with the offending account for
          moderation purposes. This access is logged. The email will never be disclosed to
          other users or third parties except where required by law.
        </p>
        <h2 className="legal-sec-h2">No Moderation Guarantee</h2>
        <p className="legal-body-text">
          While we operate an active moderation queue and automated filters, we do not guarantee
          that all violating content will be removed promptly or at all. If you encounter
          content that violates these Terms, use the report feature within the platform.
        </p>
      </section>

      <section className="legal-section" id="tc-liability">
        <div className="legal-sec-tag">
          <span className="num">6</span>Liability &amp; Disclaimer
        </div>
        <h1 className="legal-sec-h1">LIMITATION OF LIABILITY</h1>
        <div className="legal-warning-box">
          <div className="warn-label">⚠ Critical — Read Carefully</div>
          <p>
            Murmur is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without any
            warranty of any kind, express or implied. The Operator makes no representations
            regarding the platform&apos;s availability, reliability, accuracy, or fitness for
            any particular purpose.
          </p>
        </div>
        <h2 className="legal-sec-h2">The Operator Is Not Liable For</h2>
        <ul className="legal-ul">
          <li>
            Any content posted by users on the platform. Users are solely responsible for what
            they post.
          </li>
          <li>
            Any harm, loss, damage, embarrassment, or legal consequence arising from content
            posted by any user, including yourself.
          </li>
          <li>
            Any data loss resulting from platform outages, infrastructure failures, or service
            interruptions.
          </li>
          <li>Any failure or delay in moderation leading to exposure to harmful content.</li>
          <li>Any third-party claims arising from your use of the platform.</li>
          <li>
            Any consequences arising from de-anonymisation by third parties outside of our
            control.
          </li>
          <li>
            Any damages arising from your reliance on the platform for professional, legal,
            medical, or any other sensitive decision-making.
          </li>
          <li>Any disputes between users or between a user and their organisation.</li>
          <li>
            Any legal action taken against a user by their employer, institution, or any third
            party as a result of content they posted on Murmur.
          </li>
        </ul>
        <h2 className="legal-sec-h2">No Legal Accountability</h2>
        <p className="legal-body-text">
          Murmur is an unregistered hobby project operated by a private individual. By using this
          platform, you acknowledge that pursuing legal action against the Operator is at your
          own cost and risk, and that the Operator makes no representations about their ability
          to satisfy any legal judgement. You use Murmur entirely at your own risk.
        </p>
        <h2 className="legal-sec-h2">Your Indemnity</h2>
        <p className="legal-body-text">
          You agree to indemnify, defend, and hold harmless the Operator from and against any
          claims, liabilities, damages, losses, and expenses, including legal fees, arising out
          of or in any way connected with your access to or use of Murmur, your violation of
          these Terms, or your violation of any rights of any other person or entity.
        </p>
      </section>

      <section className="legal-section" id="tc-ip">
        <div className="legal-sec-tag">
          <span className="num">7</span>Intellectual Property
        </div>
        <h1 className="legal-sec-h1">OWNERSHIP</h1>
        <p className="legal-body-text">
          The Murmur platform, including its design, code, branding, and documentation, is owned
          by Anas Abubakar. You may not copy, reproduce, distribute, or create derivative works
          from any part of the platform without explicit written permission.
        </p>
        <p className="legal-body-text">
          Content you post on Murmur remains your intellectual property. By posting, you grant
          Murmur a non-exclusive, royalty-free licence to display, store, and distribute that
          content within the platform, and to include it in anonymised aggregate data products.
          This licence terminates when you delete your account and your posts are removed.
        </p>
      </section>

      <section className="legal-section" id="tc-data-sale">
        <div className="legal-sec-tag">
          <span className="num">8</span>Data Commerce
        </div>
        <h1 className="legal-sec-h1">SELLING YOUR DATA</h1>
        <p className="legal-body-text">
          By using Murmur and accepting these Terms, you consent to the following data
          practices:
        </p>
        <ul className="legal-ul">
          <li>
            Your <strong>anonymised, aggregated activity data</strong> (post categories,
            engagement trends, discussion volumes) may be compiled into organisation-level
            intelligence reports and sold to third parties, including the organisation whose
            domain you signed up with.
          </li>
          <li>
            These reports will <strong>never identify you personally</strong>. No email
            address, no user ID, no post-level data traceable to you will be included.
          </li>
          <li>
            Data points in any report use a{" "}
            <strong>minimum cohort size of 10 users</strong>. In plain English: we only
            include org-level stats when at least 10 people from that organisation were
            active in the period. Smaller groups are excluded so nobody can guess who said
            what in a small team.
          </li>
          <li>
            Murmur may in future display <strong>third-party advertising</strong>. If and when
            ads are introduced, this document will be updated and users will be notified via
            the platform.
          </li>
        </ul>
        <p className="legal-body-text">
          If you do not consent to your anonymised data being included in aggregate reports,
          you must not use Murmur, or contact us at{" "}
          <a className="legal-mail-link" href="mailto:anasabubakar840@gmail.com">
            anasabubakar840@gmail.com
          </a>{" "}
          to request exclusion before deleting your account.
        </p>
      </section>

      <section className="legal-section" id="tc-termination">
        <div className="legal-sec-tag">
          <span className="num">9</span>Termination
        </div>
        <h1 className="legal-sec-h1">ENDING THE RELATIONSHIP</h1>
        <p className="legal-body-text">
          You may terminate your use of Murmur at any time by deleting your account within the
          platform. The Operator may terminate or suspend your account at any time, with or
          without notice, for any violation of these Terms or for any reason at the
          Operator&apos;s sole discretion.
        </p>
        <p className="legal-body-text">
          The Operator also reserves the right to shut down Murmur entirely at any time, for
          any reason, with no obligation to provide advance notice or preserve any user data
          after shutdown.
        </p>
      </section>

      <section className="legal-section" id="tc-governing">
        <div className="legal-sec-tag">
          <span className="num">10</span>Governing Law
        </div>
        <h1 className="legal-sec-h1">JURISDICTION</h1>
        <p className="legal-body-text">
          These Terms are governed by the laws of the{" "}
          <strong>Federal Republic of Nigeria</strong>. Any disputes arising from these Terms
          or your use of Murmur shall be subject to the exclusive jurisdiction of Nigerian
          courts, to the extent legally permissible.
        </p>
        <p className="legal-body-text">
          If any provision of these Terms is found to be unenforceable under applicable law, the
          remaining provisions shall continue in full force and effect.
        </p>
      </section>
    </>
  );
}
