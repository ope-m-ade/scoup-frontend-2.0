# SCOUP Search Engine Report

Last updated: May 8, 2026

This document describes the current search system as implemented in the frontend and backend. It replaces older notes that described the previous IDF-style implementation.

## Executive Summary

SCOUP search is now a backend-ranked, evidence-based search engine.

The frontend has two separate search-related responsibilities:

1.  Suggestions while typing, built from public data already loaded into the browser.
2.  Submitted search, which calls the backend endpoint and renders ranked results.

The backend owns actual search ranking. It parses the query, scores faculty, papers, patents, and projects with comparable evidence tiers, merges lexical and semantic paper evidence, and returns one mixed ranked result list.

The core rule is:

> Lexical evidence wins first. Embeddings are an additional discovery layer, not a replacement for exact title, name, author, or keyword matches.

## Source Files

### Backend

| File | Role |
|-------------------------|-----------------------------------------------|
| `scoupdb/academic/views.py` | Exposes API endpoints. `unified_search()` delegates to `run_search()`. `public_search_data()` feeds frontend suggestions and analytics. |
| `scoupdb/academic/search_engine.py` | Main backend search engine: parsing, evidence scoring, result shaping, confidence scores, justifications, sorting. |
| `scoupdb/academic/semantic.py` | OpenAI embedding helpers, paper semantic text builder, cosine similarity. |
| `scoupdb/academic/ai_keywords.py` | OpenAI LLM keyword generation for faculty `ai_keywords`. |
| `scoupdb/academic/management/commands/embed_papers.py` | Generates and stores paper embeddings. |
| `scoupdb/academic/management/commands/generate_ai_keywords.py` | Generates faculty AI keywords from profile, papers, patents, and projects. |
| `scoupdb/academic/management/commands/migrate_themes_to_ai_keywords.py` | One-time utility to copy imported Academic Metrics themes into `Faculty.ai_keywords`. |

### Frontend

| File | Role |
|--------------------|----------------------------------------------------|
| `src/utils/publicData.ts` | Fetches `/api/public/search-data/` and `/api/search/`. Defines backend response shape. |
| `src/utils/searchEngine.ts` | Builds client-side suggestion index and maps backend search responses into frontend types. |
| `src/utils/datasetNormalization.ts` | Normalizes backend records into stable frontend shapes. |
| `src/components/Home.tsx` | Owns search input, suggestion dropdown, filters, submit behavior, and search state. |
| `src/components/SearchResults.tsx` | Renders ranked search results, confidence badge, justifications, keyword chips, and pagination. |
| `src/data/searchData.ts` | TypeScript types for faculty, paper, patent, project, and search result objects. |

## API Endpoints

### Full Search

``` http
GET /api/search/?q=<query>
```

Implemented by:

``` text
academic/views.py -> unified_search()
academic/search_engine.py -> run_search()
```

Returns:

``` json
{
  "query": "machine learning",
  "count": 7,
  "results": [
    {
      "type": "paper",
      "confidence": 97,
      "aiJustification": "The paper title directly contains your search phrase.",
      "matchEvidence": {
        "match_source": "title",
        "match_strength": "phrase",
        "matched_value": "Image Processing and Machine Learning ...",
        "matched_terms": ["Image Processing and Machine Learning ..."],
        "score": 97
      },
      "matchedKeywords": ["Image Processing and Machine Learning ..."],
      "data": {}
    }
  ]
}
```

### Public Search Data

``` http
GET /api/public/search-data/
```

Used for frontend analytics and suggestions. This is not the full search endpoint.

It returns:

-   `facultyData`
-   `papersData`
-   `patentsData`
-   `projectsData`

The frontend loads this once in `Home.tsx`, normalizes it, and passes it into `setSearchDataset()`.

### Semantic Paper Search

``` http
GET /api/semantic/papers/?q=<query>&limit=20
```

This endpoint still exists separately, but the main site search uses `/api/search/`.

## Query Parsing

The backend parses each submitted query with:

``` python
phrase, words = parse_query(query)
```

### Phrase

The phrase is a normalized version of the full query:

-   lowercased
-   non-alphanumeric characters replaced with spaces
-   repeated whitespace collapsed

Example:

``` text
"NLP Analysis of Shakespearean Characters!"
-> "nlp analysis of shakespearean characters"
```

The phrase is used for exact phrase matching against titles, names, keywords, authors, abstracts, descriptions, departments, and journals.

### Words

Words are the meaningful terms extracted from the normalized phrase.

A token is kept only if:

-   length is at least 3
-   it is not in the stopword list

Stopwords include common English words and search-intent filler words like:

``` text
a, an, the, and, or, in, on, at, to, for, of, with,
find, get, give, look, looking, about, show, want,
need, use, using, used, work, working, works
```

If no meaningful words remain, the backend returns no results.

## Matching Helpers

### `normalize_text(value)`

Normalizes arbitrary text for matching:

-   converts to lowercase
-   replaces non-alphanumeric characters with spaces
-   collapses repeated whitespace

This makes `"Computer-Science"` and `"computer science"` comparable.

### `phrase_in_text(phrase, text)`

Checks whether the normalized phrase appears as a consecutive sequence of whole normalized tokens.

Important consequence:

-   `science` does not automatically match `sciences`
-   `computer science` matches `Department of Computer Science`
-   `machine learning` matches `Machine Learning Challenges`

### `words_in_text(words, text)`

Checks whether every meaningful query word appears somewhere in the normalized text.

This is weaker than `phrase_in_text()` because the words do not need to be adjacent.

### `coverage(words, text)`

Calculates the fraction of query words present in a text. This is used only for low-confidence partial context matches.

## Evidence Model

Every match is represented internally as an `Evidence` object:

``` python
Evidence(
    score=95,
    kind="keyword_phrase",
    field="AI keyword",
    value="Machine Learning Challenges",
    matched=("Machine Learning Challenges",),
)
```

The backend returns this as `matchEvidence`:

| Field | Meaning |
|--------------|----------------------------------------------------------|
| `match_source` | Where the match came from, such as `title`, `name`, `author`, `AI keyword`, `abstract`, `department`. |
| `match_strength` | Normalized strength category: `exact`, `phrase`, `all_terms`, `fuzzy`, `semantic`, or `partial`. |
| `matched_value` | The actual value that matched, such as a title, keyword, author name, or abstract text. |
| `matched_terms` | Terms/chips that the frontend may highlight. Context matches usually return no matched terms to avoid misleading chip highlights. |
| `score` | Same number as `confidence`. |

## Score Contract

Current backend score tiers:

| Score | Evidence |
|----------:|-------------------------------------------------------------|
| 99 | Exact faculty name or exact title match. |
| 97 | Query phrase appears directly in a title. |
| 95 | Exact phrase in faculty-entered keyword or faculty AI keyword. |
| 92 | Exact phrase in paper AI keyword or paper faculty keyword. |
| 90 | All meaningful query terms appear in a title/name, or an exact phrase appears in a faculty department affiliation. |
| 88 | Close fuzzy title/name match, or exact paper author match. |
| 82 | Exact phrase in imported paper raw keyword/category. |
| 78 | Exact phrase in imported faculty raw keyword/category, clean abstract, project description, patent description, or similar medium-confidence context. |
| 60-65 | All query terms in context fields, depending on source. |
| 52 | Partial context match when at least two-thirds of a query with at least three words is covered. |
| 45 | Single-word partial context match. |
| 40-85 | Semantic embedding match for papers. |
| \<40 | Filtered out. |

The broad discipline calibration is intentional:

-   `Computer science` as an exact faculty department match is `90`.
-   `Computer science` as an imported paper raw category is `82`.
-   `Computer science` as an imported faculty raw keyword/category is `78`.
-   A specific paper title or faculty AI keyword can still score higher.

## Faculty Search

Faculty are scored in `score_faculty()`.

The queryset includes:

``` python
Faculty.objects.filter(confirmed_su_faculty=True)
| Faculty.objects.filter(is_approved=True)
```

It preloads:

-   primary department
-   primary school
-   departments
-   schools

### Faculty Fields Scored

| Field group | Source fields | Score behavior |
|-----------------|------------------------|-------------------------------|
| Primary | faculty display name | exact `99`, phrase `97`, fuzzy `94/88`, all terms `90` |
| Faculty-entered keywords | `faculty.faculty_keywords` | phrase `95`, all terms `88` |
| AI/recommended keywords | `faculty.ai_keywords` plus `faculty.themes` | phrase `95`, all terms `88` |
| Raw imported keywords | `faculty.keywords` | phrase `78`, all terms `71` |
| Department context | primary and additional departments | phrase `90`, terms around `65` |
| Bio context | `faculty.bio` | phrase `65`, terms around `52` |

### Faculty Display Keywords

Faculty result cards receive:

``` python
display_keywords = merge_unique_list(
    faculty.faculty_keywords,
    faculty.ai_keywords,
    faculty.themes,
    faculty.keywords,
)[:12]
```

The API sends this same list as:

-   `researchInterests`
-   `aiKeywords`

This is a frontend compatibility detail. Conceptually, these are display keywords, not a separate prose research-interest field.

### Faculty Result Payload

Faculty results include:

-   id
-   name
-   title
-   primary department
-   department affiliations
-   school affiliations
-   email
-   phone
-   photo URL
-   bio
-   `researchInterests`
-   `aiKeywords`
-   metrics profile
-   themes
-   journals

## Paper Search

Paper search has two layers:

1.  Lexical/evidence search.
2.  Semantic embedding search.

The two layers are merged by paper id. If the same paper appears in both, the stronger evidence wins.

### Paper Lexical Fields

Papers are scored in `score_papers_lexical()`.

| Field group | Source fields | Score behavior |
|----------------|---------------------|-----------------------------------|
| Primary | `paper.title` | exact `99`, phrase `97`, fuzzy `94/88`, all terms `90` |
| Author | related `paper.authors` plus `paper.faculty_members` | phrase `88`, all terms `81` |
| Paper AI keyword | `paper.ai_keywords` | phrase `92`, all terms `85` |
| Paper faculty keyword | `paper.faculty_keywords` | phrase `92`, all terms `85` |
| Paper raw keyword | `paper.keywords` | phrase `82`, all terms `75` |
| Abstract | cleaned abstract text | phrase `78`, all terms `65`; metadata-like abstract text is capped at `58` for phrase |
| Journal | `paper.journal` | phrase `60`, all terms `47` |

### Paper Author Matching

This was added so faculty-name searches return that faculty member's papers as real authored-paper matches.

Example:

``` text
Query: Kwang Wook Gang
99 faculty Exact faculty name match.
88 paper Paper author matches your search: 'Kwang Wook Gang'.
```

### Abstract Cleanup

Some imported paper `abstract` fields are not clean abstracts. They may contain sections like:

-   Authors
-   Published in
-   Abstract
-   Index Terms
-   Acknowledgements
-   Funding
-   Notes on contributors

To reduce false matches, `searchable_paper_abstract()` extracts only the markdown `**Abstract:**` section when present.

Then `likely_metadata_text()` checks for metadata markers. If a searched abstract still looks metadata-heavy, exact phrase matches are capped lower.

This prevents cases where a geology or salt marsh paper ranks highly for `computer science` only because an author affiliation or editor note contains a computer science department.

### Paper Semantic Search

Semantic search happens in `score_papers_semantic()`.

Process:

1.  Create an embedding for the query using `create_query_embedding()`.
2.  Load papers that have non-empty `paper_embedding`.
3.  Compute cosine similarity between query vector and paper vector.
4.  Keep papers with similarity at least `0.22`.
5.  Convert similarity to confidence:

``` python
confidence = min(85, max(40, round((similarity - 0.15) / 0.35 * 100)))
```

Semantic paper confidence is capped at `85`, so semantic similarity cannot outrank exact title/name/keyword evidence.

If `OPENAI_API_KEY` is missing or the embedding call fails, semantic search returns no semantic matches instead of breaking the entire search.

## Patent Search

Patents are scored in `score_patents()`.

| Field group | Source fields | Score behavior |
|---------------|---------------|------------------------------------------|
| Primary | patent title | exact `99`, phrase `97`, fuzzy `94/88`, all terms `90` |
| Keyword | `patent.aiKeywords` | phrase `95`, all terms `88` |
| Description | patent abstract | phrase `78`, all terms `65` |

Patent result payload includes:

-   id
-   title
-   patent number
-   inventors
-   year
-   description
-   link
-   aiKeywords

## Project Search

Projects are scored in `score_projects()`.

| Field group | Source fields | Score behavior |
|---------------|---------------|------------------------------------------|
| Primary | project title | exact `99`, phrase `97`, fuzzy `94/88`, all terms `90` |
| Keyword | `project.keywords` | phrase `95`, all terms `88` |
| Description | project description | phrase `78`, all terms `65` |

Project result payload includes:

-   id
-   title
-   status
-   lead faculty
-   start date
-   end date
-   description
-   link
-   aiKeywords
-   funding source

## Sorting And Result Limits

After all result types are scored, the backend merges them into one list and sorts by:

``` python
(
    result["confidence"],
    {"paper": 4, "faculty": 3, "patent": 2, "project": 1}.get(result["type"], 0),
)
```

Sorting is descending.

This means:

1.  Higher confidence wins first.
2.  If confidence is tied, papers sort above faculty, faculty above patents, patents above projects.
3.  After sorting, a diversification pass prevents long runs of a single result type when another type has a reasonably close score.

The diversification rule currently allows a different result type to appear after three consecutive results of the same type if it is within `25` confidence points of the next highest result. This is why a broad query like `computer science` can show several `90%` faculty department matches while still interleaving `82%` paper category matches.

The backend returns:

``` python
results[:250]
```

The `count` field reflects the full number of matched results before slicing.

## Justification Text

Justifications are generated from evidence in `evidence_justification()`.

Examples:

| Evidence | Justification |
|-------------------|-----------------------------------------------------|
| exact faculty name | `Exact faculty name match.` |
| fuzzy faculty name | `Close faculty name match, allowing for spacing or spelling differences.` |
| exact paper title | `Exact paper title match.` |
| phrase in paper title | `The paper title directly contains your search phrase.` |
| paper author | `Paper author matches your search: 'Kwang Wook Gang'.` |
| faculty-entered keyword | `Faculty-entered keyword matches your search: '...'.` |
| faculty AI keyword | `Recommended research keyword matches your search: '...'.` |
| imported faculty keyword | `Imported faculty keyword/category matches your search: '...'.` |
| generated paper keyword | `Generated paper keyword matches your search: '...'.` |
| imported paper category | `Paper is categorized under '...'.` |
| department | `Department affiliation directly matches your search phrase.` |
| abstract | `Paper abstract directly contains your search phrase.` |
| semantic | `Semantic match based on the paper's embedded research content.` |

The frontend currently labels this as `Match Summary:`.

## Keyword Source Semantics

### Faculty `faculty_keywords`

Faculty-entered or admin-entered keywords. Highest trust. Search scores these at `95` for phrase matches.

### Faculty `ai_keywords`

Recommended/generated keywords. Today this may include migrated Academic Metrics themes and can now be populated by the OpenAI keyword-generation command. Search scores these at `95`.

### Faculty `themes`

Imported Academic Metrics research themes. Search currently merges them with `ai_keywords` for high-trust recommended keyword matching.

### Faculty `keywords`

Imported broad raw categories. Useful, but more generic. Search scores phrase matches at `78`.

### Paper `ai_keywords`

Generated/recommended paper keywords. Search scores phrase matches at `92`.

### Paper `faculty_keywords`

Faculty-provided paper keywords. Search scores phrase matches at `92`.

### Paper `keywords`

Imported paper categories. Search scores phrase matches at `68`.

### Frontend `researchInterests`

Display name for faculty keyword chips. It is currently populated from the merged display keyword list, not from a separate prose research-interest field.

## AI Keyword Generation

The backend now supports LLM-generated faculty keywords.

Command:

``` bash
python manage.py generate_ai_keywords --limit 10 --dry-run --overwrite
python manage.py generate_ai_keywords --limit 10 --overwrite
```

Options:

| Option | Meaning |
|----------------|--------------------------------------------------------|
| `--model` | OpenAI model. Defaults to `OPENAI_KEYWORD_MODEL` or `gpt-5.4-mini`. |
| `--faculty-id` | Generate for one faculty id. Can be repeated. |
| `--limit` | Process at most N faculty records. |
| `--max-keywords` | Generate 3-20 keywords, default 12. |
| `--overwrite` | Replace existing `ai_keywords`; otherwise records with existing values are skipped. |
| `--merge` | Merge generated keywords with existing `ai_keywords`; implies overwrite. |
| `--dry-run` | Calls the model and prints keywords without saving. |

Input context includes:

-   faculty name
-   title
-   departments
-   bio
-   current keywords/categories
-   up to 12 papers
-   up to 8 patents
-   up to 8 projects

Output is parsed from JSON:

``` json
{ "keywords": ["keyword one", "keyword two"] }
```

Saved keywords are stored in `Faculty.ai_keywords`, where the search engine already treats them as high-trust recommended research keywords.

## Paper Embeddings

Paper embeddings are generated by:

``` bash
python manage.py embed_papers
```

Options:

| Option         | Meaning                                             |
|----------------|-----------------------------------------------------|
| `--model`      | Embedding model, default `text-embedding-3-small`.  |
| `--batch-size` | Number of papers per embedding request, default 50. |
| `--limit`      | Embed at most N papers.                             |
| `--force`      | Re-embed papers even when an embedding exists.      |
| `--dry-run`    | Report what would happen without saving.            |

The semantic text for each paper includes:

-   title
-   abstract
-   journal
-   keywords
-   themes
-   authors

Embeddings are stored on the paper:

-   `paper_embedding`
-   `embedding_model`
-   `embedding_updated_at`

## Frontend Suggestions

Suggestions are separate from backend search.

They are built in `src/utils/searchEngine.ts` from the public dataset loaded by `/api/public/search-data/`.

### Cold Start Suggestions

When the input is focused and empty, the frontend shows the top cited paper titles:

``` typescript
topPapers = papers
  .filter(has title)
  .map(title, citations)
  .sort(citations descending)
```

### Typing Suggestions

While typing, the frontend filters a `topicIndex`.

Sources and weights:

| Source                          | Weight |
|---------------------------------|-------:|
| Paper title                     |     50 |
| Paper keyword chips             |     30 |
| Faculty name                    |     35 |
| Faculty research interests      |     28 |
| Faculty aiKeywords              |     22 |
| Faculty department affiliations |     18 |
| Project title                   |     25 |
| Project keywords                |     18 |
| Patent title                    |     22 |
| Patent keywords                 |     16 |

Deduplication is case-insensitive. If the same text appears more than once, the highest weight wins.

Suggestion ranking tiers:

| Tier | Condition                                  |
|-----:|--------------------------------------------|
|    1 | Entry exactly equals query.                |
|    2 | Entry starts with query.                   |
|    3 | A word inside the entry starts with query. |
|    4 | Entry contains query anywhere.             |

Within the same tier, higher weight wins.

The frontend returns the top 8 suggestions.

### Performance Note

Suggestions currently run synchronously on every keystroke:

``` typescript
topicIndex
  .filter(...)
  .map(...)
  .sort(...)
  .slice(...)
```

This can cause typing delay if the public dataset grows large. The submitted backend search is separate from this delay.

## Frontend Submitted Search Flow

1.  User types a query in `Home.tsx`.
2.  Suggestions open via `openSuggestions(value)`.
3.  On form submit, `executeSearch(searchQuery)` runs.
4.  `performSearch(query)` calls `fetchUnifiedSearch(query)`.
5.  `fetchUnifiedSearch()` calls `/api/search/?q=<encoded query>`.
6.  Raw backend records are normalized by type.
7.  Results are stored in `searchResults`.
8.  `SearchResults` renders the list.

If the backend call fails, `performSearch()` returns an empty list.

## Frontend Result Rendering

`SearchResults.tsx` receives:

-   `results`
-   `query`
-   `activeFilters`

### Filtering

The user can filter by result type:

-   faculty
-   paper
-   patent
-   project

If no filters are active, all results are shown. Otherwise, only selected types are shown.

### Pagination

The frontend shows 10 results at a time:

``` typescript
const PAGE_SIZE = 10;
```

The `Load more` button increases the visible count by 10.

Changing query, filters, or results resets visible count back to 10.

### Confidence Labels

| Confidence | Label          | Color  |
|-----------:|----------------|--------|
|    `>= 80` | High Match     | green  |
|    `>= 60` | Good Match     | yellow |
|     `< 60` | Moderate Match | orange |

### Keyword Highlighting

The backend sends `matchedKeywords`.

The frontend highlights chips when:

``` typescript
matchedKeyword === chip
or chip includes matchedKeyword
```

This means context-only matches usually do not highlight chips, because backend context evidence often sends an empty `matchedKeywords` list.

Potential issue: the frontend still uses substring-style chip highlighting. If the backend sends a broad term, a chip can be highlighted because it contains that term.

### Faculty Cards

Faculty cards render:

-   type badge
-   confidence badge
-   photo or initials
-   name
-   title and department
-   `Research Interests` chips
-   match summary
-   contact information only if email or phone exists

### Paper Cards

Paper cards render:

-   title
-   authors and year
-   match summary
-   abstract preview
-   up to 10 keyword chips
-   `View Paper` link if DOI or link exists

### Patent Cards

Patent cards render:

-   title
-   inventors
-   patent number
-   year
-   match summary
-   description
-   up to 8 keyword chips
-   patent link

### Project Cards

Project cards render:

-   title
-   status
-   lead faculty
-   start date
-   match summary
-   description
-   up to 8 keyword chips

## Known Current Tradeoffs And Risks

### Suggestions Are Still Client-Side

The user wanted to avoid large frontend datasets. Full search is backend-based, but suggestions still rely on public data loaded into memory. This is why typing can feel delayed even when backend search is fine.

Possible fix:

-   move suggestions to a backend endpoint
-   or precompute lowercased suggestion keys and avoid sorting the full index on every keystroke
-   or debounce suggestion generation

### `researchInterests` Is A Display Alias

The frontend label says `Research Interests`, but the actual data is the merged display keyword set. This is acceptable as a UI label, but technically the API is not sending a separate prose research-interests field.

Possible fix:

-   rename frontend/internal type to `displayKeywords`
-   keep `researchInterests` only for backward compatibility

### Paper Abstract Display Still Shows Raw Abstract

Search scoring uses `searchable_paper_abstract()` for cleaner matching, but `paper_result()` still returns the original `paper.abstract` for display. If imported abstracts contain full scraped metadata, the card may display noisy text.

Possible fix:

-   return both `abstract` and `searchableAbstract`
-   display the cleaned abstract when available

### Search Is Row-Scan Based

The backend loops through faculty, papers, patents, and projects in Python. This is acceptable for a small dataset but will not scale indefinitely.

Possible fix:

-   database full-text indexes
-   materialized search documents
-   vector index for embeddings
-   cached keyword indexes

### Semantic Search Depends On OpenAI At Query Time

`score_papers_semantic()` embeds the query live. If OpenAI is unavailable or the key is missing, semantic results silently disappear and lexical results remain.

Possible fix:

-   cache query embeddings
-   report semantic availability in diagnostics
-   optionally allow search without OpenAI in production

### Diversification Reduces Type Clusters

When many results have similar confidence, pure confidence sorting can create long blocks of one result type. For example, a broad discipline query can produce many faculty department matches before any papers appear.

Current behavior:

-   score everything by evidence first
-   sort by confidence and tie-breaker
-   interleave another result type after three consecutive results of the same type, as long as the next different type is within the configured score window

This keeps relevance primary while making broad results pages more useful to scan.

## Representative Expected Behavior

### Faculty Name Query

Query:

``` text
Kwang Wook Gang
```

Expected:

-   exact faculty name match near `99`
-   close duplicate/spacing variant around `94`
-   authored papers around `88`

### Exact Paper Title Query

Query:

``` text
NLP Analysis of Shakespearean Characters
```

Expected:

-   exact paper title at `99`

### Slightly Misspelled Paper Title Query

Query:

``` text
NLP analysis of Shakespearean character
```

Expected:

-   fuzzy title match around `94`

### Broad Discipline Query

Query:

``` text
computer science
```

Expected:

-   faculty with exact `Department of Computer Science` or `Department of Mathematics and Computer Science` affiliation around `90`
-   paper raw category matches around `82`
-   faculty with imported raw `Computer science` category outside the matching department around `78`
-   department faculty and paper category matches should be mixed rather than separated into long blocks
-   exact title or AI/faculty keyword matches can outrank broad category matches
-   papers should not rank highly only because affiliation metadata says `Department of Computer Science`

### Topic Query

Query:

``` text
machine learning
```

Expected:

-   paper title phrase match around `97`
-   faculty AI keyword phrase match around `95`
-   clean abstract phrase matches around `78`
-   imported raw categories around `78` for faculty, `82` for papers

## Implementation Principle

When search behavior is wrong, debug the `matchEvidence` first.

The right question is not only:

``` text
Why is this result 78%?
```

The better question is:

``` text
What field matched, what strength matched, what value matched, and does that evidence deserve this score?
```

That is why every result now carries structured evidence.
