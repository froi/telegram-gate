import Head from 'next/head';
import Header from '../components/header';
import Page from '../components/page';
import data from '../static/chat-otro.json';
import lunr from 'lunr';
import elOtroIndex from '../static/el-otro-index.json';
import unidecode from 'unidecode';

function Home(props) {
  return (
    <>
      <Header source="otro" query={props.query} sticky={true} />
      <div className="flex flex-col">
        {props.query && props.results.length > 0 && (
          <p className="p-4 mb-4 bg-green-500 text-green-800 font-medium">
            El término <span className="text-white">"{props.query}"</span> se
            encontró en {props.results.length} página(s).
          </p>
        )}

        {props.query && props.results.length === 0 && (
          <p className="p-4 mb-4 bg-red-500 text-red-800 font-medium">
            No se encontraron resultados para el término{' '}
            <span className="text-white">"{props.query}"</span>.
          </p>
        )}

        {props.results.map((result) => (
          <Page
            source="otro"
            key={result.image}
            text={result.text}
            image={result.image}
            number={result.page}
            query={props.query}
          />
        ))}
      </div>
    </>
  );
}

Home.getInitialProps = async function(context) {
  let query = context.query.q;
  if (query) {
    const normalizedQuery = unidecode(query.toLowerCase());
    const idx = lunr.Index.load(elOtroIndex);
    const results = idx.search(normalizedQuery);
    const refs = results.map(result => parseInt(result.ref));

    return { 
      results: data.filter(result => refs.includes(result.page)), 
      query
    };
  }

  return { results: data, query: '' };
};

export default Home;
