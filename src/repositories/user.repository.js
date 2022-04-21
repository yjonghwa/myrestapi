import models from '../models'

export default {
  // create
  store: async (data) => await models.User.create(data),

  // read
  all: async () => await models.User.findAll(),

  find: async (uuid) => await models.User.findOne({ where: { uuid: Buffer(uuid, 'hex') } }),

  findById: async (id) => await models.User.findByPk(id)

  // update
  // delete
}