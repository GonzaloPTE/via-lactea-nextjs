import DocLayout from "components/layouts/DocLayout";
import CodeHighlight from "components/reuseable/CodeHighlight";

const markup1 = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // UNCOMMENT TO ENABLE STATIC EXPORT.
  // images: { unoptimized: true }, // UNCOMMENT TO ENABLE STATIC EXPORT.
};

export default nextConfig;`;

export default function StaticExport() {
  return (
    <DocLayout
      pageTitle="Static Exports"
      description="Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.">
      <section id="snippet-1" className="wrapper pt-16">
        <div className="card mb-5">
          <div className="card-body">
            <h2 className="mb-4">Static Exports</h2>

            <h5>
              Step 1: Uncomment output and images properties in <span className="file">next.config.mjs</span>{" "}
            </h5>
            <CodeHighlight language="js">{markup1}</CodeHighlight>

            <h5 className="mt-6">
              Step 2: Run <mark className="terminal">yarn build</mark> or{" "}
              <mark className="terminal">npm run build</mark> on your terminal
            </h5>
            <p className="mb-2">
              After running <kbd className="terminal">next build</kbd>, Next.js will produce an{" "}
              <span className="folder">out</span> folder which contains the HTML/CSS/JS assets for your application. It
              can be deployed and hosted on any web server that can serve HTML/CSS/JS static assets.
            </p>

            <h5 className="mt-6">
              Step 3: Run <mark className="terminal">npx serve@latest out</mark> on your terminal
            </h5>
            <p className="mb-2">
              It will be served on your local web server. You can now view your application in your browser.
            </p>
          </div>
        </div>
      </section>
    </DocLayout>
  );
}
