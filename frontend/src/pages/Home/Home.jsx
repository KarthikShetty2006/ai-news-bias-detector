import Container from "../../components/layout/Container";
import SearchInput from "../../components/ui/SearchInput";
import Card from "../../components/ui/Card";

export default function Home() {
  return (
    <>

      {/* Hero */}

      <section className="py-24">

        <Container>

          <div className="mx-auto max-w-4xl text-center">

            <span className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              AI Powered News Intelligence
            </span>

            <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
              Understand news
              <span className="bg-[image:var(--button-gradient)] bg-clip-text text-transparent">
                {" "}
                beyond headlines.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Search any news article and let AI analyze political bias,
              sentiment, subjectivity, clickbait, and generate concise summaries.
            </p>

            <div className="mx-auto mt-10 w-full max-w-3xl">
              <SearchInput
                placeholder="Search articles..."
              />
            </div>

          </div>

        </Container>

      </section>

      {/* Latest News */}

      <section className="pb-24">
    <Container className="px-10 lg:px-12">

          <div className="mb-10">

            <div>

              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Latest News
              </h2>

              <p className="mt-2 text-slate-500">
                Latest articles from your backend.
              </p>

            </div>

          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>

                <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100" />

                <h3 className="mt-5 line-clamp-2 text-lg font-semibold">
                  Article title goes here
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  This card will later display live data from the backend.
                </p>

              </Card>
            ))}

          </div>

        </Container>

      </section>

    </>
  );
}