export const formatArticle = (article) => ({

    id: article._id,

    title: article.title,

    description: article.description,

    content: article.content,

    author: article.author,

    publisher: article.publisher,

    url: article.url,

    image: article.image,

    topic: article.topic,

    publishedAt: article.publishedAt,

    analysis: article.analysis || null

});