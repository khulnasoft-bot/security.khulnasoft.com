import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  // Sample blog posts
  const posts = [
    {
      id: 1,
      title: "Understanding CVE-2023-1234: PostgreSQL SQL Injection Vulnerability",
      excerpt:
        "A detailed analysis of the recent PostgreSQL vulnerability, including how it works and how to mitigate it.",
      date: "2023-05-15",
      author: "Security Researcher",
      category: "Vulnerability Analysis",
    },
    {
      id: 2,
      title: "The Rise of Supply Chain Attacks: How to Protect Your Dependencies",
      excerpt:
        "Supply chain attacks are becoming increasingly common. Learn how to protect your software dependencies from compromise.",
      date: "2023-04-22",
      author: "Security Engineer",
      category: "Supply Chain Security",
    },
    {
      id: 3,
      title: "Implementing Zero Trust Security in Modern Applications",
      excerpt:
        "Zero Trust is more than a buzzword. This post explores practical ways to implement Zero Trust principles in your applications.",
      date: "2023-03-10",
      author: "Security Architect",
      category: "Security Architecture",
    },
    {
      id: 4,
      title: "Container Security Best Practices for Kubernetes Environments",
      excerpt:
        "Securing containerized applications requires a different approach. Learn the best practices for Kubernetes security.",
      date: "2023-02-18",
      author: "DevSecOps Engineer",
      category: "Container Security",
    },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Security Blog
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Expert insights, vulnerability analyses, and security best practices from our research team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20 card-hover h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">By {post.author}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
