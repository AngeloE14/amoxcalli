import mongoose from 'mongoose';
import Plan from './models/Plan.js';
import Book from './models/Book.js';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/amoxcalli';

const plans = [
  {
    name: 'Estándar',
    price: 79.99,
    durationDays: 90,
    maxBooks: 5,
    description: 'Acceso a hasta 5 libros por 3 meses. Sin reseñas, sin guardado ni compras individuales.',
  },
  {
    name: 'Premium',
    price: 149.99,
    durationDays: 90,
    maxBooks: null,
    description: 'Acceso ilimitado a todo el catálogo por 3 meses. Reseñas, guardado y compras.',
  },
];

const books = [
  {
    title: 'Cien Años de Soledad',
    author: 'Gabriel García Márquez',
    description: 'La historia de la familia Buendía en el pueblo de Macondo. Una obra maestra del realismo mágico que narra siete generaciones de amor, soledad ydestino.',
    genre: 'Novela',
    language: 'Español',
    price: 229.99,
    pages: 496,
    coverUrl: 'https://picsum.photos/seed/book1/300/450',
    content: 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.\n\nMacondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho pedregoso sobre un siglo de piedras pulidas.\n\nCada año, en el mes de marzo, una familia de gitanos harapientos acampaba en las afueras del pueblo y un nutrido bullicio de alborotadores anunciaba las novedades del mundo.\n\nJosé Arcadio Buendía, que fue quien organizó la fundación de Macondo, fue el hombre más emprendedor que se había visto jamás en la aldea.\n\nLos primeros años fueron felices. La gente se levantaba temprano para escuchar el canto de los pájaros, y la vida transcurría con sencillez y alegreza.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'Una distopía sobre un régimen totalitario donde el Gran Hermano lo vigila todo. Winston Smith lucha por la verdad en un mundo de mentiras.',
    genre: 'Ciencia Ficción',
    language: 'Inglés',
    price: 189.99,
    pages: 328,
    coverUrl: 'https://picsum.photos/seed/book2/300/450',
    content: 'Era un día frío y brillante de abril, y los relojes daban las trece. Winston Smith, con la barbilla clavada en el pecho para escapar del viento helado, se deslizó rápidamente a través de las puertas de cristal de la Mansión Vitoria.\n\nEl pasillo olía a col cocida y a esterilla vieja. Al fondo, una estampa colorada, demasiado grande para ser un cartel doméstico, estaba clavada en la pared.\n\nWINSTON SMITH, SU GRATITUD, LE PONÍA LOS PELITOS DE PUNTA. Un partido de más de diez millones de miembros que llenaban el mundo entero.\n\nEn la calle, los cartelones gigantescos con la cara del Gran Hermano pegados en las esquinas parecían seguirlo con los ojos a todas partes.',
  },
  {
    title: 'Orgullo y Prejuicio',
    author: 'Jane Austen',
    description: 'La clásica historia de Elizabeth Bennet y el señor Darcy en la Inglaterra del siglo XIX. Un relato ingenioso sobre amor, orgullo y malentendidos.',
    genre: 'Romance',
    language: 'Inglés',
    price: 179.99,
    pages: 432,
    coverUrl: 'https://picsum.photos/seed/book3/300/450',
    content: 'Es una verdad universalmente reconocida que un hombre soltero, poseedor de una gran fortuna, necesita una esposa.\n\nSin embargo, poco se conoce del sentimiento o de los puntos de vista de aquel hombre cuando entra por primera vez en el vecindario.\n\nLa familia Bennet vivía en Longbourn, una casa modesta pero acogedora, rodeada de campos verdes y cercana al pueblo más grande de la región.\n\nElizabeth Bennet era la segunda de cinco hermanas, todas ellas solteras y en edad de matrimonio, lo cual era motivo de gran preocupación para su madre.',
  },
  {
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'Bilbo Bolsón emprende una aventura inesperada con un grupo de enanos y un mago. Un viaje épico que cambiará la Tierra Media para siempre.',
    genre: 'Fantasía',
    language: 'Inglés',
    price: 199.99,
    pages: 310,
    coverUrl: 'https://picsum.photos/seed/book4/300/450',
    content: 'En un agujero en el suelo, vivía un hobbit. No un agujero húmedo, sucio, repugnante, con olores viscosos, ni tampoco un agujero seco, arenoso y vacío, sin nada que sentarse o que comer.\n\nEra un agujero-hogar, y eso significa confort.\n\nTenía una puerta redonda como una ventanilla, pintada de verde, con un picaporte amarillo brillante en el centro.\n\nLa puerta abría directamente al salón, que tenía forma de tubo, como un túnel.',
  },
  {
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes',
    description: 'Las aventuras del ingenioso hidalgo que enloquece leyendo libros de caballerías. La obra cumbre de la literatura española.',
    genre: 'Clásico',
    language: 'Español',
    price: 259.99,
    pages: 992,
    coverUrl: 'https://picsum.photos/seed/book5/300/450',
    content: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.\n\nUna olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.\n\nEl resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo.',
  },
  {
    title: 'Fundación',
    author: 'Isaac Asimov',
    description: 'Hari Seldon crea la Fundación para preservar el conocimiento tras la caída del Imperio Galáctico. Ciencia ficción en su máxima expresión.',
    genre: 'Ciencia Ficción',
    language: 'Inglés',
    price: 189.99,
    pages: 244,
    coverUrl: 'https://picsum.photos/seed/book6/300/450',
    content: 'Hari Seldon... el hombre que había elegido el exilio para cumplir su plan maestro.\n\nLa psicohistoria, la ciencia que había creado, permitía predecir el futuro de grandes masas humanas con una precisión estadística.\n\nEl Imperio Galáctico, que gobernaba millones de mundos habitados por billones de seres humanos, estaba condenado a caer.\n\nLa Edad Oscura duraría treinta mil años. Pero Seldon había creado un camino para acortar esa era a apenas un milenio.',
  },
  {
    title: 'Matar a un Ruiseñor',
    author: 'Harper Lee',
    description: 'La historia de Scout Finch y su padre Atticus, un abogado que defiende a un hombre negro en el sur de Estados Unidos. Justicia e inocencia.',
    genre: 'Novela',
    language: 'Inglés',
    price: 199.99,
    pages: 384,
    coverUrl: 'https://picsum.photos/seed/book7/300/450',
    content: 'Cuando tenía casi trece años, mi hermano Jem se rompió el brazo por el codo. Bien curado, dejó de preocuparse por sus asuntos de musculación y se dedicó a la lectura.\n\nEl verano que Jem tenía doce años empezó con cosas muy tranquilas, pero se acabó en el juicio que cambió nuestras vidas.\n\nAtticus Finch era un abogado que trabajaba en Maycomb, Alabama, un pueblo pequeño donde todo el mundo conocía a todo el mundo.',
  },
  {
    title: 'Harry Potter y la Piedra Filosofal',
    author: 'J.K. Rowling',
    description: 'El niño que vivió descubre que es un mago y entra a Hogwarts. El comienzo de una aventura mágica que cautivó al mundo entero.',
    genre: 'Fantasía',
    language: 'Español',
    price: 239.99,
    pages: 309,
    coverUrl: 'https://picsum.photos/seed/book8/300/450',
    content: 'El señor y la señora Dursley, del número cuatro de Privet Drive, se sentían orgullosos de decir que eran muy normales, por favor, gracias.\n\nNo tenían nada que ver con gente sospechosa o misteriosa, pues no podían soportar ese tipo de personas.\n\nHarry Potter vivía con los Dursley desde que era bebé, cuando sus padres murieron en un terrible accidente de coche.\n\nUna mañana, Harry recibió una carta con su nombre escrito con tinta verde sobre un sobre amarillento y cremoso.',
  },
  {
    title: 'Crónica de una Muerte Anunciada',
    author: 'Gabriel García Márquez',
    description: 'La reconstrucción del asesinato de Santiago Nasar en un pueblo colombiano. Una obra maestra del realismo mágico.',
    genre: 'Novela',
    language: 'Español',
    price: 159.99,
    pages: 192,
    coverUrl: 'https://picsum.photos/seed/book9/300/450',
    content: 'Lo van a matar. Margot Lozano se lo dijo a Santiago Nasar a las cinco y media de la mañana, cuando él volvía del río donde había ido a esperar el buque del obispo.\n\nFue una advertencia tan vaga que al principio nadie le dio importancia.\n\nPero la verdad es que todo el mundo lo sabía, menos el propio Santiago Nasar.\n\nEl día de su muerte, Santiago Nasar se levantó a las cinco y media de la mañana para ver pasar al obispo.',
  },
  {
    title: 'El Alquimista',
    author: 'Paulo Coelho',
    description: 'Santiago, un joven pastor, viaja desde España hasta Egipto en busca de un tesoro. Una fábula sobre seguir los sueños.',
    genre: 'Novela',
    language: 'Español',
    price: 179.99,
    pages: 208,
    coverUrl: 'https://picsum.photos/seed/book10/300/450',
    content: 'El muchacho se llamaba Santiago. Dormía al raso, sobre un viejo y abandonado templo de la Sierra Morena.\n\nLa capilla tenía un árbol de encina que crecía en el centro, y a través de una grieta del techo entraba la luz de la luna.\n\nEsa noche tuvo un sueño que se repetía, igual que la noche anterior.\n\nSoñaba que, igual que la noche anterior, la lluvia caía sobre la sierra y la reina del desierto aparecía ante sus ojos.',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Plan.deleteMany({});
  await Book.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  await Plan.insertMany(plans);
  console.log(`Inserted ${plans.length} plans`);

  await Book.insertMany(books);
  console.log(`Inserted ${books.length} books`);

  await User.create({
    name: 'Administrador',
    email: 'admin@amoxcalli.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('Created admin user: admin@amoxcalli.com / admin123');

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
