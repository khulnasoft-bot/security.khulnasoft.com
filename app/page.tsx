import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
          {"🛡️"}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">KhulnaSoft Security Database</h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          The leading database for open source vulnerabilities and security advisories.
        </p>
        <div className="max-w-xl mx-auto">
          <label htmlFor="search" className="sr-only">
            Search vulnerabilities
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search by package name, CVE, or keyword..."
            className="w-full rounded-md border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="#recent"
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
          >
            View recent CVEs
          </Link>
          <Link href="/api-docs" className="rounded-md border px-4 py-2 text-gray-900 hover:bg-gray-50 transition">
            API Docs
          </Link>
        </div>
      </section>

      <section id="recent" className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">Recent Vulnerabilities</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "CVE-2023-4863", title: "Heap Buffer Overflow in WebP", severity: "High" },
            { id: "GHSA-7rqg-2h9m-v13r", title: "Prototype Pollution in lodash", severity: "High" },
            { id: "CVE-2023-2878", title: "Privilege Escalation in Kubernetes", severity: "Critical" },
            { id: "GHSA-p6mc-m468-83gw", title: "Path Traversal in adm-zip", severity: "Medium" },
          ].map((item) => (
            <li key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{item.id}</div>
                  <div className="text-gray-700">{item.title}</div>
                </div>
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    item.severity === "Critical"
                      ? "bg-red-100 text-red-700"
                      : item.severity === "High"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700",
                  ].join(" ")}
                >
                  {item.severity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
