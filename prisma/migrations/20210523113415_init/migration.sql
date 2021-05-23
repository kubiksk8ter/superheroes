-- CreateTable
CREATE TABLE "Superhero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "superheroName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "superPowers" TEXT NOT NULL
);
