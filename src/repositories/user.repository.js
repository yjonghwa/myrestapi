import models from '../models'

export default {
  // create
  store: async (data) => await models.User.create(data),

  // read
  all: async () => await models.User.findAll(),

  find: async (uuid) => await models.User.findOne({ where: { uuid: Buffer.from(uuid, 'hex') } }),

  findById: async (id) => await models.User.findByPk(id),

  findByEmail: async (email) => await models.User.findOne({ where : { email } })

  // update
  // delete
}