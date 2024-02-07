const { Client } = require('@elastic/elasticsearch')
const client = new Client({ 
  node: 'http://34.28.106.98:9200/',
  auth: {
    username: 'elastic',
    password: '3VDywTV3JZdiPbZ0AOMa'
  }
})

async function run () {
  await client.index({
    index: 'pruebaiottxm',
    body: {
      mi_campo: 'mi_valor'
    }
  })

  const { body } = await client.search({
    index: 'mi_indice',
    body: {
      query: {
        match: { mi_campo: 'mi_valor' }
      }
    }
  })

  console.log(body.hits.hits)
}

run().catch(console.log)
