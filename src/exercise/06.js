// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [fullState, setFullState] = React.useState({
    pokemon: null,
    state: 'idle',
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName) {
      setFullState({
        state: 'pending',
      })
      fetchPokemon(pokemonName).then(
        data => {
          console.log('data', data)
          setFullState({pokemon: data, state: 'resolved'})
        },
        reason => {
          setFullState({state: 'rejected', error: reason})
        },
      )
    }
  }, [pokemonName])

  if (fullState.state === 'rejected') {
    throw fullState.error
  } else if (fullState.state === 'idle') {
    return 'Submit a pokemon'
  } else if (fullState.state === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return <PokemonDataView pokemon={fullState.pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function resetErrorBoundary() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorBoundaryFallback}
          resetErrorBoundary={resetErrorBoundary}
          onReset={resetErrorBoundary}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

function ErrorBoundaryFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default App
