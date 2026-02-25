import { useEffect, useState } from "react";
import { Search, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchPublicDataset } from "../utils/publicData";
import { performSearch, setSearchDataset } from "../utils/searchEngine";
import type { SearchResult } from "../data/searchData";

export function SearchDemo() {
  const [query, setQuery] = useState("cybersecurity data analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPublicDataset();
        setSearchDataset(data);
        const found = await performSearch(query);
        setResults(found.slice(0, 6));
      } catch (err: any) {
        setError(err?.message || "Unable to load public search demo.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const runSearch = async () => {
    setLoading(true);
    try {
      const found = await performSearch(query);
      setResults(found.slice(0, 6));
      setError("");
    } catch (err: any) {
      setError(err?.message || "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl mb-3">Live Search Preview</h2>
          <p className="text-lg text-muted-foreground">Results are loaded from live public data only.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers, patents, projects, or faculty"
              className="pl-12"
            />
          </div>
          <Button onClick={runSearch} disabled={loading}>Search</Button>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">Loading search preview...</div>
        ) : results.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">No results available.</div>
        ) : (
          <div className="grid gap-3">
            {results.map((result, idx) => (
              <Card key={`${result.type}-${idx}`} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{result.type}</Badge>
                    <span className="text-xs text-gray-600">{result.confidence}% match</span>
                  </div>
                  <CardTitle className="text-lg">{"title" in result.data ? result.data.title : "name" in result.data ? result.data.name : "Result"}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{result.aiJustification}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Database className="w-4 h-4" />
                    {result.matchedKeywords.slice(0, 5).join(", ") || "No keyword details"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
