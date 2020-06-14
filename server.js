// https://www.youtube.com/watch?v=ZQL7tL2S0oQ

const express = require('express');
const expressgraphQl = require('express-graphql');
const app = express();

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const authors = [ 
  { id: 1, name: 'vinu'},
  { id: 2, name: 'Manu'},
  { id: 3, name: 'Gump'}
]
const books = [
  {id: '11', name: 'dsefsf', authorid: 1},
  {id: '12', name: 'fhfh', authorid: 3},
  {id: '13', name: 'yjyjyj', authorid: 2},
  {id: '14', name: 'dvffdv', authorid: 1},
  {id: '15', name: 'uyjyjyj', authorid: 3},
  {id: '16', name: 'xvxvxf', authorid: 4}
]
// const mySchema = new GraphQLSchema({ 
//   //name : name of the api
//   // fields: What this api returns
//   // message:  Value it returns is a message. This will contins the message type and from where(resovlve handles this) it will get the value
//   query: new GraphQLObjectType({
//     name: 'helloworld',

      // why fiedls are defined as a fun becse depednecy needs to be resolved for the below use case author tye needs to be before booktype and viceversa

//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => "Hi this really works"
//       }
//     })
//   })
// })

const BookType = new GraphQLObjectType({
  name: 'book',
  description: 'Book information',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorid: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (books) => {
        return authors.find((item) => item.id === books.authorid)
      }
    }
  })
})
//type: new GraphQLList(BookType) -- becse books returns an array of values
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author information',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (authors) => {
        return books.filter((item) => authors.id === item.authorid)
      }
    }
  })
})

const mutationQuery = new GraphQLObjectType({
  name: 'mutationQuery',
  description: "This help you mutate the data",
  fields: () => ({
    addAuthor: {
      type: AuthorType,
      description: 'Add a book',
      args: {
        name: {type: GraphQLNonNull(GraphQLString)}
      },
      resolve: (parents, args) => {
        const author = {id: 6, name: args.name}
        authors.push(author);
        return author
      }
    }
  })
}) 
const rootQuery = new GraphQLObjectType({
  name: 'rootQuery',
  description: "This is the root query",
  fields: () => ({
    book: {
      type: BookType,
      args: {
         id: { type: GraphQLString }
      },
      resolve: (parents, args) =>  books.find((book) => book.id === args.id)
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parents, args) =>  authors.find((author) => author.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of all Authors',
      resolve: () => authors
    }
  })
})

const rootSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: mutationQuery
});

app.use('/graphql', expressgraphQl({
  schema: rootSchema,
  graphiql: true
}));

app.listen(5000, () => console.log('server is running'));

