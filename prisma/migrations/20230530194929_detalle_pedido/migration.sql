/*
  Warnings:

  - You are about to drop the column `Dto` on the `DetallePedido` table. All the data in the column will be lost.
  - You are about to drop the column `PrecioCosto` on the `DetallePedido` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DetallePedido] DROP COLUMN [Dto],
[PrecioCosto];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
