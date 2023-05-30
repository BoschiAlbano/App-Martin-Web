/*
  Warnings:

  - You are about to drop the column `Abreviatura` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `CodigoBarra` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `Detalle` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `PorcentajeGanancia` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `PrecioCosto` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `StockMinimo` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `Ubicacion` on the `Articulo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Codigo]` on the table `Articulo` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Articulo] DROP COLUMN [Abreviatura],
[CodigoBarra],
[Detalle],
[PorcentajeGanancia],
[PrecioCosto],
[StockMinimo],
[Ubicacion];

-- CreateIndex
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [Articulo_Codigo_key] UNIQUE NONCLUSTERED ([Codigo]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
