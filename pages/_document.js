import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
          <Head>
            <meta name="description" content="Distrinova, Tu destino de compras mayoristas en linea." />
            <link rel="icon" href="/assets/Icono.ico" />
          </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
