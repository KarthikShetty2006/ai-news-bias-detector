import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import Container from "../../components/layout/Container";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import Card from "../../components/ui/Card";

import {
  getArticles,
  fetchFreshNews,
} from "../../services/newsService";


/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}


function buildArticleText(
  article
) {
  return [
    article.title,
    article.description,
    article.content,
  ]
    .filter(Boolean)
    .join("\n\n");
}


/* ---------------------------------------------
   News Card
--------------------------------------------- */

function NewsCard({
  article,
}) {
  const [copied, setCopied] =
    useState(false);


  const handleCopyToAnalyze =
    async () => {
      const articleText =
        buildArticleText(
          article
        );

      if (
        !articleText.trim()
      ) {
        return;
      }

      try {
        /*
         * Copy only this article.
         */
        await navigator.clipboard.writeText(
          articleText
        );


        /*
         * Store selected article
         * for Analyze page.
         */
        sessionStorage.setItem(
          "newsToAnalyze",
          articleText
        );


        /*
         * Store metadata of ONLY
         * this article.
         */
        sessionStorage.setItem(
          "newsToAnalyzeMeta",
          JSON.stringify({
            title:
              article.title ||
              "",

            description:
              article.description ||
              "",

            content:
              article.content ||
              "",

            publisher:
              article.publisher ||
              article.author ||
              "",

            author:
              article.author ||
              "",

            image:
              article.image ||
              "",

            url:
              article.url ||
              "",

            publishedAt:
              article.publishedAt ||
              "",
          })
        );


        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );
      } catch (error) {
        console.error(
          "Unable to copy article:",
          error
        );
      }
    };


  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">

      {/* ---------------------------------------
          Image
      --------------------------------------- */}

      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

        {article.image ? (
          <img
            src={article.image}
            alt={
              article.title ||
              "News article"
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            onError={(
              event
            ) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-medium text-indigo-400">
              AI News
            </span>
          </div>
        )}

      </div>


      {/* ---------------------------------------
          Content
      --------------------------------------- */}

      <div className="flex flex-1 flex-col p-6">

        {/* Publisher */}

        <div className="flex items-center gap-2 text-xs text-slate-500">

          {(
            article.publisher ||
            article.author
          ) && (
            <span className="font-medium text-slate-700">
              {article.publisher ||
                article.author}
            </span>
          )}

          {(
            article.publisher ||
            article.author
          ) &&
            article.publishedAt && (
              <span className="text-slate-300">
                •
              </span>
            )}

          {article.publishedAt && (
            <span>
              {formatDate(
                article.publishedAt
              )}
            </span>
          )}

        </div>


        {/* Title */}

        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-slate-900">
          {article.title ||
            "Untitled article"}
        </h2>


        {/* Description */}

        {article.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {article.description}
          </p>
        )}


        {/* Actions */}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">

          {/* Copy */}

          <button
            type="button"
            onClick={
              handleCopyToAnalyze
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            {copied ? (
              <>
                <Check
                  size={16}
                />
                Copied
              </>
            ) : (
              <>
                <Copy
                  size={16}
                />
                Copy to Analyze
              </>
            )}
          </button>


          {/* Read */}

          {article.url && (
            <a
              href={
                article.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Read

              <ExternalLink
                size={15}
              />
            </a>
          )}

        </div>

      </div>

    </Card>
  );
}


/* ---------------------------------------------
   News Page
--------------------------------------------- */

export default function News() {

  /*
   * Articles currently displayed.
   */
  const [articles, setArticles] =
    useState([]);


  /*
   * Search input.
   */
  const [keyword, setKeyword] =
    useState("");


  /*
   * Current fresh search.
   */
  const [activeSearch, setActiveSearch] =
    useState("");


  /*
   * Current page.
   */
  const [page, setPage] =
    useState(1);


  /*
   * MongoDB total pages.
   */
  const [totalPages, setTotalPages] =
    useState(1);


  /*
   * Loading stored news.
   */
  const [loading, setLoading] =
    useState(true);


  /*
   * Loading fresh GNews.
   */
  const [
    searchingNews,
    setSearchingNews,
  ] = useState(false);


  /*
   * Error.
   */
  const [error, setError] =
    useState("");


  /* -------------------------------------------
     Load Previously Stored News
  ------------------------------------------- */

  const loadStoredNews =
    useCallback(
      async (
        search = "",
        pageNumber = 1
      ) => {
        try {
          setLoading(true);

          setError("");


          const response =
            await getArticles({
              page: pageNumber,

              limit: 12,

              search:
                search.trim() ||
                undefined,

              sort:
                "-publishedAt",
            });


          const storedArticles =
            Array.isArray(
              response?.articles
            )
              ? response.articles
              : [];


          setArticles(
            storedArticles
          );


          setPage(
            response?.page ||
              pageNumber
          );


          setTotalPages(
            response?.totalPages ||
              1
          );


          /*
           * We are back to stored news.
           */
          setActiveSearch("");

        } catch (err) {
          console.error(
            "Failed to load stored news:",
            err
          );


          setError(
            err?.response?.data
              ?.message ||
              "Unable to load news."
          );


          setArticles([]);

        } finally {
          setLoading(false);
        }
      },
      []
    );


  /* -------------------------------------------
     Fetch NEW News From GNews
  ------------------------------------------- */

const searchNewNews = useCallback(
  async (
    searchKeyword,
    pageNumber = 1
  ) => {
    try {
      setSearchingNews(true);
      setError("");

      const response =
        await fetchFreshNews(
          searchKeyword,
          pageNumber
        );

      const freshArticles =
        Array.isArray(
          response?.articles
        )
          ? response.articles
          : [];

      setArticles(
        freshArticles
      );

      setActiveSearch(
        searchKeyword
      );

      setPage(
        pageNumber
      );
    } catch (err) {
      console.error(
        "Failed to fetch new news:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          "Unable to fetch new news."
      );

      setArticles([]);
    } finally {
      setSearchingNews(false);
    }
  },
  []
);


  /* -------------------------------------------
     Initial Page Load
     
     IMPORTANT:
     Only MongoDB.
     NO GNews.
     NO ML.
  ------------------------------------------- */

  useEffect(() => {
    loadStoredNews(
      "",
      1
    );
  }, [
    loadStoredNews,
  ]);


  /* -------------------------------------------
     Search Previously Stored News
  ------------------------------------------- */

  const handleStoredSearch =
    (event) => {

      event.preventDefault();


      loadStoredNews(
        keyword,
        1
      );
    };


  /* -------------------------------------------
     Search NEW News
  ------------------------------------------- */

  const handleSearchNewNews = () => {
  const searchKeyword =
    keyword.trim() || "technology";

  // Always start fresh search from page 1
  setPage(1);
  setActiveSearch(searchKeyword);

  searchNewNews(
    searchKeyword,
    1
  );
};


  /* -------------------------------------------
     Refresh
  ------------------------------------------- */

  const handleRefresh =
    () => {

      if (
        activeSearch
      ) {
        /*
         * Refresh fresh GNews.
         */
        searchNewNews(
          activeSearch,
          page
        );

        return;
      }


      /*
       * Refresh stored articles.
       */
      loadStoredNews(
        keyword,
        page
      );
    };


  /* -------------------------------------------
     Stored Pagination
  ------------------------------------------- */

  const handlePreviousStored =
    () => {

      if (
        page <= 1 ||
        loading
      ) {
        return;
      }


      loadStoredNews(
        keyword,
        page - 1
      );
    };


  const handleNextStored =
    () => {

      if (
        loading ||
        page >= totalPages
      ) {
        return;
      }


      loadStoredNews(
        keyword,
        page + 1
      );
    };


  /* -------------------------------------------
     Fresh GNews Pagination
  ------------------------------------------- */

  const handlePreviousFresh =
    () => {

      if (
        page <= 1 ||
        searchingNews
      ) {
        return;
      }


      searchNewNews(
        activeSearch,
        page - 1
      );
    };


  const handleNextFresh =
    () => {

      if (searchingNews) {
        return;
      }


      searchNewNews(
        activeSearch,
        page + 1
      );
    };


  const showingFreshNews =
    activeSearch.trim() !== "";


  const isLoading =
    loading ||
    searchingNews;


  /* -------------------------------------------
     Render
  ------------------------------------------- */

  return (
    <main className="py-12 md:py-16">

      <Container>

        {/* Header */}

        <PageHeader
          eyebrow="News Library"
          title="All News"
          description="Browse previously fetched news or search the news API for fresh articles."
        />


        {/* -------------------------------------
            Search Area
        ------------------------------------- */}

        <div className="mt-8 w-full max-w-3xl">

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search input */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={keyword}
                onChange={(
                  event
                ) =>
                  setKeyword(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    handleSearchNewNews();
                  }
                }}
                placeholder="Enter a topic..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            {/* Search Stored */}

            <button
              type="button"
              onClick={
                handleStoredSearch
              }
              disabled={
                isLoading
              }
              className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Search Stored
            </button>

          </div>


          {/* Search New News */}

          <button
            type="button"
            onClick={
              handleSearchNewNews
            }
            disabled={
              isLoading
            }
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Sparkles
              size={17}
            />

            {searchingNews
              ? "Fetching New News..."
              : "Search New News"}

          </button>

        </div>


        {/* -------------------------------------
            Status
        ------------------------------------- */}

        <div className="mt-8 flex flex-wrap items-center gap-3">

          {showingFreshNews ? (
            <>
              <span className="rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-3 py-1 text-sm font-medium text-indigo-600">
                Fresh News
              </span>

              <span className="text-sm text-slate-500">
                Results for
              </span>

              <span className="text-sm font-medium text-slate-700">
                "{activeSearch}"
              </span>
            </>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              Previously Fetched News
            </span>
          )}


          {/* Refresh */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              isLoading
            }
            title="Refresh"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />

          </button>

        </div>


        {/* -------------------------------------
            News
        ------------------------------------- */}

        <section className="mt-8">

          {/* Loading */}

          {isLoading && (
            <Loader
              text={
                searchingNews
                  ? "Fetching new news..."
                  : "Loading saved news..."
              }
            />
          )}


          {/* Error */}

          {!isLoading &&
            error && (
              <EmptyState
                title="Unable to load news"
                description={
                  error
                }
              />
            )}


          {/* Empty */}

          {!isLoading &&
            !error &&
            articles.length ===
              0 && (
              <EmptyState
                title="No news found"
                description={
                  showingFreshNews
                    ? "Try another topic."
                    : "There are no previously fetched articles yet. Search for new news to get started."
                }
              />
            )}


          {/* Cards */}

          {!isLoading &&
            !error &&
            articles.length >
              0 && (
              <>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

                  {articles.map(
                    (
                      article,
                      index
                    ) => (
                      <NewsCard
                        key={
                          article._id ||
                          article.url ||
                          `${article.title}-${index}`
                        }
                        article={
                          article
                        }
                      />
                    )
                  )}

                </div>


                {/* --------------------------------
                    Pagination
                -------------------------------- */}

                <div className="mt-12 flex items-center justify-center gap-3">

                  {/* Previous */}

                  <button
                    type="button"
                    disabled={
                      page <= 1 ||
                      isLoading
                    }
                    onClick={
                      showingFreshNews
                        ? handlePreviousFresh
                        : handlePreviousStored
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>


                  {/* Current Page */}

                  <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 text-sm font-medium text-white shadow-sm">
                    {page}
                  </div>


                  {/* Next */}

                  <button
                    type="button"
                    disabled={
                      isLoading ||
                      (
                        showingFreshNews
                          ? articles.length <
                            10
                          : page >=
                            totalPages
                      )
                    }
                    onClick={
                      showingFreshNews
                        ? handleNextFresh
                        : handleNextStored
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              </>
            )}

        </section>

      </Container>

    </main>
  );
}