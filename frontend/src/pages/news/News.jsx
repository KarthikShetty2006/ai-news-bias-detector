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
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import Card from "../../components/ui/Card";

import {
  getArticles,
  fetchFreshNews,
} from "../../services/newsService";


/* =========================================================
   Helpers
========================================================= */

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


function buildArticleText(article) {
  return [
    article.title,
    article.description,
    article.content,
  ]
    .filter(Boolean)
    .join("\n\n");
}


/* =========================================================
   News Card
========================================================= */

function NewsCard({ article }) {
  const [copied, setCopied] = useState(false);

  const handleCopyToAnalyze = async () => {
    const articleText = buildArticleText(article);

    if (!articleText.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(articleText);

      sessionStorage.setItem(
        "newsToAnalyze",
        articleText
      );

      sessionStorage.setItem(
        "newsToAnalyzeMeta",
        JSON.stringify({
          title: article.title || "",
          description: article.description || "",
          content: article.content || "",
          publisher:
            article.publisher ||
            article.author ||
            "",
          author: article.author || "",
          image: article.image || "",
          url: article.url || "",
          publishedAt:
            article.publishedAt || "",
        })
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Unable to copy article:",
        error
      );
    }
  };


  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_4px_20px_rgba(15,23,42,0.05)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.10)]
      "
    >

      {/* =====================================================
          Image
      ====================================================== */}

      <div
        className="
          relative
          aspect-[16/9]
          w-full
          overflow-hidden
          bg-gradient-to-br
          from-slate-100
          via-indigo-50
          to-purple-50
        "
      >

        {article.image ? (
          <img
            src={article.image}
            alt={
              article.title ||
              "News article"
            }
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.04]
            "
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              bg-gradient-to-br
              from-indigo-50
              via-white
              to-purple-50
            "
          >
            <div
              className="
                rounded-xl
                border
                border-white/80
                bg-white/70
                px-4
                py-2
                text-sm
                font-semibold
                text-indigo-500
                shadow-sm
              "
            >
              AI News
            </div>
          </div>
        )}

        {/* Image overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-gradient-to-t
            from-black/20
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

      </div>


      {/* =====================================================
          Content
      ====================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
          sm:p-6
        "
      >

        {/* Publisher / Date */}

        <div
          className="
            flex
            min-h-5
            items-center
            gap-2
            text-xs
            text-slate-400
          "
        >

          {(article.publisher ||
            article.author) && (
            <>
              <span
                className="
                  max-w-[65%]
                  truncate
                  font-semibold
                  text-slate-600
                "
              >
                {article.publisher ||
                  article.author}
              </span>
            </>
          )}

          {(article.publisher ||
            article.author) &&
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

        <h2
          className="
            mt-3
            line-clamp-2
            min-h-[3.5rem]
            text-[17px]
            font-bold
            leading-7
            tracking-[-0.01em]
            text-slate-900
            transition-colors
            group-hover:text-indigo-600
          "
        >
          {article.title ||
            "Untitled article"}
        </h2>


        {/* Description */}

        <div className="mt-3 flex-1">

          {article.description ? (
            <p
              className="
                line-clamp-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              {article.description}
            </p>
          ) : (
            <p
              className="
                text-sm
                leading-6
                text-slate-400
              "
            >
              No description available
              for this article.
            </p>
          )}

        </div>


        {/* Divider */}

        <div className="my-5 h-px bg-slate-100" />


        {/* Actions */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* Copy / Analyze */}

          <button
            type="button"
            onClick={handleCopyToAnalyze}
            className="
              inline-flex
              h-10
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              px-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              shadow-indigo-200
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
              hover:shadow-indigo-200
              active:translate-y-0
            "
          >

            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Analyze
              </>
            )}

          </button>


          {/* Read */}

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                font-semibold
                text-slate-600
                transition-all
                duration-200
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-900
              "
            >
              <span className="hidden sm:inline">
                Read
              </span>

              <ExternalLink size={15} />
            </a>
          )}

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   News Page
========================================================= */

export default function News() {

  const [articles, setArticles] =
    useState([]);

  const [keyword, setKeyword] =
    useState("");

  const [activeSearch, setActiveSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [
    searchingNews,
    setSearchingNews,
  ] = useState(false);

  const [error, setError] =
    useState("");


  /* =========================================================
     Load Previously Stored News
  ========================================================= */

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
              sort: "-publishedAt",
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


  /* =========================================================
     Fetch New News From GNews
  ========================================================= */

  const searchNewNews =
    useCallback(
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


  /* =========================================================
     Initial Load
  ========================================================= */

  useEffect(() => {

    loadStoredNews(
      "",
      1
    );

  }, [
    loadStoredNews,
  ]);


  /* =========================================================
     Search Stored News
  ========================================================= */

  const handleStoredSearch =
    (event) => {

      event.preventDefault();

      loadStoredNews(
        keyword,
        1
      );
    };


  /* =========================================================
     Search New News
  ========================================================= */

  const handleSearchNewNews = () => {

    const searchKeyword =
      keyword.trim() ||
      "technology";

    setPage(1);
    setActiveSearch(
      searchKeyword
    );

    searchNewNews(
      searchKeyword,
      1
    );
  };


  /* =========================================================
     Refresh
  ========================================================= */

  const handleRefresh = () => {

    if (activeSearch) {

      searchNewNews(
        activeSearch,
        page
      );

      return;
    }

    loadStoredNews(
      keyword,
      page
    );
  };


  /* =========================================================
     Stored Pagination
  ========================================================= */

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


  /* =========================================================
     Fresh News Pagination
  ========================================================= */

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


  /* =========================================================
     Render
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-slate-50/60
        py-8
        sm:py-10
        lg:py-12
      "
    >

      <Container>

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
          "
        >

          {/* =================================================
              Header
          ================================================= */}

          <header
            className="
              border-b
              border-slate-200/80
              pb-7
            "
          >

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-indigo-600
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-indigo-600
                  "
                />

                News Library
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-[-0.03em]
                  text-slate-950
                  sm:text-4xl
                  lg:text-[42px]
                "
              >
                All News
              </h1>

              <p
                className="
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                  sm:text-base
                "
              >
                Browse previously fetched
                articles or discover fresh
                stories from the news API.
              </p>

            </div>

          </header>


          {/* =================================================
              Search Panel
          ================================================= */}

          {/* =================================================
    Search Panel
================================================= */}

<section
  className="
    mt-7
    w-full
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-4
    shadow-[0_4px_20px_rgba(15,23,42,0.04)]
    sm:p-5
  "
>
  <form onSubmit={handleStoredSearch}>

    <div
      className="
        flex
        w-full
        flex-col
        gap-3
        lg:flex-row
        lg:items-center
      "
    >

      {/* Search Input */}

      <div className="relative min-w-0 flex-1">
  <div
    className="
      flex
      h-12
      w-full
      items-center
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      transition-all
      hover:border-slate-300
      focus-within:border-indigo-400
      focus-within:bg-white
      focus-within:ring-4
      focus-within:ring-indigo-100
    "
  >
    <Search
      size={18}
      strokeWidth={2}
      className="
        ml-4
        mr-3
        shrink-0
        text-slate-400
      "
    />

    <input
      type="text"
      value={keyword}
      onChange={(event) =>
        setKeyword(event.target.value)
      }
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSearchNewNews();
        }
      }}
      placeholder="Search news by topic..."
      className="
        h-full
        min-w-0
        flex-1
        bg-transparent
        pr-4
        text-sm
        font-medium
        text-slate-800
        outline-none
        placeholder:text-slate-400
      "
    />
  </div>
</div>


      {/* Search Stored */}

      <button
        type="submit"
        disabled={isLoading}
        className="
          inline-flex
          h-12
          shrink-0
          items-center
          justify-center
          whitespace-nowrap
          rounded-xl
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          px-6
          text-sm
          font-semibold
          text-white
          shadow-md
          shadow-indigo-200
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:shadow-lg
          hover:shadow-indigo-200
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Search Stored
      </button>


      {/* Search New News */}

      <button
        type="button"
        onClick={handleSearchNewNews}
        disabled={isLoading}
        className="
          inline-flex
          h-12
          shrink-0
          items-center
          justify-center
          gap-2
          whitespace-nowrap
          rounded-xl
          bg-gradient-to-r
          from-indigo-600
          to-purple-600
          px-6
          text-sm
          font-semibold
          text-white
          shadow-md
          shadow-indigo-200
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:shadow-lg
          hover:shadow-indigo-200
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        <Sparkles size={17} />

        {searchingNews
          ? "Fetching..."
          : "Search New News"}

      </button>

    </div>

  </form>
</section>


          {/* =================================================
              Results Toolbar
          ================================================= */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div className="min-w-0">

              {showingFreshNews ? (
                <div
                  className="
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-indigo-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-indigo-600
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-indigo-500
                      "
                    />

                    Fresh News
                  </span>

                  <span className="text-sm text-slate-400">
                    Results for
                  </span>

                  <span
                    className="
                      max-w-[240px]
                      truncate
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    "{activeSearch}"
                  </span>

                </div>
              ) : (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <h2
                    className="
                      text-lg
                      font-bold
                      tracking-[-0.01em]
                      text-slate-900
                    "
                  >
                    Previously Fetched News
                  </h2>

                  {articles.length > 0 && (
                    <span
                      className="
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      {articles.length}
                    </span>
                  )}

                </div>
              )}

            </div>


            {/* Refresh */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh"
              className="
                inline-flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                self-start
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition-all
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-900
                sm:self-auto
              "
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


          {/* =================================================
              Content
          ================================================= */}

          <section className="mt-6">

            {/* Loading */}

            {isLoading && (
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  py-16
                "
              >
                <Loader
                  text={
                    searchingNews
                      ? "Fetching new news..."
                      : "Loading saved news..."
                  }
                />
              </div>
            )}


            {/* Error */}

            {!isLoading &&
              error && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-white
                    p-6
                  "
                >
                  <EmptyState
                    title="Unable to load news"
                    description={error}
                  />
                </div>
              )}


            {/* Empty */}

            {!isLoading &&
              !error &&
              articles.length === 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    p-10
                    sm:p-16
                  "
                >
                  <EmptyState
                    title="No news found"
                    description={
                      showingFreshNews
                        ? "Try another topic."
                        : "There are no previously fetched articles yet. Search for new news to get started."
                    }
                  />
                </div>
              )}


            {/* Cards */}

            {!isLoading &&
              !error &&
              articles.length > 0 && (
                <>

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-5
                      sm:gap-6
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >

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


                  {/* =================================================
                      Pagination
                  ================================================= */}

                  <div
                    className="
                      mt-10
                      flex
                      items-center
                      justify-center
                      gap-2
                      border-t
                      border-slate-200
                      pt-7
                    "
                  >

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
                      className="
                        h-10
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-sm
                        font-semibold
                        text-slate-600
                        transition-all
                        hover:border-slate-300
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Previous
                    </button>


                    {/* Current Page */}

                    <div
                      className="
                        flex
                        h-10
                        min-w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-900
                        px-3
                        text-sm
                        font-bold
                        text-white
                        shadow-sm
                      "
                    >
                      {page}
                    </div>


                    {/* Next */}

                    <button
                      type="button"
                      disabled={
                        isLoading ||
                        (
                          showingFreshNews
                            ? articles.length < 10
                            : page >= totalPages
                        )
                      }
                      onClick={
                        showingFreshNews
                          ? handleNextFresh
                          : handleNextStored
                      }
                      className="
                        h-10
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-sm
                        font-semibold
                        text-slate-600
                        transition-all
                        hover:border-slate-300
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Next
                    </button>

                  </div>

                </>
              )}

          </section>

        </div>

      </Container>

    </main>
  );
}