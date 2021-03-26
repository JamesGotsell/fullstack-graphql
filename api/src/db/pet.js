const nanoid = require('nanoid')

const createPetModel = db => {
  console.log(db)
  return {
    findMany(filter) {
      return db.get('pet')
        .filter(filter)
        .orderBy(['createdAt'], ['desc'])
        .value()
    },

    findOne(filter) {
      return db.get('pet')
        .find(filter)
        .value()
    },

    create(pet) {
      const newPet = {id: nanoid(), createdAt: Date.now(), ...pet}
      
      db.get('pet')
        .push(newPet)
        .write()

      return newPet
    },
    delete(id) {
      console.log(id)
      const pets = db.get('pets').value()
      delete pets[id]
      db.set('pets', pets).value()
    }
  }
}

module.exports = createPetModel
