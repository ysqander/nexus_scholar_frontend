import React from 'react'

function Start() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to Nexus Scholar</h1>
      <p className="mb-4">
        This app allows you to build a large context of arXiv research papers
        and your own provided PDFs to chat with using the Gemini 1.5 Google
        models.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        How to Use the Context Builder
      </h2>
      <p className="mb-4">
        In the Context Builder, load an arXiv paper, and you will get its
        references automatically split into arXiv and non-arXiv papers. Select
        the arXiv papers you want to include in your context. You can also add
        any other arXiv paper by ID or include your own PDFs (which can be
        non-arXiv papers) to the context as well.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Model Types</h2>
      <p className="mb-4">
        Choose between the Base and Pro models to build the context cache and
        start chatting. Currently the base and pro models are Google Gemini
        Flash 1.5 and Gemini Pro 1.5{' '}
      </p>
      <p className="mb-4">
        The base model is good at retrieving a single item from a large cache
        (needle in haystack) and at summarizing. For more sophisticated work,
        use the Pro model.
      </p>
      <h2 className="text-2xl font-semibold mb-2">How Much Does It Cost?</h2>
      <p className="mb-4">
        You are charged per context cache stored, which is calculated as the
        total number of tokens stored in the cache multiplied by the number of
        minutes the cache exists. To use Nexus Scholar, you need Token Hours.
        These represent a unit of 1 million tokens cached for an hour. All new
        users receive 5 Token Hours of the Base model and 1 Token Hours of the
        Pro model.
      </p>
      <p className="mb-4">
        The cost of a Token Hour for the base model is $1.2. So, for example, if
        you build a context cache with 400,000 tokens and it exists for 10
        minutes, the usage would be 400,000/1,000,000 tokens * 10/60 minutes=
        0.067 Token Hours. This will be then deducted form your token Hours
        tally. This chat would have cost you 0.067 token Hours * 1.2$ per Token
        Hour = $0.08 (8 cents){' '}
      </p>{' '}
      <p className="mb-4">
        You can purchase more Token Hours in the Account page.
      </p>
      <p className="mb-4">
        {' '}
        We do not charge for the tokens used during the chat currently
      </p>
      <h2 className="text-2xl font-semibold mb-2">Cache Persistence</h2>
      <p className="mb-4">
        Context caches only persist for the duration of the chat. When you
        terminate your chat the cached context is deleted. But you can refer to
        the raw text used as cache in the chat history page.
      </p>
    </div>
  )
}

export default Start
