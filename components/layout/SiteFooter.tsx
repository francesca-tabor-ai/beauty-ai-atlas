import Link from "next/link";
import { Github, LogIn } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              Beauty × AI Atlas is an interconnected knowledge platform
              exploring the intersection of beauty and artificial intelligence.
              Discover brands, use cases, AI specialisms, job roles, projects,
              and learning paths.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/brands"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use Cases
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/paths"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-accent transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none flex items-center gap-1"
                >
                  <LogIn className="h-3 w-3" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Tech */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="text-sm text-muted-foreground">
              For questions or contributions, please reach out via GitHub.
            </p>
            <div className="flex items-center space-x-2">
              <Link
                href="https://github.com/francesca-tabor-ai/beauty-ai-atlas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-accent transition-colors duration-150"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Made with Next.js + Supabase
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Beauty × AI Atlas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

