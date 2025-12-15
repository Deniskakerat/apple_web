import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "apple-seedlings" },
    update: {},
    create: { name: "Плодові саджанці", slug: "apple-seedlings" },
  });

const products = [
  // ===== APPLE =====
  {
    title: "Айдаред",
    slug: "aidared",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/aidared.jpg",
    description: "Популярний зимовий сорт яблуні з кисло-солодким смаком. Добре зберігається та підходить для свіжого споживання і переробки."
  },
  {
    title: "Антонівка",
    slug: "antonovka",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/antonovka.jpg",
    description: "Класичний український сорт з яскраво вираженим ароматом. Відзначається високою зимостійкістю та стабільною врожайністю."
  },
  {
    title: "Чемпіон",
    slug: "champion",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/champion.webp",
    description: "Десертний сорт з солодким смаком і соковитою м’якоттю. Плоди привабливі, добре продаються на ринку."
  },
  {
    title: "Флоріна",
    slug: "florina",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/florina1.jpg",
    description: "Зимовий сорт з високою стійкістю до хвороб. Яблука солодкі, ароматні та довго зберігаються."
  },
  {
    title: "Фуджі",
    slug: "fuji",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/fuji.jpg",
    description: "Дуже солодкий сорт із хрусткою м’якоттю. Користується великим попитом серед покупців."
  },
  {
    title: "Гала",
    slug: "gala",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/Gala.webp",
    description: "Ранній сорт яблуні з ніжним солодким смаком. Ідеальний для вживання у свіжому вигляді."
  },
  {
    title: "Голден Делішес",
    slug: "golden-delicious",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/golden_delicious.jpg",
    description: "Солодкий сорт з жовтими плодами та тонким ароматом. Часто використовується для десертів та соків."
  },
  {
    title: "Джонаголд",
    slug: "jonagold",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/jona_gold.png",
    description: "Великі плоди з гармонійним кисло-солодким смаком. Підходить для комерційного вирощування."
  },
  {
    title: "Лігол",
    slug: "ligol",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/Ligol.jpg",
    description: "Сучасний сорт з високою врожайністю. Яблука тверді, соковиті та добре транспортуються."
  },
  {
    title: "Мельба",
    slug: "melba",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/Melba.jfif",
    description: "Літній сорт з карамельним присмаком. Дуже ароматний і популярний серед покупців."
  },
  {
    title: "Пінова",
    slug: "pinova",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/Pinova.webp",
    description: "Зимовий сорт з солодко-кислим смаком. Відзначається стабільним урожаєм та якісними плодами."
  },
  {
    title: "Ред Делішес",
    slug: "red-delicious",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/red_delicios.jpg",
    description: "Яскраво-червоні плоди з солодкою м’якоттю. Має привабливий вигляд для продажу."
  },
  {
    title: "Спартан",
    slug: "spartan",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/spartan.jpg",
    description: "Сорт із насиченим смаком та темно-червоними плодами. Добре підходить для зберігання."
  },
  {
    title: "Симиренко",
    slug: "symyrenko",
    price: 150,
    stock: 15,
    type: "apple",
    imagePath: "/img/apple/Symyrenko.jpg",
    description: "Відомий зимовий сорт зелених яблук. Має освіжаючий смак і високу врожайність."
  },

  // ===== PEAR =====
  {
    title: "Бере Боск",
    slug: "bere-bosc",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/bere_box.jpg",
    description: "Французький сорт з великими ароматними плодами. М’якоть ніжна та солодка."
  },
  {
    title: "Груша",
    slug: "grusha",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/Grusha.jpg",
    description: "Класичний сорт груші для домашнього саду. Плоди соковиті та ароматні."
  },
  {
    title: "Конференція",
    slug: "konferentsiia",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/konferentsiia.webp",
    description: "Один із найпопулярніших сортів для продажу. Добре зберігається та транспортується."
  },
  {
    title: "Лісова красуня",
    slug: "lisova-krasunya",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/lesnaya.jpg",
    description: "Невибагливий сорт з високою врожайністю. Плоди солодкі та соковиті."
  },
  {
    title: "Ноябрська",
    slug: "noyabrska",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/noyabrska.jpg",
    description: "Пізній сорт для тривалого зберігання. Має приємний солодкий смак."
  },
  {
    title: "Талгарська красуня",
    slug: "talharska",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/talharska.jpg",
    description: "Великі та красиві плоди з щільною м’якоттю. Підходить для комерційного вирощування."
  },
  {
    title: "Вільямс",
    slug: "viliams",
    price: 170,
    stock: 15,
    type: "pear",
    imagePath: "/img/pear/viliams.jpg",
    description: "Ароматний десертний сорт. Часто використовується для соків і консервації."
  },

  // ===== PLUM =====
  {
    title: "Богатирська",
    slug: "bogatyrskaya",
    price: 160,
    stock: 15,
    type: "plum",
    imagePath: "/img/plum/bogatyrskaya.jpg",
    description: "Сорт з великими та соковитими плодами. Підходить для свіжого вживання і переробки."
  },
  {
    title: "Президент",
    slug: "prezident",
    price: 160,
    stock: 15,
    type: "plum",
    imagePath: "/img/plum/prezident.jpg",
    description: "Пізній сорт сливи з високою врожайністю. Плоди щільні та солодкі."
  },
  {
    title: "Угорка",
    slug: "vengerka",
    price: 160,
    stock: 15,
    type: "plum",
    imagePath: "/img/plum/sliva_vengerka.jpg",
    description: "Один з найпопулярніших сортів слив. Ідеальний для сушіння та варення."
  },
  {
    title: "Стенлей",
    slug: "stenley",
    price: 160,
    stock: 15,
    type: "plum",
    imagePath: "/img/plum/stenley.webp",
    description: "Американський сорт з великими плодами. Добре підходить для експорту."
  },

  // ===== PEACH =====
  {
    title: "Фаворит",
    slug: "favorit",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/Favorit.jpg",
    description: "Соковитий персик із солодким смаком. Плоди великі та ароматні."
  },
  {
    title: "Харнес",
    slug: "harnes",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/harnes.jpg",
    description: "Ранній сорт з ніжною м’якоттю. Підходить для швидкої реалізації."
  },
  {
    title: "Редхейвен",
    slug: "redhaven",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/hedhvane.jpg",
    description: "Один з найпопулярніших сортів персика. Висока врожайність і чудовий смак."
  },
  {
    title: "Кардинал",
    slug: "kardinal",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/kardinal.jpg",
    description: "Ранній сорт із яскравими плодами. Смак солодкий з легкою кислинкою."
  },
  {
    title: "Київський ранній",
    slug: "kyiv",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/kyiv.jfif",
    description: "Український сорт з раннім дозріванням. Плоди ароматні та соковиті."
  },
  {
    title: "Сочний",
    slug: "sochnyi",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/sochnyi.webp",
    description: "Назва повністю відповідає властивостям плоду. М’якоть дуже соковита і солодка."
  },
  {
    title: "Ветеран",
    slug: "veteran",
    price: 180,
    stock: 15,
    type: "peach",
    imagePath: "/img/peach/Veteran.jpg",
    description: "Перевірений сорт з стабільним урожаєм. Добре переносить транспортування."
  },
 ] as const;

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        price: p.price,
        stock: p.stock,
        isActive: true,
        categoryId: cat.id,
        imagePath: p.imagePath,
        description: p.description ?? null,
      },
      create: {
        title: p.title,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        isActive: true,
        categoryId: cat.id,
        type: p.type,
        imagePath: p.imagePath,
        description: p.description ?? null,
      },
    });
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
