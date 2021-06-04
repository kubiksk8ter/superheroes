module.exports = {
    Query: {
        //info: () => 'This is the API of a Superheroes UX',
        superheroes: async (parent, args, context) => {
            return context.prisma.superhero.findMany();
        }
    },
    Mutation: {
        createSuperhero: (parent, args, context, info) => {
            const newSuperhero = context.prisma.superhero.create({
                data: {
                firstName: args.firstName,
                lastName: args.lastName,
                superheroName: args.superheroName,
                dateOfBirth: args.dateOfBirth,
                superPowers: args.superPowers
                }
            });  
            return newSuperhero;
        },
        deleteSuperhero: (parent,{id}, context, info) => {
            let ID = parseInt(id);
            const superhero = context.prisma.superhero.delete({
                where: { id:ID }
            });
            return superhero;
        },
        updateSuperhero: (parent, args, context, info) => {
            let ID = parseInt(args.id);
            const superhero = context.prisma.superhero.update({
                where: { id: ID },
                data: {
                firstName: args.firstName,
                lastName: args.lastName,
                superheroName: args.superheroName,
                dateOfBirth: args.dateOfBirth,
                superPowers: args.superPowers 
                }
            });
            return superhero;
         }          
    }
};

