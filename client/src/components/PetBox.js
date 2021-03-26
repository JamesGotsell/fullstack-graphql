import React from 'react'
import { useMutation } from '@apollo/react-hooks'
const PetBox = ({pet}) => {

  
  return (
  <div className="pet">
    <figure>
      <img src={pet.img + `?pet=${pet.id}`} alt=""/>
    </figure>
    <div className="pet-name">{pet.name}</div>
    <div className="pet-type">{pet.type}</div>
    <button>Delete pet</button>
  </div>
  )
}

export default PetBox
