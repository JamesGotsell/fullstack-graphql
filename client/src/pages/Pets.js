import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'


const PETS_FIELDS = gql`
 fragment PetsFields on Pet {
          name
          id
          type
          img
          age @client
          vacinated @client
 }
`

const ALL_PETS = gql`
    query AllPets {
        pets {
          ...PetsFields
        }
}
  ${PETS_FIELDS}
`
// need to make sure that items returned in the query and mutattion are the same - for cache  
const NEW_PET = gql`
    mutation CreateAPet($newPet: NewPetInput!) {
        addPet(input: $newPet) {
          ...PetsFields
      }
  }
  ${PETS_FIELDS}
`
export default function Pets () {
  const [modal, setModal] = useState(false)
  const { data, loading, error } = useQuery(ALL_PETS, {
    optimisticResponse: {
      __typename: "Query",
      pets: {
        __typename: "Pet",
        name: "default",
        id: Math.round(Math.random() * -1000000) + '', 
        type: "DOG",
        img: "https://via.placeholder.com/300", 
        age: 35,
        vacinated: true
      }
    }
  })

  const [ createPet, newPet ] = useMutation(NEW_PET , {
    update(cache, { data: { addPet }} ) {
      // read data 
      const data  = cache.readQuery({ query: ALL_PETS })
      // wrire with the new graphql mutation data
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [ addPet, ...data.pets]}
      })
    }
  })



 
  const onSubmit = input => {
    setModal(false)
    createPet({
      variables: {
        "newPet": input
      },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          name: input.name,
          id: Math.round(Math.random() * -1000000) + '', 
          type: input.type,
          age: 35,
          vacinated: true,
          img: "https://via.placeholder.com/300", 
        }
      }
    })
  }
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }
  if(loading) {
    return <Loader/>
  }
  if(error || newPet.error) {
    return <p>error</p>
  }

 
  
  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
   
        {!loading && <PetsList pets={data.pets} /> }
      </section>
    </div>
  )
}
