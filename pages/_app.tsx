import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "../styles/globals.css"
import Head from "next/head"

function App({ Component, pageProps }) {
  return (<div>
      <Head>
        <title>CryptoTracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default App
