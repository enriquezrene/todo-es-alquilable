const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const bucket = storage.bucket('todo-es-alquilable.firebasestorage.app')

bucket.setCorsConfiguration([
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    maxAgeSeconds: 3600,
  },
]).then(() => {
  console.log('CORS set successfully')
}).catch((err) => {
  console.error('Error:', err.message)
})
