import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';


const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

const Button = styled.button`
margin: 1rem;
padding: 1rem;
background-color: black;
color: white;
border-radius: 0.5rem;
padding-left: 1rem;
margin-left: 1rem;
`;


const PageContainer = styled.div`
display: grid;
flex-direction: row;
`;

const Input = styled.input`
width: 33%;
margin: 1rem;
padding: 1rem;
background-color: transparent;
color: black
`;

const Title = styled.h1`
  font-size: rem;
  text-align: center;
  color: black;
`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;

  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });
  const { current } = page;

  useEffect(() => {


    if ( current === defaultEndpoint ) return;

    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      });

      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return;
      }

      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');

    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint
    });
  }

  return (
 <PageContainer>
        <Title>
          WOW, VILKEN TITEL!
        </Title>

        <form className="search" onSubmit={handleOnSubmitSearch}>
          <Input name="query" type="search" />
          <Button>Filtrera resultat</Button>
        </form>

        <ul className="grid">
          {results.map(result => {
            const { id, name, image } = result;
            return (
            
              <p href="/character/[id]" as={`/character/${id}`}>
                  <a>
                    <img src={image} alt={`${name} Thumbnail`} />
                    <h3>{ name }</h3>
                  </a>
                </p>
            )

          })}
        </ul>

        <p>
          <Button onClick={handleLoadMore}>Ladda fler resultat</Button>
        </p>
   </PageContainer>

  )
}
